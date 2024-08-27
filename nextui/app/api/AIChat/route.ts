import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch Kubernetes data
async function fetchKubernetesData() {
  // TODO: Implement this function to fetch Kubernetes-specific data
  // This is a placeholder and should be replaced with actual Kubernetes data fetching logic
  return {
    pods: 10,
    services: 5,
    deployments: 3,
    // Add more relevant Kubernetes metrics here
  };
}

export async function POST(request: Request) {
  try {
    // Extract the prompt and model from the request body
    const { prompt, model } = await request.json();

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    // Fetch Kubernetes metrics data
    const kubernetesData = await fetchKubernetesData();

    // Combine the user's prompt with the Kubernetes data
    const enhancedPrompt = `
      ${prompt}
      These are current metrics data from our Kubernetes cluster:
      ${JSON.stringify(kubernetesData, null, 2)}
      Analyze this, along with the original prompt to provide insights and your opinions about the Kubernetes cluster. 
      Organize response by the metrics. Add a recommendation section with a list of specific actions.
      Aim to specify pods/services/deployments and their metrics/numbers. Response should be concise but informative.
    `;

    // Send the enhanced prompt to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: enhancedPrompt }],
    });

    const result = completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
