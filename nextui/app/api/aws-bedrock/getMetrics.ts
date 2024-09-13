import { RateLimiter } from 'limiter';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://localhost:50002';
const limiter = new RateLimiter({ tokensPerInterval: 5, interval: 'second' });
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

const queries = [
  {
    name: 'CPU Usage',
    query:
      'sum(rate(container_cpu_usage_seconds_total{name=~".+"}[5m])) by (name)',
    unit: 'cores',
    description: 'CPU usage rate over 5 minutes',
  },
  {
    name: 'Memory Usage',
    query: 'sum(container_memory_usage_bytes{name=~".+"}) by (name)',
    unit: 'bytes',
    description: 'Current memory usage',
  },
  {
    name: 'Network Receive',
    query:
      'sum(rate(container_network_receive_bytes_total{name=~".+"}[5m])) by (name)',
    unit: 'bytes/s',
    description: 'Network receive rate over 5 minutes',
  },
  {
    name: 'Network Transmit',
    query:
      'sum(rate(container_network_transmit_bytes_total{name=~".+"}[5m])) by (name)',
    unit: 'bytes/s',
    description: 'Network transmit rate over 5 minutes',
  },
];

interface PrometheusMetric {
  metric: {
    [key: string]: string;
  };
  value: [number, string];
}

interface QueryResult {
  name: string;
  data: PrometheusMetric[];
}

export default async function getMetrics() {
  if (!(await limiter.removeTokens(1))) {
    throw new Error('Rate limit exceeded');
  }

  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    const results: QueryResult[] = await Promise.all(
      queries.map(async ({ name, query }) => {
        const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(
          query
        )}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { name, data: data.data.result };
      })
    );

    const formattedResults = results.map(({ name, data }) => {
      const queryInfo = queries.find((q) => q.name === name);
      return {
        metric: name,
        unit: queryInfo?.unit,
        description: queryInfo?.description,
        data: data.map((item: PrometheusMetric) => ({
          container: item.metric.name,
          value: parseFloat(item.value[1]).toFixed(2),
        })),
      };
    });

    cache = { data: formattedResults, timestamp: Date.now() };
    return formattedResults;
  } catch (error) {
    console.error('Error fetching Prometheus data:', error);
    throw new Error('Failed to fetch Prometheus data');
  }
}
