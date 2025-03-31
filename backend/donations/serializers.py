from rest_framework import serializers
from .models import Project, Donation, FundAllocation, CartItem, Payment, ExchangeRate

class FundAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundAllocation
        fields = ['operational_costs', 'direct_aid', 'emergency_reserve']

class ProjectSerializer(serializers.ModelSerializer):
    fund_allocation = FundAllocationSerializer(read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    total_donors = serializers.SerializerMethodField()
    categories_display = serializers.SerializerMethodField()
    location_display = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 'categories', 'categories_display',
            'location', 'location_display', 'organization', 'goal', 'raised', 'status', 
            'featured', 'created_at', 'fund_allocation', 'progress_percentage',
            'total_donors'
        ]

    def get_progress_percentage(self, obj):
        if obj.goal:
            return round((float(obj.raised) / float(obj.goal)) * 100, 2)
        return 0

    def get_total_donors(self, obj):
        return obj.donations.filter(status='completed').count()
    
    def get_categories_display(self, obj):
        return ' | '.join(obj.categories) if obj.categories else ''
    
    def get_location_display(self, obj):
        return obj.location.replace(',', ' | ')

class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.SerializerMethodField()
    project_title = serializers.SerializerMethodField()
    project_organization = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = [
            'id', 'project', 'donor', 'amount', 'status',
            'created_at', 'anonymous', 'message', 'donor_name',
            'project_title', 'project_organization', 'email'
        ]
        read_only_fields = ['status', 'payment_id']
        extra_kwargs = {
            'donor': {'required': False},
            'email': {'required': False, 'write_only': True}
        }

    def get_donor_name(self, obj):
        if obj.anonymous:
            return 'Anonymous'
        if obj.donor:
            return obj.donor.get_full_name() or obj.donor.username
        return 'Anonymous'

    def get_project_title(self, obj):
        return obj.project.title
    
    def get_project_organization(self, obj):
        return obj.project.organization

    def validate(self, data):
        # Ensure either donor or email is provided
        if not data.get('donor') and not data.get('email'):
            raise serializers.ValidationError("Either a user account or email address is required.")
        return data

class ProjectDetailSerializer(ProjectSerializer):
    recent_donations = serializers.SerializerMethodField()
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['recent_donations']

    def get_recent_donations(self, obj):
        recent_donations = obj.donations.filter(
            status='completed'
        ).order_by('-created_at')[:5]
        return DonationSerializer(recent_donations, many=True).data

class CartItemSerializer(serializers.ModelSerializer):
    nonprofit_name = serializers.CharField(source='nonprofit.name', read_only=True)
    nonprofit_logo = serializers.CharField(source='nonprofit.logo', read_only=True)
    gift_card_code = serializers.CharField(source='gift_card.code', read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'nonprofit', 'nonprofit_name', 'nonprofit_logo', 
            'amount', 'quantity', 'is_recurring', 'recurring_frequency',
            'gift_card', 'gift_card_code', 'total_amount', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate(self, data):
        # Ensure amount is positive
        if data.get('amount', 0) <= 0:
            raise serializers.ValidationError({"amount": "Amount must be greater than zero."})
        
        # Ensure quantity is positive
        if data.get('quantity', 0) <= 0:
            raise serializers.ValidationError({"quantity": "Quantity must be greater than zero."})
        
        # If is_recurring is True, ensure recurring_frequency is provided
        if data.get('is_recurring') and not data.get('recurring_frequency'):
            raise serializers.ValidationError({"recurring_frequency": "Recurring frequency is required for recurring donations."})
        
        return data 

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'donation', 'amount', 'currency', 'status',
            'payment_method', 'is_recurring', 'recurring_frequency',
            'reference_number', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reference_number', 'created_at', 'updated_at']

class PaymentIntentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(max_length=3)
    payment_method_id = serializers.CharField(max_length=100)
    is_recurring = serializers.BooleanField(default=False)
    recurring_frequency = serializers.CharField(max_length=20, required=False, allow_null=True, allow_blank=True)
    donation_id = serializers.IntegerField(required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    name = serializers.CharField(max_length=100, required=False, allow_null=True, allow_blank=True)
    original_amount_usd = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    exchange_rate = serializers.DecimalField(max_digits=12, decimal_places=6, required=False)

class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = ['base_currency', 'target_currency', 'rate', 'last_updated']
        read_only_fields = ['last_updated'] 