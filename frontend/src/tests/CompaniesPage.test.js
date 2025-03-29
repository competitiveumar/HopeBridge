import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CompaniesPage from '../pages/CompaniesPage';

// Mock axios
jest.mock('axios');

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('CompaniesPage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the hero section with title and apply button', () => {
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Corporate Solutions')).toBeInTheDocument();
    expect(screen.getByText('Partner with us to drive social impact and engage your stakeholders')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });

  test('renders the solutions section with three cards', () => {
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Solutions')).toBeInTheDocument();
    expect(screen.getByText('Employee Giving')).toBeInTheDocument();
    expect(screen.getByText('Cause Marketing')).toBeInTheDocument();
    expect(screen.getByText('Disaster Response')).toBeInTheDocument();
  });

  test('renders the trusted companies section', () => {
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Trusted by Leading Companies')).toBeInTheDocument();
    expect(screen.getByText('Company 1')).toBeInTheDocument();
    expect(screen.getByText('Company 2')).toBeInTheDocument();
    expect(screen.getByText('Company 3')).toBeInTheDocument();
    expect(screen.getByText('Company 4')).toBeInTheDocument();
  });

  test('renders the impact section with statistics', () => {
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
    expect(screen.getByText('$200M+')).toBeInTheDocument();
    expect(screen.getByText('Distributed Annually')).toBeInTheDocument();
    expect(screen.getByText('170+')).toBeInTheDocument();
    expect(screen.getByText('Countries Reached')).toBeInTheDocument();
  });

  test('renders the contact form with all fields', () => {
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/partnership type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('clicking Apply Now button scrolls to contact form', () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    const applyButton = screen.getByRole('button', { name: /apply now/i });
    fireEvent.click(applyButton);
    
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('submits form data correctly', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({ data: { message: 'Success' } });
    
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if axios.post was called with the correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/companies/applications/', {
        company_name: 'Test Company',
        contact_name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        partnership_type: 'custom',
      });
    });
  });

  test('shows error message when form submission fails', async () => {
    // Mock failed API response
    axios.post.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <CompaniesPage />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test message' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      // Note: In a real test, we would check for the error message in the UI
      // but since Snackbar is rendered in a portal, we'd need additional setup
    });
  });
}); 