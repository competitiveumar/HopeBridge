from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import datetime, timedelta

class GiftCardDesign(models.Model):
    """Model for gift card designs/templates"""
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='gift_cards/designs/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

def default_expiration_date():
    return datetime.now() + timedelta(days=365)

class GiftCard(models.Model):
    """Model for gift cards"""
    # Status choices
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('redeemed', 'Redeemed'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    )
    
    # Type choices
    TYPE_CHOICES = (
        ('digital', 'Digital'),
        ('print', 'Print'),
    )
    
    code = models.CharField(max_length=16, unique=True, editable=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sender_name = models.CharField(max_length=100)
    sender_email = models.EmailField()
    recipient_name = models.CharField(max_length=100)
    recipient_email = models.EmailField()
    message = models.TextField(blank=True, null=True)
    design = models.ForeignKey(GiftCardDesign, on_delete=models.CASCADE, related_name='gift_cards')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    card_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='digital')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='gift_cards_created')
    redeemed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='gift_cards_redeemed')
    purchased_at = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateTimeField(default=default_expiration_date)
    redeemed_at = models.DateTimeField(null=True, blank=True)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Gift Card {self.code} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        # Generate a unique code if not provided
        if not self.code:
            self.code = self.generate_unique_code()
        super().save(*args, **kwargs)
    
    def generate_unique_code(self):
        """Generate a unique gift card code"""
        code = str(uuid.uuid4()).replace('-', '')[:16].upper()
        return code
    
    def redeem(self, user):
        """Redeem the gift card"""
        if self.status == 'active':
            self.status = 'redeemed'
            self.redeemed_by = user
            self.redeemed_at = datetime.now()
            self.save()
            return True
        return False
    
    def is_valid(self):
        """Check if gift card is valid for redemption"""
        return self.status == 'active' and self.expiration_date > datetime.now()

class GiftCardRedemption(models.Model):
    """Model to track gift card redemptions"""
    gift_card = models.ForeignKey(GiftCard, on_delete=models.CASCADE, related_name='redemptions')
    redeemed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redemptions')
    redeemed_at = models.DateTimeField(auto_now_add=True)
    # Use integer field for nonprofit ID instead of direct ForeignKey
    nonprofit_id = models.IntegerField(help_text="ID of the nonprofit organization")
    nonprofit_name = models.CharField(max_length=255, help_text="Name of the nonprofit organization")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Redemption: {self.gift_card.code} - ${self.amount}"
