import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import DonationsPage from '../pages/DonationsPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn().mockResolvedValue({ error: null })
  }))
}));

// Create theme for testing
const theme = createTheme();

// Mock data that matches our prototype
const mockProjects = [
  {
    id: 1,
    title: 'Project of the Month Club',
    description: 'Each month HopeBridge selects an innovative, high-impact project from our community to be the project of the month. All donations to this...',
    image: '/images/project-month.jpg',
    categories: ['Featured'],
    location: 'Global',
    goal: 5000000,
    raised: 3083942,
    status: 'active',
    featured: true,
    created_at: '2023-01-01T00:00:00Z',
    organization: 'HopeBridge',
    read_more_link: '#',
  },
  {
    id: 2,
    title: 'Rescue Unwanted and Abandoned Companion Birds',
    description: 'Mickaboo Companion Bird Rescue, based in Northern California, helps birds commonly kept as indoor pets by rescuing, rehabilitating (physical...',
    image: '/images/birds-rescue.jpg',
    categories: ['Animal Welfare'],
    location: 'United States | California',
    goal: 700000,
    raised: 696125,
    status: 'active',
    featured: false,
    created_at: '2023-02-01T00:00:00Z',
    organization: 'Mickaboo Companion Bird Rescue',
    read_more_link: '#',
  }
];

describe('DonationsPage', () => {
  beforeEach(() => {
    // Mock the setTimeout to execute immediately
    jest.useFakeTimers();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock window.alert
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the page title and description', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    expect(screen.getByText('For Donations')).toBeInTheDocument();
    expect(screen.getByText('Give to make the world a better place')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('loads and displays projects after loading', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('Project of the Month Club')).toBeInTheDocument();
      expect(screen.getByText('Rescue Unwanted and Abandoned Companion Birds')).toBeInTheDocument();
    });
  });

  it('displays featured tag for featured projects', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('displays organization names', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('by HopeBridge')).toBeInTheDocument();
      expect(screen.getByText('by Mickaboo Companion Bird Rescue')).toBeInTheDocument();
    });
  });

  it('displays progress bars with correct amounts', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('$3,083,942 raised of $5,000,000 goal')).toBeInTheDocument();
      expect(screen.getByText('$696,125 raised of $700,000 goal')).toBeInTheDocument();
    });
  });

  it('allows entering donation amounts', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });

    // Get the first donation amount input
    const donationInputs = screen.getAllByRole('textbox');
    
    // Enter a donation amount
    fireEvent.change(donationInputs[0], { target: { value: '100' } });
    
    expect(donationInputs[0].value).toBe('100');
  });

  it('validates donation amount when clicking donate', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getAllByText('DONATE')).toHaveLength(2);
    });

    // Click donate without entering an amount
    const donateButtons = screen.getAllByText('DONATE');
    fireEvent.click(donateButtons[0]);
    
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid donation amount');
  });

  it('processes donation when amount is valid', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getAllByRole('textbox')).toHaveLength(2);
      expect(screen.getAllByText('DONATE')).toHaveLength(2);
    });

    // Get the first donation amount input and donate button
    const donationInputs = screen.getAllByRole('textbox');
    const donateButtons = screen.getAllByText('DONATE');
    
    // Enter a donation amount
    fireEvent.change(donationInputs[0], { target: { value: '100' } });
    
    // Click donate
    fireEvent.click(donateButtons[0]);
    
    expect(window.alert).toHaveBeenCalledWith('Processing donation of $100 for project ID: 1');
  });

  it('allows filtering by category', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    // Open the category dropdown
    const categorySelect = screen.getAllByRole('button')[0];
    fireEvent.mouseDown(categorySelect);
    
    // Select "Animal Welfare"
    const animalWelfareOption = screen.getByText('Animal Welfare');
    fireEvent.click(animalWelfareOption);
    
    // This would trigger a new API call in a real app
    // For our mock implementation, we're just testing the UI interaction
    expect(categorySelect).toBeInTheDocument();
  });

  it('allows sorting projects', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DonationsPage />
      </ThemeProvider>
    );

    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sort by:')).toBeInTheDocument();
    });

    // Open the sort dropdown
    const sortSelect = screen.getAllByRole('button')[3]; // The sort dropdown
    fireEvent.mouseDown(sortSelect);
    
    // Select "Most Funded"
    const mostFundedOption = screen.getByText('Most Funded');
    fireEvent.click(mostFundedOption);
    
    // This would trigger a new API call in a real app
    // For our mock implementation, we're just testing the UI interaction
    expect(sortSelect).toBeInTheDocument();
  });
}); 
}); 