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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Link from 'next/link';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Settings', path: '/dashboard/settings' },
  {
    name: 'Data',
    path: '/dashboard/data',
    children: [
      { name: 'System Data', path: '/systemData' },
      { name: 'Kubernetes', path: '/kubernetes' },
    ],
  },
  { name: 'Docker Management', path: '/docker/containers' },
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
          style={{ color: 'white', marginLeft: '10px' }}
        >
          <MenuIcon fontSize='large' />
        </IconButton>
      </Toolbar>
      <Drawer
        variant='persistent'
        open={open}
        PaperProps={{
          style: {
            width: 250,
            backgroundColor: '#1e1e1e',
            color: '#e0e0e0',
            paddingTop: '20px',
            fontFamily: 'Roboto, sans-serif',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '10px',
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            style={{
              color: '#e0e0e0',
              marginTop: '10px',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          {pages.map((page) => (
            <React.Fragment key={page.name}>
              <ListItem
                button
                onClick={() => {
                  if (page.children) {
                    handleDropdownClick(page.name);
                  }
                }}
                style={{
                  paddingLeft: '20px',
                  color: '#f0f0f0',
                  cursor: 'pointer',
                }}
              >
                <Link href={page.path} passHref>
                  <ListItemText
                    primary={page.name}
                    style={{
                      color: '#f0f0f0',
                      fontSize: '18px',
                      fontWeight: 500,
                    }}
                  />
                </Link>
                {page.children ? (
                  openDropdown === page.name ? (
                    <ExpandLess style={{ color: '#f0f0f0' }} />
                  ) : (
                    <ExpandMore style={{ color: '#f0f0f0' }} />
                  )
                ) : null}
              </ListItem>
              {page.children && (
                <Collapse
                  in={openDropdown === page.name}
                  timeout='auto'
                  unmountOnExit
                >
                  <List component='div' disablePadding>
                    {page.children.map((child) => (
                      <ListItem
                        key={child.name}
                        button
                        style={{
                          paddingLeft: '40px',
                          color: '#e0e0e0',
                          cursor: 'pointer',
                        }}
                      >
                        <Link href={child.path} passHref>
                          <ListItemText
                            primary={child.name}
                            style={{
                              color: '#e0e0e0',
                              fontSize: '16px',
                              fontWeight: 400,
                            }}
                          />
                        </Link>
                      </ListItem>
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
