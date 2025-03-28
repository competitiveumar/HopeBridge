import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import { userService } from '../services/api';
import '@testing-library/jest-dom';

// Mock userService
jest.mock('../services/api', () => ({
  userService: {
    getProfile: jest.fn(),
    getUserDetails: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    updateNotificationSettings: jest.fn(),
    uploadProfileImage: jest.fn(),
  },
}));

// Mock firebase auth
const mockCurrentUser = {
  uid: 'testUserId',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: mockCurrentUser,
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));

// Mock firebase functions
jest.mock('firebase/auth', () => ({
  updateProfile: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  EmailAuthProvider: {
    credential: jest.fn(() => 'mockCredential'),
  },
  reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
}));

// Mock firebase storage
jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => 'mockStorage'),
  ref: jest.fn(() => 'mockStorageRef'),
  uploadBytes: jest.fn(() => Promise.resolve()),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/new-photo.jpg')),
}));

// Setup mock responses
const mockProfileData = {
  phone_number: '1234567890',
  bio: 'Test bio',
  profile_image: 'https://example.com/backend-photo.jpg',
  address: '123 Main St',
  city: 'Test City',
  state: 'Test State',
  zip_code: '12345',
  country: 'Test Country',
  email_notifications: true,
  sms_notifications: false,
  marketing_emails: true,
  donation_receipts: true,
  event_reminders: true,
};

const mockUserData = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  profile: mockProfileData,
};

// Render component with necessary providers
const renderAccountSettingsPage = () => {
  userService.getProfile.mockResolvedValue({ data: mockProfileData });
  userService.getUserDetails.mockResolvedValue({ data: mockUserData });
  
  return render(
    <MemoryRouter initialEntries={['/account-settings']}>
      <Routes>
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('AccountSettingsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders account settings page with user data', async () => {
    renderAccountSettingsPage();
    
    // Verify page title is rendered
    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });
    
    // Verify tabs are rendered
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Payment Methods')).toBeInTheDocument();
    
    // Verify profile data is loaded
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toHaveValue('Test User');
      expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
      expect(screen.getByLabelText('Phone Number')).toHaveValue('1234567890');
      expect(screen.getByLabelText('Address')).toHaveValue('123 Main St');
    });
  });

  test('updates profile information', async () => {
    userService.updateProfile.mockResolvedValue({ data: mockProfileData });
    renderAccountSettingsPage();
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });
    
    // Update phone number
    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    
    // Update address
    const addressInput = screen.getByLabelText('Address');
    fireEvent.change(addressInput, { target: { value: '456 New St' } });
    
    // Submit form
    const saveButton = await screen.findByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith({
        phone_number: '9876543210',
        address: '456 New St',
        city: 'Test City',
        state: 'Test State',
        zip_code: '12345',
        country: 'Test Country',
      });
    });
  });

  test('validates password update form', async () => {
    renderAccountSettingsPage();
    
    // Go to Security tab
    await waitFor(() => {
      expect(screen.getByText('Security')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Security'));
    
    // Fill password form with non-matching passwords
    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPassword' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword' } });
    
    // Submit form
    const updateButton = screen.getByText('Update Password');
    fireEvent.click(updateButton);
    
    // Verify validation error appears
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
    
    // Verify API was not called
    expect(userService.changePassword).not.toHaveBeenCalled();
  });

  test('updates notification settings', async () => {
    userService.updateNotificationSettings.mockResolvedValue({ data: { success: true } });
    renderAccountSettingsPage();
    
    // Go to Notifications tab
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Notifications'));
    
    // Toggle SMS notifications
    const smsSwitch = screen.getByLabelText('SMS Notifications');
    fireEvent.click(smsSwitch);
    
    // Submit form
    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(userService.updateNotificationSettings).toHaveBeenCalledWith({
        email_notifications: true,
        sms_notifications: true,
        marketing_emails: true,
        donation_receipts: true,
        event_reminders: true,
      });
    });
  });

  test('shows payment methods tab', async () => {
    renderAccountSettingsPage();
    
    // Go to Payment Methods tab
    await waitFor(() => {
      expect(screen.getByText('Payment Methods')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Payment Methods'));
    
    // Verify empty state is shown
    await waitFor(() => {
      expect(screen.getByText('You don\'t have any payment methods saved yet.')).toBeInTheDocument();
      expect(screen.getByText('Add Payment Method')).toBeInTheDocument();
    });
  });
}); 