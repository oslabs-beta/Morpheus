import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Home from '../app/page';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  })),
}));

describe('Routing Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Home page renders without 404', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome to morpheus/i })).toBeInTheDocument();
  });

  test('Navigation links do not lead to 404', () => {
    render(<Home />);
    
    const links = screen.getAllByRole('link');
    console.log(`Found ${links.length} links`);
    
    links.forEach((link, index) => {
      const href = link.getAttribute('href');
      console.log(`Link ${index + 1}: ${href}`);
      
      if (href && !href.startsWith('http')) {
        fireEvent.click(link);
        expect(useRouter().push).toHaveBeenCalledWith(href);
      }
    });
    
    // Add an overall expectation
    expect(useRouter().push).toHaveBeenCalled();
  });
});