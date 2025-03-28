from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FocusArea, OrganizationType, Application, ApplicationDocument
from .serializers import (
    FocusAreaSerializer,
    OrganizationTypeSerializer,
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationAdminSerializer,
    ApplicationDocumentSerializer,
)
from .permissions import IsAdminOrReadOnly, IsAdminOrOwner


class FocusAreaViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing focus areas."""
    queryset = FocusArea.objects.filter(is_active=True)
    serializer_class = FocusAreaSerializer
    permission_classes = [permissions.AllowAny]


class OrganizationTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing organization types."""
    queryset = OrganizationType.objects.filter(is_active=True)
    serializer_class = OrganizationTypeSerializer
    permission_classes = [permissions.AllowAny]


class ApplicationViewSet(viewsets.ModelViewSet):
    """API endpoint for managing applications."""
    queryset = Application.objects.all()
    permission_classes = [IsAdminOrOwner]
    
    def get_serializer_class(self):
        """
        Return different serializers based on the action.
        """
        if self.action == 'create':
            return ApplicationCreateSerializer
        elif self.request and self.request.user and self.request.user.is_staff:
            return ApplicationAdminSerializer
        return ApplicationSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        if self.request.user.is_staff:
            return Application.objects.all()
        
        # Regular users can only see their own applications
        return Application.objects.filter(
            contact_email=self.request.user.email
        )
    
    def perform_create(self, serializer):
        """
        Create a new application and send confirmation email.
        """
        application = serializer.save()
        self.send_confirmation_email(application)
    
    def send_confirmation_email(self, application):
        """
        Send a confirmation email to the applicant.
        """
        try:
            subject = f"Application Received: {application.organization_name}"
            context = {
                'application': application,
                'site_name': settings.SITE_NAME,
                'site_url': settings.SITE_URL,
            }
            
            # Render email templates
            text_message = render_to_string('applications/emails/confirmation_email.txt', context)
            html_message = render_to_string('applications/emails/confirmation_email.html', context)
            
            # Send email
            send_mail(
                subject=subject,
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.email, application.contact_email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log the error but don't prevent the application from being created
            print(f"Error sending confirmation email: {str(e)}")
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """
        Approve an application.
        """
        application = self.get_object()
        application.status = 'approved'
        application.status_notes = request.data.get('notes', '')
        application.save()
        
        # Send approval email
        self.send_status_update_email(application, 'approved')
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """
        Reject an application.
        """
        application = self.get_object()
        application.status = 'rejected'
        application.status_notes = request.data.get('notes', '')
        application.save()
        
        # Send rejection email
        self.send_status_update_email(application, 'rejected')
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def request_more_info(self, request, pk=None):
        """
        Request more information for an application.
        """
        application = self.get_object()
        application.status = 'more_info'
        application.status_notes = request.data.get('notes', '')
        application.save()
        
        # Send more info email
        self.send_status_update_email(application, 'more_info')
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)
    
    def send_status_update_email(self, application, status_type):
        """
        Send a status update email to the applicant.
        """
        try:
            status_display = application.get_status_display()
            subject = f"Application Status Update: {application.organization_name} - {status_display}"
            context = {
                'application': application,
                'site_name': settings.SITE_NAME,
                'site_url': settings.SITE_URL,
                'status_type': status_type,
                'status_display': status_display,
            }
            
            # Render email templates
            text_message = render_to_string(f'applications/emails/{status_type}_email.txt', context)
            html_message = render_to_string(f'applications/emails/{status_type}_email.html', context)
            
            # Send email
            send_mail(
                subject=subject,
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[application.email, application.contact_email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log the error but don't prevent the status update
            print(f"Error sending status update email: {str(e)}")


class ApplicationDocumentViewSet(viewsets.ModelViewSet):
    """API endpoint for managing application documents."""
    queryset = ApplicationDocument.objects.all()
    serializer_class = ApplicationDocumentSerializer
    permission_classes = [IsAdminOrOwner]
    
    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        if self.request.user.is_staff:
            return ApplicationDocument.objects.all()
        
        # Regular users can only see documents for their own applications
        return ApplicationDocument.objects.filter(
            application__contact_email=self.request.user.email
        )
    
    def perform_create(self, serializer):
        """
        Create a new document and associate it with an application.
        """
        application_id = self.request.data.get('application')
        application = Application.objects.get(pk=application_id)
        
        # Check if the user has permission to add documents to this application
        if not self.request.user.is_staff and application.contact_email != self.request.user.email:
            return Response(
                {"detail": "You do not have permission to add documents to this application."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save(application=application) 