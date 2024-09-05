import React from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import ContainerActions from './ContainerActions';

async function getContainers() {
  const Docker = (await import('dockerode')).default;
  const docker = new Docker();
  const containers = await docker.listContainers({ all: true });
  return containers;
}

export default async function ContainersPage() {
  const containers = await getContainers();

  return (
    <Box sx={{ 
      backgroundColor: '#D8DCDD', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Container maxWidth='md' sx={{ py: 2, flexGrow: 1 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 2 }}>
          Docker Containers
        </Typography>
        <Paper elevation={3}>
          <List disablePadding>
            {containers.map((container) => (
              <ListItem
                key={container.Id}
                divider
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <ListItemText
                  primary={container.Names[0].slice(1)}
                  secondary={`ID: ${container.Id.slice(0, 12)}`}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <ContainerActions
                  containerId={container.Id}
                  state={container.State}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
