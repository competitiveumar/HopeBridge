from rest_framework import serializers
from .models import TeamMember, Testimonial, Partner, ImpactStat

class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer for the TeamMember model."""
    
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'avatar']


class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for the Testimonial model."""
    
    class Meta:
        model = Testimonial
        fields = ['id', 'quote', 'author', 'organization', 'country', 'image']


class PartnerSerializer(serializers.ModelSerializer):
    """Serializer for the Partner model."""
    
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo', 'website', 'description']


class ImpactStatSerializer(serializers.ModelSerializer):
    """Serializer for the ImpactStat model."""
    
    class Meta:
        model = ImpactStat
        fields = ['id', 'title', 'value', 'description', 'icon']


class AboutPageSerializer(serializers.Serializer):
    """Serializer for the entire About page data."""
    
    team_members = TeamMemberSerializer(many=True, read_only=True)
    testimonials = TestimonialSerializer(many=True, read_only=True)
    partners = PartnerSerializer(many=True, read_only=True)
    impact_stats = ImpactStatSerializer(many=True, read_only=True)
    mission = serializers.CharField(read_only=True)
    vision = serializers.CharField(read_only=True)
    values = serializers.CharField(read_only=True)
    story = serializers.CharField(read_only=True) 