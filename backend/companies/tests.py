from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CompanyPartnership, PartnershipApplication
from django.contrib.auth.models import User

class CompanyPartnershipTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # Create test partnerships
        self.partnership1 = CompanyPartnership.objects.create(
            name='Test Company 1',
            description='Test description 1',
            partnership_type='employee_giving',
            featured=True
        )
        
        self.partnership2 = CompanyPartnership.objects.create(
            name='Test Company 2',
            description='Test description 2',
            partnership_type='cause_marketing',
            featured=False
        )
        
        self.partnership3 = CompanyPartnership.objects.create(
            name='Test Company 3',
            description='Test description 3',
            partnership_type='disaster_response',
            featured=True
        )
        
        # URLs
        self.partnerships_url = reverse('companypartnership-list')
        self.applications_url = reverse('partnershipapplication-list')
    
    def test_get_all_partnerships(self):
        """Test retrieving all partnerships"""
        response = self.client.get(self.partnerships_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)
    
    def test_get_featured_partnerships(self):
        """Test retrieving featured partnerships"""
        response = self.client.get(f"{self.partnerships_url}?featured=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_filter_by_partnership_type(self):
        """Test filtering partnerships by type"""
        response = self.client.get(f"{self.partnerships_url}?type=employee_giving")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Company 1')
    
    def test_get_partnership_detail(self):
        """Test retrieving a specific partnership by slug"""
        response = self.client.get(reverse('companypartnership-detail', kwargs={'slug': self.partnership1.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Company 1')

class PartnershipApplicationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        # URL
        self.applications_url = reverse('partnershipapplication-list')
        
        # Test application data
        self.valid_application_data = {
            'company_name': 'Test Company',
            'contact_name': 'Test Contact',
            'email': 'test@example.com',
            'phone': '1234567890',
            'partnership_type': 'employee_giving',
            'message': 'Test message for partnership application'
        }
    
    def test_create_application_anonymous(self):
        """Test creating an application as anonymous user"""
        response = self.client.post(self.applications_url, self.valid_application_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PartnershipApplication.objects.count(), 1)
        self.assertEqual(PartnershipApplication.objects.get().company_name, 'Test Company')
    
    def test_list_applications_anonymous(self):
        """Test that anonymous users cannot list applications"""
        response = self.client.get(self.applications_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_applications_admin(self):
        """Test that admin users can list applications"""
        # Create a test application
        PartnershipApplication.objects.create(**self.valid_application_data)
        
        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(self.applications_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_invalid_application_data(self):
        """Test creating an application with invalid data"""
        invalid_data = {
            'company_name': '',  # Empty company name
            'contact_name': 'Test Contact',
            'email': 'invalid-email',  # Invalid email
            'partnership_type': 'invalid_type',  # Invalid partnership type
            'message': 'Test message'
        }
        
        response = self.client.post(self.applications_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 