from rest_framework import serializers
from .models import ChatMessage, QuickReply, ChatbotResponse, ChatSession

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'timestamp', 'session_id']
        read_only_fields = ['id', 'timestamp']

class QuickReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickReply
        fields = ['id', 'text', 'response', 'is_active']
        read_only_fields = ['id']

class ChatbotResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotResponse
        fields = ['id', 'category', 'message', 'is_active']
        read_only_fields = ['id']

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ['id', 'session_id', 'user_email', 'started_at', 'last_activity', 'is_active']
        read_only_fields = ['id', 'started_at', 'last_activity']

class ChatbotMessageRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)
    session_id = serializers.CharField(required=False, allow_blank=True)
    user_email = serializers.EmailField(required=False, allow_blank=True)

class ChatbotMessageResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField(), required=False) 