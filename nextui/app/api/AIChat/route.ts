import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// // Function to fetch Kubernetes data
// async function fetchKubernetesData() {
//   // TODO: implement this function to fetch Kubernetes-specific data
//   // This is placeholder and should be replaced with actual Kubernetes data fetching logic
//   return {
//     pods: 10,
//     services: 5,
//     deployments: 3,
//     // Add more relevant Kubernetes metrics here
//   };
// }

// Function to fetch Kubernetes data
async function fetchKubernetesData() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/clusterview');
    if (!response.ok) {
      throw new Error('Failed to fetch cluster data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cluster data:', error);
    return null;
  }
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

    if (!kubernetesData) {
      return NextResponse.json(
        { error: 'Failed to fetch Kubernetes data' },
        { status: 500 }
      );
    }

    // Combine the user's prompt with the Kubernetes data
    const enhancedPrompt = `
        Act as a Kubernetes expert. You will answer questions related to Kubernetes clusters, containers, deployments, or any aspects related to managing and observing these systems.
        Here is my question: ${prompt}. If my question is certainly irrelevant to clusters, containers, etc, follow these 3 steps:
1) Do not answer the question.
2) Do not provide information related to the Kubernetes data that I will provide to you.
3) Respond with 'I'm sorry, it appears your question is not relevant to your Kubernetes clusters.'
Only if the question is relevant to Kubernetes, proceed to answer the question using the Kubernetes metrics data I will provide to offer insights and recommendations. (If it is relevant, the fact that it is relevant should not be addressed.)
Here is the Kubernetes data: ${JSON.stringify(kubernetesData, null, 2)}.
Never use placeholders if you do not know specific numbers or information. Be concise yet informative.
Aim to organize the response by metrics and include specific pods/services/deployments and their metrics/numbers, if relevant. Do not use bold or heading formatting. Limit your response to under 1500 tokens.`;

    //gpt-4 seems to have much better understanding of what information is considered relevant, as well as better consistency in response style and length, so it didn't require these specific instructions.
    //However, 3.5-turbo was used because it was much cheaper at less than $0.005 per 1000 tokens. while 4 was over $0.03 per 1000 tokens.
    //For container (not k8) query: running Morpheus containers alone, the prometheus data sent is about 4 to 6 thousand tokens. The complexity of the data seems to also increase this, because just the prometheus data, with no true prompt and limited response, would cost 3 to 6 cents per request in gpt-4.
    //Used 'opinion' in prompt to get more judgement rather than only objective facts. Mentioned formatting because bold results in '**' and headings result in '###'.
    //Organization by metric was used for more clarity.Used 'containers/metrics/numbers' to prevent vague or general sounding responses.
    //Several questions can be representative of how strict their interpretation of the rules are. From least to most answered given the same rules for interpretation and response: 'how is the weather', 'where is california', 'how are my containers', 'how is my cluster'.
    //For the most strict rules, use terms like 'act strictly as...' and 'without exception'. However, this combo made 3.5 believe questions like 'how is my cluster' not relevant.

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
