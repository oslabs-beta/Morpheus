import { NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime';
import getMetrics from './getMetrics';

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? undefined,
    accessKeyId: process.env.ACCESS_KEY_ID ?? undefined,
  },
} as BedrockRuntimeClientConfig);

export async function GET(req: Request) {
  try {
    // Dummy data (For testing purposes instead of actual API call)
    const dummyResponse = `
      Based on the provided Prometheus metrics, here are some suggestions for improving performance:

      1. **CPU Usage**:
         - The CPU usage for all containers is currently at 0%, which suggests that the system is not under high CPU load. This could indicate that the resources allocated to these containers are sufficient or potentially excessive.
         - Consider monitoring the CPU usage over time and adjusting the CPU resources allocated to each container based on actual load and requirements.

      2. **Memory Usage**:
         - The memory usage for the \`morpheus-grafana\` container is relatively high at 204 MB, while the other containers have lower memory usage.
         - Ensure that the memory limits and requests for the \`morpheus-grafana\` container are appropriate for its workload. If the memory usage is consistently high, you may need to increase the memory allocation for this container.
         - Monitor the memory usage over time and adjust the memory resources as needed to prevent out-of-memory issues.
      `;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return NextResponse.json(dummyResponse, { status: 200 });

    // Uncomment the following block for actual API call to AWS Bedrock

    // const metrics = await getMetrics();
    // const convertedMetrics = JSON.stringify(metrics, null, 0);

    // const conversationHistory = [
    //   {
    //     role: 'user',
    //     content: `Analyze my Prometheus metrics and provide suggestions for improvement to optimize performance. Here are my metrics: ${convertedMetrics}`,
    //   },
    // ];

    // const input = {
    //   modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    //   contentType: 'application/json',
    //   accept: 'application/json',
    //   body: JSON.stringify({
    //     messages: conversationHistory,
    //     max_tokens: 1000,
    //     anthropic_version: 'bedrock-2023-05-31',
    //   }),
    // };

    // const command = new InvokeModelCommand(input);
    // const resp = await client.send(command);

    // let buffer;
    // if (resp.body instanceof Uint8Array) {
    //   buffer = resp.body;
    // } else if ((resp.body as any).buffer instanceof ArrayBuffer) {
    //   buffer = new Uint8Array((resp.body as any).buffer);
    // } else {
    //   throw new TypeError('Unexpected response body type');
    // }

    // const decodedResponseBody = new TextDecoder('utf-8').decode(buffer);
    // const parsedBody = JSON.parse(decodedResponseBody);

    // if (
    //   parsedBody.content &&
    //   Array.isArray(parsedBody.content) &&
    //   parsedBody.content.length > 0
    // ) {
    //   return NextResponse.json(parsedBody.content[0].text, { status: 200 })
    //   res.status(200).send(parsedBody.content[0].text);
    // } else {
    //   throw new Error('Content array is empty or undefined.');
    // }
  } catch (error) {
    console.error('Error:', error);

    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}
