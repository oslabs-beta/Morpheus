'use client';

import React from 'react';
import { MetricsDisplay } from '../components/MetricsDisplay';

export default function MetricsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Metrics</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <MetricsDisplay />
      </div>
    </div>
  );
}
