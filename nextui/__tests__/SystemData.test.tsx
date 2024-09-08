import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../app/systemData/Dashboard';

jest.mock('next/router', () => require('next-router-mock'));

describe('SystemData Dashboard', () => {
  it('renders without crashing', () => {
    render(<Dashboard />);
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('RAM status')).toBeInTheDocument();
  });

  it('renders the correct number of Grid containers', () => {
    render(<Dashboard />);
    const gridContainers = document.querySelectorAll('.MuiGrid-container');
    expect(gridContainers.length).toBe(5); 
  });

  it('renders iframes for each panel', () => {
    render(<Dashboard />);
    const iframes = document.querySelectorAll('iframe');
    expect(iframes.length).toBe(11); 
  });

  it('renders the correct headers for each section', () => {
    render(<Dashboard />);
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage detailed')).toBeInTheDocument();
    expect(screen.getByText('Network data detailed')).toBeInTheDocument();
    expect(screen.getByText('Extended CPU data')).toBeInTheDocument();
    expect(screen.getByText('Cached Mem data')).toBeInTheDocument();
    expect(screen.getByText('Sent packets Data')).toBeInTheDocument();
    expect(screen.getByText('Received Packets Data')).toBeInTheDocument();
  });
});
