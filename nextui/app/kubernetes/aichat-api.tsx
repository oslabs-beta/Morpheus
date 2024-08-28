import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import AIChat from './aichat-format';

const AIChatApi: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/AIChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, model: model }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.result };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <Typography variant='h6' sx={{ mb: 2 }}>
        AI Analysis
      </Typography> */}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id='model-select-label'>Model</InputLabel>
        <Select
          labelId='model-select-label'
          value={model}
          label='Model'
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
          <MenuItem value='gpt-4o'>GPT-4o</MenuItem>
          <MenuItem value='gpt-4'>GPT-4</MenuItem>
        </Select>
      </FormControl>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', marginBottom: '16px' }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask a question...'
          variant='outlined'
          size='small'
          sx={{ mr: 1 }}
          disabled={isLoading}
        />
        <Button type='submit' variant='contained' disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </form>
      <AIChat messages={messages} />
    </Box>
  );
};

export default AIChatApi;
