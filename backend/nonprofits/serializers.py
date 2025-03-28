from rest_framework import serializers
from .models import Nonprofit, NonprofitProject, Testimonial, Resource, Survey

class NonprofitSerializer(serializers.ModelSerializer):
    """Serializer for the Nonprofit model."""
    class Meta:
        model = Nonprofit
        fields = [
            'id', 'name', 'slug', 'description', 'mission', 'logo', 
            'website', 'email', 'phone', 'address', 'country', 
            'founded_year', 'focus_area', 'is_verified', 'created_at'
        ]

class NonprofitDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for the Nonprofit model."""
    class Meta:
        model = Nonprofit
        fields = '__all__'

class NonprofitProjectSerializer(serializers.ModelSerializer):
    """Serializer for the NonprofitProject model."""
    nonprofit_name = serializers.CharField(source='nonprofit.name', read_only=True)
    
    class Meta:
        model = NonprofitProject
        fields = [
            'id', 'nonprofit', 'nonprofit_name', 'title', 'description',
            'goal_amount', 'current_amount', 'start_date', 'end_date',
            'image', 'is_active', 'created_at'
        ]

class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for the Testimonial model."""
    nonprofit_name = serializers.CharField(source='nonprofit.name', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'nonprofit', 'nonprofit_name', 'content', 'author_name',
            'author_title', 'country', 'is_featured', 'created_at'
        ]

class ResourceSerializer(serializers.ModelSerializer):
    """Serializer for the Resource model."""
    resource_type_display = serializers.CharField(source='get_resource_type_display', read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type', 'resource_type_display',
            'file', 'url', 'is_premium', 'created_at'
        ]

class SurveySerializer(serializers.ModelSerializer):
    """Serializer for the Survey model."""
    class Meta:
        model = Survey
        fields = [
            'id', 'name', 'email', 'organization', 'feedback',
            'rating', 'improvements', 'created_at'
        ]
        read_only_fields = ['id', 'created_at'] 