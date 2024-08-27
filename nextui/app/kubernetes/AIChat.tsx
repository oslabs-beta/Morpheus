// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from '@mui/material';
// import ReactMarkdown from 'react-markdown';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

// const AIChat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [model, setModel] = useState('gpt-3.5-turbo');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = { role: 'user', content: input };
//     setMessages([...messages, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/AIChat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: input, model: model }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to get response from AI');
//       }

//       const data = await response.json();
//       const assistantMessage: Message = {
//         role: 'assistant',
//         content: data.result,
//       };
//       setMessages((prevMessages) => [...prevMessages, assistantMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage: Message = {
//         role: 'assistant',
//         content: 'Sorry, there was an error processing your request.',
//       };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <Typography variant='h6' sx={{ mb: 2 }}>
//         AI Assistant
//       </Typography>
//       <Paper sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2 }}>
//         {messages.map((message, index) => (
//           <Box key={index} sx={{ mb: 2 }}>
//             <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
//               {message.role === 'user' ? 'You' : 'AI'}:
//             </Typography>
//             <ReactMarkdown>{message.content}</ReactMarkdown>
//           </Box>
//         ))}
//       </Paper>
//       <FormControl fullWidth sx={{ mb: 2 }}>
//         <InputLabel id='model-select-label'>Model</InputLabel>
//         <Select
//           labelId='model-select-label'
//           value={model}
//           label='Model'
//           onChange={(e) => setModel(e.target.value)}
//         >
//           <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
//           <MenuItem value='gpt-4'>GPT-4</MenuItem>
//         </Select>
//       </FormControl>
//       <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
//         <TextField
//           fullWidth
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder='Ask a question...'
//           variant='outlined'
//           size='small'
//           sx={{ mr: 1 }}
//           disabled={isLoading}
//         />
//         <Button type='submit' variant='contained' disabled={isLoading}>
//           {isLoading ? 'Sending...' : 'Send'}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default AIChat;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Add your API call logic here
    setIsLoading(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        AI Analysis
      </Typography>
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
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id='model-select-label'>Model</InputLabel>
        <Select
          labelId='model-select-label'
          value={model}
          label='Model'
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
          <MenuItem value='gpt-4'>GPT-4</MenuItem>
        </Select>
      </FormControl>
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
    </Box>
  );
};

export default AIChat;
