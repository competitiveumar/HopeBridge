import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from '../mocks/axios';
import Chatbot from '../../components/chat/Chatbot';

// Mock responses for chatbot
const mockChatbotResponses = {
  greeting: {
    message: 'Hello! How can I help you today?',
    options: ['Donation Information', 'Find Projects', 'About HopeBridge']
  },
  'donation information': {
    message: 'We accept donations via credit card, PayPal, and bank transfer. 100% of your donation goes directly to the projects you choose.',
    options: ['How to donate?', 'Tax benefits', 'Back to main menu']
  },
  'find projects': {
    message: 'You can search for projects by category, location, or specific keywords. What type of projects are you interested in?',
    options: ['Education', 'Healthcare', 'Environment', 'Back to main menu']
  },
  'about hopebridge': {
    message: 'HopeBridge is a global crowdfunding platform connecting nonprofits, donors, and companies in nearly every country.',
    options: ['Our mission', 'How it works', 'Back to main menu']
  }
};

describe('Chatbot Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup axios mock responses
    axios.post.mockImplementation((url, data) => {
      if (url.includes('/api/chatbot/message')) {
        const query = data.message.toLowerCase();
        let response;
        
        if (query.includes('donation') || query.includes('donate')) {
          response = mockChatbotResponses['donation information'];
        } else if (query.includes('project') || query.includes('find')) {
          response = mockChatbotResponses['find projects'];
        } else if (query.includes('about') || query.includes('hopebridge')) {
          response = mockChatbotResponses['about hopebridge'];
        } else {
          response = mockChatbotResponses.greeting;
        }
        
        return Promise.resolve({ data: response });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders chatbot button when closed', () => {
    render(<Chatbot />);
    
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    expect(chatbotButton).toBeInTheDocument();
    expect(chatbotButton).toBeVisible();
  });

  test('opens chatbot when button is clicked', () => {
    render(<Chatbot />);
    
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    expect(screen.getByText('HopeBridge Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  test('displays greeting message when opened', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Wait for greeting message
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    });
    
    // Check for quick reply options
    expect(screen.getByText('Donation Information')).toBeInTheDocument();
    expect(screen.getByText('Find Projects')).toBeInTheDocument();
    expect(screen.getByText('About HopeBridge')).toBeInTheDocument();
  });

  test('sends user message and displays response', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Type and send message
    const inputField = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputField, { target: { value: 'How can I donate?' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Check if user message appears
    expect(screen.getByText('How can I donate?')).toBeInTheDocument();
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('We accept donations via credit card, PayPal, and bank transfer. 100% of your donation goes directly to the projects you choose.')).toBeInTheDocument();
    });
    
    // Check for quick reply options
    expect(screen.getByText('How to donate?')).toBeInTheDocument();
    expect(screen.getByText('Tax benefits')).toBeInTheDocument();
    expect(screen.getByText('Back to main menu')).toBeInTheDocument();
  });

  test('clicking quick reply option sends that message', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Wait for greeting message and options
    await waitFor(() => {
      expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    });
    
    // Click on "Find Projects" quick reply
    const findProjectsOption = screen.getByText('Find Projects');
    fireEvent.click(findProjectsOption);
    
    // Check if option was sent as message
    expect(screen.getByText('Find Projects')).toBeInTheDocument();
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('You can search for projects by category, location, or specific keywords. What type of projects are you interested in?')).toBeInTheDocument();
    });
    
    // Check for new quick reply options
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
  });

  test('closes chatbot when close button is clicked', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Wait for chatbot to open
    await waitFor(() => {
      expect(screen.getByText('HopeBridge Assistant')).toBeInTheDocument();
    });
    
    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Verify chatbot is closed
    expect(screen.queryByText('HopeBridge Assistant')).not.toBeInTheDocument();
    expect(chatbotButton).toBeVisible();
  });

  test('minimizes chatbot when minimize button is clicked', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Wait for chatbot to open
    await waitFor(() => {
      expect(screen.getByText('HopeBridge Assistant')).toBeInTheDocument();
    });
    
    // Click minimize button
    const minimizeButton = screen.getByRole('button', { name: /minimize/i });
    fireEvent.click(minimizeButton);
    
    // Verify chatbot is minimized but not closed
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
    expect(screen.getByText('HopeBridge Assistant')).toBeInTheDocument();
  });

  test('restores chatbot when header is clicked while minimized', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Wait for chatbot to open
    await waitFor(() => {
      expect(screen.getByText('HopeBridge Assistant')).toBeInTheDocument();
    });
    
    // Click minimize button
    const minimizeButton = screen.getByRole('button', { name: /minimize/i });
    fireEvent.click(minimizeButton);
    
    // Verify chatbot is minimized
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
    
    // Click on header to restore
    const header = screen.getByText('HopeBridge Assistant');
    fireEvent.click(header);
    
    // Verify chatbot is restored
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });
  });

  test('maintains conversation history when minimized and restored', async () => {
    render(<Chatbot />);
    
    // Open chatbot
    const chatbotButton = screen.getByRole('button', { name: /chat with us/i });
    fireEvent.click(chatbotButton);
    
    // Type and send message
    const inputField = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputField, { target: { value: 'Tell me about HopeBridge' } });
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('HopeBridge is a global crowdfunding platform connecting nonprofits, donors, and companies in nearly every country.')).toBeInTheDocument();
    });
    
    // Minimize chatbot
    const minimizeButton = screen.getByRole('button', { name: /minimize/i });
    fireEvent.click(minimizeButton);
    
    // Restore chatbot
    const header = screen.getByText('HopeBridge Assistant');
    fireEvent.click(header);
    
    // Verify conversation history is maintained
    expect(screen.getByText('Tell me about HopeBridge')).toBeInTheDocument();
    expect(screen.getByText('HopeBridge is a global crowdfunding platform connecting nonprofits, donors, and companies in nearly every country.')).toBeInTheDocument();
  });
}); 