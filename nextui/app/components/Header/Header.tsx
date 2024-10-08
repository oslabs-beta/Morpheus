'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KubernetesIcon from '@mui/icons-material/Cloud';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ContainerIcon from '@mui/icons-material/ViewInAr';
import { FaDocker, FaAws, FaBitcoin } from 'react-icons/fa';
import { BiLogoKubernetes } from 'react-icons/bi';
import { FaDatabase, FaGear } from 'react-icons/fa6';
import Image from 'next/image';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: 0, // Remove top padding
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
  const pathname = usePathname();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [DockerFolderOpen, setDockerFolderOpen] = React.useState(false);
  const [kubernetesOpen, setKubernetesOpen] = React.useState(false);

  // Memoize static pages to prevent unnecessary re-renders
  const memoizedPages = React.useMemo(() => pages, []);
  const memoizedDockerPages = React.useMemo(() => dockerPages, []);
  const memoizedKubernetesPages = React.useMemo(() => kubernetesPages, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => {
    setOpen(false);
    setDockerFolderOpen(false);
    setKubernetesOpen(false);
  };

  const handleDockerFolderClick = () => setDockerFolderOpen(!DockerFolderOpen);
  const handleKubernetesFolderClick = () => setKubernetesOpen(!kubernetesOpen);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='fixed'
        open={open}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{
                mr: 2,
                ...(open && { display: 'none' }),
                '&:hover': {
                  transform: 'rotate(90deg)',
                  transition: 'transform 0.3s',
                },
              }}
            >
              <Image
                src='/sidebarIcon.png'
                alt='Menu Icon'
                width={40}
                height={40}
              />
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
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  letterSpacing: 2,
                  background:

                  'linear-gradient(45deg, #59D7F7 20%, #2196F3 60%)',

                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s',
                  },
                }}
              >
                Morpheus
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Link href='/dashboard/settings' passHref>
              <IconButton
                color='inherit'
                sx={{ ml: 1 }}
                data-testid='settings-icon'
              >
                <FaGear />
              </IconButton>
            </Link>
            <Link href='/metrics' passHref>
              <IconButton color='inherit' sx={{ ml: 1 }}>
                <FaDatabase />
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        data-testid='sidebar-drawer'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'common.white',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader
          sx={{
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <IconButton
            onClick={handleDrawerClose}
            data-testid='close-drawer-button'
            sx={{
              color: 'common.white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <List>
          {/* Docker folder */}
          <ListItemButton
            onClick={handleDockerFolderClick}
            sx={{
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              transition: 'background-color 0.3s',
            }}
          >
            <ListItemIcon sx={{ color: 'common.white' }}>
              <FaDocker />
            </ListItemIcon>
            <ListItemText primary='Docker' />
            {DockerFolderOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={DockerFolderOpen} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {memoizedDockerPages.map((page) => (
                <Link
                  key={page.name}
                  href={page.path}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton
                    sx={{
                      pl: 4,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'common.white' }}>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

          {/* Kubernetes folder */}
          <ListItemButton
            onClick={handleKubernetesFolderClick}
            sx={{
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              transition: 'background-color 0.3s',
            }}
          >
            <ListItemIcon sx={{ color: 'common.white' }}>
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
                  <ListItemButton
                    sx={{
                      pl: 4,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'common.white' }}>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

          {memoizedPages.map((page) => (
            <Link
              key={page.name}
              href={page.path}
              passHref
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    transition: 'background-color 0.3s',
                  }}
                >
                  <ListItemIcon sx={{ color: 'common.white' }}>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}

export default Header;
