import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-900 rounded-xl shadow-xl">
      <header className="flex justify-between items-center bg-blue-600 p-4 rounded-lg mb-8"></header>

      <h2 className="text-5xl font-bold text-center text-white mb-12">k8s Cluster Dashboard 📊</h2>

      {/* <div className="flex-1">
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=1"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=2"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=3"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=4"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=5"
          // width="450"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
        <iframe
          src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=6"
          height="200"
          className="rounded-lg border-none"
          frameBorder="0"
        ></iframe>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">CPU Usage by Namespace 🖥️</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=7"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">CPU Quota by Namespace 🖥️</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=8"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">Memory Usage by Namespace</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=9"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">Memory Requests</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=10"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">Network Traffic / Receive 🌐</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=12"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">Network Traffic / Transmit 🌐</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=13"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-green-500 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-white text-xl mb-4">Network Traffic 🌐</h3>
          <iframe
            src="http://localhost:45556/d-solo/efa86fd1d0c121a26444b636a3f509a8/kubernetes-compute-resources-cluster?orgId=1&refresh=10s&panelId=11"
            width="100%"
            height="250"
            className="rounded-lg border-none"
            frameBorder="0"
          ></iframe>
        </div>
      </div>

      <footer className="text-center text-gray-500 mt-12"></footer>
    </div>
  );
};

export default Dashboard;
