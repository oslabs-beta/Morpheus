import { NextResponse } from 'next/server';
import { RateLimiter } from 'limiter';

// Set the Prometheus URL, defaulting to localhost if not provided in environment variables
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:9090';

// Create a rate limiter: 5 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });

export async function GET(request: Request) {
  // Check rate limit
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Extract the 'query' parameter from the request URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // Validate that a query parameter was provided
  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  try {
    // Construct the Prometheus API URL with the provided query
    const prometheusUrl = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(
      query
    )}`;

    // Fetch data from Prometheus
    const response = await fetch(prometheusUrl);

    if (!response.ok) {
      throw new Error(`Prometheus responded with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the Prometheus data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error querying Prometheus:', error);

    // Return a more specific error message to the client
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to query Prometheus',
      },
      { status: 500 }
    );
  }
}
