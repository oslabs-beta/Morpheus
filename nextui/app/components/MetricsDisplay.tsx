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
  const [metric, setMetric] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/db-metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const { data } = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format');
        }
        setMetric(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
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
  if (!metric) return <div className={styles.noData}>No metrics available</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Metrics Overview</h2>
      <div className={styles.timestamp}>
        Last updated: {new Date(metric.metric_date).toLocaleString()}
      </div>
      <div className={styles.grid}>
        {renderMetricCard('CPU Usage', metric.CPU_usage, 'CPU_usage')}
        {renderMetricCard('Memory Usage', metric.memory, 'memory')}
        {renderMetricCard('Available Memory', metric.available_memory, 'available_memory')}
        {renderMetricCard('Disk Space Used', metric.diskSpace || '0', 'diskSpace')}
        {renderMetricCard('Swap Usage', metric.swap, 'swap')}
      </div>
    </div>
  );
}
