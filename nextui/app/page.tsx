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
          background: 'linear-gradient(to bottom, #0a192f, #112240)',
          color: '#e6f1ff',
          padding: '40px 0',
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
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography 
              variant='h2' 
              component='h1' 
              gutterBottom
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to Morpheus
            </Typography>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Typography 
              variant='h5' 
              component='h2' 
              gutterBottom
              sx={{
                fontWeight: 300,
                color: '#8892b0',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              A Docker, Kubernetes visualizer and dashboard tool with AI integration
            </Typography>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              variant='contained'
              size='large'
              component={Link}
              href='/dashboard'
              sx={{
                mt: 3,
                py: 1,
                px: 3,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #4286f4, #42e5f4)',
                boxShadow: '0 4px 6px rgba(66, 134, 244, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3a76d8, #3accd8)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 8px rgba(66, 134, 244, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ background: '#f5f8ff', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {[
              { title: 'Docker Dashboard', description: 'Visualize and manage your Docker containers with ease.' },
              { title: 'Kubernetes Integration', description: 'Monitor and control your Kubernetes clusters effortlessly.' },
              { title: 'AI-Powered Insights', description: 'Leverage AI to optimize your container and cluster performance.' },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 * index + 0.8, duration: 0.5 }}
                  style={{ height: '100%' }}
                >
                  <Box
                    sx={{
                      padding: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      background: 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <Typography 
                      variant='h5' 
                      component='h3' 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600, 
                        color: '#0a192f',
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: '#4a5568', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
