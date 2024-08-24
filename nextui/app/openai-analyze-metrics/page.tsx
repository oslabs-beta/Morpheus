'use client';

import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';

export default function OpenAIAnalyzeMetrics() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/openai-analyze-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setError('An error occurred while fetching the response.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        // bgcolor: 'gray',
        // color: 'white',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography variant='h4' gutterBottom>
            OpenAI Metrics Analysis
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Enter your prompt here'
            sx={{ mb: 2, bgcolor: 'white' }}
          />
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Analyze'}
          </Button>
          {error && (
            <Typography color='error' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          {response && (
            <Paper elevation={3} sx={{ p: 2, mt: 2, height: '100%' }}>
              <Typography variant='h6' gutterBottom fontWeight='bold'>
                Insights and Recommendations:
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  fontFamily: 'Calibri, Arial, sans-serif',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {response}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
