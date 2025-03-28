from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import UserProfile
import json

User = get_user_model()


class UserAPITests(APITestCase):
    def setUp(self):
        # Make sure any previous test users are cleaned up
        User.objects.filter(username='testuser').delete()
        User.objects.filter(username='newuser').delete()
        
        # Create a fresh test user
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.client.force_authenticate(user=self.user)
    
    def tearDown(self):
        # Clean up after tests
        User.objects.filter(username='newuser').delete()
        User.objects.filter(username='testuser').delete()
        
    def test_register_user(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword123',
            'password2': 'newpassword123',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        # Log out for registration test
        self.client.force_authenticate(user=None)
        
        response = self.client.post(url, data, format='json')
        # Print response data for debugging
        print("Response status:", response.status_code)
        print("Response content:", response.content.decode())
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
        
        # Check if profile was created
        user = User.objects.get(username='newuser')
        self.assertTrue(hasattr(user, 'profile'))
        
    def test_get_user_profile(self):
        url = reverse('user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone_number'], self.profile.phone_number)
        
    def test_update_user_profile(self):
        url = reverse('user-profile')
        data = {
            'phone_number': '1234567890',
            'bio': 'Updated bio',
            'address': '123 Main St',
            'city': 'New York',
            'state': 'NY',
            'zip_code': '10001',
            'country': 'USA'
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh profile from DB
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.phone_number, '1234567890')
        self.assertEqual(self.profile.bio, 'Updated bio')
        self.assertEqual(self.profile.address, '123 Main St')
        self.assertEqual(self.profile.city, 'New York')
        
    def test_get_notification_settings(self):
        url = reverse('notification-settings')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email_notifications', response.data)
        self.assertIn('sms_notifications', response.data)
        self.assertIn('marketing_emails', response.data)
        
    def test_update_notification_settings(self):
        url = reverse('notification-settings')
        data = {
            'email_notifications': True,
            'sms_notifications': True,
            'marketing_emails': False,
            'donation_receipts': True,
            'event_reminders': False
        }
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh profile from DB
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.email_notifications)
        self.assertTrue(self.profile.sms_notifications)
        self.assertFalse(self.profile.marketing_emails)
        self.assertTrue(self.profile.donation_receipts)
        self.assertFalse(self.profile.event_reminders)
        
    def test_change_password(self):
        url = reverse('change-password')
        data = {
            'current_password': 'testpassword123',
            'new_password': 'newtestpassword123',
            'confirm_password': 'newtestpassword123'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that we can login with new password
        self.client.force_authenticate(user=None)
        login_successful = self.client.login(username='testuser', password='newtestpassword123')
        self.assertTrue(login_successful)
        
    def test_invalid_password_change(self):
        url = reverse('change-password')
        
        # Test wrong current password
        data = {
            'current_password': 'wrongpassword',
            'new_password': 'newtestpassword123',
            'confirm_password': 'newtestpassword123'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test mismatched new passwords
        data = {
            'current_password': 'testpassword123',
            'new_password': 'newtestpassword123',
            'confirm_password': 'differentpassword'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_get_user_details(self):
        url = reverse('user-details')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertIn('profile', response.data) 