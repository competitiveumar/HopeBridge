import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApplicationFormPage from '../pages/ApplicationFormPage';

// Mock the API service
jest.mock('../services/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
}));

// Mock the router navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ApplicationFormPage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ApplicationFormPage />
      </BrowserRouter>
    );
  };

  // This test should pass
  test('renders the application form with all required fields', () => {
    renderComponent();
    
    // Check for form title
    expect(screen.getByText('Nonprofit Application')).toBeInTheDocument();
    
    // Check for organization name field
    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    
    // Check for email field
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // Check for next button
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  // This test should fail - testing validation that doesn't match implementation
  test('validates phone number format correctly', async () => {
    renderComponent();
    
    // Fill out organization name and email to proceed
    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: 'Test Nonprofit' },
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.org' },
    });
    
    // Click next to go to contact info step
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for the next step to appear
    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });
    
    // Enter an invalid phone number (too short)
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123' },
    });
    
    // Try to proceed to the next step
    fireEvent.click(screen.getByText('Next'));
    
    // This will fail because our validation doesn't check for minimum length
    // The test expects a specific error message that isn't implemented
    expect(screen.getByText('Phone number must be at least 10 digits')).toBeInTheDocument();
  });

  // This test should fail - testing a feature that doesn't exist
  test('allows uploading multiple supporting documents', async () => {
    renderComponent();
    
    // Navigate through the form to the final step
    // Fill out first step
    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: 'Test Nonprofit' },
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.org' },
    });
    
    // Click next to go to contact info step
    fireEvent.click(screen.getByText('Next'));
    
    // Wait for the next step and fill it out
    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    });
    
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });
    
    // Click next to go to the final step
    fireEvent.click(screen.getByText('Next'));
    
    // This will fail because the multiple document upload feature doesn't exist
    // The test is looking for a button that isn't in the component
    expect(screen.getByText('Add Another Document')).toBeInTheDocument();
  });
}); 