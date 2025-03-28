from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import DisasterCategory, DisasterProject, DisasterDonation, EmergencyResource
from .serializers import (
    DisasterCategorySerializer,
    DisasterProjectListSerializer,
    DisasterProjectDetailSerializer,
    DisasterDonationSerializer,
    EmergencyResourceSerializer
)

# Create your views here.

class DisasterCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing disaster categories"""
    queryset = DisasterCategory.objects.all()
    serializer_class = DisasterCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

class DisasterProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing disaster projects"""
    queryset = DisasterProject.objects.all()
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['title', 'created_at', 'funds_raised', 'funding_goal']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DisasterProjectDetailSerializer
        return DisasterProjectListSerializer
    
    def get_queryset(self):
        queryset = DisasterProject.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter featured projects
        featured = self.request.query_params.get('featured', None)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)
        
        # Filter active projects
        active = self.request.query_params.get('active', None)
        if active and active.lower() == 'true':
            queryset = queryset.filter(status='active')
        
        return queryset
    
    @action(detail=True, methods=['post'], serializer_class=DisasterDonationSerializer)
    def donate(self, request, slug=None):
        """Endpoint for making donations to a specific project"""
        project = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(
                {"message": "Thank you for your donation!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Endpoint for getting disaster relief statistics"""
        total_projects = DisasterProject.objects.count()
        active_projects = DisasterProject.objects.filter(status='active').count()
        total_raised = DisasterProject.objects.aggregate(total=Sum('funds_raised'))['total'] or 0
        total_donations = DisasterDonation.objects.count()
        
        return Response({
            'total_projects': total_projects,
            'active_projects': active_projects,
            'total_raised': total_raised,
            'total_donations': total_donations
        })

class DisasterDonationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing disaster donations"""
    queryset = DisasterDonation.objects.all()
    serializer_class = DisasterDonationSerializer
    
    def get_permissions(self):
        """
        Allow anyone to create a donation, but only staff can view or modify
        """
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class EmergencyResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing emergency resources"""
    queryset = EmergencyResource.objects.all()
    serializer_class = EmergencyResourceSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'content']
    ordering_fields = ['order', 'title', 'created_at']
