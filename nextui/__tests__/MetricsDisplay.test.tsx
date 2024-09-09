import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricsDisplay } from '../app/components/MetricsDisplay';

// Mock the fetch function
global.fetch = jest.fn();

describe('MetricsDisplay', () => {
  const mockMetrics = [
    {
      id: 1,
      metric_date: '2023-01-01T00:00:00Z',
      diskSpace: '1000000000',
      memory: '500000000',
      swap: '100000000',
      CPU_usage: '50',
      available_memory: '250000000',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MetricsDisplay />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  it('renders metrics when fetch is successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockMetrics }),
    });

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getByText('System Metrics Overview')).toBeInTheDocument();
      expect(screen.getAllByText('CPU Usage')).toHaveLength(2);
      expect(screen.getAllByText('50.00%')).toHaveLength(2);
      expect(screen.getAllByText('Memory Usage')).toHaveLength(2);
      expect(screen.getAllByText('476.84 MB')).toHaveLength(2);
    });
  });

  it('renders "No metrics available" when data is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getByText('No metrics available')).toBeInTheDocument();
    });
  });

  it('formats bytes correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockMetrics }),
    });

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getAllByText('953.67 MB')).toHaveLength(2); // diskSpace
      expect(screen.getAllByText('476.84 MB')).toHaveLength(2); // memory
      expect(screen.getAllByText('95.37 MB')).toHaveLength(2); // swap
      expect(screen.getAllByText('238.42 MB')).toHaveLength(2); // available_memory
    });
  });

  it('shows alert for high usage', async () => {
    const highUsageMetrics = [
      {
        ...mockMetrics[0],
        CPU_usage: '90',
        memory: '950000000',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: highUsageMetrics }),
    });

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getAllByText('Alert: High usage')).toHaveLength(4);
    });
  });

  it('renders metrics history table', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockMetrics }),
    });

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Metrics History')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(2); // Header + 1 data row as im displaying it in the metrics endpoint twice 
    });
  });
});
