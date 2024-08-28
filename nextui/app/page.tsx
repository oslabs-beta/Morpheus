'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface Particle {
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 8,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 2,
    }));
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.velocityX + 100) % 100,
          y: (particle.y + particle.velocityY + 100) % 100,
        }))
      );
    };

    const animationInterval = setInterval(animateParticles, 50);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          background: '#0a192f',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(45deg, rgba(66, 134, 244, 0.15), rgba(66, 229, 244, 0.15))',
            backgroundSize: '400% 400%',
            animation: `${gradientAnimation} 15s ease infinite`,
            zIndex: 1,
          },
        }}
      >
        {particles.map((particle, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              zIndex: 0,
            }}
          />
        ))}
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography variant='h2' component='h1' gutterBottom>
              Welcome to Morpheus
            </Typography>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Typography variant='h5' component='h2' gutterBottom>
              A Docker, Kubernetes visualizer and dashboard tool with AI
              integration
            </Typography>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              variant='contained'
              color='primary'
              size='large'
              component={Link}
              href='/dashboard'
              sx={{
                mt: 2,
                background: 'rgba(66, 134, 244, 0.8)',
                '&:hover': { background: 'rgba(66, 134, 244, 1)' },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Container sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          {[
            'Docker Dashboard',
            'Kubernetes Integration',
            'AI-Powered Insights',
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index + 0.8, duration: 0.5 }}
              >
                <Box
                  sx={{
                    padding: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                    },
                  }}
                >
                  <Typography variant='h5' component='h3' gutterBottom>
                    {feature}
                  </Typography>
                  <Typography>
                    {index === 0 &&
                      'Visualize and manage your Docker containers with ease.'}
                    {index === 1 &&
                      'Monitor and control your Kubernetes clusters effortlessly.'}
                    {index === 2 &&
                      'Leverage AI to optimize your container and cluster performance.'}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
