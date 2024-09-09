import { render, screen, waitFor } from '@testing-library/react'; // Ensure waitFor is imported
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Header from '../app/components/Header/Header';
import { act } from 'react-dom/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn().mockReturnValue('/'),
}));

jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn().mockReturnValue({
    direction: 'ltr',
  }),
}));

describe('Header Routing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Header renders without errors', () => {
    render(<Header />);
    expect(screen.getByText(/Morpheus/i)).toBeInTheDocument();
  });

  const clickLinkAndExpectNavigation = async (name, path) => {
    const link = await screen.findByText(name);
    expect(link).toBeInTheDocument();

    // Use userEvent to simulate a click
    await userEvent.click(link);

    const { push } = useRouter();
    // Ensure push is called
    expect(push).toHaveBeenCalledWith(path); // Check if this is being called
  };

  test('Folder toggles work correctly', async () => {
    render(<Header />);
  
    const menuButton = screen.getByAltText('Menu Icon');
    await userEvent.click(menuButton);

    const dockerFolder = await screen.findByText('Docker');
    await userEvent.click(dockerFolder);
    expect(await screen.findByText('Docker Controller')).toBeVisible();

    await userEvent.click(dockerFolder);
    await waitFor(() => {
      expect(screen.queryByText('Docker Controller')).not.toBeInTheDocument();
    });
  });


});
