'use client';

import { CssBaseline } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './data.module.scss';
import ReactMarkdown from 'react-markdown';

type ApiResponse = {
  data: string; // Adjust this based on your actual JSON structure
};

export default function DashboardData() {
  const [data, setData] = useState<string | undefined>();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [typedData, setTypedData] = useState('');
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [textBoxFadeState, setTextBoxFadeState] = useState<
    'fade-in' | 'fade-out'
  >('fade-out'); // Initially fade-out
  const [isLoading, setIsLoading] = useState(false);

  const onClickHandle = async () => {
    // Start fading out the button
    setFadeState('fade-out');
    setIsLoading(true);
    setTimeout(() => {
      setIsButtonVisible(false); // Remove the button after fading out
    }, 1000); // 1s for button fade-out

    try {
      const response = await axios.get('/api/aws-bedrock');
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
      setTextBoxFadeState('fade-in'); // Start fading in the text box
    } catch (error) {
      console.error('Error fetching data: ', error);
      setIsLoading(false);
      setIsButtonVisible(true);
      setTextBoxFadeState('fade-out'); // Reset the text box if error occurs
    }
  };

  useEffect(() => {
    if (data) {
      const typingDelay = 2500; // Delay to match fade-in duration (2 seconds)
      setTypedData(''); // Reset the typed data

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
        }, 12); // Adjust the speed of typing here
      }, typingDelay);
    }
  }, [data]);

  // useEffect(() => {
  //   setTypedData(data); // Test with a full block of text
  // }, [data]);

  return (
    <div className={styles.container}>
      <CssBaseline />
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
      <div className={`${styles['data-display']} ${styles[textBoxFadeState]}`}>
        <ReactMarkdown>{typedData}</ReactMarkdown>
      </div>
    </div>
  );
}
