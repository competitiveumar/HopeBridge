from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    EventCategory,
    Event,
    EventImage,
    EventRegistration,
    EventWorkshop,
    VolunteerPosition,
    VolunteerApplication
)
from .serializers import (
    EventCategorySerializer,
    EventSerializer,
    EventDetailSerializer,
    EventImageSerializer,
    EventRegistrationSerializer,
    EventWorkshopSerializer,
    VolunteerPositionSerializer,
    VolunteerApplicationSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class EventCategoryViewSet(viewsets.ModelViewSet):
    queryset = EventCategory.objects.filter(is_active=True)
    serializer_class = EventCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['name', 'slug']


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'city', 'country', 'tags']
    filterset_fields = ['status', 'is_virtual', 'is_featured', 'registration_required']
    ordering_fields = ['start_date', 'end_date', 'title', 'created_at', 'amount_raised']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range
        date_filter = self.request.query_params.get('date', None)
        if date_filter:
            today = timezone.now().date()
            
            if date_filter == 'this-month':
                month_start = today.replace(day=1)
                next_month = month_start.replace(month=month_start.month % 12 + 1)
                queryset = queryset.filter(start_date__gte=month_start, start_date__lt=next_month)
            elif date_filter == 'next-month':
                next_month_start = today.replace(day=1, month=today.month % 12 + 1)
                next_next_month = next_month_start.replace(month=next_month_start.month % 12 + 1)
                queryset = queryset.filter(start_date__gte=next_month_start, start_date__lt=next_next_month)
            elif date_filter == 'three-months':
                queryset = queryset.filter(start_date__gte=today, start_date__lte=today.replace(month=(today.month + 3 - 1) % 12 + 1))
            elif date_filter == 'six-months':
                queryset = queryset.filter(start_date__gte=today, start_date__lte=today.replace(month=(today.month + 6 - 1) % 12 + 1))
        
        # Filter by event type/category
        event_type = self.request.query_params.get('event_type', None)
        if event_type:
            queryset = queryset.filter(
                Q(categories__slug__icontains=event_type) |
                Q(tags__icontains=event_type)
            ).distinct()
        
        # Filter by location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(
                Q(location__icontains=location) |
                Q(city__icontains=location) |
                Q(country__icontains=location) |
                Q(postal_code__icontains=location)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        """Endpoint for users to register for an event."""
        event = self.get_object()
        user = request.user
        
        # Check if already registered
        if EventRegistration.objects.filter(event=event, user=user).exists():
            return Response({'detail': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if registration is still open
        if event.registration_required and event.registration_deadline and event.registration_deadline < timezone.now().date():
            return Response({'detail': 'Registration for this event has closed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if there is still space available
        if event.max_participants > 0 and event.registrations.count() >= event.max_participants:
            return Response({'detail': 'This event has reached maximum capacity.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create registration
        registration = EventRegistration.objects.create(
            event=event,
            user=user,
            status='registered',
            payment_status='pending' if event.registration_fee > 0 else 'not_required',
            notes=request.data.get('notes', '')
        )
        
        serializer = EventRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventWorkshopViewSet(viewsets.ModelViewSet):
    queryset = EventWorkshop.objects.filter(is_active=True)
    serializer_class = EventWorkshopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description']
    filterset_fields = ['event', 'is_active']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        event_id = self.request.query_params.get('event_id', None)
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset


class VolunteerPositionViewSet(viewsets.ModelViewSet):
    queryset = VolunteerPosition.objects.filter(is_active=True)
    serializer_class = VolunteerPositionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'requirements']
    filterset_fields = ['event', 'is_active']
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        """Endpoint for users to apply for a volunteer position."""
        position = self.get_object()
        user = request.user
        
        # Check if already applied
        if VolunteerApplication.objects.filter(position=position, user=user).exists():
            return Response({'detail': 'You have already applied for this position.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if there are available slots
        if position.filled_slots >= position.slots:
            return Response({'detail': 'This position has been filled.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create application
        application = VolunteerApplication.objects.create(
            position=position,
            user=user,
            message=request.data.get('message', '')
        )
        
        serializer = VolunteerApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VolunteerApplicationViewSet(viewsets.ModelViewSet):
    queryset = VolunteerApplication.objects.all()
    serializer_class = VolunteerApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['position', 'status']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return VolunteerApplication.objects.all()
        return VolunteerApplication.objects.filter(user=user)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """Admin endpoint to update application status."""
        application = self.get_object()
        status_value = request.data.get('status')
        
        if status_value not in [choice[0] for choice in VolunteerApplication.STATUS_CHOICES]:
            return Response({'detail': 'Invalid status value.'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_status = application.status
        application.status = status_value
        application.admin_notes = request.data.get('admin_notes', application.admin_notes)
        application.save()
        
        # If approved, increment the filled slots count
        if status_value == 'approved' and old_status != 'approved':
            position = application.position
            position.filled_slots = position.filled_slots + 1
            position.save()
        
        # If unapproved, decrement the filled slots count
        elif old_status == 'approved' and status_value != 'approved':
            position = application.position
            position.filled_slots = max(0, position.filled_slots - 1)
            position.save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data) 