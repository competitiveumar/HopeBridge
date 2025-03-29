from django.contrib import admin
from .models import ChatMessage, QuickReply, ChatbotResponse, ChatSession

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'message_preview', 'timestamp', 'session_id')
    list_filter = ('sender', 'timestamp')
    search_fields = ('message', 'session_id')
    date_hierarchy = 'timestamp'
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'

@admin.register(QuickReply)
class QuickReplyAdmin(admin.ModelAdmin):
    list_display = ('text', 'response_preview', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('text', 'response')
    
    def response_preview(self, obj):
        return obj.response[:50] + '...' if len(obj.response) > 50 else obj.response
    response_preview.short_description = 'Response'

@admin.register(ChatbotResponse)
class ChatbotResponseAdmin(admin.ModelAdmin):
    list_display = ('category', 'message_preview', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('message',)
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user_email', 'started_at', 'last_activity', 'is_active')
    list_filter = ('is_active', 'started_at', 'last_activity')
    search_fields = ('session_id', 'user_email')
    date_hierarchy = 'started_at'
