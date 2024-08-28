'use client';

import React, { useEffect, useState } from 'react';
import { CssBaseline, Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useFormState } from 'react-dom';
import { updateUserSettings } from './actions';

export default function Settings() {
  const [userData, setUserData] = useState({ firstname: '', lastname: '', email: '' });
  const [state, formAction] = useFormState(updateUserSettings, null);

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch('/api/v1/usersettings');
      const data = await response.json();
      setUserData(data);
    }
    fetchUserData();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <CssBaseline />
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <form action={formAction} name="usersettings">
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Profile Settings
                </Typography>
                <TextField
                  label="First Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  name="firstname"
                  defaultValue={userData.firstname}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  name="lastname"
                  defaultValue={userData.lastname}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  type="email"
                  name="email"
                  defaultValue={userData.email}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                  Update Changes
                </Button>
                {state && <p>{state.message}</p>}
              </CardContent>
            </Card>
          </form>
        </Grid>
        {/* ... (rest of the code remains unchanged) ... */}
      </Grid>
    </Container>
  );
}
