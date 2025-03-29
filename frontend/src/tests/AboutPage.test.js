import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';

// Mock the RouterLink component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// Mock axios
jest.mock('axios');

describe('AboutPage Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders the page content after loading', async () => {
    renderWithRouter(<AboutPage />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check that the page title is rendered
    expect(screen.getByText('About HopeBridge')).toBeInTheDocument();
  });

  test('renders the mission statement', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Transforming aid and philanthropy to accelerate community-led change')).toBeInTheDocument();
  });

  test('renders the Our Story section with content from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText(/HopeBridge is the largest global crowdfunding community connecting nonprofits, donors, and companies in nearly every country/)).toBeInTheDocument();
  });

  test('renders the Find a Project button', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const button = screen.getByRole('link', { name: 'Find a Project' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/projects');
  });

  test('renders the Mission, Vision, and Values sections with content from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Our Values')).toBeInTheDocument();
    
    expect(screen.getByText('To transform aid and philanthropy to accelerate community-led change.')).toBeInTheDocument();
    expect(screen.getByText('Unleashing the potential of people to make positive change happen.')).toBeInTheDocument();
    expect(screen.getByText('Always open, committed to listening and learning, focused on community-led change.')).toBeInTheDocument();
  });

  test('renders the Impact section with statistics from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('$750M+')).toBeInTheDocument();
    expect(screen.getByText('31,000+')).toBeInTheDocument();
    expect(screen.getByText('175+')).toBeInTheDocument();
    expect(screen.getByText('Total Donations')).toBeInTheDocument();
    expect(screen.getByText('Projects Funded')).toBeInTheDocument();
    expect(screen.getByText('Countries Reached')).toBeInTheDocument();
  });

  test('renders the Team section with team members from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Our Team')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('Aisha Patel')).toBeInTheDocument();
    expect(screen.getByText('David Rodriguez')).toBeInTheDocument();
  });

  test('renders team member roles correctly from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Executive Director')).toBeInTheDocument();
    expect(screen.getByText('Director of Operations')).toBeInTheDocument();
    expect(screen.getByText('Partnerships Manager')).toBeInTheDocument();
    expect(screen.getByText('Technology Lead')).toBeInTheDocument();
  });

  test('renders the Corporate Partnerships section', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Corporate Partnerships')).toBeInTheDocument();
    expect(screen.getByText(/We help companies develop powerful corporate social responsibility/)).toBeInTheDocument();
    const learnMoreButton = screen.getByRole('link', { name: 'Learn More' });
    expect(learnMoreButton).toBeInTheDocument();
    expect(learnMoreButton).toHaveAttribute('href', '/companies');
  });

  test('renders the Testimonials section with testimonials from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Maria Gonzalez')).toBeInTheDocument();
    expect(screen.getByText('Emmanuel Okafor')).toBeInTheDocument();
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
  });

  test('renders testimonial organizations correctly from API', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Education for All, Mexico')).toBeInTheDocument();
    expect(screen.getByText('Clean Water Initiative, Nigeria')).toBeInTheDocument();
    expect(screen.getByText('Women\'s Empowerment Collective, India')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock the console.error to prevent error output in test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Force the useEffect to throw an error
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {
      throw new Error('API Error');
    });

    renderWithRouter(<AboutPage />);
    
    // Restore console.error
    console.error = originalConsoleError;

    // The component should handle the error and display an error message
    expect(screen.getByText(/Failed to load about page data/)).toBeInTheDocument();
  });

  // This test should pass
  test('renders the page title and mission statement', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText('About HopeBridge')).toBeInTheDocument();
    expect(screen.getByText('Transforming aid and philanthropy to accelerate community-led change')).toBeInTheDocument();
  });

  // This test should fail - incorrect impact numbers
  test('displays correct impact statistics', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // This will fail because the actual numbers are different
    expect(screen.getByText('$800M+')).toBeInTheDocument(); // Actual is $750M+
    expect(screen.getByText('35,000+')).toBeInTheDocument(); // Actual is 31,000+
    expect(screen.getByText('200+')).toBeInTheDocument(); // Actual is 175+
  });

  // This test should fail - testing for non-existent functionality
  test('newsletter subscription works correctly', async () => {
    renderWithRouter(<AboutPage />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // This will fail because the newsletter subscription feature doesn't exist
    const emailInput = screen.getByLabelText('Subscribe to our newsletter');
    const subscribeButton = screen.getByText('Subscribe');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    expect(await screen.findByText('Thank you for subscribing!')).toBeInTheDocument();
  });
}); 