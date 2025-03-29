from django.db import models
from django.utils.text import slugify

class CompanyPartnership(models.Model):
    """Model for company partnerships"""
    PARTNERSHIP_TYPES = (
        ('employee_giving', 'Employee Giving'),
        ('cause_marketing', 'Cause Marketing'),
        ('disaster_response', 'Disaster Response'),
        ('custom', 'Custom Partnership'),
    )
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField()
    partnership_type = models.CharField(max_length=50, choices=PARTNERSHIP_TYPES)
    website = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Company Partnership"
        verbose_name_plural = "Company Partnerships"
        ordering = ['-featured', 'name']

class PartnershipApplication(models.Model):
    """Model for partnership applications"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    company_name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    partnership_type = models.CharField(max_length=50, choices=CompanyPartnership.PARTNERSHIP_TYPES)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.company_name} - {self.get_status_display()}"
    
    class Meta:
        verbose_name = "Partnership Application"
        verbose_name_plural = "Partnership Applications"
        ordering = ['-created_at'] 