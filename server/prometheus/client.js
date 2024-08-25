const express = require('express');
// const fetch = require('node-fetch');
const { RateLimiter } = require('limiter');
const dotenv = require('dotenv');
const router = express.Router();

// Load environment variables from .env file
dotenv.config();

// Set the Prometheus URL, defaulting to localhost if not provided in environment variables
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:50002';

// Create a rate limiter: 5 requests per second
// This helps prevent overloading the Prometheus server with too many requests
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });

// Simple in-memory cache to store the last fetched data
// This reduces the load on Prometheus by serving cached data for a short period
let cache = null;
const CACHE_DURATION = 60 * 1000; // Cache duration: 1 minute

const queries = [
  {
    name: 'CPU Usage',
    query:
      'sum(rate(container_cpu_usage_seconds_total{name=~".+"}[5m])) by (name)',
    unit: 'cores',
    description: 'CPU usage rate over 5 minutes',
  },
  {
    name: 'Memory Usage',
    query: 'sum(container_memory_usage_bytes{name=~".+"}) by (name)',
    unit: 'bytes',
    description: 'Current memory usage',
  },
  {
    name: 'Network Receive',
    query:
      'sum(rate(container_network_receive_bytes_total{name=~".+"}[5m])) by (name)',
    unit: 'bytes/s',
    description: 'Network receive rate over 5 minutes',
  },
  {
    name: 'Network Transmit',
    query:
      'sum(rate(container_network_transmit_bytes_total{name=~".+"}[5m])) by (name)',
    unit: 'bytes/s',
    description: 'Network transmit rate over 5 minutes',
  },
];

async function getMetrics() {
  // Check rate limit before processing the request
  if (!(await limiter.removeTokens(1))) {
    console.log({ error: 'Rate limit exceeded' });
  }

  // Check if we have valid cached data
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    console.log(cache.data);
  }

  try {
    // Execute all queries in parallel using Promise.all
    const results = await Promise.all(
      queries.map(async ({ name, query }) => {
        // Construct the URL for the Prometheus API call
        const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(
          query
        )}`;

        // Fetch data from Prometheus
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Return an object with the query name and the result data
        return { name, data: data.data.result };
      })
    );

    // Format the results into a more usable structure
    const formattedResults = results.map(({ name, data }) => {
      const queryInfo = queries.find((q) => q.name === name);
      return {
        metric: name,
        unit: queryInfo?.unit,
        description: queryInfo?.description,
        data: data.map((item) => ({
          container: item.metric.name,
          value: parseFloat(item.value[1]).toFixed(2),
        })),
      };
    });

    // Update the cache with the new data
    cache = { data: formattedResults, timestamp: Date.now() };

    // Return the formatted results as a JSON response
    return formattedResults;
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error fetching Prometheus data:', error);

    // Return a 500 error response to the client
    return { error: 'Failed to fetch Prometheus data' };
  }
}

module.exports = getMetrics;
