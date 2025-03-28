from rest_framework import serializers
from .models import ChatSession, ChatMessage, ChatFeedback


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'timestamp']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'created_at', 'updated_at', 'is_active', 'messages']


class ChatFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatFeedback
        fields = ['id', 'message', 'user', 'rating', 'comment', 'created_at'] 