import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import DisastersPage from '../pages/DisastersPage';

// Mock axios
jest.mock('axios');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('DisastersPage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the hero section with title and donate button', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Disaster Relief & Recovery')).toBeInTheDocument();
    expect(screen.getByText('Support communities affected by natural disasters and humanitarian crises')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /donate now/i })).toBeInTheDocument();
  });

  test('renders the active disaster response projects section with three cards', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Active Disaster Response Projects')).toBeInTheDocument();
    expect(screen.getByText('Emergency Response Fund')).toBeInTheDocument();
    expect(screen.getByText('Earthquake Relief')).toBeInTheDocument();
    expect(screen.getByText('Hurricane Recovery')).toBeInTheDocument();
  });

  test('renders the response process section with three steps', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Response Process')).toBeInTheDocument();
    expect(screen.getByText('Immediate Response')).toBeInTheDocument();
    expect(screen.getByText('Local Partnerships')).toBeInTheDocument();
    expect(screen.getByText('Long-term Recovery')).toBeInTheDocument();
  });

  test('renders the impact section with statistics', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('$50M+')).toBeInTheDocument();
    expect(screen.getByText('Disaster Relief Funds Distributed')).toBeInTheDocument();
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Disasters Responded To')).toBeInTheDocument();
    expect(screen.getByText('1M+')).toBeInTheDocument();
    expect(screen.getByText('People Helped')).toBeInTheDocument();
  });

  test('renders the partners section', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Response Partners')).toBeInTheDocument();
    expect(screen.getByText('Partner 1')).toBeInTheDocument();
    expect(screen.getByText('Partner 2')).toBeInTheDocument();
    expect(screen.getByText('Partner 3')).toBeInTheDocument();
    expect(screen.getByText('Partner 4')).toBeInTheDocument();
  });

  test('renders the FAQ section with three questions', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('How quickly are disaster funds deployed?')).toBeInTheDocument();
    expect(screen.getByText('How are partner organizations selected?')).toBeInTheDocument();
    expect(screen.getByText('What percentage of donations go directly to relief efforts?')).toBeInTheDocument();
  });

  test('clicking Donate Now button scrolls to projects section', () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    const donateButton = screen.getByRole('button', { name: /donate now/i });
    fireEvent.click(donateButton);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('handles donation amount change correctly', () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    // Get the first donation input field
    const donationInputs = screen.getAllByPlaceholderText('Enter amount');
    const firstDonationInput = donationInputs[0];
    
    // Change the value
    fireEvent.change(firstDonationInput, { target: { value: '100' } });
    
    // Check if the value was updated
    expect(firstDonationInput.value).toBe('100');
  });

  test('shows error message for invalid donation amount', async () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    // Get the first donate button
    const donateButtons = screen.getAllByRole('button', { name: /donate$/i });
    const firstDonateButton = donateButtons[0];
    
    // Click donate without entering an amount
    fireEvent.click(firstDonateButton);
    
    // Check if error message is shown
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid donation amount')).toBeInTheDocument();
    });
  });

  test('shows success message for valid donation', async () => {
    render(
      <BrowserRouter>
        <DisastersPage />
      </BrowserRouter>
    );
    
    // Get the first donation input field and donate button
    const donationInputs = screen.getAllByPlaceholderText('Enter amount');
    const donateButtons = screen.getAllByRole('button', { name: /donate$/i });
    const firstDonationInput = donationInputs[0];
    const firstDonateButton = donateButtons[0];
    
    // Enter a valid amount and click donate
    fireEvent.change(firstDonationInput, { target: { value: '100' } });
    fireEvent.click(firstDonateButton);
    
    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByText('Thank you for your donation!')).toBeInTheDocument();
    });
  });
}); 