// import { createMocks } from 'node-mocks-http';
// import { GET } from '../app/api/aws-bedrock/route'; // Adjust the path if necessary
// import pool from '@/db/pgModel'; // Adjust according to your setup

// jest.mock('@/db/pgModel', () => ({
//   query: jest.fn(),
// }));

// describe('GET API Route Handler', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('responds with metrics when the conversation is found', async () => {
//     // Mock the database query for fetching conversation history
//     pool.query.mockResolvedValueOnce({
//       rows: [
//         {
//           conversation: JSON.stringify([
//             { role: 'user', content: 'Dummy data' },
//           ]),
//         },
//       ],
//     });

//     // Mock the database update query
//     pool.query.mockResolvedValueOnce({
//       rowCount: 1, // Simulating that an existing conversation was updated
//     });

//     // Mocking the request and response
//     const { req, res } = createMocks({
//       method: 'GET',
//     });

//     // Call the GET handler
//     await GET(req);

//     // Assert the status code and response
//     expect(res._getStatusCode()).toBe(200);
//     expect(res._getJSONData()).toEqual({
//       result: expect.any(String),
//     });
//   });

//   it('returns 500 when the database query fails', async () => {
//     // Mock the database query failure
//     pool.query.mockRejectedValueOnce(new Error('Database query failed'));

//     const { req, res } = createMocks({
//       method: 'GET',
//     });

//     // Call the GET handler
//     await GET(req);

//     // Assert the response status and error details
//     expect(res._getStatusCode()).toBe(500);
//     expect(res._getJSONData()).toEqual({
//       error: 'Internal Server Error',
//       details: 'Database query failed',
//     });
//   });

//   it('returns 500 when JSON parsing fails', async () => {
//     // Mock the database query to return invalid JSON
//     pool.query.mockResolvedValueOnce({
//       rows: [{ conversation: 'invalid JSON' }],
//     });

//     const { req, res } = createMocks({
//       method: 'GET',
//     });

//     // Call the GET handler
//     await GET(req);

//     // Assert the response status and error details
//     expect(res._getStatusCode()).toBe(500);
//     expect(res._getJSONData()).toEqual({
//       error: 'Internal Server Error',
//       details: 'Unexpected token i in JSON at position 0',
//     });
//   });
// });
