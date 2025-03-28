import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import CartPage from '../pages/CartPage';
import { CartProvider } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => ({
    confirmCardPayment: jest.fn().mockResolvedValue({})
  }),
  useElements: () => ({
    getElement: jest.fn()
  })
}));

// Mock loadStripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn().mockResolvedValue({})
}));

// Sample cart items
const mockCartItems = [
  {
    id: 1,
    name: 'Disaster Relief',
    description: 'Help victims of natural disasters',
    nonprofit_id: 1,
    nonprofit_name: 'Red Cross',
    price: 50,
    quantity: 2,
    image: 'redcross.jpg'
  },
  {
    id: 2,
    name: 'Education Fund',
    description: 'Support education initiatives',
    nonprofit_id: 2,
    nonprofit_name: 'Education First',
    price: 75,
    quantity: 1,
    image: null
  }
];

// Setup mock auth context
const mockAuthContext = {
  currentUser: {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  },
  loading: false
};

// Setup mock cart context with items
const mockCartContext = {
  cartItems: mockCartItems,
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  getSubtotal: jest.fn().mockReturnValue(175), // 50*2 + 75*1
  getTotalItems: jest.fn().mockReturnValue(3), // 2 + 1
  isRecurring: false,
  recurringFrequency: 'monthly',
  toggleRecurring: jest.fn(),
  setRecurringFrequency: jest.fn(),
  giftCard: null,
  removeGiftCard: jest.fn(),
  addGiftCard: jest.fn(),
  clearCart: jest.fn()
};

// Empty cart mock context
const emptyCartContext = {
  ...mockCartContext,
  cartItems: [],
  getTotalItems: jest.fn().mockReturnValue(0)
};

// Wrapper component with needed providers
const renderWithProviders = (ui, { cartContext = mockCartContext, authContext = mockAuthContext } = {}) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authContext}>
        <CartProvider value={cartContext}>
          {ui}
        </CartProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('CartPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart page with items correctly', () => {
    renderWithProviders(<CartPage />);
    
    // Check page title
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    
    // Check items count
    expect(screen.getByText('3 Items')).toBeInTheDocument();
    
    // Check first item details
    expect(screen.getByText('Disaster Relief')).toBeInTheDocument();
    expect(screen.getByText('Help victims of natural disasters')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    
    // Check second item details
    expect(screen.getByText('Education Fund')).toBeInTheDocument();
    expect(screen.getByText('Support education initiatives')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument();
    
    // Check summary section
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$175.00', { exact: false })).toBeInTheDocument();
    
    // Check payment section
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Pay $175.00')).toBeInTheDocument();
  });
  
  test('renders empty cart message when cart is empty', () => {
    renderWithProviders(<CartPage />, { cartContext: emptyCartContext });
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some donations to your cart to get started.')).toBeInTheDocument();
    expect(screen.getByText('Browse Charities')).toBeInTheDocument();
  });
  
  test('updates quantity when clicking add/remove buttons', () => {
    renderWithProviders(<CartPage />);
    
    // Find quantity buttons for first item
    const decreaseBtn = screen.getAllByRole('button', { name: /remove/i })[0];
    const increaseBtn = screen.getAllByRole('button', { name: /add/i })[0];
    
    // Click increase button
    fireEvent.click(increaseBtn);
    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3);
    
    // Click decrease button
    fireEvent.click(decreaseBtn);
    expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 1);
  });
  
  test('removes item when clicking remove button', () => {
    renderWithProviders(<CartPage />);
    
    // Find delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /remove item/i });
    
    // Click delete button for first item
    fireEvent.click(deleteButtons[0]);
    expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1);
  });
  
  test('toggles recurring donation option', () => {
    renderWithProviders(<CartPage />);
    
    // Find and click recurring donation switch
    const recurringSwitch = screen.getByRole('checkbox', { name: /make this a recurring donation/i });
    fireEvent.click(recurringSwitch);
    
    expect(mockCartContext.toggleRecurring).toHaveBeenCalled();
  });
  
  test('shows frequency selector when recurring is enabled', () => {
    // Create a context with recurring enabled
    const recurringContext = {
      ...mockCartContext,
      isRecurring: true
    };
    
    renderWithProviders(<CartPage />, { cartContext: recurringContext });
    
    // Check that frequency selector is visible
    expect(screen.getByLabelText('Frequency')).toBeInTheDocument();
  });
  
  test('applies gift card when code is entered', async () => {
    // Mock API response for gift card
    axios.post.mockResolvedValueOnce({ 
      data: { 
        success: true, 
        amount: 50.00 
      } 
    });
    
    renderWithProviders(<CartPage />);
    
    // Find and fill gift card input
    const giftCardInput = screen.getByLabelText('Gift Card Code');
    fireEvent.change(giftCardInput, { target: { value: 'GIFT123' } });
    
    // Click apply button
    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/donations/cart/add_gift_card/', {
        gift_card_code: 'GIFT123',
        session_id: undefined
      });
      expect(mockCartContext.addGiftCard).toHaveBeenCalledWith({ 
        code: 'GIFT123', 
        amount: 50.00 
      });
    });
  });
  
  test('shows gift card details when gift card is applied', () => {
    // Create a context with gift card applied
    const giftCardContext = {
      ...mockCartContext,
      giftCard: { code: 'GIFT123', amount: 50.00 }
    };
    
    renderWithProviders(<CartPage />, { cartContext: giftCardContext });
    
    // Check gift card section
    expect(screen.getByText('Gift Card Applied')).toBeInTheDocument();
    expect(screen.getByText('Gift Card: GIFT123')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
    
    // Check order summary shows gift card discount
    expect(screen.getByText('Gift Card:')).toBeInTheDocument();
    expect(screen.getByText('-$50.00')).toBeInTheDocument();
  });
  
  test('handles payment submission', async () => {
    // Mock API response for checkout
    axios.post.mockResolvedValueOnce({ 
      data: { 
        client_secret: 'test_secret',
        donation_ids: [1, 2]
      } 
    });
    
    renderWithProviders(<CartPage />);
    
    // Submit payment form
    const payButton = screen.getByRole('button', { name: /pay \$175\.00/i });
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/donations/cart/checkout/', {
        payment_method: 'card',
        session_id: undefined,
        email: 'test@example.com',
        name: 'Test User'
      });
    });
  });
  
  test('renders form for anonymous users', () => {
    // Create an anonymous context (no current user)
    const anonymousContext = {
      currentUser: null,
      loading: false
    };
    
    renderWithProviders(<CartPage />, { authContext: anonymousContext });
    
    // Check contact information form is rendered
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
}); 