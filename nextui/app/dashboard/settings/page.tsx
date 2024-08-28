'use client'; // Ensure this is a client component

import React from 'react';
import {
  CssBaseline,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  TextField,
  Button,
} from '@mui/material';

export default function Settings() {
  return (
    <Container maxWidth='md' style={{ marginTop: '20px' }}>
      <CssBaseline />
      <Typography variant='h4' component='h1' gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Settings Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Profile Settings
              </Typography>
              <TextField
                label='Username'
                fullWidth
                margin='normal'
                variant='outlined'
              />
              <TextField
                label='Email'
                fullWidth
                margin='normal'
                variant='outlined'
                type='email'
              />
              <Button
                variant='contained'
                color='primary'
                style={{ marginTop: '10px' }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Preferences Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Notification Preferences
              </Typography>
              <Grid
                container
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='body1'>Email Notifications</Typography>
                <Switch color='primary' />
              </Grid>
              <Grid
                container
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='body1'>SMS Notifications</Typography>
                <Switch color='primary' />
              </Grid>
              <Grid
                container
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography variant='body1'>Push Notifications</Typography>
                <Switch color='primary' />
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Security Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Account Security
              </Typography>
              <TextField
                label='Current Password'
                fullWidth
                margin='normal'
                variant='outlined'
                type='password'
              />
              <TextField
                label='New Password'
                fullWidth
                margin='normal'
                variant='outlined'
                type='password'
              />
              <TextField
                label='Confirm New Password'
                fullWidth
                margin='normal'
                variant='outlined'
                type='password'
              />
              <Button
                variant='contained'
                color='secondary'
                style={{ marginTop: '10px' }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
