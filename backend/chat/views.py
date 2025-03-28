from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ChatRoom, Message, ChatTranscript, UserProfile
from .serializers import (
    ChatRoomSerializer,
    MessageSerializer,
    ChatTranscriptSerializer,
    UserProfileSerializer,
)
from .consumers import ChatConsumer

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        room = serializer.save()
        room.participants.add(self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        room.participants.add(request.user)
        return Response({'status': 'joined'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        room.participants.remove(request.user)
        return Response({'status': 'left'})

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs.get('room_pk')
        return Message.objects.filter(room_id=room_id)

    def perform_create(self, serializer):
        room_id = self.kwargs.get('room_pk')
        room = ChatRoom.objects.get(id=room_id)
        serializer.save(sender=self.request.user, room=room)

class ChatTranscriptViewSet(viewsets.ModelViewSet):
    serializer_class = ChatTranscriptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatTranscript.objects.filter(room__participants=self.request.user)

    def perform_create(self, serializer):
        transcript = serializer.save()
        # Send email with transcript
        send_mail(
            f'Chat Transcript - {transcript.room.name}',
            transcript.transcript,
            settings.DEFAULT_FROM_EMAIL,
            [transcript.email],
            fail_silently=False,
        )
        transcript.sent = True
        transcript.save()

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_status(self, request):
        profile = self.get_queryset().first()
        if profile:
            profile.online_status = request.data.get('online_status', False)
            profile.save()
            return Response({'status': 'updated'})
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND) 