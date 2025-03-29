from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from unittest.mock import patch, MagicMock
import json
from .models import Project, Donation, FundAllocation, Nonprofit, GiftCard, CartItem
from .serializers import ProjectSerializer, DonationSerializer, FundAllocationSerializer
from django.utils import timezone

User = get_user_model()

class ProjectModelTests(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States',
            organization='Test Organization',
            categories=['Education'],
            status='active'
        )

    def test_project_creation(self):
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.organization, 'Test Organization')
        self.assertEqual(self.project.raised, Decimal('0.00'))
        self.assertEqual(self.project.status, 'active')
        self.assertIn('Education', self.project.categories)

    def test_project_str(self):
        self.assertEqual(str(self.project), 'Test Project')

class DonationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States',
            organization='Test Organization',
            categories=['Education']
        )
        self.donation = Donation.objects.create(
            project=self.project,
            donor=self.user,
            amount=Decimal('100.00'),
            payment_id='test_payment_id',
            payment_provider='stripe'
        )

    def test_donation_creation(self):
        self.assertEqual(self.donation.amount, Decimal('100.00'))
        self.assertEqual(self.donation.status, 'pending')
        self.assertEqual(self.donation.payment_provider, 'stripe')

    def test_donation_str(self):
        self.assertEqual(str(self.donation), '$100.00 to Test Project')

    def test_donation_completion_updates_project(self):
        initial_raised = self.project.raised
        self.donation.status = 'completed'
        self.donation.save()
        self.project.refresh_from_db()
        self.assertEqual(
            self.project.raised,
            initial_raised + self.donation.amount
        )
    
    def test_anonymous_donation(self):
        anonymous_donation = Donation.objects.create(
            project=self.project,
            amount=Decimal('50.00'),
            payment_id='anon_payment_id',
            anonymous=True,
            email='anonymous@example.com'
        )
        self.assertTrue(anonymous_donation.anonymous)
        self.assertIsNone(anonymous_donation.donor)
        self.assertEqual(anonymous_donation.email, 'anonymous@example.com')

class FundAllocationModelTests(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States',
            organization='Test Organization',
            categories=['Education']
        )
        self.allocation = FundAllocation.objects.create(
            project=self.project,
            operational_costs=Decimal('10.00'),
            direct_aid=Decimal('80.00'),
            emergency_reserve=Decimal('10.00')
        )

    def test_fund_allocation_creation(self):
        self.assertEqual(self.allocation.operational_costs, Decimal('10.00'))
        self.assertEqual(self.allocation.direct_aid, Decimal('80.00'))
        self.assertEqual(self.allocation.emergency_reserve, Decimal('10.00'))

    def test_fund_allocation_str(self):
        self.assertEqual(
            str(self.allocation),
            'Fund allocation for Test Project'
        )

class ProjectAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States',
            organization='Test Organization',
            categories=['Education'],
            status='active'
        )
        self.url = reverse('project-list')
        self.detail_url = reverse('project-detail', args=[self.project.id])

    def test_get_projects_list(self):
        response = self.client.get(self.url)
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_project_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Project')
        self.assertEqual(response.data['organization'], 'Test Organization')

    def test_filter_projects_by_category(self):
        # Create another project with different category
        Project.objects.create(
            title='Health Project',
            description='Health Description',
            goal=Decimal('20000.00'),
            location='Global',
            organization='Health Org',
            categories=['Healthcare'],
            status='active'
        )
        
        response = self.client.get(f'{self.url}?category=Education')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')

    def test_filter_projects_by_location(self):
        # Create another project with different location
        Project.objects.create(
            title='Global Project',
            description='Global Description',
            goal=Decimal('30000.00'),
            location='Global',
            organization='Global Org',
            categories=['Education'],
            status='active'
        )
        
        response = self.client.get(f'{self.url}?location=United')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')

    @patch('stripe.PaymentIntent.create')
    def test_donate_to_project_authenticated(self, mock_stripe_create):
        mock_intent = MagicMock()
        mock_intent.id = 'test_intent_id'
        mock_intent.client_secret = 'test_client_secret'
        mock_stripe_create.return_value = mock_intent
        
        self.client.force_authenticate(user=self.user)
        url = reverse('project-donate', args=[self.project.id])
        data = {
            'amount': '100.00',
            'anonymous': False,
            'message': 'Test donation'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('client_secret', response.data)
        self.assertIn('donation_id', response.data)
        
        # Verify donation was created
        donation = Donation.objects.get(id=response.data['donation_id'])
        self.assertEqual(donation.amount, Decimal('100.00'))
        self.assertEqual(donation.project, self.project)
        self.assertEqual(donation.donor, self.user)
        self.assertEqual(donation.payment_id, 'test_intent_id')

    @patch('stripe.PaymentIntent.create')
    def test_donate_to_project_anonymous(self, mock_stripe_create):
        mock_intent = MagicMock()
        mock_intent.id = 'test_intent_id'
        mock_intent.client_secret = 'test_client_secret'
        mock_stripe_create.return_value = mock_intent
        
        url = reverse('project-donate', args=[self.project.id])
        data = {
            'amount': '50.00',
            'anonymous': True,
            'message': 'Anonymous donation',
            'email': 'donor@example.com'
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify donation was created
        donation = Donation.objects.get(id=response.data['donation_id'])
        self.assertEqual(donation.amount, Decimal('50.00'))
        self.assertEqual(donation.project, self.project)
        self.assertIsNone(donation.donor)
        self.assertTrue(donation.anonymous)
        self.assertEqual(donation.email, 'donor@example.com')

class DonationAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='adminuser',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States',
            organization='Test Organization',
            categories=['Education']
        )
        self.donation = Donation.objects.create(
            project=self.project,
            donor=self.user,
            amount=Decimal('100.00'),
            payment_id='test_payment_id'
        )
        self.url = reverse('donation-list')
        self.detail_url = reverse('donation-detail', args=[self.donation.id])

    def test_get_user_donations(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.donation.id)

    def test_admin_can_see_all_donations(self):
        # Create another donation from a different user
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        other_donation = Donation.objects.create(
            project=self.project,
            donor=other_user,
            amount=Decimal('200.00'),
            payment_id='other_payment_id'
        )
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    @patch('stripe.PaymentIntent.retrieve')
    def test_confirm_donation_payment(self, mock_stripe_retrieve):
        mock_payment_intent = MagicMock()
        mock_payment_intent.status = 'succeeded'
        mock_stripe_retrieve.return_value = mock_payment_intent
        
        self.client.force_authenticate(user=self.user)
        url = reverse('donation-confirm-payment', args=[self.donation.id])
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.donation.refresh_from_db()
        self.assertEqual(self.donation.status, 'completed')
        
        # Check that project raised amount was updated
        self.project.refresh_from_db()
        self.assertEqual(self.project.raised, Decimal('100.00'))

    @patch('stripe.Webhook.construct_event')
    def test_webhook_payment_succeeded(self, mock_construct_event):
        # Create a donation with pending status
        donation = Donation.objects.create(
            project=self.project,
            amount=Decimal('150.00'),
            payment_id='webhook_payment_id',
            status='pending'
        )
        
        # Mock the webhook event
        event_data = {
            'type': 'payment_intent.succeeded',
            'data': {
                'object': {
                    'id': 'webhook_payment_id',
                    'status': 'succeeded'
                }
            }
        }
        mock_construct_event.return_value = event_data
        
        url = reverse('stripe-webhook')
        response = self.client.post(
            url, 
            data=json.dumps(event_data),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='test_signature'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify donation status was updated
        donation.refresh_from_db()
        self.assertEqual(donation.status, 'completed')

class SerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            goal=Decimal('10000.00'),
            location='United States, California',
            organization='Test Organization',
            categories=['Education', 'Technology'],
            status='active'
        )
        self.fund_allocation = FundAllocation.objects.create(
            project=self.project,
            operational_costs=Decimal('15.00'),
            direct_aid=Decimal('75.00'),
            emergency_reserve=Decimal('10.00')
        )
        self.donation = Donation.objects.create(
            project=self.project,
            donor=self.user,
            amount=Decimal('100.00'),
            payment_id='test_payment_id',
            status='completed'
        )

    def test_project_serializer(self):
        serializer = ProjectSerializer(self.project)
        data = serializer.data
        
        self.assertEqual(data['title'], 'Test Project')
        self.assertEqual(data['organization'], 'Test Organization')
        self.assertEqual(data['categories'], ['Education', 'Technology'])
        self.assertEqual(data['categories_display'], 'Education | Technology')
        self.assertEqual(data['location_display'], 'United States | California')
        self.assertEqual(data['progress_percentage'], 1.0)  # 100/10000 = 1%
        self.assertEqual(data['total_donors'], 1)
        
        # Check fund allocation data
        self.assertEqual(data['fund_allocation']['operational_costs'], '15.00')
        self.assertEqual(data['fund_allocation']['direct_aid'], '75.00')
        self.assertEqual(data['fund_allocation']['emergency_reserve'], '10.00')

    def test_donation_serializer(self):
        serializer = DonationSerializer(self.donation)
        data = serializer.data
        
        self.assertEqual(data['amount'], '100.00')
        self.assertEqual(data['status'], 'completed')
        self.assertEqual(data['donor_name'], 'testuser')
        self.assertEqual(data['project_title'], 'Test Project')
        self.assertEqual(data['project_organization'], 'Test Organization')
        
        # Test anonymous donation
        anonymous_donation = Donation.objects.create(
            project=self.project,
            amount=Decimal('50.00'),
            payment_id='anon_payment_id',
            anonymous=True
        )
        anon_serializer = DonationSerializer(anonymous_donation)
        self.assertEqual(anon_serializer.data['donor_name'], 'Anonymous')

class CartItemTests(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        # Create test nonprofit
        self.nonprofit = Nonprofit.objects.create(
            name='Test Nonprofit',
            description='Test nonprofit for cart items',
            mission='Test mission',
            logo='test_logo.jpg',
            website='https://testnonprofit.org',
            email='contact@testnonprofit.org',
            is_verified=True
        )
        
        # Create test gift card
        self.gift_card = GiftCard.objects.create(
            code='TESTGIFT123',
            amount=50.00,
            is_redeemed=False,
            expiration_date=timezone.now() + timezone.timedelta(days=30)
        )
        
        # Create test cart item
        self.cart_item = CartItem.objects.create(
            user=self.user,
            nonprofit=self.nonprofit,
            amount=25.00,
            quantity=2,
            is_recurring=False
        )
        
        # URL for cart API
        self.cart_url = reverse('cart-list')
        self.cart_detail_url = reverse('cart-detail', args=[self.cart_item.id])
        self.checkout_url = reverse('cart-checkout')
        self.add_gift_card_url = reverse('cart-add-gift-card')
        
    def test_get_cart_items_authenticated(self):
        """Test retrieving cart items for authenticated user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.cart_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nonprofit'], self.nonprofit.id)
        self.assertEqual(float(response.data[0]['amount']), 25.00)
        self.assertEqual(response.data[0]['quantity'], 2)
    
    def test_create_cart_item_authenticated(self):
        """Test creating a cart item for authenticated user"""
        self.client.force_authenticate(user=self.user)
        data = {
            'nonprofit': self.nonprofit.id,
            'amount': 30.00,
            'quantity': 1,
            'is_recurring': True,
            'recurring_frequency': 'monthly'
        }
        
        response = self.client.post(self.cart_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CartItem.objects.count(), 2)
        self.assertEqual(float(response.data['amount']), 30.00)
        self.assertEqual(response.data['is_recurring'], True)
        self.assertEqual(response.data['recurring_frequency'], 'monthly')
    
    def test_create_cart_item_anonymous(self):
        """Test creating a cart item for anonymous user with session ID"""
        session_id = 'test_session_123'
        data = {
            'nonprofit': self.nonprofit.id,
            'amount': 15.00,
            'quantity': 3,
            'session_id': session_id
        }
        
        response = self.client.post(self.cart_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CartItem.objects.filter(session_id=session_id).count(), 1)
        self.assertEqual(float(response.data['amount']), 15.00)
        self.assertEqual(response.data['quantity'], 3)
    
    def test_update_cart_item(self):
        """Test updating a cart item"""
        self.client.force_authenticate(user=self.user)
        data = {
            'quantity': 4,
            'is_recurring': True,
            'recurring_frequency': 'quarterly'
        }
        
        response = self.client.patch(self.cart_detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cart_item.refresh_from_db()
        self.assertEqual(self.cart_item.quantity, 4)
        self.assertEqual(self.cart_item.is_recurring, True)
        self.assertEqual(self.cart_item.recurring_frequency, 'quarterly')
    
    def test_delete_cart_item(self):
        """Test deleting a cart item"""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.cart_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)
    
    @patch('stripe.PaymentIntent.create')
    def test_checkout_cart(self, mock_stripe_create):
        """Test checkout process for cart items"""
        self.client.force_authenticate(user=self.user)
        
        # Mock Stripe PaymentIntent.create response
        mock_intent = MagicMock()
        mock_intent.id = 'test_intent_id'
        mock_intent.client_secret = 'test_client_secret'
        mock_stripe_create.return_value = mock_intent
        
        data = {
            'payment_method': 'card'
        }
        
        response = self.client.post(self.checkout_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['client_secret'], 'test_client_secret')
        self.assertEqual(len(response.data['donation_ids']), 1)
        
        # Check that cart items are cleared after checkout
        self.assertEqual(CartItem.objects.count(), 0)
        
        # Check that donation was created with correct data
        donation = Donation.objects.get(id=response.data['donation_ids'][0])
        self.assertEqual(donation.donor, self.user)
        self.assertEqual(donation.nonprofit, self.nonprofit)
        self.assertEqual(float(donation.amount), 50.00)  # 25 × 2
        self.assertEqual(donation.payment_id, 'test_intent_id')
        self.assertEqual(donation.status, 'pending')
    
    def test_add_gift_card_to_cart(self):
        """Test adding a gift card to cart items"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'gift_card_code': 'TESTGIFT123'
        }
        
        response = self.client.post(self.add_gift_card_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], True)
        self.assertEqual(float(response.data['amount']), 50.00)
        
        # Check that gift card was applied to cart item
        self.cart_item.refresh_from_db()
        self.assertEqual(self.cart_item.gift_card, self.gift_card)
    
    def test_add_invalid_gift_card(self):
        """Test adding an invalid gift card to cart"""
        self.client.force_authenticate(user=self.user)
        
        data = {
            'gift_card_code': 'INVALID123'
        }
        
        response = self.client.post(self.add_gift_card_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data) 