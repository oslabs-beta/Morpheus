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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// Left input text box that is 1/3 of the page, with drop down menu to choose from different models.
// Upon click, the input and prometheus data from prometheus-query are sent to openAI. Results appear to the right in a box that takes 2/3rds of the page.

export default function OpenAIAnalyzeMetrics() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/openai-analyze-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
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
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={4} sx={{ pr: { md: 2 } }}>
          <Typography
            variant='h3'
            fontFamily={'avenir'}
            gutterBottom
            sx={{ mt: 5, mb: 5 }}
          >
            OpenAI Analysis
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id='model-select-label'>Model</InputLabel>
            <Select
              labelId='model-select-label'
              value={model}
              label='Model'
              onChange={(e) => setModel(e.target.value)}
            >
              <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
              <MenuItem value='gpt-4o-mini'>GPT-4o Mini</MenuItem>
              <MenuItem value='gpt-4o'>GPT-4o</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Enter your prompt here'
            sx={{
              mb: 2,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,.1)',
              '& .MuiInputBase-input': {
                fontSize: '20px',
              },
            }}
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
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mt: 2,
              height: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0,0,0,.2)',
            }}
          >
            {response && (
              <Typography
                variant='h5'
                gutterBottom
                fontWeight='bold'
                fontFamily={'avenir'}
                sx={{ mb: 5 }}
              >
                Insights and Recommendations:
              </Typography>
            )}
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            ) : response ? (
              <Typography
                variant='body1'
                sx={{
                  fontFamily: 'avenir',
                  whiteSpace: 'pre-wrap',
                  fontSize: '22px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {response}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <Typography
                  variant='body1'
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    fontFamily: 'avenir',
                    fontSize: '20px',
                  }}
                >
                  Your results will appear here.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
