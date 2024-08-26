// import {
//   BedrockRuntimeClient,
//   InvokeModelCommand,
// } from '@aws-sdk/client-bedrock-runtime';
const getMetrics = require('../prometheus/client');

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const express = require('express');
const router = express.Router();

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
  },
});

/* DUMMY DATA TO TEST INSTEAD OF ACTUAL CALLS TO BEDROCK */
router.get('/aws-response', async (req, res) => {
  try {
    const responseText = `
Based on the provided Prometheus metrics, here are some suggestions for improving performance:

1. **CPU Usage**:
   - The CPU usage for all containers is currently at 0%, which suggests that the system is not under high CPU load. This could indicate that the resources allocated to these containers are sufficient or potentially excessive.
   - Consider monitoring the CPU usage over time and adjusting the CPU resources allocated to each container based on actual load and requirements.

2. **Memory Usage**:
   - The memory usage for the \`morpheus-grafana\` container is relatively high at 204 MB, while the other containers have lower memory usage.
   - Ensure that the memory limits and requests for the \`morpheus-grafana\` container are appropriate for its workload. If the memory usage is consistently high, you may need to increase the memory allocation for this container.
   - Monitor the memory usage over time and adjust the memory resources as needed to prevent out-of-memory issues.
    `;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(4000);
    res.status(200).json(responseText);
  } catch (error) {
    res.status(500).json('hit error: ', error);
  }
});

/* ACTUAL ROUTE TO PERFORM CALLS TO BEDROCK */
// router.get('/aws-response', async (req, res) => {
//   try {
//     const metrics = await getMetrics();
//     const convertedMetrics = JSON.stringify(metrics, null, 0);

//     const conversationHistory = [
//       {
//         role: 'user',
//         content: `Analyze my Prometheus metrics and provide suggestions for improvement to optimize performance. Here are my metrics: ${convertedMetrics}`,
//       },
//     ];

//     const input = {
//       modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
//       contentType: 'application/json',
//       accept: 'application/json',
//       body: JSON.stringify({
//         messages: conversationHistory,
//         max_tokens: 1000,
//         anthropic_version: 'bedrock-2023-05-31',
//       }),
//     };

//     const command = new InvokeModelCommand(input);
//     const resp = await client.send(command);

//     if (resp.body instanceof Uint8Array) {
//       buffer = resp.body;
//     } else if (resp.body.buffer instanceof ArrayBuffer) {
//       // Handle if resp.body is an ArrayBuffer
//       buffer = new Uint8Array(resp.body.buffer);
//     } else {
//       throw new TypeError('Unexpected response body type');
//     }

//     const decodedResponseBody = new TextDecoder('utf-8').decode(buffer);
//     const parsedBody = JSON.parse(decodedResponseBody);

//     if (
//       parsedBody.content &&
//       Array.isArray(parsedBody.content) &&
//       parsedBody.content.length > 0
//     ) {
//       console.log(parsedBody.content[0].text);
//       res.status(200).send(parsedBody.content[0].text);
//     } else {
//       throw new Error('Content array is empty or undefined.');
//     }
//   } catch (err) {
//     console.log('reached error: ', err);
//     res.status(500).send(err);
//   }
// });

// Example route
router.get('/example', (req, res) => {
  res.send('This is an example route');
});

module.exports = router;
