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
//     res
//       .status(200)
//       .json(
//         'Based on the provided Prometheus metrics, here are some suggestions to optimize performance: \n 1. **CPU Usage**: - The CPU usage for all containers is very low, indicating that the current CPU resources are not being fully utilized. This could mean that the application is not resource-intensive or the resources are over-provisioned. - Consider scaling down the number of CPU cores or limiting the CPU resources allocated to each container, if possible, to optimize costs. 2. **Memory Usage**: - The memory usage for some containers, particularly `morpheus-node-exporter`, `morpheus-grafana`, and `morpheus-prometheus`, is relatively high compared to the others. - Investigate the memory requirements of these components and ensure that the memory allocation is appropriate for their workloads. You may need to increase or decrease the memory resources based on their actual usage patterns. - Consider using a memory profiler or monitoring tool to identify any memory leaks or inefficient memory usage within these containers. 3. **Network Receive and Transmit**: - The network receive and transmit rates vary significantly across the different containers. - The `morpheus-prometheus` container has a relatively high network receive rate, which could indicate a high volume of data being ingested or scraped by Prometheus. - The `morpheus-node-exporter` and `morpheus-cadvisor` containers have higher network transmit rates, which could be related to the data they are exposing for monitoring purposes. - Investigate the network traffic patterns and ensure that the network resources are provisioned appropriately for the workloads. Consider optimizing network configurations, such as reducing the frequency of data scraping or adjusting the resource limits, to manage the network utilization. 4. **Overall Optimization Suggestions**: - Review the resource requirements of each container and ensure that the resource allocations (CPU, memory, and network) are aligned with the actual usage patterns. Adjust the resource limits as needed to optimize performance and cost-effectiveness. - Implement monitoring and alerting mechanisms to proactively identify any resource bottlenecks or performance degradation. This will help you respond to issues quickly and make informed decisions about scaling or optimizing your deployment. - Regularly review and analyze the Prometheus metrics to identify any trends or anomalies that may indicate areas'
//       );
//   } catch (error) {
//     res.status(500).json('hit error: ', error);
//   }
// });

router.get('/aws-response', async (req, res) => {
  try {
    const metrics = await getMetrics();
    const convertedMetrics = JSON.stringify(metrics, null, 0);

    const conversationHistory = [
      {
        role: 'user',
        content: `Analyze my Prometheus metrics and provide suggestions for improvement to optimize performance. Here are my metrics: ${convertedMetrics}`,
      },
    ];

    const input = {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: conversationHistory,
        max_tokens: 1000,
        anthropic_version: 'bedrock-2023-05-31',
      }),
    };

    const command = new InvokeModelCommand(input);
    const resp = await client.send(command);

    if (resp.body instanceof Uint8Array) {
      buffer = resp.body;
    } else if (resp.body.buffer instanceof ArrayBuffer) {
      // Handle if resp.body is an ArrayBuffer
      buffer = new Uint8Array(resp.body.buffer);
    } else {
      throw new TypeError('Unexpected response body type');
    }

    const decodedResponseBody = new TextDecoder('utf-8').decode(buffer);
    const parsedBody = JSON.parse(decodedResponseBody);

    if (
      parsedBody.content &&
      Array.isArray(parsedBody.content) &&
      parsedBody.content.length > 0
    ) {
      res.status(200).send(parsedBody.content[0].text);
    } else {
      throw new Error('Content array is empty or undefined.');
    }
  } catch (err) {
    console.log('reached error: ', err);
    res.status(500).send(err);
  }
});

// Example route
router.get('/example', (req, res) => {
  res.send('This is an example route');
});

module.exports = router;
