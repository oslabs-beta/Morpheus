'use client';

import React from 'react';
import { Container, CssBaseline, Box } from '@mui/material';
import Sidebar from '../../components/sideBar/sideBar';
import styles from './data.module.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';

type ApiResponse = {
  data: string;
};

export default function DashboardData() {
  const [data, setData] = useState<string | undefined>();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [typedData, setTypedData] = useState('');
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [textBoxFadeState, setTextBoxFadeState] = useState<
    'fade-in' | 'fade-out'
  >('fade-out');
  const [isLoading, setIsLoading] = useState(false);

  const onClickHandle = async () => {
    setFadeState('fade-out');
    setIsLoading(true);
    setTimeout(() => {
      setIsButtonVisible(false);
    }, 1000);

    try {
      const response = await axios.get(
        'http://localhost:5000/api/aws-response'
      );
      setData(response.data);
      setIsLoading(false);
      setTextBoxFadeState('fade-in');
    } catch (error) {
      console.error('Error fetching data: ', error);
      setIsLoading(false);
      setIsButtonVisible(true);
      setTextBoxFadeState('fade-out');
    }
  };

  useEffect(() => {
    if (data) {
      const typingDelay = 2500;
      setTypedData('');
      setTimeout(() => {
        let currentIndex = 0;
        const intervalId = setInterval(() => {
          setTypedData((prev) => {
            const newTypedData = prev + (data[currentIndex] || '');
            currentIndex++;
            if (currentIndex === data.length) {
              clearInterval(intervalId);
            }
            return newTypedData;
          });
        }, 12);
      }, typingDelay);
    }
  }, [data]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Container component='main' maxWidth='lg' sx={{ flexGrow: 1, p: 3 }}>
        <CssBaseline />
        <div className={styles.container}>
          <div className={styles['button-wrapper']}>
            {isButtonVisible && (
              <button
                className={`${styles['aws-btn']} ${styles[fadeState]}`}
                onClick={onClickHandle}
              >
                <img
                  src='/aws-bedrock-logo.png'
                  alt='AWS Bedrock Logo'
                  className={styles['logo']}
                />
                <span>Analyze Data</span>
              </button>
            )}
            {isLoading && (
              <div
                className={`${styles['loading-spinner']} ${styles['fade-in']}`}
              ></div>
            )}
          </div>
          <p
            className={`${styles['data-display']} ${styles[textBoxFadeState]}`}
          >
            {typedData}
          </p>
        </div>
      </Container>
    </Box>
  );
}
