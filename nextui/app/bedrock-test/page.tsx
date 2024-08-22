'use client';

import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  CircularProgress,
} from '@mui/material';

export default function BedrockTest() {
  // State hooks for managing the analysis result, user input, selected model, loading state, and error messages
  const [analysis, setAnalysis] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('anthropic.claude-3-sonnet-20240229-v1:0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch Prometheus data
  const fetchPrometheusData = async () => {
    // Define queries for various container metrics
    const queries = [
      'container_cpu_usage_seconds_total',
      'container_memory_usage_bytes',
      'container_network_receive_bytes_total',
      'container_network_transmit_bytes_total',
    ];

    // Fetch data for each query in parallel
    const results = await Promise.all(
      queries.map(async (query) => {
        try {
          const response = await fetch(
            `/api/prometheus-query?query=${encodeURIComponent(query)}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        } catch (error) {
          console.error(`Error fetching data for query ${query}:`, error);
          return null; // or some error placeholder
        }
      })
    );

    return results.filter((result) => result !== null);
  };

  // Function to handle the analysis request
  const handleAnalysis = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch Prometheus data before sending the request to Bedrock
      const prometheusData = await fetchPrometheusData();

      // Enhance the prompt with Prometheus data
      const enhancedPrompt = `
        ${prompt}
        
        Here's the current metrics data from our containers:
        ${JSON.stringify(prometheusData, null, 2)}
        
        Please analyze these metrics and provide insights and optimization suggestions.
      `;

      // Send the enhanced prompt to the Bedrock API
      const response = await fetch('/api/bedrock-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt, model }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze data');
      }

      const data = await response.json();
      setAnalysis(data.result);
    } catch (error) {
      console.error('Error during analysis:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container component to center content and set max width
    <Container
      maxWidth='lg'
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ width: '50%', p: 4 }}>
        {/* Page title */}
        <Typography variant='h4' gutterBottom align='center'>
          LLM Analysis
        </Typography>

        {/* Model selection dropdown */}
        <FormControl fullWidth sx={{ mb: 2, mt: 4 }}>
          <InputLabel id='model-select-label'>
            Choose your preferred model
          </InputLabel>
          <Select
            labelId='model-select-label'
            id='model-select'
            value={model}
            label='Choose your preferred model'
            onChange={(e) => setModel(e.target.value)}
          >
            <MenuItem value='anthropic.claude-3-sonnet-20240229-v1:0'>
              Anthropic Claude 3 Sonnet
            </MenuItem>
            <MenuItem value='anthropic.claude-instant-v1'>
              Anthropic Claude Instant
            </MenuItem>
            <MenuItem value='amazon.titan-text-express-v1:0:8k'>
              Amazon Titan Text Express
            </MenuItem>
          </Select>
        </FormControl>

        {/* Text input for user query */}
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          id='query-input'
          name='query-input'
          label='Enter your query'
          placeholder="Example: 'Analyze the performance metrics of my containers and provide optimization suggestions.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Button to trigger analysis */}
        <Button
          fullWidth
          variant='contained'
          onClick={handleAnalysis}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Run Analysis'}
        </Button>

        {/* Error message display */}
        {error && (
          <Typography color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Analysis results display */}
        {analysis && (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant='body1'>{analysis}</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
