import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { RateLimiter } from 'limiter';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a rate limiter: 2 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 'second' });

// Function to fetch Prometheus data
async function fetchPrometheusData() {
  try {
    const response = await fetch('http://localhost:3000/api/prometheus-query');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching Prometheus data:', error);
    return null;
  }
}

export async function POST(request: Request) {
  // Check rate limit before processing the request
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // Extract the prompt from the request body
    const { prompt } = await request.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    // Fetch Prometheus metrics data
    const prometheusData = await fetchPrometheusData();

    // Combine the user's prompt with the Prometheus data
    const enhancedPrompt = `
      ${prompt}
      
      Here's the current metrics data from our system:
      ${JSON.stringify(prometheusData, null, 2)}
      
      Please analyze these metrics along with the original prompt and provide insights and recommendations.
    `;

    // Send the enhanced prompt to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [{ role: 'user', content: enhancedPrompt }],
    });

    // Extract the result from the OpenAI response
    const result = completion.choices[0].message.content;

    // Log successful analysis (for monitoring purposes)
    console.log(
      `Successfully analyzed prompt with metrics: "${prompt.substring(
        0,
        50
      )}..."`
    );

    // Return the analysis result
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error invoking OpenAI model:', error);

    // Handle rate limit errors from OpenAI
    if (error instanceof OpenAI.APIError && error.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Generic error response for all other errors
    return NextResponse.json(
      {
        error:
          'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
