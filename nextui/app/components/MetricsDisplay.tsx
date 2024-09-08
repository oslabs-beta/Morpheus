'use client';

import React, { useState, useEffect } from 'react';
import styles from './MetricsDisplay.module.css';

interface Metric {
  id: number;
  metric_date: string;
  diskSpace: string;
  memory: string;
  swap: string;
  CPU_usage: string;
  available_memory: string;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatPercentage = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'N/A';
  // If the number is already a percentage (greater than or equal to 1), don't multiply
  return (num >= 1 ? num : num * 100).toFixed(2) + '%';
};

const THRESHOLDS = {
  CPU_usage: 80, // 80%
  memory: 90, // 90%
  diskSpace: 90, // 90%
  swap: 50, // 50%
};

const isOutlier = (metricName: string, value: number): boolean => {
  return value > THRESHOLDS[metricName as keyof typeof THRESHOLDS];
};

export function MetricsDisplay() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/db-metrics?limit=50'); // Fetch last 50 metrics
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const responseData = await response.json();
        console.log('API Response:', responseData); // Log the entire response

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
    const intervalId = setInterval(fetchMetrics, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  const renderMetricCard = (title: string, value: string | number, metricName: string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const formattedValue = metricName.includes('memory') || metricName === 'swap' || metricName === 'diskSpace'
      ? formatBytes(parseInt(value as string))
      : formatPercentage(value as string);
    
    const isOutlying = isOutlier(metricName, numericValue);

    return (
      <div className={`${styles.card} ${isOutlying ? styles.alert : ''}`}>
        <h3>{title}</h3>
        <p>{formattedValue}</p>
        {isOutlying && <span className={styles.alertText}>Alert: High usage</span>}
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (metrics.length === 0) return <div className={styles.noData}>No metrics available</div>;

    return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Metrics Overview</h2>
      <div>
        <div className={styles.timestamp}>
          Last updated: {new Date(metrics[0].metric_date).toLocaleString()}
        </div>
 
        <div className={styles.grid}>
          {renderMetricCard('CPU Usage', metrics[0].CPU_usage, 'CPU_usage')}
          {renderMetricCard('Memory Usage', metrics[0].memory, 'memory')}
          {renderMetricCard('Available Memory', metrics[0].available_memory, 'available_memory')}
          {renderMetricCard('Disk Space Used', metrics[0].diskSpace || '0', 'diskSpace')}
          {renderMetricCard('Swap Usage', metrics[0].swap, 'swap')}
        </div>
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
              <th>Disk Space Used</th>
              <th>Swap Usage</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id}>
                <td>{new Date(metric.metric_date).toLocaleString()}</td>
                <td>{formatPercentage(metric.CPU_usage)}</td>
                <td>{formatBytes(parseInt(metric.memory))}</td>
                <td>{formatBytes(parseInt(metric.available_memory))}</td>
                <td>{formatBytes(parseInt(metric.diskSpace || '0'))}</td>
                <td>{formatBytes(parseInt(metric.swap))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
