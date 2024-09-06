import Header from '../app/components/Header/Header';
import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import { UserProvider } from '@auth0/nextjs-auth0/client';

// Mock global window.location
const originalLocation = window.location;
delete window.location; // Remove the original location to replace it
window.location = {
  ...originalLocation,
  assign: jest.fn(), // Mock 'assign' method
  replace: jest.fn(), // Mock 'replace' method
  reload: jest.fn(),  // Mock 'reload' method
};

// Create a mock router function for Next.js components
const createMockRouter = (router: Partial<NextRouter>): NextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  ...router,
});

// Create a theme for Material-UI components
const theme = createTheme();

// Helper function to render with ThemeProvider and RouterContext
const renderWithProviders = (component: React.ReactNode) => {
  const mockRouter = createMockRouter({});
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterContext.Provider value={mockRouter}>
        <UserProvider>
          {component}
        </UserProvider>
      </RouterContext.Provider>
    </ThemeProvider>
  );
};

describe('Header component', () => {
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
    });
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
      expect(screen.queryByText('Docker Controller')).toBeNull();
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
      expect(screen.queryByText('Cluster Visualizer')).not.toBeVisible();
    });
  });

  it('should navigate to correct paths when links are clicked', async () => {
    const push = jest.fn();
    const mockRouter = createMockRouter({ push });
    
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterContext.Provider value={mockRouter}>
            <UserProvider>
              <Header />
            </UserProvider>
          </RouterContext.Provider>
        </ThemeProvider>
      );
    });

    const menuButton = screen.getByAltText('Menu Icon');
    await act(async () => {
      fireEvent.click(menuButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-drawer')).toBeInTheDocument();
    });

    await act(async () => {
      const awsLink = screen.getByText('AWS Bedrock');
      fireEvent.click(awsLink);
    });
    
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard/data');
    });
  });
});
