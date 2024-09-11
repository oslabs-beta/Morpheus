import { NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime';
import getMetrics from './getMetrics';
import pool from '@/db/pgModel';

interface ConversationEntry {
  role: 'user' | 'assistant';
  content: string;
}

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
  endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com',
  credentials: {
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? undefined,
    accessKeyId: process.env.ACCESS_KEY_ID ?? undefined,
  },
} as BedrockRuntimeClientConfig);

export async function GET(req: Request) {
  /****************************************************************************************
   ************ Uncomment the following block for dummy data and db testing  **************
   ****************************************************************************************/
  // try {
  //   console.log('Starting GET request handler');

  //   const userId = 'local_user';
  //   console.log('Attempting database query');

  //   let historyResult;
  //   try {
  //     historyResult = await pool.query(
  //       'SELECT conversation FROM conversation_history WHERE id = $1',
  //       [2] // Using 2 to select the second row for dummy data
  //     );
  //     console.log('Database query result:', historyResult);
  //   } catch (dbError: unknown) {
  //     console.error('Database query error:', dbError);
  //     throw new Error(`Database query failed: ${(dbError as Error).message}`);
  //   }

  //   const dummyMetrics = {
  //     CPU_usage: '7%',
  //     memory: '35%',
  //     diskSpace: '42%',
  //   };

  //   let conversationHistory: ConversationEntry[];
  //   if (historyResult.rows.length > 0) {
  //     try {
  //       console.log('Conversation exists, now parsing');
  //       const conversationData = historyResult.rows[0].conversation;
  //       conversationHistory =
  //         typeof conversationData === 'string'
  //           ? JSON.parse(conversationData)
  //           : conversationData;
  //       console.log('Conversation parsed:', conversationHistory);
  //     } catch (parseError: unknown) {
  //       console.error('JSON parse error:', parseError);
  //       const errorMessage =
  //         parseError instanceof Error ? parseError.message : 'Unknown error';
  //       throw new Error(
  //         `Failed to parse conversation history: ${errorMessage}`
  //       );
  //     }
  //     conversationHistory.push({
  //       role: 'user',
  //       content: `I made updates to my system. Here are the current metrics: ${JSON.stringify(
  //         dummyMetrics
  //       )}`,
  //     });
  //   } else {
  //     console.log('No conversation found, creating new one');
  //     conversationHistory = [
  //       {
  //         role: 'user',
  //         content: `Analyze my Prometheus metrics and provide suggestions for improvement to optimize performance. Here are my metrics: ${JSON.stringify(
  //           dummyMetrics
  //         )}`,
  //       },
  //     ];
  //   }

  //   const dummyResponse = `Based on the updated metrics, here's an analysis of your system:

  //     1. **CPU Usage**:
  //        - The CPU usage for all containers is currently at 0%, which suggests that the system is not under high CPU load. This could indicate that the resources allocated to these containers are sufficient or potentially excessive.
  //        - Consider monitoring the CPU usage over time and adjusting the CPU resources allocated to each container based on actual load and requirements.

  //     2. **Memory Usage**:
  //        - The memory usage for the \`morpheus-grafana\` container is relatively high at 204 MB, while the other containers have lower memory usage.
  //        - Ensure that the memory limits and requests for the \`morpheus-grafana\` container are appropriate for its workload. If the memory usage is consistently high, you may need to increase the memory allocation for this container.
  //        - Monitor the memory usage over time and adjust the memory resources as needed to prevent out-of-memory issues.

  //     1. **CPU Usage**:
  //        - The CPU usage for all containers is currently at 0%, which suggests that the system is not under high CPU load. This could indicate that the resources allocated to these containers are sufficient or potentially excessive.
  //        - Consider monitoring the CPU usage over time and adjusting the CPU resources allocated to each container based on actual load and requirements.

  //     2. **Memory Usage**:
  //        - The memory usage for the \`morpheus-grafana\` container is relatively high at 204 MB, while the other containers have lower memory usage.
  //        - Ensure that the memory limits and requests for the \`morpheus-grafana\` container are appropriate for its workload. If the memory usage is consistently high, you may need to increase the memory allocation for this container.
  //        - Monitor the memory usage over time and adjust the memory resources as needed to prevent out-of-memory issues.
  //   `;

  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   const updatedConversation: ConversationEntry[] = [
  //     ...conversationHistory,
  //     { role: 'assistant', content: dummyResponse },
  //   ];

  //   try {
  //     // First, try to update the existing conversation in row 2
  //     const updateResult = await pool.query(
  //       'UPDATE conversation_history SET conversation = $1, last_updated = CURRENT_TIMESTAMP WHERE id = 2 RETURNING *',
  //       [JSON.stringify(updatedConversation)]
  //     );

  //     // If no row was updated (row 2 doesn't exist), insert a new one
  //     if (updateResult.rowCount === 0) {
  //       await pool.query(
  //         'INSERT INTO conversation_history (id, conversation) VALUES (2, $1)',
  //         [JSON.stringify(updatedConversation)]
  //       );
  //     }

  //     console.log('Conversation saved to database');
  //   } catch (dbError: unknown) {
  //     console.error('Database operation error:', dbError);
  //     const errorMessage =
  //       dbError instanceof Error ? dbError.message : 'Unknown error';
  //     throw new Error(
  //       `Failed to save conversation to database: ${errorMessage}`
  //     );
  //   }
  //   return NextResponse.json({ result: dummyResponse }, { status: 200 });
  // } catch (error) {
  //   console.error('Detailed error:', error);
  //   if (error instanceof Error) {
  //     console.error('Error stack:', error.stack);
  //   }

  /****************************************************************************************
   ************ Uncomment the following block for actual API call to AWS Bedrock ***********
   *****************************************************************************************/
  try {
    const metrics = await getMetrics();
    const convertedMetrics = JSON.stringify(metrics, null, 0);

    // const userId = 'local_user';

    let historyResult;
    try {
      historyResult = await pool.query(
        'SELECT conversation FROM conversation_history WHERE id = $1',
        [1] // selecting first row
      );
      console.log('Database query result:', historyResult);
    } catch (dbError: unknown) {
      console.error('Database query error:', dbError);
      throw new Error(`Database query failed: ${(dbError as Error).message}`);
    }

    let conversationHistory: ConversationEntry[];
    if (historyResult.rows.length > 0) {
      try {
        const conversationData = historyResult.rows[0].conversation;
        conversationHistory =
          typeof conversationData === 'string'
            ? JSON.parse(conversationData)
            : conversationData;

        const MAX_TOKENS = 1000;
        const ESTIMATED_TOKENS_PER_MESSAGE = 200;

        // Before adding a new message, check to see if the conversation history is too long:
        while (
          conversationHistory.length * ESTIMATED_TOKENS_PER_MESSAGE >
          MAX_TOKENS
        ) {
          conversationHistory.shift(); // Remove oldest message
        }
      } catch (parseError: unknown) {
        console.error('JSON parse error:', parseError);
        const errorMessage =
          parseError instanceof Error ? parseError.message : 'Unknown error';
        throw new Error(
          `Failed to parse conversation history: ${errorMessage}`
        );
      }
      conversationHistory.push({
        role: 'user',
        content: `I made updates to my system. Here are the current metrics: ${convertedMetrics}`,
      });
    } else {
      conversationHistory = [
        {
          role: 'user',
          content: `Analyze my Prometheus metrics and provide suggestions for improvement to optimize performance. Here are my metrics: ${convertedMetrics}`,
        },
      ];
    }

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

    let buffer;
    if (resp.body instanceof Uint8Array) {
      buffer = resp.body;
    } else if ((resp.body as any).buffer instanceof ArrayBuffer) {
      buffer = new Uint8Array((resp.body as any).buffer);
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
      const aiResponse = parsedBody.content[0].text;

      const updatedConversation: ConversationEntry[] = [
        ...conversationHistory,
        { role: 'assistant', content: aiResponse },
      ];

      try {
        // First, try to update the existing conversation
        const updateResult = await pool.query(
          'UPDATE conversation_history SET conversation = $1, last_updated = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM conversation_history ORDER BY last_updated DESC LIMIT 1) RETURNING *',
          [JSON.stringify(updatedConversation)]
        );

        // If no row was updated (table is empty), insert a new one
        if (updateResult.rowCount === 0) {
          await pool.query(
            'INSERT INTO conversation_history (conversation) VALUES ($1)',
            [JSON.stringify(updatedConversation)]
          );
        }

        console.log('Conversation saved to database');
      } catch (dbError: unknown) {
        console.error('Database operation error:', dbError);
        const errorMessage =
          dbError instanceof Error ? dbError.message : 'Unknown error';
        throw new Error(
          `Failed to save conversation to database: ${errorMessage}`
        );
      }

      return NextResponse.json({ result: aiResponse }, { status: 200 });
      // res.status(200).send(parsedBody.content[0].text);
    } else {
      throw new Error('Content array is empty or undefined.');
    }
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }

    /****************************************************************************************
     ************************ End of actual API call to AWS Bedrock *************************
     *****************************************************************************************/

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
