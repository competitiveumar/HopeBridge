from rest_framework import serializers
from .models import (
    EventCategory, 
    Event, 
    EventImage, 
    EventRegistration, 
    EventWorkshop,
    VolunteerPosition,
    VolunteerApplication
)

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'slug', 'description']


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['id', 'title', 'image', 'description']


class EventSerializer(serializers.ModelSerializer):
    categories = EventCategorySerializer(many=True, read_only=True)
    tags_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'status', 'start_date', 'end_date', 'location', 'address',
            'city', 'country', 'postal_code', 'categories', 'featured_image',
            'max_participants', 'registration_required', 'registration_deadline',
            'registration_fee', 'fundraising_goal', 'amount_raised',
            'website_url', 'is_virtual', 'tags', 'tags_list', 'is_featured',
            'created_at', 'updated_at'
        ]
    
    def get_tags_list(self, obj):
        return obj.get_tags_list()


class EventDetailSerializer(EventSerializer):
    gallery_images = EventImageSerializer(many=True, read_only=True)
    
    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['gallery_images']


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'event_title', 'user', 'user_name',
            'registration_date', 'status', 'payment_status',
            'amount_paid', 'notes'
        ]
        read_only_fields = ['registration_date']


class EventWorkshopSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    host_name = serializers.ReadOnlyField(source='host.get_full_name')
    
    class Meta:
        model = EventWorkshop
        fields = [
            'id', 'event', 'event_title', 'title', 'description',
            'start_time', 'end_time', 'meeting_link', 'host',
            'host_name', 'max_participants', 'is_active'
        ]


class VolunteerPositionSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    available_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteerPosition
        fields = [
            'id', 'event', 'event_title', 'title', 'description',
            'requirements', 'slots', 'filled_slots', 'available_slots',
            'is_active'
        ]
    
    def get_available_slots(self, obj):
        return max(0, obj.slots - obj.filled_slots)


class VolunteerApplicationSerializer(serializers.ModelSerializer):
    position_title = serializers.ReadOnlyField(source='position.title')
    event_title = serializers.ReadOnlyField(source='position.event.title')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    
    class Meta:
        model = VolunteerApplication
        fields = [
            'id', 'position', 'position_title', 'event_title',
            'user', 'user_name', 'application_date', 'status',
            'message'
        ]
        read_only_fields = ['application_date', 'status'] 