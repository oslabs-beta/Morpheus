
// 'use client';
import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { CssBaseline } from "@mui/material";
import styles from './systemData.module.scss';

interface IframeProps {
  panelId: number;
  // timeRange?: number;
}


const Dashboard: React.FC = () => {

  // const [timestamp, setTimestamp] = useState<number>(Date.now());


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimestamp(Date.now());
  //   }, 60000); //this is the refresh interval 60000 is 60seconds etc
  //   return () => clearInterval(interval);
  // }, []);

  const getIframeSource = ({ panelId, timeRange = 30 }: IframeProps): string => {
    // const to = timestamp;
    // const from = to - timeRange * 1000; &from=${from}&to=${to}
    return `http://localhost:50003/d-solo/h5LcytHGz/system?orgId=1&refresh=10s&panelId=${panelId}`;
  }
   const getIframeSource2 = ({ panelId, timeRange = 30 }: IframeProps): string => {
    // const to = timestamp;
    // const from = to - timeRange * 1000; &from=${from}&to=${to}
    return `http://localhost:50003/d-solo/4dMaCsRZz/docker-container?orgId=1&refresh=5s&panelId=${panelId}`;
  }
  return (
    <>
      <CssBaseline />
      <Box>
        <Grid container spacing={2} className={styles.topCardsContainer}>
           <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.dataCardGrid1}>
              <iframe src={getIframeSource({ panelId: 29 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.dataCardGrid1}>
              <iframe src={getIframeSource({ panelId: 75 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.dataCardGrid1}>
              <div className={styles.cardHeaderMemory}>
                RAM status
              </div>
              <iframe src={getIframeSource({ panelId: 2 })}></iframe>
            </Paper>
          </Grid>
        </Grid>
        <Grid container marginY={2} spacing={4}>
          <Grid item xs={12}>
            <Paper className={styles.dataCardGrid2}>
              <div className={styles.cardHeaderCPU}>
                CPU Usage
              </div>
              <iframe src={getIframeSource({ panelId: 70 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} >
            <Paper className={styles.dataCardGrid2}>
              <div className={styles.cardHeaderMemory}>
                Memory Usage
              </div>
              <iframe src={getIframeSource({ panelId: 68 })}></iframe>
            </Paper>
          </Grid>
        </Grid>
        <Grid container marginY={2} spacing={2} className={styles.topCardsContainer}>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderMemory}>
                Memory Usage detailed
              </div>
              <iframe src={getIframeSource({ panelId: 6 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderNetwork}>
                Network data detailed
              </div>
              <iframe src={getIframeSource({ panelId: 8 })}></iframe>
            </Paper>
          </Grid>
        </Grid>
        <Grid container marginY={2} spacing={2} className={styles.topCardsContainer}>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderCPU}>
                Extended CPU data
              </div>
              <iframe src={getIframeSource2({ panelId: 1 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderCPU}>
                Cached Mem data
              </div>
              <iframe src={getIframeSource2({ panelId: 11 })}></iframe>
            </Paper>
          </Grid>
        </Grid>
        <Grid container marginY={2} spacing={2} className={styles.topCardsContainer}>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderNetwork}>
                Sent packets Data
              </div>
              <iframe src={getIframeSource2({ panelId: 9 })}></iframe>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={styles.thirdGridItems}>
              <div className={styles.cardHeaderNetwork}>
                Received Packets Data
              </div>
              <iframe src={getIframeSource2({ panelId: 8 })}></iframe>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Dashboard;