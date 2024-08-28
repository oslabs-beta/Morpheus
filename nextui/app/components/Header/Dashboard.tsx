import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className='max-w-7xl mx-auto p-8'>
      <header className='flex justify-between items-center bg-blue-600 p-4 rounded-lg mb-8'>
        <h1 className='text-white text-2xl font-bold'>Morpheus Dashboard</h1>
        <nav className='text-white'>
          <Link href='/dashboard'>
            <a className='mx-4'>Dashboard</a>
          </Link>
          <Link href='/settings'>
            <a className='mx-4'>Settings</a>
          </Link>
          <Link href='/data'>
            <a className='mx-4'>Data</a>
          </Link>
          <Link href='/kubernetes'>
            <a className='mx-4'>Kubernetes</a>
          </Link>
          <Link href='/docker/containers'>
            <a className='mx-4'>Docker Management</a>
          </Link>
        </nav>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Docker Management Section */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Docker Management</h2>
          <p className='mb-4'>
            Start, stop, and monitor Docker containers running on your server.
          </p>
          <Link href='/docker/containers'>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
              Manage Docker Containers
            </button>
          </Link>
        </div>

        {/* Kubernetes Metrics Section */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-bold mb-4'>Kubernetes Metrics</h2>
          <p className='mb-4'>
            View and analyze metrics for Kubernetes clusters and nodes.
          </p>
          <Link href='/api/k-prometheus-query'>
            <button className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'>
              View Kubernetes Metrics
            </button>
          </Link>
        </div>
      </div>

      {/* Docker Containers Table */}
      <div className='mt-12'>
        <h2 className='text-3xl font-bold mb-4'>Docker Containers</h2>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          {/* Table Header */}
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold'>Container Name</h3>
            <div className='flex space-x-4'>
              <span className='text-gray-700'>Actions</span>
            </div>
          </div>
          {/* Table Rows - Dynamically generated */}
          <div className='space-y-2'>
            {[
              'k8s-morpheus-worker3',
              'k8s-morpheus-worker',
              'k8s-morpheus-worker2',
              'k8s-morpheus-control-plane',
              'morpheus-grafana',
              'morpheus-prometheus',
              'morpheus-cadvisor',
              'morpheus',
              'morpheus-node-exporter',
            ].map((containerName, index) => (
              <div
                key={index}
                className='flex justify-between items-center p-4 bg-gray-100 rounded-lg'
              >
                <span>{containerName}</span>
                <div className='flex space-x-2'>
                  <button className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition'>
                    Start
                  </button>
                  <button className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'>
                    Stop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
