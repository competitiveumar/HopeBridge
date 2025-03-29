from django.conf import settings
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import TeamMember, Testimonial, Partner, ImpactStat
from .serializers import (
    TeamMemberSerializer, 
    TestimonialSerializer, 
    PartnerSerializer, 
    ImpactStatSerializer,
    AboutPageSerializer
)

class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing team members."""
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing testimonials."""
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]


class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing partners."""
    queryset = Partner.objects.filter(is_active=True)
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]


class ImpactStatViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing impact statistics."""
    queryset = ImpactStat.objects.filter(is_active=True)
    serializer_class = ImpactStatSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
def about_page_data(request):
    """
    API endpoint for retrieving all about page data in a single request.
    """
    # Get all active records from each model
    team_members = TeamMember.objects.filter(is_active=True)
    testimonials = Testimonial.objects.filter(is_active=True)
    partners = Partner.objects.filter(is_active=True)
    impact_stats = ImpactStat.objects.filter(is_active=True)
    
    # Static content that could be moved to a database or CMS in a real application
    mission = "To transform aid and philanthropy to accelerate community-led change."
    vision = "Unleashing the potential of people to make positive change happen."
    values = "Always open, committed to listening and learning, focused on community-led change."
    story = "HopeBridge is the largest global crowdfunding community connecting nonprofits, donors, and companies in nearly every country. We help fellow nonprofits access the funding, tools, training, and support they need to serve their communities."
    
    # Construct the response data
    data = {
        'team_members': TeamMemberSerializer(team_members, many=True).data,
        'testimonials': TestimonialSerializer(testimonials, many=True).data,
        'partners': PartnerSerializer(partners, many=True).data,
        'impact_stats': ImpactStatSerializer(impact_stats, many=True).data,
        'mission': mission,
        'vision': vision,
        'values': values,
        'story': story,
    }
    
    # Use the AboutPageSerializer to validate the structure
    serializer = AboutPageSerializer(data)
    
    return Response(serializer.data) 