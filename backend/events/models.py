from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class EventCategory(models.Model):
    """Model for event categories like challenge, running, cycling, etc."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'events'
        verbose_name = _("Event Category")
        verbose_name_plural = _("Event Categories")
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Event(models.Model):
    """Model for charity events and fundraisers."""
    STATUS_CHOICES = (
        ('upcoming', _('Upcoming')),
        ('ongoing', _('Ongoing')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    location = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    
    categories = models.ManyToManyField(EventCategory, related_name='events')
    
    featured_image = models.ImageField(upload_to='events/', blank=True, null=True)
    gallery_images = models.ManyToManyField('EventImage', related_name='events', blank=True)
    
    max_participants = models.PositiveIntegerField(default=0, help_text=_('0 means unlimited'))
    registration_required = models.BooleanField(default=True)
    registration_deadline = models.DateField(blank=True, null=True)
    
    organizer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='organized_events')
    
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    fundraising_goal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    amount_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    website_url = models.URLField(blank=True)
    is_virtual = models.BooleanField(default=False)
    
    tags = models.CharField(max_length=500, blank=True, help_text=_('Comma separated list of tags'))
    
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'events'
        verbose_name = _("Event")
        verbose_name_plural = _("Events")
        ordering = ["-start_date", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    def get_tags_list(self):
        """Return list of tags from the comma-separated string."""
        if not self.tags:
            return []
        return [tag.strip().upper() for tag in self.tags.split(',')]
    
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('event-detail', kwargs={'slug': self.slug})


class EventImage(models.Model):
    """Model for event gallery images."""
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='events/gallery/')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'events'
        verbose_name = _("Event Image")
        verbose_name_plural = _("Event Images")
    
    def __str__(self):
        return self.title or f"Image {self.id}"


class EventRegistration(models.Model):
    """Model for user registrations to events."""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    registration_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='registered')
    payment_status = models.CharField(max_length=20, default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    
    class Meta:
        app_label = 'events'
        verbose_name = _("Event Registration")
        verbose_name_plural = _("Event Registrations")
        unique_together = ('event', 'user')
        
    def __str__(self):
        return f"{self.user.username} - {self.event.title}"


class EventWorkshop(models.Model):
    """Model for online workshops."""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='workshops')
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    meeting_link = models.URLField(blank=True)
    host = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='hosted_workshops')
    max_participants = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        app_label = 'events'
        verbose_name = _("Workshop")
        verbose_name_plural = _("Workshops")
        
    def __str__(self):
        return self.title


class VolunteerPosition(models.Model):
    """Model for volunteer positions needed for events."""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='volunteer_positions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    slots = models.PositiveIntegerField(default=1)
    filled_slots = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        app_label = 'events'
        verbose_name = _("Volunteer Position")
        verbose_name_plural = _("Volunteer Positions")
        
    def __str__(self):
        return f"{self.title} - {self.event.title}"


class VolunteerApplication(models.Model):
    """Model for volunteer applications for events."""
    STATUS_CHOICES = (
        ('pending', _('Pending')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
    )
    
    position = models.ForeignKey(VolunteerPosition, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='volunteer_applications')
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    class Meta:
        app_label = 'events'
        verbose_name = _("Volunteer Application")
        verbose_name_plural = _("Volunteer Applications")
        unique_together = ('position', 'user')
        
    def __str__(self):
        return f"{self.user.username} - {self.position.title}" 