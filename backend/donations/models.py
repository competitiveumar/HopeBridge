from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
from users.models import User
from django.conf import settings
from nonprofits.models import Nonprofit
from gift_cards.models import GiftCard
import time
import random
import string

class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('urgent', 'Urgent'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='project_images/')
    categories = models.JSONField(default=list)  # Store as list of strings
    location = models.CharField(max_length=100)
    organization = models.CharField(max_length=200)
    goal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    raised = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Donation(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='donations')
    donor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    payment_id = models.CharField(max_length=100, unique=True)
    payment_provider = models.CharField(max_length=20, default='stripe')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    anonymous = models.BooleanField(default=False)
    message = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.donor.username if self.donor else 'Anonymous'} - ${self.amount}"

    def save(self, *args, **kwargs):
        if self.status == 'completed' and not self._state.adding:
            # Update project raised amount when donation is completed
            self.project.raised += self.amount
            self.project.save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class FundAllocation(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='fund_allocation')
    operational_costs = models.DecimalField(max_digits=5, decimal_places=2, help_text='Percentage', validators=[MinValueValidator(0)])
    direct_aid = models.DecimalField(max_digits=5, decimal_places=2, help_text='Percentage', validators=[MinValueValidator(0)])
    emergency_reserve = models.DecimalField(max_digits=5, decimal_places=2, help_text='Percentage', validators=[MinValueValidator(0)])

    def __str__(self):
        return f"Fund allocation for {self.project.title}"

    def clean(self):
        # Ensure percentages add up to 100
        total = self.operational_costs + self.direct_aid + self.emergency_reserve
        if total != 100:
            raise ValidationError('Percentages must add up to 100%')

class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='cart_items'
    )
    session_id = models.CharField(max_length=100, null=True, blank=True)
    nonprofit = models.ForeignKey(
        Nonprofit, 
        on_delete=models.CASCADE, 
        related_name='cart_items'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    is_recurring = models.BooleanField(default=False)
    recurring_frequency = models.CharField(
        max_length=20,
        choices=[
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('quarterly', 'Quarterly'),
            ('annually', 'Annually'),
        ],
        default='monthly',
        null=True,
        blank=True
    )
    gift_card = models.ForeignKey(
        GiftCard,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cart_items'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"CartItem: {self.nonprofit.name} - ${self.amount} x {self.quantity}"

    @property
    def total_amount(self):
        return self.amount * self.quantity 

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('stripe', 'Credit/Debit Card (Stripe)'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('crypto', 'Cryptocurrency'),
        ('check', 'Check'),
        ('other', 'Other'),
    )
    
    CURRENCY_CHOICES = (
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('JPY', 'Japanese Yen'),
        ('CAD', 'Canadian Dollar'),
        ('AUD', 'Australian Dollar'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='payments'
    )
    donation = models.ForeignKey(
        'Donation', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='payments'
    )
    session_id = models.CharField(max_length=100, blank=True, null=True)
    payment_intent_id = models.CharField(max_length=100, blank=True, null=True)
    payment_method_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='stripe')
    is_recurring = models.BooleanField(default=False)
    recurring_frequency = models.CharField(max_length=20, blank=True, null=True)
    billing_email = models.EmailField(blank=True, null=True)
    billing_name = models.CharField(max_length=100, blank=True, null=True)
    billing_address = models.TextField(blank=True, null=True)
    reference_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency} - {self.status}"
    
    def save(self, *args, **kwargs):
        if not self.reference_number:
            timestamp = int(time.time())
            random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            self.reference_number = f"HB-{timestamp}-{random_str}"
        super().save(*args, **kwargs) 

class ExchangeRate(models.Model):
    """Model to store currency exchange rates."""
    base_currency = models.CharField(max_length=3, default='USD')
    target_currency = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=12, decimal_places=6)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('base_currency', 'target_currency')
        ordering = ['base_currency', 'target_currency']
    
    def __str__(self):
        return f"{self.base_currency}/{self.target_currency}: {self.rate}" 