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

  it('renders the correct number of Paper components', () => {
    render(<Dashboard />);
    const paperComponents = document.querySelectorAll('.MuiPaper-root');
    expect(paperComponents.length).toBe(11); 
  });

  it('renders the correct number of iframes with specific sources', () => {
    render(<Dashboard />);
    const systemIframes = document.querySelectorAll('iframe[src*="system?orgId=1"]');
    const dockerIframes = document.querySelectorAll('iframe[src*="docker-container?orgId=1"]');
    expect(systemIframes.length).toBe(7); 
    expect(dockerIframes.length).toBe(4); 
  });

  it('renders the correct classes for grid items', () => {
    render(<Dashboard />);
    const dataCardGrid1Items = document.querySelectorAll('.dataCardGrid1');
    const dataCardGrid2Items = document.querySelectorAll('.dataCardGrid2');
    const thirdGridItems = document.querySelectorAll('.thirdGridItems');
    expect(dataCardGrid1Items.length).toBe(3);
    expect(dataCardGrid2Items.length).toBe(2);
    expect(thirdGridItems.length).toBe(6);
  });

  it('renders the correct header classes', () => {
    render(<Dashboard />);
    const cpuHeaders = document.querySelectorAll('.cardHeaderCPU');
    const memoryHeaders = document.querySelectorAll('.cardHeaderMemory');
    const networkHeaders = document.querySelectorAll('.cardHeaderNetwork');
    expect(cpuHeaders.length).toBe(3);
    expect(memoryHeaders.length).toBe(3);
    expect(networkHeaders.length).toBe(3);
  });
});
