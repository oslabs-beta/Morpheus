import { NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 'second' });

// Initialize the AWS SDK client once, outside of the request handler
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { prompt, model } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    console.log('Requested model:', model);

    const input = {
      modelId: model,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `Human: ${prompt}\n\nAssistant: I'll analyze the provided information and offer insights and recommendations.`,
        max_tokens: 1000,
        temperature: 0.7,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ['\nHuman:'],
        anthropic_version: 'bedrock-2023-05-31',
      }),
    };

    const command = new InvokeModelCommand(input);
    const resp = await client.send(command);

    let buffer =
      resp.body instanceof Uint8Array ? resp.body : new Uint8Array(resp.body);
    const decodedResponseBody = new TextDecoder('utf-8').decode(resp.body);
    const parsedBody = JSON.parse(decodedResponseBody);

    if (parsedBody.completion) {
      return NextResponse.json({ result: parsedBody.completion });
    } else {
      throw new Error('Invalid response from Bedrock');
    }
  } catch (error) {
    console.error('Error invoking Bedrock model:', error);
    return NextResponse.json(
      {
        error:
          'An error occurred while processing your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}
