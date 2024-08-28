import React from 'react';
import './dashboard.css'; // Ensure this path is correct based on your folder structure

const Dashboard = () => {
  return (
    <div className='dashboard-full-container'>
      <header className='header'></header>

      <h2 className='dashboard-title'>Docker Dashboard 📊</h2>

      <div className='dashboard-grid'>
        <div className='dashboard-card border-blue'>
          <h3 className='card-title'>CPU Usage per Container 🖥️</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=1'
            width='100%'
            height='250'
            className='iframe'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='dashboard-card border-green'>
          <h3 className='card-title'>Network Traffic 🌐</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=19'
            width='100%'
            height='250'
            className='iframe'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='dashboard-card border-yellow'>
          <h3 className='card-title'>Disk I/O 💾</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=3'
            width='100%'
            height='250'
            className='iframe'
            frameBorder='0'
          ></iframe>
        </div>
        <div className='dashboard-card border-red'>
          <h3 className='card-title'>Used Disk Space 📦</h3>
          <iframe
            src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=13'
            width='100%'
            height='250'
            className='iframe'
            frameBorder='0'
          ></iframe>
        </div>
      </div>

      <footer className='footer'></footer>
    </div>
  );
};

export default Dashboard;
