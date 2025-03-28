import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from './mocks/axios';
import HomePage from '../pages/HomePage';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock data for testing
const mockFeaturedCampaigns = [
  {
    id: 1,
    title: 'Education for Rural Children',
    description: 'Providing quality education to children in remote villages.',
    image: '/images/campaigns/education.jpg',
    raised: 15000,
    goal: 20000,
    daysLeft: 30,
  },
  {
    id: 2,
    title: 'Clean Water Initiative',
    description: 'Bringing clean water to communities in need.',
    image: '/images/campaigns/water.jpg',
    raised: 8000,
    goal: 12000,
    daysLeft: 15,
  },
  {
    id: 3,
    title: 'Healthcare Access Program',
    description: 'Expanding healthcare access in underserved areas.',
    image: '/images/campaigns/healthcare.jpg',
    raised: 25000,
    goal: 40000,
    daysLeft: 45,
  },
];

describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup axios mock responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/campaigns/featured')) {
        return Promise.resolve({ data: mockFeaturedCampaigns });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders the hero section with title and call-to-action buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Make a Difference Today')).toBeInTheDocument();
    expect(screen.getByText('Support vetted nonprofits and make a lasting impact in communities worldwide.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /donate now/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore campaigns/i })).toBeInTheDocument();
  });

  test('renders the "How it Works" section with three cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('How it Works')).toBeInTheDocument();
    expect(screen.getByText('Non-Profits')).toBeInTheDocument();
    expect(screen.getByText('Donors')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  test('renders the impact statistics section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('24+')).toBeInTheDocument();
    expect(screen.getByText('Years')).toBeInTheDocument();
    expect(screen.getByText('35,000')).toBeInTheDocument();
    expect(screen.getByText('Donors')).toBeInTheDocument();
    expect(screen.getByText('$650M+')).toBeInTheDocument();
    expect(screen.getByText('Total Donations')).toBeInTheDocument();
    expect(screen.getByText('31,000+')).toBeInTheDocument();
    expect(screen.getByText('Projects Funded')).toBeInTheDocument();
    expect(screen.getByText('55+')).toBeInTheDocument();
    expect(screen.getByText('Countries Reached')).toBeInTheDocument();
  });

  test('renders the corporate partners section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Corporate Partners')).toBeInTheDocument();
    expect(screen.getByText(/We've made it possible for more than 260 companies to support local causes around the world/i)).toBeInTheDocument();
  });

  test('renders the news section with three cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Press Book')).toBeInTheDocument();
    expect(screen.getByText('Give + Get Matched')).toBeInTheDocument();
    expect(screen.getByText('Unwrap a World of Good')).toBeInTheDocument();
  });

  test('renders the search projects section with filters', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Search Projects')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for projects, causes, or locations...')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Project Size')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  test('renders the search results section with project cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Search Results (125)')).toBeInTheDocument();
    expect(screen.getByText('Education for Rural Children')).toBeInTheDocument();
    expect(screen.getByText('Providing quality education to children in remote villages...')).toBeInTheDocument();
    expect(screen.getByText('75% funded')).toBeInTheDocument();
  });

  test('renders the newsletter subscription section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Subscribe to our Newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  test('renders the social media links section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    // Check for social media icons (Facebook, Twitter, Instagram, LinkedIn)
    const socialLinks = screen.getAllByRole('link', { name: /social media/i });
    expect(socialLinks.length).toBeGreaterThanOrEqual(4);
  });

  test('clicking Donate Now button opens donation dialog', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const donateButton = screen.getByRole('button', { name: /donate now/i });
    fireEvent.click(donateButton);
    
    expect(screen.getByText('Make a Donation')).toBeInTheDocument();
    expect(screen.getByText('Choose an amount:')).toBeInTheDocument();
  });

  test('donation dialog allows selecting predefined amounts', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Open donation dialog
    const donateButton = screen.getByRole('button', { name: /donate now/i });
    fireEvent.click(donateButton);
    
    // Select $50 option
    const fiftyDollarOption = screen.getByLabelText('$50');
    fireEvent.click(fiftyDollarOption);
    
    // Submit donation
    const submitButton = screen.getByRole('button', { name: /donate/i, within: screen.getByRole('dialog') });
    fireEvent.click(submitButton);
    
    // Verify donation was processed
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        amount: '50'
      }));
    });
  });

  test('donation dialog allows custom amount input', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Open donation dialog
    const donateButton = screen.getByRole('button', { name: /donate now/i });
    fireEvent.click(donateButton);
    
    // Select custom option
    const customOption = screen.getByLabelText('Custom');
    fireEvent.click(customOption);
    
    // Enter custom amount
    const customAmountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(customAmountInput, { target: { value: '75' } });
    
    // Submit donation
    const submitButton = screen.getByRole('button', { name: /donate/i, within: screen.getByRole('dialog') });
    fireEvent.click(submitButton);
    
    // Verify donation was processed
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        amount: '75'
      }));
    });
  });

  test('search functionality filters projects correctly', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search for projects, causes, or locations...');
    fireEvent.change(searchInput, { target: { value: 'education' } });
    
    // Submit search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    // Verify search API call
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/projects/search'), expect.objectContaining({
        params: expect.objectContaining({
          query: 'education'
        })
      }));
    });
  });

  test('newsletter subscription works correctly', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Enter email
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit subscription
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.click(subscribeButton);
    
    // Verify subscription API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        email: 'test@example.com'
      }));
    });
    
    // Verify success message
    expect(screen.getByText('Thank you for subscribing!')).toBeInTheDocument();
  });

  test('pagination controls work correctly', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Check pagination controls exist
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    // Click on page 2
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    
    // Verify page change
    expect(page2Button).toHaveClass('active');
  });

  test('chatbot is accessible and can be opened', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Find chatbot button
    const chatbotButton = screen.getByRole('button', { name: /chat/i });
    expect(chatbotButton).toBeInTheDocument();
    
    // Open chatbot
    fireEvent.click(chatbotButton);
    
    // Verify chatbot is open
    expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
  });
}); 