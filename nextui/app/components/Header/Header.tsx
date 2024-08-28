'use client';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KubernetesIcon from '@mui/icons-material/Cloud';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ContainerIcon from '@mui/icons-material/ViewInAr'; // Import for Docker icon (container representation)
import { FaDocker, FaAws, FaBitcoin } from 'react-icons/fa';
import { BiLogoKubernetes } from 'react-icons/bi';
import { FaDatabase, FaGear } from 'react-icons/fa6';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const pages = [
  { name: 'System Data', path: '/systemData', icon: <FaDatabase /> },
  { name: 'AWS Bedrock', path: '/dashboard/data', icon: <FaAws /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <FaGear /> },
  { name: 'Support our Team', path: '/', icon: <FaBitcoin /> },
];

const dockerPages = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  {
    name: 'Docker Controller',
    path: '/docker/containers',
    icon: <ContainerIcon />,
  },
];

const kubernetesPages = [
  {
    name: 'Cluster Visualizer',
    path: '/kubernetes',
    icon: <KubernetesIcon />,
  },
];

function Header() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [DockerFolderOpen, setDockerFolderOpen] = React.useState(false);
  const [kubernetesOpen, setKubernetesOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDockerFolderClick = () => {
    setDockerFolderOpen(!DockerFolderOpen);
  };

  const handleKubernetesFolderClick = () => {
    setKubernetesOpen(!kubernetesOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Link
            href='/'
            passHref
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ cursor: 'pointer' }}
            >
              Morpheus
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Docker folder */}
          <ListItemButton onClick={handleDockerFolderClick}>
            <ListItemIcon>
              <FaDocker />
            </ListItemIcon>
            <ListItemText primary='Docker' />
            {DockerFolderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={DockerFolderOpen} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {dockerPages.map((page) => (
                <Link
                  key={page.name}
                  href={page.path}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

          {/* Kubernetes folder */}
          <ListItemButton onClick={handleKubernetesFolderClick}>
            <ListItemIcon>
              <BiLogoKubernetes />
            </ListItemIcon>
            <ListItemText primary='Kubernetes' />
            {kubernetesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={kubernetesOpen} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {kubernetesPages.map((page) => (
                <Link
                  key={page.name}
                  href={page.path}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

          {/* Other pages */}
          {pages.map((page) => (
            <Link
              key={page.name}
              href={page.path}
              passHref
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Your main content goes here */}
      </Main>
    </Box>
  );
}

export default Header;
