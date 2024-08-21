import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import scss from './Dashboard.module.scss';
import { CssBaseline } from "@mui/material";


const dashboard = () => {
  return (
    <>
            <CssBaseline />

    <Box>
      <Grid container gap={2} className={scss.topCardsContainer} >
        <Grid>
          <Paper className = {scss.dataCard}> <iframe
              src="http://localhost:50003/d-solo/metrics_monitoring/docker-and-system-monitoring?orgId=1&refresh=5s&from=1724261171643&to=1724264771643&theme=dark&panelId=27"
              width="450"
              height="200"
              frameBorder="0"
            ></iframe></Paper>
        </Grid>
        <Grid>
          <Paper className = {scss.dataCard}> grid1</Paper>
        </Grid>
        <Grid>
          <Paper className = {scss.dataCard}> grid1</Paper>
        </Grid>
      </Grid>
      <Grid xs={12} marginY={2}>
        <Paper className={scss.dataCard}> grid2</Paper>
      </Grid>
    </Box>

    </>
  )
}

export default dashboard;