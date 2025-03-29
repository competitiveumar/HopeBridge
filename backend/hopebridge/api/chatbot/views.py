from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import ChatSession, ChatMessage, ChatFeedback
from .serializers import ChatSessionSerializer, ChatMessageSerializer, ChatFeedbackSerializer


class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        session = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': 'Message content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user message
        user_message = ChatMessage.objects.create(
            session=session,
            role='user',
            content=content
        )

        # TODO: Integrate with AI model to generate response
        # For now, return a simple response
        assistant_message = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content='This is a placeholder response from the chatbot.'
        )

        return Response({
            'user_message': ChatMessageSerializer(user_message).data,
            'assistant_message': ChatMessageSerializer(assistant_message).data
        })


class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(session__user=self.request.user)


class ChatFeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = ChatFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatFeedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        message = get_object_or_404(ChatMessage, id=self.request.data.get('message'))
        if message.session.user != self.request.user:
            return Response(
                {'error': 'You can only provide feedback for your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(user=self.request.user) 