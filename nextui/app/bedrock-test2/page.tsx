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

export default function BedrockTest2() {
  // State hooks for managing the analysis result, user input, selected model, loading state, and error messages
  const [analysis, setAnalysis] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('anthropic.claude-3-sonnet-20240229-v1:0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle the analysis process
  const handleAnalysis = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch Prometheus data from the centralized API endpoint
      const prometheusResponse = await fetch('/api/prometheus-query');
      if (!prometheusResponse.ok) {
        throw new Error('Failed to fetch Prometheus data');
      }
      const prometheusData = await prometheusResponse.json();

      // Enhance the user's prompt with the fetched Prometheus data
      const enhancedPrompt = `Human: ${prompt}
These are current metrics data from our containerized system:
${JSON.stringify(prometheusData, null, 2)}
Analyze this, along with the original prompt to provide insights and opinions. 
Organize response by the four metrics, titled. Ensure there is no bold and no headings formatting. 
Create a recommendation section with a list of specific actions.
Aim to specify containers/metrics/numbers. Response should be 1000 to 1500 tokens.`;

      // Send the enhanced prompt to the Bedrock API for analysis
      const bedrockResponse = await fetch('/api/bedrock-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt, model }),
      });

      if (!bedrockResponse.ok) {
        const errorData = await bedrockResponse.json();
        throw new Error(errorData.error || 'Failed to analyze data');
      }

      const data = await bedrockResponse.json();
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
    <Container maxWidth='lg'>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' gutterBottom>
          Bedrock Metrics Analysis
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
            {/* <MenuItem value='amazon.titan-text-express-v1:0:8k'>
              Amazon Titan Text Express
            </MenuItem> */}
            <MenuItem value='anthropic.claude-3-haiku-20240307-v1:0'>
              Anthropic Claude 3 Haiku
            </MenuItem>
          </Select>
        </FormControl>

        {/* User input text field */}
        <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          label='Enter your query'
          placeholder="Example: 'Analyze the performance metrics of my system and provide optimization suggestions.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Analysis trigger button */}
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

        {/* Analysis result display */}
        {analysis && (
          <Paper elevation={3} sx={{ p: 2, mt: 2, width: '100%' }}>
            <Typography variant='body1'>{analysis}</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
