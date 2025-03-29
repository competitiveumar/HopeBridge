from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import TeamMember, Testimonial, Partner, ImpactStat

class TeamMemberModelTest(TestCase):
    """Test module for TeamMember model."""
    
    def setUp(self):
        TeamMember.objects.create(
            name="John Doe",
            role="CEO",
            bio="John has over 10 years of experience in the non-profit sector.",
            order=1
        )
        TeamMember.objects.create(
            name="Jane Smith",
            role="COO",
            bio="Jane is an experienced operations manager with a passion for social impact.",
            order=2,
            is_active=False
        )
    
    def test_team_member_str(self):
        """Test the string representation of TeamMember."""
        team_member = TeamMember.objects.get(name="John Doe")
        self.assertEqual(str(team_member), "John Doe - CEO")
    
    def test_team_member_ordering(self):
        """Test that team members are ordered by the order field."""
        team_members = list(TeamMember.objects.all())
        self.assertEqual(team_members[0].name, "John Doe")
        self.assertEqual(team_members[1].name, "Jane Smith")


class TestimonialModelTest(TestCase):
    """Test module for Testimonial model."""
    
    def setUp(self):
        Testimonial.objects.create(
            quote="This organization has changed my life.",
            author="Alice Johnson",
            organization="Community Center",
            country="USA",
            is_featured=True,
            order=1
        )
        Testimonial.objects.create(
            quote="The support we received was incredible.",
            author="Bob Williams",
            organization="Local School",
            country="Canada",
            order=2
        )
    
    def test_testimonial_str(self):
        """Test the string representation of Testimonial."""
        testimonial = Testimonial.objects.get(author="Alice Johnson")
        self.assertEqual(str(testimonial), "Testimonial from Alice Johnson - Community Center")
    
    def test_testimonial_ordering(self):
        """Test that featured testimonials come first."""
        testimonials = list(Testimonial.objects.all())
        self.assertEqual(testimonials[0].author, "Alice Johnson")
        self.assertEqual(testimonials[1].author, "Bob Williams")


class PartnerModelTest(TestCase):
    """Test module for Partner model."""
    
    def setUp(self):
        Partner.objects.create(
            name="ABC Corporation",
            website="https://abc.com",
            description="A global technology company.",
            is_featured=True,
            order=1
        )
        Partner.objects.create(
            name="XYZ Foundation",
            website="https://xyz.org",
            description="A philanthropic foundation.",
            order=2
        )
    
    def test_partner_str(self):
        """Test the string representation of Partner."""
        partner = Partner.objects.get(name="ABC Corporation")
        self.assertEqual(str(partner), "ABC Corporation")
    
    def test_partner_ordering(self):
        """Test that featured partners come first."""
        partners = list(Partner.objects.all())
        self.assertEqual(partners[0].name, "ABC Corporation")
        self.assertEqual(partners[1].name, "XYZ Foundation")


class ImpactStatModelTest(TestCase):
    """Test module for ImpactStat model."""
    
    def setUp(self):
        ImpactStat.objects.create(
            title="Total Donations",
            value="$750M+",
            description="Total donations processed through our platform.",
            order=1
        )
        ImpactStat.objects.create(
            title="Projects Funded",
            value="31,000+",
            description="Number of projects successfully funded.",
            order=2
        )
    
    def test_impact_stat_str(self):
        """Test the string representation of ImpactStat."""
        stat = ImpactStat.objects.get(title="Total Donations")
        self.assertEqual(str(stat), "Total Donations: $750M+")
    
    def test_impact_stat_ordering(self):
        """Test that impact stats are ordered by the order field."""
        stats = list(ImpactStat.objects.all())
        self.assertEqual(stats[0].title, "Total Donations")
        self.assertEqual(stats[1].title, "Projects Funded")


class AboutAPITest(APITestCase):
    """Test module for About API."""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test data
        TeamMember.objects.create(
            name="John Doe",
            role="CEO",
            bio="John has over 10 years of experience in the non-profit sector.",
            order=1
        )
        
        Testimonial.objects.create(
            quote="This organization has changed my life.",
            author="Alice Johnson",
            organization="Community Center",
            country="USA",
            is_featured=True,
            order=1
        )
        
        Partner.objects.create(
            name="ABC Corporation",
            website="https://abc.com",
            description="A global technology company.",
            is_featured=True,
            order=1
        )
        
        ImpactStat.objects.create(
            title="Total Donations",
            value="$750M+",
            description="Total donations processed through our platform.",
            order=1
        )
    
    def test_get_team_members(self):
        """Test getting all team members."""
        url = reverse('teammember-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'John Doe')
    
    def test_get_testimonials(self):
        """Test getting all testimonials."""
        url = reverse('testimonial-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['author'], 'Alice Johnson')
    
    def test_get_partners(self):
        """Test getting all partners."""
        url = reverse('partner-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'ABC Corporation')
    
    def test_get_impact_stats(self):
        """Test getting all impact stats."""
        url = reverse('impactstat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Total Donations')
    
    def test_get_about_page_data(self):
        """Test getting all about page data in a single request."""
        url = reverse('about-page-data')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that all sections are present
        self.assertIn('team_members', response.data)
        self.assertIn('testimonials', response.data)
        self.assertIn('partners', response.data)
        self.assertIn('impact_stats', response.data)
        self.assertIn('mission', response.data)
        self.assertIn('vision', response.data)
        self.assertIn('values', response.data)
        self.assertIn('story', response.data)
        
        # Check that data is correctly included
        self.assertEqual(len(response.data['team_members']), 1)
        self.assertEqual(response.data['team_members'][0]['name'], 'John Doe')
        self.assertEqual(len(response.data['testimonials']), 1)
        self.assertEqual(response.data['testimonials'][0]['author'], 'Alice Johnson')
        self.assertEqual(len(response.data['partners']), 1)
        self.assertEqual(response.data['partners'][0]['name'], 'ABC Corporation')
        self.assertEqual(len(response.data['impact_stats']), 1)
        self.assertEqual(response.data['impact_stats'][0]['title'], 'Total Donations') 