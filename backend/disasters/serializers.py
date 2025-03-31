from rest_framework import serializers
from .models import DisasterCategory, DisasterProject, DisasterDonation, EmergencyResource

class DisasterCategorySerializer(serializers.ModelSerializer):
    """Serializer for disaster categories"""
    class Meta:
        model = DisasterCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']

class DisasterProjectListSerializer(serializers.ModelSerializer):
    """Serializer for listing disaster projects"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    progress_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = DisasterProject
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'description', 
            'image', 'location', 'status', 'funding_goal', 'funds_raised', 
            'progress_percentage', 'start_date', 'end_date', 'featured', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'progress_percentage']

class DisasterProjectDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed disaster project view"""
    category = DisasterCategorySerializer(read_only=True)
    progress_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = DisasterProject
        fields = [
            'id', 'title', 'slug', 'category', 'description', 'image', 
            'location', 'status', 'funding_goal', 'funds_raised', 
            'progress_percentage', 'start_date', 'end_date', 'featured', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'progress_percentage']

class DisasterDonationSerializer(serializers.ModelSerializer):
    """Serializer for disaster donations"""
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = DisasterDonation
        fields = [
            'id', 'project', 'project_title', 'amount', 'donor_name', 
            'donor_email', 'anonymous', 'message', 'transaction_id', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'transaction_id', 'project_title']
        extra_kwargs = {
            'donor_name': {'write_only': True},
            'donor_email': {'write_only': True},
            'project': {'required': False},
        }
    
    def validate(self, data):
        # If donation is anonymous, donor_name and donor_email can be optional
        if data.get('anonymous', False):
            if 'donor_name' not in data:
                data['donor_name'] = 'Anonymous'
            if 'donor_email' not in data:
                data['donor_email'] = 'anonymous@example.com'
        else:
            # For non-anonymous donations, these fields are required
            if 'donor_name' not in data:
                raise serializers.ValidationError({'donor_name': 'This field is required for non-anonymous donations.'})
            if 'donor_email' not in data:
                raise serializers.ValidationError({'donor_email': 'This field is required for non-anonymous donations.'})
        
        return data
    
    def create(self, validated_data):
        # Update the project's funds_raised field
        project = validated_data.get('project')
        amount = validated_data.get('amount')
        
        project.funds_raised += amount
        project.save()
        
        return super().create(validated_data)

class EmergencyResourceSerializer(serializers.ModelSerializer):
    """Serializer for emergency resources"""
    class Meta:
        model = EmergencyResource
        fields = [
            'id', 'title', 'slug', 'description', 'content', 
            'source', 'source_url', 'order', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at'] 