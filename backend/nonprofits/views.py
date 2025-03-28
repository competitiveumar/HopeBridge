from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Nonprofit, NonprofitProject, Testimonial, Resource, Survey
from .serializers import (
    NonprofitSerializer, NonprofitDetailSerializer, NonprofitProjectSerializer,
    TestimonialSerializer, ResourceSerializer, SurveySerializer
)

# Create your views here.

class NonprofitViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing nonprofits."""
    queryset = Nonprofit.objects.filter(is_verified=True)
    serializer_class = NonprofitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['country', 'focus_area']
    search_fields = ['name', 'description', 'mission']
    ordering_fields = ['name', 'created_at', 'founded_year']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NonprofitDetailSerializer
        return NonprofitSerializer
    
    @action(detail=True, methods=['get'])
    def projects(self, request, slug=None):
        """Get all projects for a specific nonprofit."""
        nonprofit = self.get_object()
        projects = NonprofitProject.objects.filter(nonprofit=nonprofit, is_active=True)
        serializer = NonprofitProjectSerializer(projects, many=True)
        return Response(serializer.data)

class NonprofitProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing nonprofit projects."""
    queryset = NonprofitProject.objects.filter(is_active=True)
    serializer_class = NonprofitProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nonprofit']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'goal_amount', 'current_amount']

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing testimonials."""
    queryset = Testimonial.objects.filter(is_featured=True)
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['nonprofit', 'country']
    ordering_fields = ['created_at']

class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing resources."""
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['resource_type', 'is_premium']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        """Filter premium resources for authenticated users only."""
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_premium=False)
        return queryset

class SurveyViewSet(viewsets.ModelViewSet):
    """ViewSet for submitting surveys."""
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    http_method_names = ['post', 'head', 'options']  # Only allow POST requests
    
    def create(self, request, *args, **kwargs):
        """Create a new survey response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Thank you for completing our survey!"},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
