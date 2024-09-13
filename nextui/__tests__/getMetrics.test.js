// import getMetrics from '../app/api/aws-bedrock/getMetrics';
// import { RateLimiter } from 'limiter';

// const mockLimiterRemoveTokens = jest.spyOn(
//   RateLimiter.prototype,
//   'removeTokens'
// );

// describe('getMetrics', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('fetches Prometheus data successfully', async () => {
//     mockLimiterRemoveTokens.mockResolvedValueOnce(true);

//     global.fetch = jest.fn().mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({
//         data: {
//           result: [
//             { metric: { name: 'container1' }, value: [1691856162.332, '0.12'] },
//           ],
//         },
//       }),
//     });

//     const result = await getMetrics();

//     expect(fetch).toHaveBeenCalledTimes(4);
//     expect(result).toEqual([
//       {
//         metric: 'CPU Usage',
//         unit: 'cores',
//         description: 'CPU usage rate over 5 minutes',
//         data: [{ container: 'container1', value: '0.12' }],
//       },
//       {
//         metric: 'Memory Usage',
//         unit: 'bytes',
//         description: 'Current memory usage',
//         data: [{ container: 'container1', value: '0.12' }],
//       },
//       {
//         metric: 'Network Receive',
//         unit: 'bytes/s',
//         description: 'Network receive rate over 5 minutes',
//         data: [{ container: 'container1', value: '0.12' }],
//       },
//       {
//         metric: 'Network Transmit',
//         unit: 'bytes/s',
//         description: 'Network transmit rate over 5 minutes',
//         data: [{ container: 'container1', value: '0.12' }],
//       },
//     ]);
//   });

//   it('throws an error when rate limit is exceeded', async () => {
//     mockLimiterRemoveTokens.mockResolvedValueOnce(false);

//     await expect(getMetrics()).rejects.toThrow('Rate limit exceeded');
//   });

//   it('throws an error when fetch fails', async () => {
//     mockLimiterRemoveTokens.mockResolvedValueOnce(true);

//     global.fetch = jest.fn().mockResolvedValueOnce({
//       ok: false,
//       status: 500,
//     });

//     await expect(getMetrics()).rejects.toThrow(
//       'Failed to fetch Prometheus data'
//     );
//   });

//   it('uses cached data if cache is valid', async () => {
//     mockLimiterRemoveTokens.mockResolvedValueOnce(true);

//     const mockCacheData = [
//       {
//         metric: 'CPU Usage',
//         unit: 'cores',
//         description: 'CPU usage rate over 5 minutes',
//         data: [{ container: 'container1', value: '0.12' }],
//       },
//     ];
//     const now = Date.now();
//     jest.spyOn(Date, 'now').mockReturnValueOnce(now);
//     const cache = { data: mockCacheData, timestamp: now - 1000 };

//     global.cache = cache;

//     const result = await getMetrics();

//     expect(result).toBe(mockCacheData);
//   });
// });
