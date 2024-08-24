'use client';

import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';

export default function OpenAITest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/openai-analyze', {
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
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <Typography variant='h4' gutterBottom>
        OpenAI Simple Test
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant='outlined'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Enter your prompt here'
        sx={{ mb: 2 }}
      />
      <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {response && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant='body1'>{response}</Typography>
        </Paper>
      )}
    </Box>
  );
}
