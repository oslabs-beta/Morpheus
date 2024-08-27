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

// router.get('/aws-response', async (req, res) => {
//   try {
//     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//     await delay(4000);
//     res
//       .status(200)
//       .json(
// "Based on the provided Prometheus metrics, I can provide the following suggestions for performance optimization: 1. **CPU Usage**: - The CPU usage metric is not provided in the data, so I cannot make any specific recommendations. However, if the CPU usage is high, you may want to investigate the underlying processes and see if you can optimize their resource utilization or scale out the infrastructure. 2. **Memory Usage**: - The memory usage data shows that some containers, such as `morpheus-grafana` and `morpheus-prometheus`, are consuming a significant amount of memory (205MB and 84MB, respectively). This could indicate that these containers may be running tasks or services that are memory-intensive. - Consider the following optimizations: - Analyze the memory usage patterns of these containers and identify the root causes of the high memory consumption. This may involve profiling the applications or services running in the containers. - Optimize the configuration and resource settings of these containers to ensure they are running with the optimal amount of memory. This may involve adjusting memory limits or requests, or optimizing the application code to reduce memory usage. - If the high memory usage is necessary for the application's functionality, consider scaling out the infrastructure to provide more memory resources. 3. **Network Receive and Network Transmit**: - The network receive and transmit metrics are not provided in the data, so I cannot make any specific recommendations. - If you observe high network utilization, you may want to investigate the network traffic patterns and identify any potential bottlenecks or areas for optimization. This could include: - Ensuring that network resources (bandwidth, network interfaces, etc.) are scaled appropriately to handle the workload. - Identifying and optimizing any network-intensive processes or services within your application. - Implementing network-level optimizations, such as load balancing, caching, or content delivery strategies, to improve network efficiency. Overall, the provided metrics suggest that you may want to focus on optimizing the memory usage of your containers, particularly the `morpheus-grafana` and `morpheus-prometheus` containers. Additionally, if you observe any significant CPU or network utilization issues, you should investigate those as well. Remember that the effectiveness of these optimizations will depend on the specific context and requirements of your application, so it's essential to monitor the metrics, analyze the performance patterns, and make informed decisions based on your application's needs.
// "
//       );
//   } catch (error) {
//     res.status(500).json('hit error: ', error);
//   }
// });

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
