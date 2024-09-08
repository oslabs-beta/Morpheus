import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '../app/components/Header/Header';
import Router from 'next/router';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

const theme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        {component}
      </UserProvider>
    </ThemeProvider>
  );
};

describe('Header component', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/');
  });

  it('should render the Header component correctly', async () => {
    await act(async () => {
      renderWithProviders(<Header />);
    });

    const morpheusLogo = screen.getByText(/Morpheus/i);
    expect(morpheusLogo).toBeInTheDocument();

    const settingsIcon = screen.getByTestId('settings-icon');
    expect(settingsIcon).toBeInTheDocument();
  });

  it('should open and close the drawer when menu icon is clicked', async () => {
    await act(async () => {
      renderWithProviders(<Header />);
    });

    const menuButton = screen.getByAltText('Menu Icon');
    await act(async () => {
      fireEvent.click(menuButton);
    });

    const drawer = await screen.findByTestId('sidebar-drawer');
    expect(drawer).toBeInTheDocument();

    const closeButton = within(drawer).getByTestId('close-drawer-button');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('sidebar-drawer')).toBeVisible();
    }, { timeout: 3000 });
  });

  it('should toggle Docker folder when clicked', async () => {
    await act(async () => {
      renderWithProviders(<Header />);
    });

    const menuButton = screen.getByAltText('Menu Icon');
    await act(async () => {
      fireEvent.click(menuButton);
    });

    const dockerButton = await screen.findByText('Docker');
    await act(async () => {
      fireEvent.click(dockerButton);
    });

    expect(await screen.findByText('Docker Controller')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(dockerButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Docker Controller')).not.toBeInTheDocument();
    });
  });

  it('should toggle Kubernetes folder when clicked', async () => {
    await act(async () => {
      renderWithProviders(<Header />);
    });

    const kubernetesButton = await screen.findByText('Kubernetes');
    await act(async () => {
      fireEvent.click(kubernetesButton);
    });

    expect(await screen.findByText('Cluster Visualizer')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(kubernetesButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Cluster Visualizer')).not.toBeInTheDocument();
    });
  });

  
  it('should navigate to correct paths when links are clicked and not show 404', async () => {
    mockRouter.setCurrentUrl('/systemData');

    renderWithProviders(<Header />);

    const menuButton = screen.getByAltText('Menu Icon');
    fireEvent.click(menuButton);

    const drawer = await screen.findByTestId('sidebar-drawer');
    expect(drawer).toBeInTheDocument();

    const dataLink = screen.getByText('System Data');
    await act(async () => {
      fireEvent.click(dataLink);
    });

    // Check if the URL has changed
    await waitFor(() => {
      expect(mockRouter.asPath).toBe('/systemData');
    });

    // Verify that no 404 error is displayed
    expect(screen.queryByText(/404/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();

    // Basic check to ensure some expected content is still present
    expect(screen.getByText(/Morpheus/i)).toBeInTheDocument();
  });
});