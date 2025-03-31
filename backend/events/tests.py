from django.test import TestCase, SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
import json
from datetime import timedelta
from django.apps import apps

from .models import (
    EventCategory,
    Event,
    EventImage,
    EventRegistration,
    EventWorkshop,
    VolunteerPosition,
    VolunteerApplication
)

User = get_user_model()

class EventModelTests(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        
        # Create test category
        self.category = EventCategory.objects.create(
            name='Test Category',
            description='A test category'
        )
        
        # Create test event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test description',
            status='upcoming',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=7),
            location='Test Location',
            organizer=self.user,
            tags='TEST,CHALLENGE'
        )
        
        # Add category to event
        self.event.categories.add(self.category)
    
    def test_event_creation(self):
        self.assertEqual(self.event.title, 'Test Event')
        self.assertTrue(self.event.slug)  # Slug should be auto-generated
        self.assertEqual(self.event.status, 'upcoming')
        self.assertEqual(self.event.location, 'Test Location')
        self.assertIn(self.category, self.event.categories.all())
    
    def test_get_tags_list(self):
        tags_list = self.event.get_tags_list()
        self.assertEqual(tags_list, ['TEST', 'CHALLENGE'])
        
        # Test with empty tags
        self.event.tags = ''
        self.event.save()
        self.assertEqual(self.event.get_tags_list(), [])
    
    def test_event_string_representation(self):
        self.assertEqual(str(self.event), self.event.title)


class EventAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regular123'
        )
        
        # Create test category
        self.category = EventCategory.objects.create(
            name='Test Category',
            description='A test category'
        )
        
        # Create test events
        self.event1 = Event.objects.create(
            title='Test Event 1',
            description='Test description 1',
            status='upcoming',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=7),
            location='Test Location 1',
            organizer=self.admin_user,
            tags='TEST,CHALLENGE'
        )
        
        self.event2 = Event.objects.create(
            title='Test Event 2',
            description='Test description 2',
            status='ongoing',
            start_date=timezone.now().date() - timedelta(days=1),
            end_date=timezone.now().date() + timedelta(days=5),
            location='Test Location 2',
            organizer=self.admin_user,
            is_virtual=True,
            tags='VIRTUAL,ONLINE'
        )
        
        # Add categories to events
        self.event1.categories.add(self.category)
        self.event2.categories.add(self.category)
    
    def test_list_events(self):
        """Test retrieving a list of events"""
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_filter_events_by_location(self):
        """Test filtering events by location"""
        url = reverse('event-list')
        response = self.client.get(url, {'location': 'Location 1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Event 1')
    
    def test_filter_events_by_type(self):
        """Test filtering events by type/tag"""
        url = reverse('event-list')
        response = self.client.get(url, {'event_type': 'VIRTUAL'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Event 2')
    
    def test_filter_events_by_date(self):
        """Test filtering events by date range"""
        # Create an event in the future
        Event.objects.create(
            title='Future Event',
            description='Future event description',
            status='upcoming',
            start_date=timezone.now().date() + timedelta(days=60),
            end_date=timezone.now().date() + timedelta(days=67),
            location='Future Location',
            organizer=self.admin_user
        )
        
        url = reverse('event-list')
        
        # Test filtering by this month
        response = self.client.get(url, {'date': 'this-month'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [event['title'] for event in response.data['results']]
        self.assertIn('Test Event 1', titles)
        self.assertIn('Test Event 2', titles)
        self.assertNotIn('Future Event', titles)
    
    def test_retrieve_event_detail(self):
        """Test retrieving a specific event"""
        url = reverse('event-detail', args=[self.event1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Event 1')
        self.assertEqual(response.data['location'], 'Test Location 1')
        self.assertIn('TEST', response.data['tags_list'])
    
    def test_create_event_authenticated(self):
        """Test creating an event when authenticated"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('event-list')
        
        data = {
            'title': 'New Test Event',
            'description': 'New test description',
            'status': 'upcoming',
            'start_date': timezone.now().date(),
            'end_date': timezone.now().date() + timedelta(days=14),
            'location': 'New Test Location',
            'organizer': self.admin_user.id,
            'tags': 'NEW,TEST'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 3)
        self.assertEqual(Event.objects.get(title='New Test Event').location, 'New Test Location')
    
    def test_create_event_unauthenticated(self):
        """Test creating an event when not authenticated"""
        url = reverse('event-list')
        
        data = {
            'title': 'New Test Event',
            'description': 'New test description',
            'status': 'upcoming',
            'start_date': timezone.now().date(),
            'end_date': timezone.now().date() + timedelta(days=14),
            'location': 'New Test Location',
            'organizer': self.admin_user.id,
            'tags': 'NEW,TEST'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Event.objects.count(), 2)
    
    def test_update_event(self):
        """Test updating an event"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('event-detail', args=[self.event1.id])
        
        data = {
            'title': 'Updated Test Event',
            'description': self.event1.description,
            'status': self.event1.status,
            'start_date': self.event1.start_date,
            'end_date': self.event1.end_date,
            'location': self.event1.location,
            'organizer': self.admin_user.id
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event1.refresh_from_db()
        self.assertEqual(self.event1.title, 'Updated Test Event')
    
    def test_register_for_event(self):
        """Test registering for an event"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('event-register', args=[self.event1.id])
        
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(EventRegistration.objects.filter(event=self.event1, user=self.regular_user).exists())


class WorkshopAndVolunteerTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regular123'
        )
        
        # Create test event
        self.event = Event.objects.create(
            title='Workshop Event',
            description='Test event with workshops and volunteer positions',
            status='upcoming',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timedelta(days=7),
            location='Test Location',
            organizer=self.admin_user
        )
        
        # Create test workshop
        self.workshop = EventWorkshop.objects.create(
            event=self.event,
            title='Test Workshop',
            description='A test workshop',
            start_time=timezone.now() + timedelta(days=2),
            end_time=timezone.now() + timedelta(days=2, hours=2),
            host=self.admin_user
        )
        
        # Create test volunteer position
        self.position = VolunteerPosition.objects.create(
            event=self.event,
            title='Test Position',
            description='A test volunteer position',
            slots=2
        )
    
    def test_list_workshops(self):
        """Test retrieving a list of workshops"""
        url = reverse('eventworkshop-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Workshop')
    
    def test_filter_workshops_by_event(self):
        """Test filtering workshops by event"""
        url = reverse('eventworkshop-list')
        response = self.client.get(url, {'event': self.event.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Workshop')
    
    def test_list_volunteer_positions(self):
        """Test retrieving a list of volunteer positions"""
        url = reverse('volunteerposition-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Position')
    
    def test_apply_for_volunteer_position(self):
        """Test applying for a volunteer position"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('volunteerposition-apply', args=[self.position.id])
        
        data = {
            'message': 'I would like to volunteer for this position.'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(VolunteerApplication.objects.filter(position=self.position, user=self.regular_user).exists())
    
    def test_apply_for_volunteer_position_unauthenticated(self):
        """Test applying for a volunteer position when not authenticated"""
        url = reverse('volunteerposition-apply', args=[self.position.id])
        
        data = {
            'message': 'I would like to volunteer for this position.'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(VolunteerApplication.objects.filter(position=self.position).exists())
    
    def test_apply_for_volunteer_position_twice(self):
        """Test applying for a volunteer position twice"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('volunteerposition-apply', args=[self.position.id])
        
        # Create an existing application
        VolunteerApplication.objects.create(
            position=self.position,
            user=self.regular_user,
            message='Existing application'
        )
        
        data = {
            'message': 'Second application.'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(VolunteerApplication.objects.filter(position=self.position, user=self.regular_user).count(), 1)


class EventsConfigTest(SimpleTestCase):
    """Tests for the events app configuration"""
    
    def test_app_config(self):
        """Test events app is correctly configured"""
        # Check if the app is installed
        self.assertTrue(apps.is_installed('events'), 
                      "Events app should be installed")
        
        # Check if the app config is correct
        app_config = apps.get_app_config('events')
        self.assertEqual(app_config.name, 'events')
        self.assertEqual(app_config.verbose_name, 'Events') 