import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GiftCardsPage from '../pages/GiftCardsPage';
import { giftCardService } from '../services/api';
import { AuthProvider } from '../contexts/AuthContext';

// Mock API services
jest.mock('../services/api', () => ({
  giftCardService: {
    getDesigns: jest.fn(),
    purchaseGiftCard: jest.fn(),
  }
}));

// Mock Auth Context
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    currentUser: null
  })
}));

// Create theme for Material UI
const theme = createTheme();

// Mock data for testing
const mockDesigns = [
  {
    id: 1,
    name: 'Birthday',
    image: 'https://example.com/birthday.jpg',
    is_active: true,
  },
  {
    id: 2,
    name: 'Thank You',
    image: 'https://example.com/thankyou.jpg',
    is_active: true,
  }
];

// Setup for each test
const setup = () => {
  // Mock API responses
  giftCardService.getDesigns.mockResolvedValue({ data: mockDesigns });
  giftCardService.purchaseGiftCard.mockResolvedValue({ 
    data: { 
      id: 1, 
      code: 'ABC123XYZ',
      amount: 50,
      status: 'active'
    } 
  });

  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <GiftCardsPage />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('GiftCardsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the page title and description', () => {
    setup();
    expect(screen.getByText('Give the Gift of Impact')).toBeInTheDocument();
    expect(screen.getByText('Let them choose the cause they care about most')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    setup();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays gift card options after loading', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getAllByText('Digital Gift Card')[0]).toBeInTheDocument();
    });

    expect(screen.getByText('Print at Home')).toBeInTheDocument();
    expect(screen.getByText('Send instantly via email')).toBeInTheDocument();
    expect(screen.getByText('Print and give in person')).toBeInTheDocument();
  });

  test('allows selecting different gift card amounts', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getAllByText('$25')[0]).toBeInTheDocument();
    });

    // Click on $50 button for digital gift card
    const fiftyButtons = screen.getAllByText('$50');
    fireEvent.click(fiftyButtons[0]);
    
    // Click on $100 button for print gift card
    const hundredButtons = screen.getAllByText('$100');
    fireEvent.click(hundredButtons[1]);
  });

  test('shows delivery options section', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('Delivery Options')).toBeInTheDocument();
    });

    expect(screen.getByText('Send Instantly')).toBeInTheDocument();
    expect(screen.getByText('Schedule Delivery')).toBeInTheDocument();
    
    // Default selection should be "Send Instantly"
    const sendInstantlyOption = screen.getByLabelText(/Send Instantly/i);
    expect(sendInstantlyOption).toBeChecked();
    
    // Change to "Schedule Delivery"
    const scheduleOption = screen.getByLabelText(/Schedule Delivery/i);
    fireEvent.click(scheduleOption);
    expect(scheduleOption).toBeChecked();
  });

  test('shows "How It Works" section', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('How It Works')).toBeInTheDocument();
    });

    expect(screen.getByText('1. Choose & Customize')).toBeInTheDocument();
    expect(screen.getByText('2. Add Personal Message')).toBeInTheDocument();
    expect(screen.getByText('3. They Choose Their Cause')).toBeInTheDocument();
  });

  test('shows personalization form and validates required fields', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('Personalize Your Gift')).toBeInTheDocument();
    });

    // Check form fields
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipient\'s Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Recipient\'s Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Message (Optional)')).toBeInTheDocument();
    
    // Submit button should be disabled initially (form is not valid)
    const submitButton = screen.getByText('Continue to Payment');
    expect(submitButton).toBeDisabled();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Email'), { target: { value: 'jane@example.com' } });
    
    // Select an amount
    const fiftyButtons = screen.getAllByText('$50');
    fireEvent.click(fiftyButtons[0]);
    
    // Submit button should now be enabled
    expect(submitButton).not.toBeDisabled();
  });

  test('submits the form successfully', async () => {
    setup();
    
    await waitFor(() => {
      expect(screen.getByText('Personalize Your Gift')).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Message (Optional)'), { target: { value: 'Happy Birthday!' } });
    
    // Select an amount
    const fiftyButtons = screen.getAllByText('$50');
    fireEvent.click(fiftyButtons[0]);
    
    // Submit the form
    const submitButton = screen.getByText('Continue to Payment');
    fireEvent.click(submitButton);
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(giftCardService.purchaseGiftCard).toHaveBeenCalledWith(expect.objectContaining({
        amount: 50,
        sender_name: 'John Doe',
        sender_email: 'john@example.com',
        recipient_name: 'Jane Smith',
        recipient_email: 'jane@example.com',
        message: 'Happy Birthday!',
        card_type: 'digital'
      }));
    });
  });

  test('handles API errors gracefully', async () => {
    // Setup with API error
    giftCardService.getDesigns.mockResolvedValue({ data: mockDesigns });
    giftCardService.purchaseGiftCard.mockRejectedValue(new Error('API Error'));

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <GiftCardsPage />
        </MemoryRouter>
      </ThemeProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Personalize Your Gift')).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Recipient\'s Email'), { target: { value: 'jane@example.com' } });
    
    // Select an amount
    const fiftyButtons = screen.getAllByText('$50');
    fireEvent.click(fiftyButtons[0]);
    
    // Submit the form
    const submitButton = screen.getByText('Continue to Payment');
    fireEvent.click(submitButton);
    
    // Error should be handled, application should not crash
    await waitFor(() => {
      expect(giftCardService.purchaseGiftCard).toHaveBeenCalled();
    });
  });
}); 