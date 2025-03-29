from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Article(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='articles')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='articles')
    excerpt = models.TextField(help_text="A brief summary of the article")
    content = models.TextField()
    image = models.ImageField(upload_to='articles/%Y/%m/', help_text="Main article image")
    featured = models.BooleanField(default=False, help_text="Featured articles appear on the homepage")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['-published_at']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('news:article_detail', args=[self.slug])
    
    def __str__(self):
        return self.title

class Video(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    youtube_id = models.CharField(max_length=20, help_text="The YouTube video ID (e.g., dQw4w9WgXcQ)")
    thumbnail = models.ImageField(upload_to='videos/thumbnails/', blank=True, null=True, help_text="If left blank, the YouTube thumbnail will be used")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='videos')
    featured = models.BooleanField(default=False, help_text="Featured videos appear on the homepage")
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def thumbnail_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        return f"https://img.youtube.com/vi/{self.youtube_id}/maxresdefault.jpg"

class FeaturedStory(models.Model):
    title = models.CharField(max_length=255)
    excerpt = models.TextField(help_text="A brief summary of the featured story")
    content = models.TextField()
    image = models.ImageField(upload_to='featured/%Y/%m/', help_text="Main featured image (1200x600 recommended)")
    category = models.CharField(max_length=100, default="Featured Story")
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True, blank=True, 
                                help_text="Optional: Link to a full article")
    active = models.BooleanField(default=True, help_text="Only one featured story can be active at a time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Featured Stories"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.active:
            # Ensure only one featured story is active
            FeaturedStory.objects.filter(active=True).update(active=False)
        super().save(*args, **kwargs) 