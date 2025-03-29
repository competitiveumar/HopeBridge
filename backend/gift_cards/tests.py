from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import GiftCardDesign, GiftCard, GiftCardRedemption
from .serializers import GiftCardSerializer, GiftCardDesignSerializer
from datetime import datetime, timedelta

class GiftCardModelTests(TestCase):
    """Test case for the GiftCard model"""
    
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword"
        )
        
        # Create a gift card design
        self.design = GiftCardDesign.objects.create(
            name="Birthday",
            image="gift_cards/designs/birthday.jpg"
        )
    
    def test_gift_card_creation(self):
        """Test gift card creation and unique code generation"""
        gift_card = GiftCard.objects.create(
            amount=50.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            message="Happy Birthday!",
            design=self.design,
            created_by=self.user
        )
        
        # Check that the gift card was created
        self.assertEqual(GiftCard.objects.count(), 1)
        
        # Check that a unique code was generated
        self.assertIsNotNone(gift_card.code)
        self.assertEqual(len(gift_card.code), 16)
        
        # Check default values
        self.assertEqual(gift_card.status, 'active')
        self.assertIsNotNone(gift_card.expiration_date)
    
    def test_gift_card_redemption(self):
        """Test gift card redemption"""
        gift_card = GiftCard.objects.create(
            amount=100.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            design=self.design
        )
        
        # Redeem the gift card
        result = gift_card.redeem(self.user)
        
        # Check that the redemption was successful
        self.assertTrue(result)
        self.assertEqual(gift_card.status, 'redeemed')
        self.assertEqual(gift_card.redeemed_by, self.user)
        self.assertIsNotNone(gift_card.redeemed_at)
        
        # Try to redeem again (should fail)
        result = gift_card.redeem(self.user)
        self.assertFalse(result)
    
    def test_gift_card_is_valid(self):
        """Test gift card validation"""
        # Create an active gift card
        active_gift_card = GiftCard.objects.create(
            amount=75.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            design=self.design
        )
        
        # Create an expired gift card
        expired_date = datetime.now() - timedelta(days=10)
        expired_gift_card = GiftCard.objects.create(
            amount=75.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            design=self.design,
            expiration_date=expired_date
        )
        
        # Create a redeemed gift card
        redeemed_gift_card = GiftCard.objects.create(
            amount=75.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            design=self.design,
            status='redeemed'
        )
        
        # Check validity
        self.assertTrue(active_gift_card.is_valid())
        self.assertFalse(expired_gift_card.is_valid())
        self.assertFalse(redeemed_gift_card.is_valid())

class GiftCardAPITests(APITestCase):
    """Test case for the Gift Card API endpoints"""
    
    def setUp(self):
        # Create users
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword"
        )
        
        self.admin_user = User.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="adminpassword",
            is_staff=True
        )
        
        # Create a gift card design
        self.design = GiftCardDesign.objects.create(
            name="Birthday",
            image="gift_cards/designs/birthday.jpg"
        )
        
        # Create a gift card
        self.gift_card = GiftCard.objects.create(
            amount=50.00,
            sender_name="John Doe",
            sender_email="john@example.com",
            recipient_name="Jane Smith",
            recipient_email="jane@example.com",
            message="Happy Birthday!",
            design=self.design,
            created_by=self.user
        )
        
        # Create API client
        self.client = APIClient()
    
    def test_get_gift_card_designs(self):
        """Test retrieving gift card designs"""
        url = reverse('gift_cards:giftcarddesign-list')
        response = self.client.get(url)
        
        # Designs endpoint is accessible without authentication
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Birthday')
    
    def test_create_gift_card(self):
        """Test creating a gift card"""
        url = reverse('gift_cards:gift-card-list')
        data = {
            'amount': 100.00,
            'sender_name': 'Test Sender',
            'sender_email': 'sender@example.com',
            'recipient_name': 'Test Recipient',
            'recipient_email': 'recipient@example.com',
            'message': 'Test message',
            'design': self.design.id,
            'card_type': 'digital'
        }
        
        # Anonymous user should be able to create a gift card
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Authenticated user should be able to create a gift card
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the gift card was created
        self.assertEqual(GiftCard.objects.count(), 3)  # 1 from setUp + 2 from test
    
    def test_validate_gift_card_code(self):
        """Test validating a gift card code"""
        url = reverse('gift_cards:gift-card-validate')
        
        # Valid code
        data = {'code': self.gift_card.code}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['amount'], '50.00')
        
        # Invalid code
        data = {'code': 'INVALIDCODE1234'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Missing code
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_user_gift_cards(self):
        """Test listing a user's gift cards"""
        # Create another gift card for a different user
        other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="otherpassword"
        )
        
        other_gift_card = GiftCard.objects.create(
            amount=25.00,
            sender_name="Other User",
            sender_email="other@example.com",
            recipient_name="Other Recipient",
            recipient_email="recipient@example.com",
            design=self.design,
            created_by=other_user
        )
        
        url = reverse('gift_cards:gift-card-user')
        
        # Unauthenticated user should get 401
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Authenticated user should only see their own gift cards
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['sender_name'], 'John Doe')
        
        # Other user should only see their own gift cards
        self.client.force_authenticate(user=other_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['sender_name'], 'Other User')
        
        # Admin user should be able to see all gift cards in a different endpoint
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('gift_cards:gift-card-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_redeem_gift_card(self):
        """Test redeeming a gift card"""
        url = reverse('gift_cards:gift-card-redemption-list')
        data = {
            'gift_card': self.gift_card.id,
            'nonprofit_id': 1,
            'nonprofit_name': 'Test Nonprofit',
            'amount': 50.00
        }
        
        # Unauthenticated user should get 401
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Authenticated user should be able to redeem
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the gift card was redeemed
        self.gift_card.refresh_from_db()
        self.assertEqual(self.gift_card.status, 'redeemed')
        self.assertEqual(self.gift_card.redeemed_by, self.user)
        
        # Trying to redeem again should fail
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
