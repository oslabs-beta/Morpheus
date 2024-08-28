import React from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
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
    <Container maxWidth='md'>
      <h1>Docker Containers</h1>
      <List>
        {containers.map((container) => (
          <ListItem key={container.Id} divider>
            <ListItemText
              primaryTypographyProps={{ style: { color: 'black' } }}
              primary={container.Names[0].slice(1)}
            />
            <ContainerActions
              containerId={container.Id}
              state={container.State}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
