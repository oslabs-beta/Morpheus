import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface AIChatProps {
  messages: { role: string; content: string }[];
}

const AIChat: React.FC<AIChatProps> = ({ messages }) => {
  return (
    <Paper
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant='body1'
            sx={{ color: 'text.secondary', fontStyle: 'italic' }}
          >
            Your results will appear here.
          </Typography>
        </Box>
      ) : (
        messages.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
              {message.role === 'user' ? 'You' : 'AI'}:
            </Typography>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default AIChat;
