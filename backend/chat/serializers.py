from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, Message, ChatTranscript, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'avatar', 'online_status', 'last_seen')

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'room', 'sender', 'content', 'message_type', 'file_name', 'file_type', 'timestamp')

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ('id', 'name', 'created_at', 'participants', 'last_message')

    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return MessageSerializer(last_message).data
        return None

class ChatTranscriptSerializer(serializers.ModelSerializer):
    room = ChatRoomSerializer(read_only=True)

    class Meta:
        model = ChatTranscript
        fields = ('id', 'room', 'email', 'transcript', 'created_at', 'sent') 