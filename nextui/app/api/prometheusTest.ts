import { NextResponse } from 'next/server';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:50002';

export async function GET(request: Request) {
  let message = 'PrometheusTest API endpoint reached successfully.';
  let results: { query: string; data: any }[] = [];

  try {
    // Define a list of queries to fetch data for
    const queries = [
      'container_cpu_usage_seconds_total',
      'container_memory_usage_bytes',
      'container_network_receive_bytes_total',
      'container_network_transmit_bytes_total',
    ];

    // Fetch data for each query
    results = await Promise.all(
      queries.map(async (query) => {
        const response = await fetch(
          `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { query, data };
      })
    );

    // Log the results
    console.log('Prometheus data:', JSON.stringify(results, null, 2));
    message += ' Prometheus data fetched successfully.';
  } catch (error) {
    console.error('Error fetching Prometheus data:', error);
    message += ' Failed to fetch Prometheus data.';
  }

  // Return the results as a JSON response, always including the message
  return NextResponse.json({ message, results });
}
