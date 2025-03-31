from rest_framework import serializers
from .models import GiftCardDesign, GiftCard, GiftCardRedemption
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class GiftCardDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftCardDesign
        fields = ['id', 'name', 'image', 'is_active', 'created_at']

class GiftCardSerializer(serializers.ModelSerializer):
    design_details = GiftCardDesignSerializer(source='design', read_only=True)
    
    class Meta:
        model = GiftCard
        fields = [
            'id', 'code', 'amount', 'sender_name', 'sender_email', 
            'recipient_name', 'recipient_email', 'message', 'design', 
            'design_details', 'status', 'card_type', 'purchased_at', 
            'expiration_date', 'redeemed_at', 'payment_id'
        ]
        read_only_fields = ['code', 'status', 'purchased_at', 'redeemed_at']
        extra_kwargs = {
            'design': {'write_only': True}
        }
    
    def create(self, validated_data):
        user = self.context['request'].user if 'request' in self.context and self.context['request'].user.is_authenticated else None
        gift_card = GiftCard.objects.create(
            **validated_data,
            created_by=user
        )
        
        # Send email notification for digital gift cards
        if gift_card.card_type == 'digital':
            self.send_gift_card_email(gift_card)
            
        return gift_card
    
    def send_gift_card_email(self, gift_card):
        """Send email with gift card details to recipient"""
        subject = f"You've received a HopeBridge Gift Card from {gift_card.sender_name}!"
        
        # Build email content using template
        context = {
            'gift_card': gift_card,
            'redeem_url': f"{settings.FRONTEND_URL}/gift-cards/redeem/{gift_card.code}/",
        }
        
        html_message = render_to_string('gift_cards/email_template.html', context)
        plain_message = f"""
        Hello {gift_card.recipient_name},
        
        You've received a HopeBridge Gift Card worth ${gift_card.amount} from {gift_card.sender_name}!
        
        Message: {gift_card.message}
        
        Redeem your gift card at: {settings.FRONTEND_URL}/gift-cards/redeem/{gift_card.code}/
        
        The HopeBridge Team
        """
        
        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [gift_card.recipient_email],
                html_message=html_message,
                fail_silently=False,
            )
        except Exception as e:
            # Log the error but don't prevent gift card creation
            print(f"Failed to send gift card email: {str(e)}")

class GiftCardRedemptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftCardRedemption
        fields = ['id', 'gift_card', 'redeemed_by', 'redeemed_at', 'nonprofit_id', 'nonprofit_name', 'amount']
        read_only_fields = ['redeemed_at', 'redeemed_by']
    
    def validate(self, data):
        gift_card = data.get('gift_card')
        amount = data.get('amount')
        
        # Check if gift card is valid for redemption
        if not gift_card.is_valid():
            raise serializers.ValidationError("This gift card is not valid for redemption.")
        
        # Check if amount is valid
        if amount > gift_card.amount:
            raise serializers.ValidationError("Redemption amount cannot exceed gift card amount.")
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        # Update gift card status
        gift_card = validated_data['gift_card']
        gift_card.redeem(user)
        
        # Create redemption record without passing redeemed_by explicitly
        # as it will be set by the view's perform_create method
        return super().create(validated_data) 