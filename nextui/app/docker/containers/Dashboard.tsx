import React from 'react';

const Dashboard = () => {
  return (
    <div className='max-w-7xl mx-auto p-8 bg-gray-900 rounded-xl shadow-xl'>
      <header className='flex justify-between items-center bg-blue-600 p-4 rounded-lg mb-8'></header>

      <h2 className='text-5xl font-bold text-center text-white mb-12'>
        Docker Dashboard 📊
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300'>
          <h3 className='text-white text-xl mb-4'>
            CPU Usage per Container 🖥️
          </h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=1'
            width='100%'
            height='250'
            className='rounded-lg border-none'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300'>
          <h3 className='text-white text-xl mb-4'>Network Traffic 🌐</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=19'
            width='100%'
            height='250'
            className='rounded-lg border-none'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-yellow-500 transform hover:scale-105 transition-transform duration-300'>
          <h3 className='text-white text-xl mb-4'>Disk I/O 💾</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=3'
            width='100%'
            height='250'
            className='rounded-lg border-none'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-red-500 transform hover:scale-105 transition-transform duration-300'>
          <h3 className='text-white text-xl mb-4'>Used Disk Space 📦</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=13'
            width='100%'
            height='250'
            className='rounded-lg border-none'
            frameBorder='0'
          ></iframe>
        </div>
      </div>

      <footer className='text-center text-gray-500 mt-12'></footer>
    </div>
  );
};

export default Dashboard;
