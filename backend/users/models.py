from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Commented out custom User model
# from django.contrib.auth.models import AbstractUser
# 
# class User(AbstractUser):
#     """Custom user model for HopeBridge."""
#     
#     # Add custom fields
#     phone_number = models.CharField(max_length=20, blank=True)
#     bio = models.TextField(max_length=500, blank=True)
#     profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
#     date_updated = models.DateTimeField(auto_now=True)
#     
#     class Meta:
#         verbose_name = 'User'
#         verbose_name_plural = 'Users'
#         
#     def __str__(self):
#         return self.email or self.username

class UserProfile(models.Model):
    """Profile model to extend the default Django User model."""
    USER_TYPE_CHOICES = (
        ('donor', 'Donor'),
        ('volunteer', 'Volunteer'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='donor')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Contact information
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    # Notification settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    marketing_emails = models.BooleanField(default=True)
    donation_receipts = models.BooleanField(default=True)
    event_reminders = models.BooleanField(default=True)
    
    # Social login provider
    provider = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('email', 'Email'),
        ('google', 'Google'),
        ('facebook', 'Facebook')
    ], default='email')
    
    date_updated = models.DateTimeField(auto_now=True)
    date_of_birth = models.DateField(null=True, blank=True)

    class Meta:
        app_label = 'users'

    def __str__(self):
        return f"{self.user.username}'s profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile instance when a User is created."""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save the UserProfile instance when the User is saved."""
    instance.profile.save() 