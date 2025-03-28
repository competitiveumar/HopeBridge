from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Nonprofit(models.Model):
    """Model representing a nonprofit organization."""
    name = models.CharField(_("Organization Name"), max_length=255)
    slug = models.SlugField(_("Slug"), max_length=255, unique=True)
    description = models.TextField(_("Description"))
    mission = models.TextField(_("Mission Statement"))
    logo = models.ImageField(_("Logo"), upload_to="nonprofits/logos/", blank=True, null=True)
    website = models.URLField(_("Website"), blank=True, null=True)
    email = models.EmailField(_("Email"), blank=True, null=True)
    phone = models.CharField(_("Phone"), max_length=20, blank=True, null=True)
    address = models.TextField(_("Address"), blank=True, null=True)
    country = models.CharField(_("Country"), max_length=100)
    founded_year = models.PositiveIntegerField(_("Founded Year"), blank=True, null=True)
    focus_area = models.CharField(_("Focus Area"), max_length=100)
    is_verified = models.BooleanField(_("Verified"), default=False)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        app_label = 'nonprofits'
        verbose_name = _("Nonprofit")
        verbose_name_plural = _("Nonprofits")
        ordering = ["name"]

class NonprofitProject(models.Model):
    """Model representing a project by a nonprofit organization."""
    nonprofit = models.ForeignKey(Nonprofit, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(_("Title"), max_length=255)
    description = models.TextField(_("Description"))
    goal_amount = models.DecimalField(_("Goal Amount"), max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(_("Current Amount"), max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField(_("Start Date"))
    end_date = models.DateField(_("End Date"), blank=True, null=True)
    image = models.ImageField(_("Image"), upload_to="nonprofits/projects/", blank=True, null=True)
    is_active = models.BooleanField(_("Active"), default=True)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        app_label = 'nonprofits'
        verbose_name = _("Nonprofit Project")
        verbose_name_plural = _("Nonprofit Projects")
        ordering = ["-created_at"]

class Testimonial(models.Model):
    """Model representing a testimonial from a nonprofit organization."""
    nonprofit = models.ForeignKey(Nonprofit, on_delete=models.CASCADE, related_name="testimonials")
    content = models.TextField(_("Content"))
    author_name = models.CharField(_("Author Name"), max_length=255)
    author_title = models.CharField(_("Author Title"), max_length=255, blank=True, null=True)
    country = models.CharField(_("Country"), max_length=100)
    is_featured = models.BooleanField(_("Featured"), default=False)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    
    def __str__(self):
        return f"Testimonial by {self.author_name} from {self.nonprofit.name}"
    
    class Meta:
        app_label = 'nonprofits'
        verbose_name = _("Testimonial")
        verbose_name_plural = _("Testimonials")
        ordering = ["-is_featured", "-created_at"]

class Resource(models.Model):
    """Model representing a resource for nonprofit organizations."""
    RESOURCE_TYPES = (
        ("guide", _("Guide")),
        ("template", _("Template")),
        ("webinar", _("Webinar")),
        ("case_study", _("Case Study")),
        ("tool", _("Tool")),
    )
    
    title = models.CharField(_("Title"), max_length=255)
    description = models.TextField(_("Description"))
    resource_type = models.CharField(_("Resource Type"), max_length=20, choices=RESOURCE_TYPES)
    file = models.FileField(_("File"), upload_to="nonprofits/resources/", blank=True, null=True)
    url = models.URLField(_("URL"), blank=True, null=True)
    is_premium = models.BooleanField(_("Premium"), default=False)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        app_label = 'nonprofits'
        verbose_name = _("Resource")
        verbose_name_plural = _("Resources")
        ordering = ["-created_at"]

class Survey(models.Model):
    """Model representing a survey response from a nonprofit organization."""
    name = models.CharField(_("Name"), max_length=255)
    email = models.EmailField(_("Email"))
    organization = models.CharField(_("Organization"), max_length=255)
    feedback = models.TextField(_("Feedback"))
    rating = models.PositiveSmallIntegerField(_("Rating"), choices=[(i, i) for i in range(1, 6)])
    improvements = models.TextField(_("Suggested Improvements"), blank=True, null=True)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    
    def __str__(self):
        return f"Survey by {self.name} from {self.organization}"
    
    class Meta:
        app_label = 'nonprofits'
        verbose_name = _("Survey")
        verbose_name_plural = _("Surveys")
        ordering = ["-created_at"]
