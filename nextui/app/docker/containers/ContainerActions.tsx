'use client';

import { Button, Stack } from '@mui/material';
import { useState } from 'react';

interface ContainerActionsProps {
  containerId: string;
  state: string;
}

export default function ContainerActions({ containerId, state }: ContainerActionsProps) {
  const [containerState, setContainerState] = useState(state);

  const handleStart = async () => {
    await fetch(`/api/v1/docker/containers/${containerId}/start`, { method: 'GET' });
    setContainerState('running');
  };

  const handleStop = async () => {
    await fetch(`/api/v1/docker/containers/${containerId}/stop`, { method: 'GET' });
    setContainerState('exited');
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" color="success" onClick={handleStart} disabled={containerState === 'running'}>
        Start
      </Button>
      <Button variant="contained" color="error" onClick={handleStop} disabled={containerState === 'exited'}>
        Stop
      </Button>
    </Stack>
  );
}
