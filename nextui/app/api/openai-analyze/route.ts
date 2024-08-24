import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { RateLimiter } from 'limiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a rate limiter: 2 requests per second
const limiter = new RateLimiter({ tokensPerInterval: 2, interval: 'second' });

export async function POST(request: Request) {
  // Check rate limit
  if (!(await limiter.removeTokens(1))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { prompt } = await request.json();

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = completion.choices[0].message.content;

    // Log successful analysis (for monitoring purposes)
    console.log(
      `Successfully analyzed prompt: "${prompt.substring(0, 50)}..."`
    );

    // Return the model's completion as the API response
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error invoking OpenAI model:', error);

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
