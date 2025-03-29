import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

// Mock the axios module
jest.mock('../../tests/mocks/axios');

// Create a wrapper component that includes the BrowserRouter
const HomePageWithRouter = () => (
  <BrowserRouter>
    <HomePage />
  </BrowserRouter>
);

describe('HomePage Component', () => {
  test('renders hero section with title and buttons', () => {
    render(<HomePageWithRouter />);
    
    // Check for hero section title
    expect(screen.getByText('Making a Difference Together')).toBeInTheDocument();
    
    // Check for call-to-action buttons
    expect(screen.getByText('Donate Now')).toBeInTheDocument();
    expect(screen.getByText('Explore Campaigns')).toBeInTheDocument();
  });

  test('displays accurate impact statistics', () => {
    render(<HomePageWithRouter />);
    
    // These will fail because the actual numbers are different
    expect(screen.getByText('75,000+')).toBeInTheDocument(); // Actual is 50,000+
    expect(screen.getByText('30+')).toBeInTheDocument(); // Actual is 25+
    expect(screen.getByText('$3M+')).toBeInTheDocument(); // Actual is $2.5M+
  });

  test('implements dark mode toggle functionality', async () => {
    render(<HomePageWithRouter />);
    
    // This will fail because the dark mode toggle doesn't exist
    const darkModeToggle = screen.getByLabelText('Toggle dark mode');
    fireEvent.click(darkModeToggle);
    
    await waitFor(() => {
      expect(document.body).toHaveClass('dark-mode');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Light Mode')).toBeInTheDocument();
    });
  });

  test('renders featured campaigns section', () => {
    render(<HomePageWithRouter />);
    
    // Check for section title
    expect(screen.getByText('Featured Campaigns')).toBeInTheDocument();
    
    // Check for campaign cards
    expect(screen.getByText('Clean Water Initiative')).toBeInTheDocument();
    expect(screen.getByText('Education for All')).toBeInTheDocument();
    expect(screen.getByText('Emergency Relief Fund')).toBeInTheDocument();
    
    // Check for "View All Campaigns" button
    expect(screen.getByText('View All Campaigns')).toBeInTheDocument();
  });

  test('renders testimonials section', () => {
    render(<HomePageWithRouter />);
    
    // Check for section title
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
    
    // Check for testimonial content
    expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Michael Chen/)).toBeInTheDocument();
    expect(screen.getByText(/Aisha Patel/)).toBeInTheDocument();
  });

  test('renders call-to-action section', () => {
    render(<HomePageWithRouter />);
    
    // Check for CTA content
    expect(screen.getByText('Ready to Make a Difference?')).toBeInTheDocument();
    expect(screen.getByText(/Your support can change lives/)).toBeInTheDocument();
    
    // Check for buttons
    const donateButtons = screen.getAllByText('Donate Now');
    expect(donateButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Get Involved')).toBeInTheDocument();
  });

  test('opens donation dialog when "Donate Now" button is clicked', async () => {
    render(<HomePageWithRouter />);
    
    // Click the "Donate Now" button
    const donateButton = screen.getAllByText('Donate Now')[0];
    fireEvent.click(donateButton);
    
    // Check if the dialog appears
    await waitFor(() => {
      expect(screen.getByText('Make a Donation')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Your generosity helps us continue our mission/)).toBeInTheDocument();
    
    // Check for donation options
    expect(screen.getByLabelText('$10')).toBeInTheDocument();
    expect(screen.getByLabelText('$25')).toBeInTheDocument();
    expect(screen.getByLabelText('$50')).toBeInTheDocument();
    expect(screen.getByLabelText('$100')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Amount')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Payment')).toBeInTheDocument();
  });

  test('handles custom donation amount', async () => {
    render(<HomePageWithRouter />);
    
    // Open donation dialog
    const donateButton = screen.getAllByText('Donate Now')[0];
    fireEvent.click(donateButton);
    
    // Select custom amount
    const customAmountRadio = screen.getByLabelText('Custom Amount');
    fireEvent.click(customAmountRadio);
    
    // Check if custom amount field appears
    await waitFor(() => {
      expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
    });
    
    // Enter custom amount
    const customAmountInput = screen.getByLabelText('Enter amount');
    fireEvent.change(customAmountInput, { target: { value: '75' } });
    
    // Check if the "Proceed to Payment" button is enabled
    const proceedButton = screen.getByText('Proceed to Payment');
    expect(proceedButton).not.toBeDisabled();
  });
}); 