import { NextResponse } from 'next/server';
import { RateLimiter } from 'limiter';

// The example project uses a Kubernetes API useing the kubernetes/client-node library to get data to pass to AI
// See below all code, for their method

// Need to test these out, maybe need to use averages in queries, to shorten results and reduce token use when sending to Bedrock
// The metrics here are for Kubernetes. See prometheus-query for container queries
// This queries eight metrics, for whatis usually considered most important: container count, container uptime average, CPU, memory, disk I/O read and write, network receive and transmit

// Need Kubernetes specific Prometheus URL?
// Set the Prometheus URL, defaulting to localhost if not provided in environment variables
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:50002';

// Create a rate limiter: 5 requests per second
// This helps prevent overloading the Prometheus server with too many requests
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });

// Simple in-memory cache to store the last fetched data
// This reduces the load on Prometheus by serving cached data for a short period
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // Cache duration: 1 minute

export async function GET(request: Request) {
  // Check rate limit before processing the request
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Check if we have valid cached data
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    // Define the Prometheus queries we want to execute
    // Each query is an object with a name (for identification), the PromQL query string, unit, and description
    const queries = [
      {
        name: 'API Server Availability',
        query: 'apiserver_request:availability30d',
        unit: 'ratio',
        description: 'Availability of the API server over the last 30 days',
      },
      {
        name: 'Node CPU Utilization',
        query: 'node:node_cpu_utilization:ratio_rate5m',
        unit: 'ratio',
        description: 'CPU utilization ratio per node over 5 minutes',
      },
      {
        name: 'Node Memory Available',
        query: ':node_memory_MemAvailable_bytes:sum',
        unit: 'bytes',
        description: 'Available memory across all nodes',
      },
      {
        name: 'Pod CPU Usage',
        query:
          'sum(rate(container_cpu_usage_seconds_total{image!=""}[5m])) by (pod)',
        unit: 'cores',
        description: 'CPU usage rate by pod over 5 minutes',
      },
      {
        name: 'Pod Memory Usage',
        query: 'sum(container_memory_working_set_bytes{image!=""}) by (pod)',
        unit: 'bytes',
        description: 'Current memory usage by pod',
      },
      {
        name: 'API Server Request Latency',
        query:
          'histogram_quantile(0.99, sum(rate(apiserver_request_duration_seconds_bucket[5m])) by (le, verb))',
        unit: 'seconds',
        description: '99th percentile of API server request latency',
      },
      {
        name: 'Kubelet PLEG Relist Duration',
        query:
          'node_quantile:kubelet_pleg_relist_duration_seconds:histogram_quantile{quantile="0.99"}',
        unit: 'seconds',
        description: '99th percentile of Kubelet PLEG relist duration',
      },
      {
        name: 'Container Count',
        query: 'count(container_last_seen{image!=""})',
        unit: 'containers',
        description: 'Total number of containers',
      },
      {
        name: 'Disk Usage',
        query:
          '(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100',
        unit: 'percent',
        description: 'Disk usage percentage',
      },
      {
        name: 'Network Traffic',
        query:
          'sum(rate(container_network_receive_bytes_total[5m])) + sum(rate(container_network_transmit_bytes_total[5m]))',
        unit: 'bytes/sec',
        description: 'Total network traffic (receive + transmit)',
      },
    ];

    // Execute all queries in parallel using Promise.all
    // This is more efficient than running queries sequentially
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
        data: data.map((item: any) => ({
          container: item.metric.name,
          value: parseFloat(item.value[1]).toFixed(2),
        })),
      };
    });

    // Update the cache with the new data
    cache = { data: formattedResults, timestamp: Date.now() };

    // Return the formatted results as a JSON response
    return NextResponse.json(formattedResults);
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error fetching Kubernetes Prometheus data:', error);

    // Return a 500 error response to the client
    return NextResponse.json(
      { error: 'Failed to fetch Kubernetes Prometheus data' },
      { status: 500 }
    );
  }
}
