import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import '@testing-library/jest-dom';

describe('PrivacyPolicyPage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <PrivacyPolicyPage />
      </BrowserRouter>
    );
  });

  test('renders the privacy policy page title', () => {
    expect(screen.getByText('HopeBridge Privacy Policy')).toBeInTheDocument();
  });

  test('renders all section headers', () => {
    expect(screen.getByText('1. Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('2. How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('3. Sharing Your Information')).toBeInTheDocument();
    expect(screen.getByText('4. Data Security')).toBeInTheDocument();
    expect(screen.getByText('5. Your Choices')).toBeInTheDocument();
    expect(screen.getByText('6. Cookies and Tracking')).toBeInTheDocument();
    expect(screen.getByText('7. Updates to Our Policy')).toBeInTheDocument();
    expect(screen.getByText('8. Contact Us')).toBeInTheDocument();
  });

  test('renders the introduction paragraph', () => {
    const introText = screen.getByText(/Your privacy is important to us at/i);
    expect(introText).toBeInTheDocument();
    expect(introText).toHaveTextContent('HopeBridge');
  });

  test('renders information collection details', () => {
    expect(screen.getByText(/Personal Information:/i)).toBeInTheDocument();
    expect(screen.getByText(/Non-Personal Information:/i)).toBeInTheDocument();
    expect(screen.getByText(/Donation Details:/i)).toBeInTheDocument();
  });

  test('renders information usage details', () => {
    expect(screen.getByText('To process donations and send receipts.')).toBeInTheDocument();
    expect(screen.getByText('To provide updates on our programs, events, and campaigns.')).toBeInTheDocument();
    expect(screen.getByText('To respond to inquiries or requests for information.')).toBeInTheDocument();
    expect(screen.getByText('To improve our website, services, and user experience.')).toBeInTheDocument();
  });

  test('renders information sharing details', () => {
    expect(screen.getByText('We do not sell, trade, or rent your personal information.')).toBeInTheDocument();
    expect(screen.getByText(/We may share your information with trusted third-party service providers/i)).toBeInTheDocument();
    expect(screen.getByText(/We may disclose your information to comply with legal obligations/i)).toBeInTheDocument();
  });

  test('renders data security details', () => {
    expect(screen.getByText(/We implement appropriate technical and organizational measures/i)).toBeInTheDocument();
    expect(screen.getByText(/Donation transactions are encrypted using SSL/i)).toBeInTheDocument();
    expect(screen.getByText(/Access to your personal information is restricted/i)).toBeInTheDocument();
  });

  test('renders user choices information', () => {
    expect(screen.getByText(/You may opt out of receiving our email communications/i)).toBeInTheDocument();
    expect(screen.getByText(/You can request access to or deletion of your personal information/i)).toBeInTheDocument();
  });

  test('renders cookies and tracking information', () => {
    expect(screen.getByText(/We use cookies to enhance user experience/i)).toBeInTheDocument();
    expect(screen.getByText(/You can manage your cookie preferences/i)).toBeInTheDocument();
  });

  test('renders policy updates information', () => {
    expect(screen.getByText(/We may update this Privacy Policy periodically/i)).toBeInTheDocument();
  });

  test('renders contact information', () => {
    expect(screen.getByText(/If you have any questions about this Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
  });

  test('renders UK contact address', () => {
    expect(screen.getByText(/15 Charity Square, London, EC1V 9HD, United Kingdom/i)).toBeInTheDocument();
  });

  test('renders UK phone number', () => {
    expect(screen.getByText(/\+44 \(0\)20 7123 4567/i)).toBeInTheDocument();
  });

  test('renders email with correct link', () => {
    const emailLink = screen.getByRole('link', { name: 'support@hopebridge.org' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@hopebridge.org');
  });

  test('renders home link', () => {
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('renders copyright notice', () => {
    expect(screen.getByText(/© 2024 HopeBridge\. All Rights Reserved\./i)).toBeInTheDocument();
  });

  // Accessibility tests
  test('has appropriate heading hierarchy', () => {
    const headingLevel1 = screen.getByRole('heading', { level: 1 });
    expect(headingLevel1).toHaveTextContent('HopeBridge Privacy Policy');

    const headingLevel2All = screen.getAllByRole('heading', { level: 2 });
    expect(headingLevel2All).toHaveLength(8); // 8 sections
  });
}); 