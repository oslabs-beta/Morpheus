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
      These are current metrics data from our containerized system:
      ${JSON.stringify(prometheusData, null, 2)}
      Analyze this, along with the original prompt to provide insights and opinions. 
      Organize response by the four metrics, titled. Ensure there is no bold and no headings formatting. 
      Create a recommendation section with a list of specific actions.
      Aim to specify containers/metrics/numbers. Response should be 1000 to 1500 tokens.
    `;
    //Model 4 seems to have better consistency in response style and length, so it didn't require these specific instructions.
    //However, 3.5-turbo was used because it was much cheaper at less than $0.005 per 1000 tokens. while 4 was over $0.03 per 1000 tokens.
    //Currently, running Morpheus containers alone, the prometheus data is about 4 to 6 thousand tokens. The complexity of the data seems to also increase this, because just the prometheus data, with little prompt and very limited token response, would cost 3 to 6 cents per request in gpt-4.
    //Used 'opinion' in prompt to get more judgement rather than only objective facts
    //Mentioned formatting because bold results in '**' and headings result in '###'
    //Organization by metric was used for more clarity
    //Used 'containers/metrics/numbers' to prevent vague or general sounding responses

    // Send the enhanced prompt to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      // model: 'gpt-4-0125-preview',
      model: 'gpt-3.5-turbo',
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
