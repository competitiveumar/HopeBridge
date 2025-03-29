from django.db import models
from django.core.validators import MinLengthValidator

class TeamMember(models.Model):
    """Model representing a team member."""
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    bio = models.TextField(validators=[MinLengthValidator(10)])
    avatar = models.ImageField(upload_to='team/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which to display this team member")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Team Member'
        verbose_name_plural = 'Team Members'

    def __str__(self):
        return f"{self.name} - {self.role}"


class Testimonial(models.Model):
    """Model representing a testimonial from a beneficiary."""
    quote = models.TextField(validators=[MinLengthValidator(10)])
    author = models.CharField(max_length=100)
    organization = models.CharField(max_length=200)
    country = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which to display this testimonial")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'order', 'created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'

    def __str__(self):
        return f"Testimonial from {self.author} - {self.organization}"


class Partner(models.Model):
    """Model representing a corporate partner."""
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='partners/')
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Order in which to display this partner")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'order', 'name']
        verbose_name = 'Partner'
        verbose_name_plural = 'Partners'

    def __str__(self):
        return self.name


class ImpactStat(models.Model):
    """Model representing an impact statistic."""
    title = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Font Awesome icon class")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Impact Statistic'
        verbose_name_plural = 'Impact Statistics'

    def __str__(self):
        return f"{self.title}: {self.value}" 