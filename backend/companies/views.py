from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CompanyPartnership, PartnershipApplication
from .serializers import CompanyPartnershipSerializer, PartnershipApplicationSerializer

class CompanyPartnershipViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing company partnerships"""
    queryset = CompanyPartnership.objects.all()
    serializer_class = CompanyPartnershipSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = CompanyPartnership.objects.all()
        
        # Filter by partnership type if provided
        partnership_type = self.request.query_params.get('type', None)
        if partnership_type:
            queryset = queryset.filter(partnership_type=partnership_type)
            
        # Filter featured partnerships
        featured = self.request.query_params.get('featured', None)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)
            
        return queryset

class PartnershipApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for creating partnership applications"""
    queryset = PartnershipApplication.objects.all()
    serializer_class = PartnershipApplicationSerializer
    
    def get_permissions(self):
        """
        Allow anyone to create an application, but only staff can view or modify
        """
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Your partnership application has been submitted successfully."},
            status=status.HTTP_201_CREATED,
            headers=headers
        ) 