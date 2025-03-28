from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from datetime import date, timedelta
from decimal import Decimal
from .models import DisasterCategory, DisasterProject, DisasterDonation, EmergencyResource

class DisasterCategoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create test categories
        self.category1 = DisasterCategory.objects.create(
            name='Earthquake',
            description='Earthquake relief efforts',
            icon='earthquake'
        )
        
        self.category2 = DisasterCategory.objects.create(
            name='Hurricane',
            description='Hurricane relief efforts',
            icon='hurricane'
        )
        
        # URLs
        self.categories_url = reverse('disastercategory-list')
    
    def test_get_all_categories(self):
        """Test retrieving all disaster categories"""
        response = self.client.get(self.categories_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_get_category_detail(self):
        """Test retrieving a specific category by slug"""
        response = self.client.get(reverse('disastercategory-detail', kwargs={'slug': self.category1.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Earthquake')

class DisasterProjectTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create test category
        self.category = DisasterCategory.objects.create(
            name='Earthquake',
            description='Earthquake relief efforts',
            icon='earthquake'
        )
        
        # Create test projects
        self.project1 = DisasterProject.objects.create(
            title='Emergency Response Fund',
            description='Supporting immediate relief efforts worldwide',
            category=self.category,
            status='active',
            funding_goal=Decimal('1000000.00'),
            funds_raised=Decimal('750000.00'),
            start_date=date.today(),
            featured=True
        )
        
        self.project2 = DisasterProject.objects.create(
            title='Earthquake Relief',
            description='Providing emergency aid to communities',
            category=self.category,
            status='active',
            funding_goal=Decimal('500000.00'),
            funds_raised=Decimal('300000.00'),
            start_date=date.today(),
            featured=False
        )
        
        self.project3 = DisasterProject.objects.create(
            title='Hurricane Recovery',
            description='Supporting long-term recovery efforts',
            category=self.category,
            status='completed',
            funding_goal=Decimal('500000.00'),
            funds_raised=Decimal('500000.00'),
            start_date=date.today() - timedelta(days=30),
            end_date=date.today() - timedelta(days=5),
            featured=False
        )
        
        # URLs
        self.projects_url = reverse('disasterproject-list')
    
    def test_get_all_projects(self):
        """Test retrieving all disaster projects"""
        response = self.client.get(self.projects_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)
    
    def test_filter_active_projects(self):
        """Test filtering active projects"""
        response = self.client.get(f"{self.projects_url}?active=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_filter_featured_projects(self):
        """Test filtering featured projects"""
        response = self.client.get(f"{self.projects_url}?featured=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Emergency Response Fund')
    
    def test_get_project_detail(self):
        """Test retrieving a specific project by slug"""
        response = self.client.get(reverse('disasterproject-detail', kwargs={'slug': self.project1.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Emergency Response Fund')
        self.assertEqual(response.data['progress_percentage'], 75)
    
    def test_project_stats(self):
        """Test retrieving project statistics"""
        response = self.client.get(f"{self.projects_url}stats/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_projects'], 3)
        self.assertEqual(response.data['active_projects'], 2)
        self.assertEqual(float(response.data['total_raised']), 1550000.00)

class DisasterDonationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create test category and project
        self.category = DisasterCategory.objects.create(
            name='Earthquake',
            description='Earthquake relief efforts',
            icon='earthquake'
        )
        
        self.project = DisasterProject.objects.create(
            title='Emergency Response Fund',
            description='Supporting immediate relief efforts worldwide',
            category=self.category,
            status='active',
            funding_goal=Decimal('1000000.00'),
            funds_raised=Decimal('0.00'),
            start_date=date.today(),
            featured=True
        )
        
        # URLs
        self.donations_url = reverse('disasterdonation-list')
        self.project_donate_url = f"/api/disasters/projects/{self.project.slug}/donate/"
        
        # Test donation data
        self.valid_donation_data = {
            'amount': '100.00',
            'donor_name': 'Test Donor',
            'donor_email': 'test@example.com',
            'anonymous': False,
            'message': 'Test donation message'
        }
    
    def test_create_donation_anonymous(self):
        """Test creating a donation as anonymous user"""
        initial_funds = self.project.funds_raised
        
        response = self.client.post(self.project_donate_url, self.valid_donation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Refresh project from database
        self.project.refresh_from_db()
        
        # Check if funds_raised was updated
        self.assertEqual(self.project.funds_raised, initial_funds + Decimal('100.00'))
        
        # Check if donation was created
        self.assertEqual(DisasterDonation.objects.count(), 1)
        donation = DisasterDonation.objects.first()
        self.assertEqual(donation.amount, Decimal('100.00'))
        self.assertEqual(donation.donor_name, 'Test Donor')
    
    def test_list_donations_anonymous(self):
        """Test that anonymous users cannot list donations"""
        response = self.client.get(self.donations_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_donations_admin(self):
        """Test that admin users can list donations"""
        # Create a test donation
        DisasterDonation.objects.create(
            project=self.project,
            amount=Decimal('100.00'),
            donor_name='Test Donor',
            donor_email='test@example.com'
        )
        
        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(self.donations_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_invalid_donation_data(self):
        """Test creating a donation with invalid data"""
        invalid_data = {
            'amount': '-50.00',  # Negative amount
            'donor_name': 'Test Donor',
            'donor_email': 'invalid-email',  # Invalid email
            'message': 'Test message'
        }
        
        response = self.client.post(self.project_donate_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class EmergencyResourceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create test resources
        self.resource1 = EmergencyResource.objects.create(
            title='Earthquake Safety Tips',
            description='What to do during an earthquake',
            content='Detailed safety instructions...',
            source='Red Cross',
            source_url='https://redcross.org/earthquake-safety',
            order=1
        )
        
        self.resource2 = EmergencyResource.objects.create(
            title='Hurricane Preparedness',
            description='How to prepare for a hurricane',
            content='Detailed preparedness instructions...',
            source='FEMA',
            source_url='https://fema.gov/hurricane-prep',
            order=2
        )
        
        # URLs
        self.resources_url = reverse('emergencyresource-list')
    
    def test_get_all_resources(self):
        """Test retrieving all emergency resources"""
        response = self.client.get(self.resources_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_resources_ordered_by_order_field(self):
        """Test that resources are ordered by the order field"""
        response = self.client.get(self.resources_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['title'], 'Earthquake Safety Tips')
        self.assertEqual(response.data['results'][1]['title'], 'Hurricane Preparedness')
    
    def test_get_resource_detail(self):
        """Test retrieving a specific resource by slug"""
        response = self.client.get(reverse('emergencyresource-detail', kwargs={'slug': self.resource1.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Earthquake Safety Tips')
        self.assertEqual(response.data['source'], 'Red Cross')
