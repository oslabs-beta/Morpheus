'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { styled as systemStyled } from '@mui/system';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Grid from '@mui/material/Grid';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '90.3vh',
  width: '100%',
  background: 'linear-gradient(to bottom, #d7dcdd 0%, #6981ac 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  // backdropFilter: 'blur(10px)',
  zIndex: 1,
}));

// Keep your existing GlassContainer styling
const GlassContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  background: 'rgba(255, 255, 255, 0.01)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 1)',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  width: '100%',
  maxWidth: '1200px',
  height: '85vh',
  margin: 'auto',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  flex: 1, // This will make it take up all available vertical space
  width: '100%',
}));

const FrostedElement = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 1)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(0),
  marginRight: theme.spacing(30),
  marginLeft: theme.spacing(1),
  width: '100%',
  height: '530px',
  overflow: 'auto',
  maxWidth: '100%',
  boxSizing: 'border-box',
  '& > *': {
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
  '& pre': {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundClip: 'content-box',
    transition: 'background-color 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  '&:not(:hover)::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
  '&:not(:hover)': {
    scrollbarColor: 'transparent transparent',
  },
  '&:hover': {
    transition: 'scrollbar-color 0.3s ease',
  },
  flex: 1,
}));

const FrostedFrames = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 1)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  flex: 1,
  width: 'auto',
  overflowY: 'auto',
  // height: 'auto', // This will make it take up full height of its container
  height: '594px',
  display: 'flex',
  flexDirection: 'column',
  // maxWidth: '100%',
  boxSizing: 'border-box',
  '& > *': {
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
  '& pre': {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundClip: 'content-box',
    transition: 'background-color 0.3s ease',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  '&:not(:hover)::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
  '&:not(:hover)': {
    scrollbarColor: 'transparent transparent',
  },
  '&:hover': {
    transition: 'scrollbar-color 0.3s ease',
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingBottom: '50px', // Add extra space at the bottom
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(2, 0),
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
  width: '100%',
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #59D7F7 20%, #2196F3 60%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent', // Fallback for browsers that don't support background-clip: text
}));

const StyledSubHeader = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#7F8C8D',
  paddingBottom: '30px',
}));

export default function Dashboard() {
  const [data, setData] = useState<string | undefined>();
  const [typedData, setTypedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onClickHandle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/aws-bedrock');
      console.log(response.data);
      setData(response.data.result);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
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

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800); // Adjust this value to control how long the scrollbar stays visible after scrolling
  };

  return (
    <StyledEngineProvider injectFirst>
      <StyledContainer>
        <CssBaseline />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            top: '-10vw',
            left: '-10vw',
          }}
        />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            top: '-20vw',
            left: '50vw',
          }}
        />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            bottom: '-5vw',
            right: '-5vw',
          }}
        />
        <GlassContainer style={{ maxWidth: '1600px' }}>
          <StyledHeader variant='h3'>AWS Bedrock Analyzer</StyledHeader>
          <StyledSubHeader variant='subtitle1'>
            Analyze your data with Claude 3 Haiku
          </StyledSubHeader>
          <ContentContainer>
            <Box sx={{ flex: 1, maxWidth: '50%' }}>
              <AnalyzeButton variant='contained' onClick={onClickHandle}>
                ANALYZE
              </AnalyzeButton>
              <FrostedElement
                onScroll={handleScroll}
                sx={{
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: isScrolling
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'transparent',
                  },
                  scrollbarColor: isScrolling
                    ? 'rgba(255, 255, 255, 0.5) transparent'
                    : 'transparent transparent',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ color: 'white', fontStyle: 'italic', fontSize: '18px' }}
                >
                  AWS Bedrock Results:
                </Typography>
                <Box sx={{ color: '#4A5B6A', overflow: 'auto', flex: 1 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: 'white' }}>
                        Generating Response
                      </Typography>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    </Box>
                  ) : (
                    <ReactMarkdown>{typedData}</ReactMarkdown>
                  )}
                </Box>
              </FrostedElement>
            </Box>
            <FrostedFrames>
              <Typography
                variant='h5'
                sx={{
                  color: '#8F8C8D',
                  fontWeight: 'bold',
                  marginBottom: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Docker Metrics
              </Typography>
              <ScrollableContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ color: '#F5F5F5', marginBottom: 1 }}
                    >
                      CPU Usage per Container 🖥️
                    </Typography>
                    <iframe
                      src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=1'
                      width='100%'
                      height='450'
                      style={{ border: 'none', borderRadius: '8px' }}
                    ></iframe>
                  </Box>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ color: '#F5F5F5', marginBottom: 1 }}
                    >
                      Network Traffic 🌐
                    </Typography>
                    <iframe
                      src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=19'
                      width='100%'
                      height='450'
                      style={{ border: 'none', borderRadius: '8px' }}
                    ></iframe>
                  </Box>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ color: '#F5F5F5', marginBottom: 1 }}
                    >
                      Disk I/O 💾
                    </Typography>
                    <iframe
                      src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=3'
                      width='100%'
                      height='450'
                      style={{ border: 'none', borderRadius: '8px' }}
                    ></iframe>
                  </Box>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ color: '#F5F5F5', marginBottom: 1 }}
                    >
                      Used Disk Space 📦
                    </Typography>
                    <iframe
                      src='http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=10s&panelId=13'
                      width='100%'
                      height='450'
                      style={{ border: 'none', borderRadius: '8px' }}
                    ></iframe>
                  </Box>
                </Box>
              </ScrollableContent>
            </FrostedFrames>
          </ContentContainer>
        </GlassContainer>
      </StyledContainer>
    </StyledEngineProvider>
  );
}
