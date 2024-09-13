'use client';

import React, { useState, useEffect } from 'react';
import styles from './MetricsDisplay.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface Metric {
  id: number;
  metric_date: string;
  cpu_usage: number;
  memory_usage: number;
  available_memory: number;
  total_memory: number;
  network_receive_bytes: number;
  network_transmit_bytes: number;
  load_average: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const THRESHOLDS = {
  cpu_usage: 80, // 80%
  memory_usage: 0.9, // 90% of total memory
  load_average: 5, // Load average threshold
};

const isOutlier = (metricName: string, value: number): boolean => {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (threshold !== undefined) {
    if (metricName === 'memory_usage') {
      // For memory_usage, value is already in percentage
      return value > threshold;
    }
    return value > threshold;
  }
  return false;
};

export function MetricsDisplay() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchInterval, setFetchInterval] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/db-metrics?limit=50'); // Fetch last 50 metrics
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const responseData = await response.json();
        console.log('API Response:', responseData);

        let metricsData: Metric[];
        if (Array.isArray(responseData.data)) {
          metricsData = responseData.data;
        } else if (typeof responseData.data === 'object' && responseData.data !== null) {
          metricsData = [responseData.data];
        } else {
          throw new Error('Invalid data format');
        }

        setMetrics(metricsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, fetchInterval * 1000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, [fetchInterval]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const responseData = await response.json();
        setFetchInterval(responseData.data.fetch_interval);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFetchInterval(Number(event.target.value));
  };

  const handleUpdateSettings = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fetch_interval: fetchInterval, run_immediately: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunImmediately = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fetch_interval: fetchInterval, run_immediately: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to trigger immediate execution');
      }
    } catch (err) {
      console.error('Error triggering immediate execution:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricDescriptions = {
    cpu_usage: 'Percentage of CPU used across all cores.',
    memory_usage: 'Amount of memory currently in use.',
    available_memory: 'Amount of free memory available.',
    network_receive_bytes: 'Data received over the network per second.',
    network_transmit_bytes: 'Data transmitted over the network per second.',
    load_average: 'Average system load over the last minute.',
  };

  const renderMetricCard = (
    title: string,
    metric: Metric,
    metricName: keyof Metric
  ) => {
    const value = metric[metricName];
    let formattedValue: string;

    switch (metricName) {
      case 'cpu_usage':
        formattedValue = typeof value === 'number' ? value.toFixed(2) + '%' : value.toString();
        break;
      case 'memory_usage':
        const totalMemory = metric.total_memory;
        if (totalMemory && typeof value === 'number') {
          const percentage = (value / totalMemory) * 100;
          formattedValue = percentage.toFixed(2) + '%';
        } else if (typeof value === 'number') {
          formattedValue = formatBytes(value);
        } else {
          formattedValue = 'N/A';
        }
        break;
      case 'available_memory':
        formattedValue = typeof value === 'number' ? formatBytes(value) : 'N/A';
        break;
      case 'network_receive_bytes':
      case 'network_transmit_bytes':
        formattedValue = typeof value === 'number' ? formatBytes(value) + '/s' : 'N/A';
        break;
      case 'load_average':
        formattedValue = typeof value === 'number' ? value.toFixed(2) : value.toString();
        break;
      default:
        formattedValue = value.toString();
    }

    const isOutlying = isOutlier(metricName, typeof value === 'number' ? value : parseFloat(value.toString()));

    return (
    <Tooltip
      title={metricDescriptions[metricName as keyof typeof metricDescriptions] || ''}
      arrow
    >
      <div
        key={metricName}
        className={`${styles.card} ${isOutlying ? styles.alert : ''}`}
      >
        <h3>{title}</h3>
        <p>{formattedValue}</p>
        {isOutlying && <span className={styles.alertText}>Alert: High usage</span>}
      </div>
    </Tooltip>
  );
};

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (metrics.length === 0) return <div className={styles.noData}>No metrics available</div>;

  const latestMetric = metrics[0];

  const chartData = metrics.slice().reverse().map((metric) => ({
    ...metric,
    memory_usage_percentage: (metric.memory_usage / metric.total_memory) * 100,
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Metrics Overview</h2>

      <div className={styles.controls}>
        <TextField
          label="Fetch Interval (seconds)"
          type="number"
          value={fetchInterval}
          onChange={handleIntervalChange}
          disabled={isSubmitting}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateSettings}
          disabled={isSubmitting}
        >
          Update Interval
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRunImmediately}
          disabled={isSubmitting}
        >
          Run Immediately
        </Button>
      </div>

      <div>
        <div className={styles.timestamp}>
          Last updated: {new Date(latestMetric.metric_date).toLocaleString()}
        </div>
        <div className={styles.grid}>
          {renderMetricCard('CPU Usage', latestMetric, 'cpu_usage')}
{renderMetricCard('Memory Usage', latestMetric, 'memory_usage')}
          {renderMetricCard('Available Memory', latestMetric, 'available_memory')}
          {renderMetricCard('Network Receive', latestMetric, 'network_receive_bytes')}
          {renderMetricCard('Network Transmit', latestMetric, 'network_transmit_bytes')}
          {renderMetricCard('Load Average', latestMetric, 'load_average')}
        </div>
      </div>

      <h3 className={styles.subtitle}>Metrics Over Time</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="metric_date"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis />
            <RechartsTooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="cpu_usage" name="CPU Usage (%)" stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey="memory_usage_percentage"
              name="Memory Usage (%)"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="load_average"
              name="Load Average"
              stroke="#ff7300"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className={styles.subtitle}>Metrics History</h3>
      <div className={styles.tableContainer}>
        <table className={styles.metricsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>CPU Usage</th>
              <th>Memory Usage</th>
              <th>Available Memory</th>
              <th>Network Receive</th>
              <th>Network Transmit</th>
              <th>Load Average</th>
            </tr>
          </thead>
         <tbody>
  {metrics.map((metric) => (
    <tr key={metric.id}>
      <td>{new Date(metric.metric_date).toLocaleString()}</td>
      <td>{metric.cpu_usage.toFixed(2)}%</td>
      <td>
        {((metric.memory_usage / metric.total_memory) * 100).toFixed(2)}%
      </td>
      <td>{formatBytes(metric.available_memory)}</td>
      <td>{formatBytes(metric.network_receive_bytes)}/s</td>
      <td>{formatBytes(metric.network_transmit_bytes)}/s</td>
      <td>{metric.load_average.toFixed(2)}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}
