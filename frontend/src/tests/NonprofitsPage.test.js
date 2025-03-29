import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NonprofitsPage from '../pages/NonprofitsPage';

// Mock the router navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('NonprofitsPage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NonprofitsPage />
      </BrowserRouter>
    );
  };

  // This test should pass
  test('renders the main heading and apply button', () => {
    renderComponent();
    
    // Check for main heading
    expect(screen.getByText('For Nonprofits')).toBeInTheDocument();
    
    // Check for apply button
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  // This test should fail - looking for content that doesn't exist
  test('displays the correct number of partner organizations', () => {
    renderComponent();
    
    // This will fail because the text doesn't match exactly what's in the component
    // The component says "31,000+" but we're looking for "30,000+"
    expect(screen.getByText(/join a community of 30,000\+ nonprofits worldwide/i)).toBeInTheDocument();
  });

  // This test should fail - testing functionality that isn't implemented
  test('survey button submits data correctly', async () => {
    renderComponent();
    
    // Find the survey button
    const surveyButton = screen.getByText('Complete Our Survey');
    
    // Click the button
    fireEvent.click(surveyButton);
    
    // This will fail because we haven't implemented the survey submission functionality
    // and there's no confirmation message in the component
    expect(await screen.findByText('Thank you for completing our survey!')).toBeInTheDocument();
  });
}); 