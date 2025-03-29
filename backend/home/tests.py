from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Campaign, Testimonial, ImpactStatistic, CorporatePartner, NewsItem, Project
import json

User = get_user_model()

class HomeAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
        
        # Create test admin user
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            password='adminpassword123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Create test campaigns
        self.campaign1 = Campaign.objects.create(
            title='Clean Water Initiative',
            description='Providing clean water to communities in need across Africa.',
            image='/images/campaigns/water.jpg',
            raised=12500,
            goal=25000,
            days_left=15,
            is_featured=True
        )
        
        self.campaign2 = Campaign.objects.create(
            title='Education for All',
            description='Supporting education for underprivileged children worldwide.',
            image='/images/campaigns/education.jpg',
            raised=18000,
            goal=30000,
            days_left=22,
            is_featured=True
        )
        
        # Create test testimonials
        self.testimonial1 = Testimonial.objects.create(
            name='Sarah Johnson',
            role='Regular Donor',
            quote='HopeBridge has made it so easy for me to contribute to causes I care about.',
            avatar='/images/testimonials/sarah.jpg'
        )
        
        self.testimonial2 = Testimonial.objects.create(
            name='Michael Chen',
            role='Volunteer',
            quote='Volunteering with HopeBridge has been one of the most rewarding experiences of my life.',
            avatar='/images/testimonials/michael.jpg'
        )
        
        # Create test impact statistics
        self.impact_stat1 = ImpactStatistic.objects.create(
            title='Years',
            value='24+',
            icon='calendar'
        )
        
        self.impact_stat2 = ImpactStatistic.objects.create(
            title='Donors',
            value='35,000',
            icon='people'
        )
        
        # Create test corporate partners
        self.partner1 = CorporatePartner.objects.create(
            name='3M',
            logo='/images/partners/3m.png',
            website='https://www.3m.com'
        )
        
        self.partner2 = CorporatePartner.objects.create(
            name='AMD',
            logo='/images/partners/amd.png',
            website='https://www.amd.com'
        )
        
        # Create test news items
        self.news1 = NewsItem.objects.create(
            title='Press Book',
            description='Explore stories from around the world written by the HopeBridge community.',
            image='/images/news/press.jpg',
            link='/news/press-book'
        )
        
        self.news2 = NewsItem.objects.create(
            title='Give + Get Matched',
            description='This Giving Tuesday, your favorite causes get even more love.',
            image='/images/news/giving-tuesday.jpg',
            link='/news/giving-tuesday'
        )
        
        # Create test projects
        self.project1 = Project.objects.create(
            title='Education for Rural Children',
            description='Providing quality education to children in remote villages.',
            image='/images/projects/education.jpg',
            raised=15000,
            goal=20000,
            days_left=30,
            category='Education',
            location='Rural India',
            theme='Children'
        )
        
        self.project2 = Project.objects.create(
            title='Clean Water Initiative',
            description='Bringing clean water to communities in need.',
            image='/images/projects/water.jpg',
            raised=8000,
            goal=12000,
            days_left=15,
            category='Environment',
            location='Kenya',
            theme='Water'
        )

    def test_get_featured_campaigns(self):
        """Test retrieving featured campaigns"""
        url = reverse('api-featured-campaigns')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], 'Clean Water Initiative')
        self.assertEqual(response.data[1]['title'], 'Education for All')

    def test_get_testimonials(self):
        """Test retrieving testimonials"""
        url = reverse('api-testimonials')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Sarah Johnson')
        self.assertEqual(response.data[1]['name'], 'Michael Chen')

    def test_get_impact_statistics(self):
        """Test retrieving impact statistics"""
        url = reverse('api-impact-statistics')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], 'Years')
        self.assertEqual(response.data[1]['title'], 'Donors')

    def test_get_corporate_partners(self):
        """Test retrieving corporate partners"""
        url = reverse('api-corporate-partners')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], '3M')
        self.assertEqual(response.data[1]['name'], 'AMD')

    def test_get_news_items(self):
        """Test retrieving news items"""
        url = reverse('api-news-items')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], 'Press Book')
        self.assertEqual(response.data[1]['title'], 'Give + Get Matched')

    def test_search_projects(self):
        """Test searching projects"""
        url = reverse('api-search-projects')
        response = self.client.get(url, {'query': 'education'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Education for Rural Children')
        
        # Test with category filter
        response = self.client.get(url, {'category': 'Education'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Education for Rural Children')
        
        # Test with location filter
        response = self.client.get(url, {'location': 'Kenya'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Clean Water Initiative')
        
        # Test with theme filter
        response = self.client.get(url, {'theme': 'Water'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Clean Water Initiative')

    def test_process_donation(self):
        """Test processing a donation"""
        url = reverse('api-process-donation')
        data = {
            'amount': '50',
            'project_id': self.project1.id,
            'payment_method': 'credit_card',
            'name': 'John Donor',
            'email': 'john@example.com'
        }
        
        # Login as regular user
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Donation processed successfully')
        
        # Verify project raised amount was updated
        self.project1.refresh_from_db()
        self.assertEqual(self.project1.raised, 15050)  # 15000 + 50

    def test_newsletter_subscription(self):
        """Test newsletter subscription"""
        url = reverse('api-newsletter-subscribe')
        data = {
            'email': 'subscriber@example.com'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Subscription successful')

    def test_chatbot_message(self):
        """Test chatbot message API"""
        url = reverse('api-chatbot-message')
        data = {
            'message': 'How can I donate?'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('options', response.data)

    def test_admin_create_campaign(self):
        """Test admin creating a new campaign"""
        url = reverse('api-campaigns')
        data = {
            'title': 'New Test Campaign',
            'description': 'This is a test campaign created by admin',
            'image': '/images/campaigns/test.jpg',
            'goal': 50000,
            'days_left': 30,
            'is_featured': True
        }
        
        # Try without authentication
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try with regular user
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try with admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Test Campaign')

    def test_admin_update_campaign(self):
        """Test admin updating an existing campaign"""
        url = reverse('api-campaign-detail', args=[self.campaign1.id])
        data = {
            'title': 'Updated Campaign Title',
            'description': self.campaign1.description,
            'image': self.campaign1.image,
            'goal': self.campaign1.goal,
            'days_left': self.campaign1.days_left,
            'is_featured': self.campaign1.is_featured
        }
        
        # Try without authentication
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try with regular user
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try with admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Campaign Title')
        
        # Verify the campaign was updated in the database
        self.campaign1.refresh_from_db()
        self.assertEqual(self.campaign1.title, 'Updated Campaign Title')

    def test_admin_delete_campaign(self):
        """Test admin deleting a campaign"""
        url = reverse('api-campaign-detail', args=[self.campaign1.id])
        
        # Try without authentication
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try with regular user
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Try with admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify the campaign was deleted from the database
        with self.assertRaises(Campaign.DoesNotExist):
            Campaign.objects.get(id=self.campaign1.id) 