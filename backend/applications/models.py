from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone

class FocusArea(models.Model):
    """Model representing a focus area for organizations."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'applications'
        ordering = ['name']
        verbose_name = 'Focus Area'
        verbose_name_plural = 'Focus Areas'

    def __str__(self):
        return self.name


class OrganizationType(models.Model):
    """Model representing an organization type."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'applications'
        ordering = ['name']
        verbose_name = 'Organization Type'
        verbose_name_plural = 'Organization Types'

    def __str__(self):
        return self.name


class Application(models.Model):
    """Model representing an organization application."""
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('more_info', 'More Information Needed'),
    )

    # Organization Information
    organization_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    
    # Organization Details
    organization_type = models.ForeignKey(
        OrganizationType,
        on_delete=models.SET_NULL,
        null=True,
        related_name='applications'
    )
    tax_id_number = models.CharField(max_length=50)
    founding_year = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(timezone.now().year)
        ]
    )
    mission_statement = models.TextField()
    description = models.TextField(validators=[MinLengthValidator(50)])
    
    # Contact Information
    contact_first_name = models.CharField(max_length=100)
    contact_last_name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    contact_position = models.CharField(max_length=100)
    
    # Additional Information
    primary_focus_area = models.ForeignKey(
        FocusArea,
        on_delete=models.SET_NULL,
        null=True,
        related_name='primary_applications'
    )
    secondary_focus_areas = models.ManyToManyField(
        FocusArea,
        related_name='secondary_applications'
    )
    annual_budget = models.CharField(max_length=100)
    staff_size = models.PositiveIntegerField()
    has_volunteers = models.BooleanField(default=False)
    volunteer_count = models.PositiveIntegerField(null=True, blank=True)
    additional_information = models.TextField(blank=True)
    
    # Application Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    status_notes = models.TextField(blank=True)
    reviewer_notes = models.TextField(blank=True)
    
    # Timestamps and Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        app_label = 'applications'
        ordering = ['-submitted_at']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        
    def __str__(self):
        return f"{self.organization_name} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        # Set reviewed_at timestamp if status changes from pending
        if self.pk:
            old_instance = Application.objects.get(pk=self.pk)
            if old_instance.status == 'pending' and self.status != 'pending':
                self.reviewed_at = timezone.now()
        
        super().save(*args, **kwargs)


class ApplicationDocument(models.Model):
    """Model representing documents attached to an application."""
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.CharField(max_length=100)
    file = models.FileField(upload_to='application_documents/')
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'applications'
        ordering = ['document_type', '-uploaded_at']
        verbose_name = 'Application Document'
        verbose_name_plural = 'Application Documents'
        
    def __str__(self):
        return f"{self.application.organization_name} - {self.document_type}"


class ApplicationStatusHistory(models.Model):
    """Model representing the history of status changes for an application."""
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    status = models.CharField(max_length=20, choices=Application.STATUS_CHOICES)
    notes = models.TextField(blank=True)
    changed_by = models.CharField(max_length=100)
    changed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        app_label = 'applications'
        ordering = ['-changed_at']
        verbose_name = 'Application Status History'
        verbose_name_plural = 'Application Status Histories'
        
    def __str__(self):
        return f"{self.application.organization_name} - {self.get_status_display()} - {self.changed_at}" 