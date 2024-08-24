import Dashboard from "./dashboard/page";
import SideBar from "./components/sideBar/page";
import { CssBaseline, Grid, Paper, Container } from "@mui/material"; 
import Link from "next/link";
import scss from './navbar.module.scss';

export default function Home() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" className={scss.container}>
        <main>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/dashboard">
                <Paper className={scss.dataCard}>Docker Dashboard</Paper>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={scss.dataCard}>grid2</Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                            <Link href="/systemData">
                <Paper className={scss.dataCard}>system Data Metrics </Paper>
                </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={scss.dataCard}>grid4</Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link href="/kubernetes">
                <Paper className={scss.dataCard}>Kubernetes</Paper>
                </Link>
            </Grid>
          </Grid>
        </main>
      </Container>
    </>
  );
}
