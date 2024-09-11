'use client';

import * as React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  IconButton,
  Collapse,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Link from 'next/link';
import { FaDatabase, FaCog, FaDocker } from 'react-icons/fa';
import { BiLogoKubernetes } from 'react-icons/bi';
import Image from 'next/image';

const pages = [
  { name: 'Dashboard', path: '/dashboard', icon: <FaDatabase /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
  {
    name: 'Data',
    path: '/dashboard/data',
    icon: <FaDatabase />,
    children: [
      { name: 'System Data', path: '/systemData', icon: <FaDatabase /> },
      { name: 'Kubernetes', path: '/kubernetes', icon: <BiLogoKubernetes /> },
    ],
  },
  { name: 'Docker Management', path: '/docker/containers', icon: <FaDocker /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDropdownClick = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerToggle}
          edge='start'
          sx={{
            mr: 2,
            color: 'white',
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
      </Toolbar>
      <Drawer
        variant='persistent'
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'text.primary',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              letterSpacing: 2,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: 'common.white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          {pages.map((page) => (
            <React.Fragment key={page.name}>
              <ListItemButton
                onClick={() => {
                  if (page.children) {
                    handleDropdownClick(page.name);
                  }
                }}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <ListItemIcon sx={{ color: 'common.white', minWidth: '40px' }}>
                  {page.icon}
                </ListItemIcon>
                <Link
                  href={page.path}
                  passHref
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    flexGrow: 1,
                  }}
                >
                  <ListItemText primary={page.name} />
                </Link>
                {page.children &&
                  (openDropdown === page.name ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>
              {page.children && (
                <Collapse
                  in={openDropdown === page.name}
                  timeout='auto'
                  unmountOnExit
                >
                  <List component='div' disablePadding>
                    {page.children.map((child) => (
                      <ListItemButton
                        key={child.name}
                        sx={{
                          pl: 4,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{ color: 'common.white', minWidth: '40px' }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <Link
                          href={child.path}
                          passHref
                          style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            flexGrow: 1,
                          }}
                        >
                          <ListItemText primary={child.name} />
                        </Link>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
