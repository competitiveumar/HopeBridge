import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import '@testing-library/jest-dom';

describe('TermsOfServicePage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <TermsOfServicePage />
      </BrowserRouter>
    );
  });

  test('renders the terms of service page title', () => {
    expect(screen.getByText('HopeBridge Terms of Service')).toBeInTheDocument();
  });

  test('renders all section headers', () => {
    expect(screen.getByText('1. Using Our Services')).toBeInTheDocument();
    expect(screen.getByText('2. Donations and Payments')).toBeInTheDocument();
    expect(screen.getByText('3. User Accounts')).toBeInTheDocument();
    expect(screen.getByText('4. Intellectual Property')).toBeInTheDocument();
    expect(screen.getByText('5. Termination')).toBeInTheDocument();
    expect(screen.getByText('6. Changes to These Terms')).toBeInTheDocument();
    expect(screen.getByText('7. Contact Us')).toBeInTheDocument();
  });

  test('renders the introduction paragraph', () => {
    const introText = screen.getByText(/Welcome to HopeBridge/i);
    expect(introText).toBeInTheDocument();
  });

  test('renders information about using services', () => {
    expect(screen.getByText(/You must follow any policies made available to you/i)).toBeInTheDocument();
  });

  test('renders information about donations and payments', () => {
    expect(screen.getByText(/All donations made through our platform are final and non-refundable/i)).toBeInTheDocument();
  });

  test('renders information about user accounts', () => {
    expect(screen.getByText(/You may need to create an account to use some of our Services/i)).toBeInTheDocument();
  });

  test('renders information about intellectual property', () => {
    expect(screen.getByText(/The content displayed on our website/i)).toBeInTheDocument();
  });

  test('renders information about termination', () => {
    expect(screen.getByText(/We reserve the right to suspend or terminate your access/i)).toBeInTheDocument();
  });

  test('renders information about changes to terms', () => {
    expect(screen.getByText(/We may modify these terms or any additional terms/i)).toBeInTheDocument();
  });

  test('renders contact information', () => {
    expect(screen.getByText(/If you have any questions about these Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
  });

  test('renders contact address', () => {
    expect(screen.getByText(/15 Charity Square, London, EC1V 9HD, United Kingdom/i)).toBeInTheDocument();
  });

  test('renders phone number', () => {
    expect(screen.getByText(/\+44 \(0\)20 7123 4567/i)).toBeInTheDocument();
  });

  test('renders email with correct link', () => {
    const emailLink = screen.getByRole('link', { name: 'support@hopebridge.org' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@hopebridge.org');
  });

  test('renders copyright notice', () => {
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} HopeBridge\\. All Rights Reserved\\.`, 'i'))).toBeInTheDocument();
  });

  // Accessibility tests
  test('has appropriate heading hierarchy', () => {
    const headingLevel1 = screen.getByRole('heading', { level: 1 });
    expect(headingLevel1).toHaveTextContent('HopeBridge Terms of Service');

    const headingLevel2All = screen.getAllByRole('heading', { level: 2 });
    expect(headingLevel2All).toHaveLength(7); // 7 sections
  });
}); 