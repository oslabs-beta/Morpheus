'use client';

import React from 'react';
import Sidebar from './components/sideBar/sideBar'; // Ensure this path is correct based on your folder structure

const LandingPage = () => {
  return (
    <div className='relative w-full h-screen overflow-hidden bg-animated'>
      {/* Sidebar */}
      <Sidebar />

      {/* Content Container */}
      <div className='flex flex-col justify-center items-center min-h-screen text-white px-6'>
        <header className='text-center mb-12'>
          <h1 className='text-6xl font-extrabold mb-6 drop-shadow-lg'>
            Welcome to Morpheus Dashboard
          </h1>
          <p className='text-xl drop-shadow-lg max-w-lg mx-auto'>
            Easily manage and monitor your containers and dashboard.
          </p>
        </header>

        {/* Docker Management Section */}
        <div className='bg-white bg-opacity-10 p-6 rounded-lg shadow-xl mb-8 w-full max-w-md text-center hover:shadow-2xl transform hover:scale-105 transition-transform duration-300'>
          <h2 className='text-3xl font-semibold mb-4'>Docker Management</h2>
          <p className='mb-4'>
            Start, stop, and monitor Docker containers running on your server.
          </p>
          <button
            className='px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition duration-300'
            onClick={() => (window.location.href = '/docker/containers')}
          >
            Manage Docker Containers
          </button>
        </div>

        {/* Kubernetes Metrics Section */}
        <div className='bg-white bg-opacity-10 p-6 rounded-lg shadow-xl w-full max-w-md text-center hover:shadow-2xl transform hover:scale-105 transition-transform duration-300'>
          <h2 className='text-3xl font-semibold mb-4'>Kubernetes Metrics</h2>
          <p className='mb-4'>
            View and analyze metrics for Kubernetes clusters and nodes.
          </p>
          <button
            className='px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition duration-300'
            onClick={() => (window.location.href = '/kubernetes')}
          >
            View Kubernetes Metrics
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className='absolute bottom-4 w-full text-center text-white text-sm'></footer>
    </div>
  );
};

export default LandingPage;
