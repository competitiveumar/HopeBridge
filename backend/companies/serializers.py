from rest_framework import serializers
from .models import CompanyPartnership, PartnershipApplication

class CompanyPartnershipSerializer(serializers.ModelSerializer):
    """Serializer for company partnerships"""
    partnership_type_display = serializers.CharField(source='get_partnership_type_display', read_only=True)
    
    class Meta:
        model = CompanyPartnership
        fields = [
            'id', 'name', 'slug', 'logo', 'description', 
            'partnership_type', 'partnership_type_display', 
            'website', 'featured', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']

class PartnershipApplicationSerializer(serializers.ModelSerializer):
    """Serializer for partnership applications"""
    partnership_type_display = serializers.CharField(source='get_partnership_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = PartnershipApplication
        fields = [
            'id', 'company_name', 'contact_name', 'email', 'phone',
            'partnership_type', 'partnership_type_display', 
            'message', 'status', 'status_display', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at'] 