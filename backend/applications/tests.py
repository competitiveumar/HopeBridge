from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import FocusArea, OrganizationType, Application, ApplicationStatusHistory

User = get_user_model()

class FocusAreaModelTest(TestCase):
    """Test module for FocusArea model."""
    
    def setUp(self):
        FocusArea.objects.create(
            name="Education",
            description="Educational initiatives and programs",
            is_active=True
        )
        FocusArea.objects.create(
            name="Health",
            description="Health and wellness programs",
            is_active=False
        )
    
    def test_focus_area_str(self):
        """Test the string representation of FocusArea."""
        focus_area = FocusArea.objects.get(name="Education")
        self.assertEqual(str(focus_area), "Education")
    
    def test_focus_area_ordering(self):
        """Test that focus areas are ordered by name."""
        focus_areas = list(FocusArea.objects.all())
        self.assertEqual(focus_areas[0].name, "Education")
        self.assertEqual(focus_areas[1].name, "Health")


class OrganizationTypeModelTest(TestCase):
    """Test module for OrganizationType model."""
    
    def setUp(self):
        OrganizationType.objects.create(
            name="Nonprofit Organization (501c3)",
            description="A 501(c)(3) nonprofit organization",
            is_active=True
        )
        OrganizationType.objects.create(
            name="Public Charity",
            description="A public charity organization",
            is_active=False
        )
    
    def test_organization_type_str(self):
        """Test the string representation of OrganizationType."""
        org_type = OrganizationType.objects.get(name="Nonprofit Organization (501c3)")
        self.assertEqual(str(org_type), "Nonprofit Organization (501c3)")
    
    def test_organization_type_ordering(self):
        """Test that organization types are ordered by name."""
        org_types = list(OrganizationType.objects.all())
        self.assertEqual(org_types[0].name, "Nonprofit Organization (501c3)")
        self.assertEqual(org_types[1].name, "Public Charity")


class ApplicationModelTest(TestCase):
    """Test module for Application model."""
    
    def setUp(self):
        # Create focus areas and organization types
        self.focus_area = FocusArea.objects.create(
            name="Education",
            description="Educational initiatives and programs",
            is_active=True
        )
        self.org_type = OrganizationType.objects.create(
            name="Nonprofit Organization (501c3)",
            description="A 501(c)(3) nonprofit organization",
            is_active=True
        )
        
        # Create an application
        self.application = Application.objects.create(
            organization_name="Test Organization",
            email="org@example.com",
            phone="123-456-7890",
            website="https://example.com",
            address="123 Main St",
            city="Anytown",
            state="CA",
            zip_code="12345",
            organization_type=self.org_type,
            tax_id_number="12-3456789",
            founding_year=2000,
            mission_statement="Our mission is to help people.",
            description="This is a detailed description of our organization that is definitely more than 50 characters long.",
            contact_first_name="John",
            contact_last_name="Doe",
            contact_email="john.doe@example.com",
            contact_phone="987-654-3210",
            contact_position="Executive Director",
            primary_focus_area=self.focus_area,
            annual_budget="$100,000 - $250,000",
            staff_size=10,
            has_volunteers=True,
            volunteer_count=20,
            additional_information="Additional information about our organization.",
            status="pending"
        )
    
    def test_application_str(self):
        """Test the string representation of Application."""
        self.assertEqual(
            str(self.application),
            "Test Organization - Pending Review"
        )
    
    def test_application_status_change(self):
        """Test that reviewed_at is set when status changes from pending."""
        self.assertIsNone(self.application.reviewed_at)
        
        # Change status from pending to under_review
        self.application.status = "under_review"
        self.application.save()
        
        # Refresh from database
        self.application.refresh_from_db()
        
        # Check that reviewed_at is set
        self.assertIsNotNone(self.application.reviewed_at)
    
    def test_application_ordering(self):
        """Test that applications are ordered by submitted_at in descending order."""
        # Create another application
        Application.objects.create(
            organization_name="Another Organization",
            email="another@example.com",
            phone="123-456-7890",
            address="456 Oak St",
            city="Othertown",
            state="NY",
            zip_code="54321",
            organization_type=self.org_type,
            tax_id_number="98-7654321",
            founding_year=2010,
            mission_statement="Another mission statement.",
            description="This is a detailed description of another organization that is definitely more than 50 characters long.",
            contact_first_name="Jane",
            contact_last_name="Smith",
            contact_email="jane.smith@example.com",
            contact_phone="123-456-7890",
            contact_position="Director",
            primary_focus_area=self.focus_area,
            annual_budget="$50,000 - $100,000",
            staff_size=5,
            status="pending"
        )
        
        applications = list(Application.objects.all())
        self.assertEqual(applications[0].organization_name, "Another Organization")
        self.assertEqual(applications[1].organization_name, "Test Organization")


class ApplicationStatusHistoryModelTest(TestCase):
    """Test module for ApplicationStatusHistory model."""
    
    def setUp(self):
        # Create focus areas and organization types
        self.focus_area = FocusArea.objects.create(
            name="Education",
            description="Educational initiatives and programs",
            is_active=True
        )
        self.org_type = OrganizationType.objects.create(
            name="Nonprofit Organization (501c3)",
            description="A 501(c)(3) nonprofit organization",
            is_active=True
        )
        
        # Create an application
        self.application = Application.objects.create(
            organization_name="Test Organization",
            email="org@example.com",
            phone="123-456-7890",
            address="123 Main St",
            city="Anytown",
            state="CA",
            zip_code="12345",
            organization_type=self.org_type,
            tax_id_number="12-3456789",
            founding_year=2000,
            mission_statement="Our mission is to help people.",
            description="This is a detailed description of our organization that is definitely more than 50 characters long.",
            contact_first_name="John",
            contact_last_name="Doe",
            contact_email="john.doe@example.com",
            contact_phone="987-654-3210",
            contact_position="Executive Director",
            primary_focus_area=self.focus_area,
            annual_budget="$100,000 - $250,000",
            staff_size=10,
            status="pending"
        )
        
        # Create a status history entry
        self.status_history = ApplicationStatusHistory.objects.create(
            application=self.application,
            status="under_review",
            notes="Application is now under review.",
            changed_by="Admin User"
        )
    
    def test_status_history_str(self):
        """Test the string representation of ApplicationStatusHistory."""
        self.assertIn("Test Organization - Under Review", str(self.status_history))
    
    def test_status_history_ordering(self):
        """Test that status history entries are ordered by changed_at in descending order."""
        # Create another status history entry
        ApplicationStatusHistory.objects.create(
            application=self.application,
            status="approved",
            notes="Application has been approved.",
            changed_by="Admin User"
        )
        
        status_history_entries = list(ApplicationStatusHistory.objects.all())
        self.assertEqual(status_history_entries[0].status, "approved")
        self.assertEqual(status_history_entries[1].status, "under_review")


class FocusAreaAPITest(APITestCase):
    """Test module for FocusArea API."""
    
    def setUp(self):
        # Create focus areas
        FocusArea.objects.create(
            name="Education",
            description="Educational initiatives and programs",
            is_active=True
        )
        FocusArea.objects.create(
            name="Health",
            description="Health and wellness programs",
            is_active=True
        )
        FocusArea.objects.create(
            name="Environment",
            description="Environmental conservation programs",
            is_active=False  # Inactive, should not be returned
        )
    
    def test_get_all_focus_areas(self):
        """Test getting all active focus areas."""
        url = reverse('focusarea-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only active focus areas
        self.assertEqual(response.data[0]['name'], 'Education')
        self.assertEqual(response.data[1]['name'], 'Health')


class OrganizationTypeAPITest(APITestCase):
    """Test module for OrganizationType API."""
    
    def setUp(self):
        # Create organization types
        OrganizationType.objects.create(
            name="Nonprofit Organization (501c3)",
            description="A 501(c)(3) nonprofit organization",
            is_active=True
        )
        OrganizationType.objects.create(
            name="Public Charity",
            description="A public charity organization",
            is_active=True
        )
        OrganizationType.objects.create(
            name="Private Foundation",
            description="A private foundation",
            is_active=False  # Inactive, should not be returned
        )
    
    def test_get_all_organization_types(self):
        """Test getting all active organization types."""
        url = reverse('organizationtype-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only active organization types
        self.assertEqual(response.data[0]['name'], 'Nonprofit Organization (501c3)')
        self.assertEqual(response.data[1]['name'], 'Public Charity')


class ApplicationAPITest(APITestCase):
    """Test module for Application API."""
    
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        
        # Create an admin user
        self.admin_user = User.objects.create_user(
            username='adminuser',
            email='adminuser@example.com',
            password='adminpassword',
            is_staff=True
        )
        
        # Create focus areas and organization types
        self.focus_area = FocusArea.objects.create(
            name="Education",
            description="Educational initiatives and programs",
            is_active=True
        )
        self.org_type = OrganizationType.objects.create(
            name="Nonprofit Organization (501c3)",
            description="A 501(c)(3) nonprofit organization",
            is_active=True
        )
        
        # Create an application
        self.application = Application.objects.create(
            organization_name="Test Organization",
            email="org@example.com",
            phone="123-456-7890",
            website="https://example.com",
            address="123 Main St",
            city="Anytown",
            state="CA",
            zip_code="12345",
            organization_type=self.org_type,
            tax_id_number="12-3456789",
            founding_year=2000,
            mission_statement="Our mission is to help people.",
            description="This is a detailed description of our organization that is definitely more than 50 characters long.",
            contact_first_name="John",
            contact_last_name="Doe",
            contact_email="testuser@example.com",  # Match the user's email
            contact_phone="987-654-3210",
            contact_position="Executive Director",
            primary_focus_area=self.focus_area,
            annual_budget="$100,000 - $250,000",
            staff_size=10,
            has_volunteers=True,
            volunteer_count=20,
            additional_information="Additional information about our organization.",
            status="pending"
        )
        
        # Create another application with a different contact email
        self.other_application = Application.objects.create(
            organization_name="Another Organization",
            email="another@example.com",
            phone="123-456-7890",
            address="456 Oak St",
            city="Othertown",
            state="NY",
            zip_code="54321",
            organization_type=self.org_type,
            tax_id_number="98-7654321",
            founding_year=2010,
            mission_statement="Another mission statement.",
            description="This is a detailed description of another organization that is definitely more than 50 characters long.",
            contact_first_name="Jane",
            contact_last_name="Smith",
            contact_email="jane.smith@example.com",  # Different email
            contact_phone="123-456-7890",
            contact_position="Director",
            primary_focus_area=self.focus_area,
            annual_budget="$50,000 - $100,000",
            staff_size=5,
            status="pending"
        )
        
        # Set up the API client
        self.client = APIClient()
    
    def test_create_application(self):
        """Test creating a new application."""
        url = reverse('application-list')
        data = {
            "organization_name": "New Organization",
            "email": "new@example.com",
            "phone": "123-456-7890",
            "website": "https://new-example.com",
            "address": "789 Pine St",
            "city": "Newtown",
            "state": "CA",
            "zip_code": "67890",
            "organization_type": "Nonprofit Organization (501c3)",
            "tax_id_number": "45-6789012",
            "founding_year": 2015,
            "mission_statement": "Our mission is to make a difference.",
            "description": "This is a detailed description of our new organization that is definitely more than 50 characters long.",
            "contact_first_name": "Alice",
            "contact_last_name": "Johnson",
            "contact_email": "alice.johnson@example.com",
            "contact_phone": "123-456-7890",
            "contact_position": "CEO",
            "primary_focus_area": "Education",
            "secondary_focus_areas": [],
            "annual_budget": "$50,000 - $100,000",
            "staff_size": 3,
            "has_volunteers": False,
            "additional_information": ""
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 3)
        self.assertEqual(Application.objects.get(organization_name="New Organization").status, "pending")
    
    def test_get_applications_as_anonymous(self):
        """Test that anonymous users cannot list applications."""
        url = reverse('application-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_applications_as_user(self):
        """Test that authenticated users can only see their own applications."""
        url = reverse('application-list')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only the user's application
        self.assertEqual(response.data[0]['organization_name'], 'Test Organization')
    
    def test_get_applications_as_admin(self):
        """Test that admin users can see all applications."""
        url = reverse('application-list')
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # All applications
    
    def test_get_application_detail_as_owner(self):
        """Test that users can view their own application details."""
        url = reverse('application-detail', kwargs={'pk': self.application.pk})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['organization_name'], 'Test Organization')
    
    def test_get_application_detail_as_non_owner(self):
        """Test that users cannot view other users' application details."""
        url = reverse('application-detail', kwargs={'pk': self.other_application.pk})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_approve_application_as_admin(self):
        """Test that admin users can approve applications."""
        url = reverse('application-approve', kwargs={'pk': self.application.pk})
        self.client.force_authenticate(user=self.admin_user)
        data = {"notes": "Application approved."}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'approved')
        
        # Check that a status history entry was created
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'approved')
        self.assertEqual(self.application.status_history.count(), 1)
        self.assertEqual(self.application.status_history.first().status, 'approved')
    
    def test_approve_application_as_user(self):
        """Test that regular users cannot approve applications."""
        url = reverse('application-approve', kwargs={'pk': self.application.pk})
        self.client.force_authenticate(user=self.user)
        data = {"notes": "Application approved."}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Check that the application status was not changed
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'pending')
        self.assertEqual(self.application.status_history.count(), 0) 