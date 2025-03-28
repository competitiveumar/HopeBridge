from rest_framework import serializers
from .models import FocusArea, OrganizationType, Application, ApplicationDocument, ApplicationStatusHistory

class FocusAreaSerializer(serializers.ModelSerializer):
    """Serializer for the FocusArea model."""
    
    class Meta:
        model = FocusArea
        fields = ['id', 'name', 'description']


class OrganizationTypeSerializer(serializers.ModelSerializer):
    """Serializer for the OrganizationType model."""
    
    class Meta:
        model = OrganizationType
        fields = ['id', 'name', 'description']


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    """Serializer for the ApplicationDocument model."""
    
    class Meta:
        model = ApplicationDocument
        fields = ['id', 'document_type', 'file', 'description', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    """Serializer for the ApplicationStatusHistory model."""
    
    class Meta:
        model = ApplicationStatusHistory
        fields = ['id', 'status', 'notes', 'changed_by', 'changed_at']
        read_only_fields = ['changed_at']


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for the Application model."""
    organization_type = serializers.SlugRelatedField(
        slug_field='name',
        queryset=OrganizationType.objects.all()
    )
    primary_focus_area = serializers.SlugRelatedField(
        slug_field='name',
        queryset=FocusArea.objects.all()
    )
    secondary_focus_areas = serializers.SlugRelatedField(
        slug_field='name',
        queryset=FocusArea.objects.all(),
        many=True
    )
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id',
            # Organization Information
            'organization_name', 'email', 'phone', 'website', 'address',
            'city', 'state', 'zip_code',
            # Organization Details
            'organization_type', 'tax_id_number', 'founding_year',
            'mission_statement', 'description',
            # Contact Information
            'contact_first_name', 'contact_last_name', 'contact_email',
            'contact_phone', 'contact_position',
            # Additional Information
            'primary_focus_area', 'secondary_focus_areas', 'annual_budget',
            'staff_size', 'has_volunteers', 'volunteer_count', 'additional_information',
            # Status and Metadata
            'status', 'status_display', 'status_notes', 'reviewer_notes',
            'created_at', 'updated_at', 'submitted_at', 'reviewed_at',
            # Related objects
            'documents', 'status_history',
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'submitted_at', 'reviewed_at',
            'status', 'status_notes', 'reviewer_notes',
        ]
    
    def validate(self, data):
        """
        Custom validation for the application form.
        """
        # Validate volunteer count if has_volunteers is True
        if data.get('has_volunteers') and not data.get('volunteer_count'):
            raise serializers.ValidationError({
                'volunteer_count': 'Volunteer count is required when the organization has volunteers.'
            })
        
        # Ensure secondary_focus_areas doesn't include primary_focus_area
        if 'secondary_focus_areas' in data and 'primary_focus_area' in data:
            primary = data['primary_focus_area']
            if primary in data['secondary_focus_areas']:
                raise serializers.ValidationError({
                    'secondary_focus_areas': 'Secondary focus areas cannot include the primary focus area.'
                })
        
        return data


class ApplicationCreateSerializer(ApplicationSerializer):
    """Serializer for creating a new application."""
    
    class Meta(ApplicationSerializer.Meta):
        # Exclude read-only fields that are set automatically
        exclude = ['status_history', 'documents', 'reviewed_at', 'reviewed_by', 'ip_address']
    
    def create(self, validated_data):
        """
        Create a new application and set the IP address from the request.
        """
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
        
        return super().create(validated_data)
    
    def get_client_ip(self, request):
        """
        Get the client IP address from the request.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ApplicationAdminSerializer(ApplicationSerializer):
    """Serializer for admin operations on applications."""
    
    class Meta(ApplicationSerializer.Meta):
        read_only_fields = ['created_at', 'updated_at', 'submitted_at']
    
    def update(self, instance, validated_data):
        """
        Update an application and create a status history entry if status changes.
        """
        request = self.context.get('request')
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Create status history entry if status changes
        if old_status != new_status and request and request.user:
            ApplicationStatusHistory.objects.create(
                application=instance,
                status=new_status,
                notes=validated_data.get('status_notes', ''),
                changed_by=request.user.get_full_name() or request.user.username
            )
            
            # Set reviewed_by if not already set
            if not instance.reviewed_by and request.user:
                validated_data['reviewed_by'] = request.user.get_full_name() or request.user.username
        
        return super().update(instance, validated_data) 