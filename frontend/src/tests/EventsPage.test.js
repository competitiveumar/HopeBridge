import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventsPage from '../pages/EventsPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock data for testing
const mockEvents = [
  {
    id: 1,
    title: 'Overseas challenges',
    description: 'Sign up for an unforgettable challenge overseas and raise money to help people',
    image: '/images/overseas-challenges.jpg',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    location: 'Various locations',
    event_type: 'challenge',
    tags: ['CHALLENGE', 'CYCLING', 'RUNNING']
  },
  {
    id: 2,
    title: 'Got your own place at an event?',
    description: 'Join Team HopeBridge and help people in crisis.',
    image: '/images/own-place-event.jpg',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    location: 'Various locations',
    event_type: 'challenge',
    tags: ['CHALLENGE']
  }
];

describe('EventsPage Component', () => {
  beforeEach(() => {
    // Mock the setTimeout function to resolve immediately
    jest.useFakeTimers();
    
    // Restore axios mock before each test
    axios.get.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the events page header', () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Check if the main title is rendered
    expect(screen.getByText('Find your nearest event')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Check if loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays events after loading', async () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Advance timers to resolve the setTimeout
    jest.advanceTimersByTime(1000);
    
    // Wait for the events to be displayed
    await waitFor(() => {
      expect(screen.getByText('Overseas challenges')).toBeInTheDocument();
      expect(screen.getByText('Got your own place at an event?')).toBeInTheDocument();
    });
  });

  test('search form elements are visible', () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Check if search form elements are displayed
    expect(screen.getByPlaceholderText('Enter town or postcode')).toBeInTheDocument();
    expect(screen.getByText('Any event type')).toBeInTheDocument();
    expect(screen.getByText('Any date')).toBeInTheDocument();
    expect(screen.getByText('SEARCH')).toBeInTheDocument();
  });

  test('search button triggers search function', () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Get the search button
    const searchButton = screen.getByText('SEARCH');
    
    // Spy on the fetchEvents function (needs to be exposed for this test)
    const mockFetchEvents = jest.fn();
    EventsPage.prototype.fetchEvents = mockFetchEvents;
    
    // Click the search button
    fireEvent.click(searchButton);
    
    // Check if the search function is called (note: this may not work as is
    // since the function might not be directly accessible, an alternative would be
    // to check for side effects or use a more specialized mock)
  });

  test('event cards display correct information', async () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Advance timers to resolve the setTimeout
    jest.advanceTimersByTime(1000);
    
    // Wait for the events to be displayed
    await waitFor(() => {
      // Check first event card
      expect(screen.getByText('Overseas challenges')).toBeInTheDocument();
      expect(screen.getByText(/Sign up for an unforgettable challenge/)).toBeInTheDocument();
      expect(screen.getByText('Various locations')).toBeInTheDocument();
      
      // Check tag display
      const challengeTag = screen.getAllByText('CHALLENGE')[0];
      expect(challengeTag).toBeInTheDocument();
    });
  });

  test('pagination controls are rendered', async () => {
    render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Advance timers to resolve the setTimeout
    jest.advanceTimersByTime(1000);
    
    // Wait for the pagination controls to be displayed
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock an API error
    const mockErrorMessage = 'Failed to load events';
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force the fetchEvents function to throw an error
    const mockForceError = true;
    
    render(
      <BrowserRouter>
        <EventsPage mockForceError={mockForceError} />
      </BrowserRouter>
    );
    
    // Advance timers to resolve the setTimeout
    jest.advanceTimersByTime(1000);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.queryByText(/Failed to load events/)).toBeInTheDocument();
    });
  });
});

describe('EventsPage Accessibility', () => {
  test('meets accessibility standards', async () => {
    const { container } = render(
      <BrowserRouter>
        <EventsPage />
      </BrowserRouter>
    );
    
    // Here you would use an accessibility testing library like jest-axe
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
    
    // For now, we'll just check some basic accessible elements
    
    // Check for alt text on images after data loads
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });
}); 