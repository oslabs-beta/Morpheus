import { NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-bedrock-runtime';
import { RateLimiter } from 'limiter';

// List of allowed Bedrock models
const allowedModels = [
  'anthropic.claude-3-sonnet-20240229-v1:0',
  'anthropic.claude-instant-v1',
  'amazon.titan-text-express-v1:0:8k',
];

// Default prompt to use if none is provided
const defaultPrompt =
  'Analyze the performance metrics of my Docker containers and provide optimization suggestions.';

// Create a rate limiter: 2 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 'second' });

export async function POST(request: Request) {
  // Check rate limit
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // Extract prompt and model from the request body, using defaultPrompt if no prompt is provided
    const { prompt = defaultPrompt, model } = await request.json();

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }
    if (!model || !allowedModels.includes(model)) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    console.log('Requested model:', model); // Log the requested model

    // Initialize the Bedrock client with AWS credentials
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Prepare the command to invoke the Bedrock model
    const command = new InvokeModelCommand({
      modelId: model,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `Human: ${prompt}\n\nPlease provide a detailed analysis and specific recommendations.`,
        max_tokens_to_sample: 1000,
      }),
    });

    // Send the command to Bedrock and await the response
    const response = await client.send(command);

    // Parse the response body
    const result = JSON.parse(new TextDecoder().decode(response.body));

    if (!result.completion) {
      throw new Error('Invalid response from Bedrock');
    }

    // Log successful analysis (for monitoring purposes)
    console.log(
      `Successfully analyzed prompt: "${prompt.substring(0, 50)}..."`
    );

    // Return the model's completion as the API response
    return NextResponse.json({ result: result.completion });
  } catch (error) {
    console.error('Error invoking Bedrock model:', error);

    // Generic error message for all types of errors
    return NextResponse.json(
      {
        error:
          'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
