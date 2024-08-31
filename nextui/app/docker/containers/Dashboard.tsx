import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#1a202c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#2b6cb0',
          padding: '16px',
          borderRadius: '8px',
        }}
      >
        {/* Header Section */}
      </Box>

      <Typography
        variant='h2'
        sx={{ color: 'white', marginTop: 4, marginBottom: 4 }}
      >
        Docker Dashboard 📊
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{ maxWidth: '100%', padding: 2, margin: 0 }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#2d3748',
              borderRadius: '8px',
              padding: '24px',
              border: '2px solid #3182ce',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography variant='h5' sx={{ color: 'white', marginBottom: 2 }}>
              CPU Usage per Container 🖥️
            </Typography>
            <iframe
              src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=1'
              width='100%'
              height='250'
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#2d3748',
              borderRadius: '8px',
              padding: '24px',
              border: '2px solid #38a169',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography variant='h5' sx={{ color: 'white', marginBottom: 2 }}>
              Network Traffic 🌐
            </Typography>
            <iframe
              src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=19'
              width='100%'
              height='250'
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#2d3748',
              borderRadius: '8px',
              padding: '24px',
              border: '2px solid #ecc94b',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography variant='h5' sx={{ color: 'white', marginBottom: 2 }}>
              Disk I/O 💾
            </Typography>
            <iframe
              src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=3'
              width='100%'
              height='250'
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: '#2d3748',
              borderRadius: '8px',
              padding: '24px',
              border: '2px solid #e53e3e',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography variant='h5' sx={{ color: 'white', marginBottom: 2 }}>
              Used Disk Space 📦
            </Typography>
            <iframe
              src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=13'
              width='100%'
              height='250'
              style={{ border: 'none', borderRadius: '8px' }}
            ></iframe>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
