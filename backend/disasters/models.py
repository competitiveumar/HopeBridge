from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

class DisasterCategory(models.Model):
    """Model for disaster categories (e.g., Earthquake, Hurricane, Flood)"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Material icon name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Disaster Category"
        verbose_name_plural = "Disaster Categories"
        ordering = ['name']

class DisasterProject(models.Model):
    """Model for disaster relief projects"""
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('planned', 'Planned'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(DisasterCategory, on_delete=models.CASCADE, related_name='projects')
    description = models.TextField()
    image = models.ImageField(upload_to='disaster_projects/', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    funding_goal = models.DecimalField(max_digits=12, decimal_places=2)
    funds_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    @property
    def progress_percentage(self):
        if self.funding_goal > 0:
            return min(100, int((self.funds_raised / self.funding_goal) * 100))
        return 0
    
    class Meta:
        verbose_name = "Disaster Project"
        verbose_name_plural = "Disaster Projects"
        ordering = ['-featured', '-created_at']

class DisasterDonation(models.Model):
    """Model for donations to disaster relief projects"""
    project = models.ForeignKey(DisasterProject, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donor_name = models.CharField(max_length=255, blank=True)
    donor_email = models.EmailField(blank=True)
    anonymous = models.BooleanField(default=False)
    message = models.TextField(blank=True)
    transaction_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.amount} to {self.project.title}"
    
    class Meta:
        verbose_name = "Disaster Donation"
        verbose_name_plural = "Disaster Donations"
        ordering = ['-created_at']

class EmergencyResource(models.Model):
    """Model for emergency resources and guidelines"""
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    content = models.TextField()
    source = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Emergency Resource"
        verbose_name_plural = "Emergency Resources"
        ordering = ['order', 'title']
