from django.db import models
from django.utils import timezone

class ChatMessage(models.Model):
    """Model for storing chat messages"""
    SENDER_CHOICES = (
        ('user', 'User'),
        ('bot', 'Bot'),
    )
    
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    session_id = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.sender}: {self.message[:50]}"
    
    class Meta:
        ordering = ['timestamp']

class QuickReply(models.Model):
    """Model for storing quick reply options"""
    text = models.CharField(max_length=100)
    response = models.TextField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.text
    
    class Meta:
        verbose_name_plural = "Quick Replies"

class ChatbotResponse(models.Model):
    """Model for storing predefined chatbot responses"""
    CATEGORY_CHOICES = (
        ('greeting', 'Greeting'),
        ('donation', 'Donation Information'),
        ('projects', 'Projects Information'),
        ('about', 'About HopeBridge'),
        ('contact', 'Contact Information'),
        ('help', 'Help'),
        ('default', 'Default Response'),
    )
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.category}: {self.message[:50]}"
    
    class Meta:
        verbose_name_plural = "Chatbot Responses"

class ChatSession(models.Model):
    """Model for tracking chat sessions"""
    session_id = models.CharField(max_length=100, unique=True)
    user_email = models.EmailField(blank=True, null=True)
    started_at = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Session {self.session_id} - {self.started_at}"
    
    def update_activity(self):
        self.last_activity = timezone.now()
        self.save()
