'use client';

import React from 'react';
import { MetricsDisplay } from '../components/MetricsDisplay';

export default function MetricsPage() {
  return (
    <div>
      <h1>Database Metrics</h1>
      <MetricsDisplay />
    </div>
  );
}
