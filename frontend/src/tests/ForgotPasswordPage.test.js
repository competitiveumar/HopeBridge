import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import { AuthProvider } from '../contexts/AuthContext';
import '@testing-library/jest-dom';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    resetPassword: jest.fn(() => Promise.resolve()),
  }),
}));

describe('ForgotPasswordPage', () => {
  const renderForgotPasswordPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ForgotPasswordPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders the forgot password page', () => {
    renderForgotPasswordPage();
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });

  test('validates email field', async () => {
    renderForgotPasswordPage();
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Test empty email
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Test invalid email
    const emailInput = screen.getByRole('textbox');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('submits form with valid email', async () => {
    const { useAuth } = require('../contexts/AuthContext');
    const resetPassword = useAuth().resetPassword;
    
    renderForgotPasswordPage();
    const emailInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText('Password reset link sent! Check your email inbox.')).toBeInTheDocument();
    });
  });

  test('displays error message when reset fails', async () => {
    const { useAuth } = require('../contexts/AuthContext');
    const error = new Error('User not found');
    error.code = 'auth/user-not-found';
    useAuth().resetPassword.mockRejectedValueOnce(error);
    
    renderForgotPasswordPage();
    const emailInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('No account found with this email address')).toBeInTheDocument();
    });
  });

  test('navigates to login page when "Back to Login" is clicked', () => {
    renderForgotPasswordPage();
    const backToLoginLink = screen.getByRole('link', { name: /back to login/i });
    expect(backToLoginLink.getAttribute('href')).toBe('/login');
  });
}); 