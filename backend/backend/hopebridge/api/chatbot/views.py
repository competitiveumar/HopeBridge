from django.shortcuts import render
import uuid
import re
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import ChatMessage, QuickReply, ChatbotResponse, ChatSession
from .serializers import (
    ChatMessageSerializer, 
    QuickReplySerializer, 
    ChatbotResponseSerializer,
    ChatSessionSerializer,
    ChatbotMessageRequestSerializer,
    ChatbotMessageResponseSerializer
)

# Create your views here.

class ChatbotMessageView(APIView):
    """
    API endpoint for chatbot messages
    """
    permission_classes = [AllowAny]
    
    def post(self, request, format=None):
        serializer = ChatbotMessageRequestSerializer(data=request.data)
        if serializer.is_valid():
            user_message = serializer.validated_data['message']
            session_id = serializer.validated_data.get('session_id', '')
            user_email = serializer.validated_data.get('user_email', '')
            
            # Create or get session
            if not session_id:
                session_id = str(uuid.uuid4())
                ChatSession.objects.create(session_id=session_id, user_email=user_email)
            else:
                try:
                    session = ChatSession.objects.get(session_id=session_id)
                    session.update_activity()
                    if user_email and not session.user_email:
                        session.user_email = user_email
                        session.save()
                except ChatSession.DoesNotExist:
                    session_id = str(uuid.uuid4())
                    ChatSession.objects.create(session_id=session_id, user_email=user_email)
            
            # Save user message
            ChatMessage.objects.create(
                sender='user',
                message=user_message,
                session_id=session_id
            )
            
            # Process message and generate response
            response_data = self.generate_response(user_message)
            
            # Save bot response
            ChatMessage.objects.create(
                sender='bot',
                message=response_data['message'],
                session_id=session_id
            )
            
            # Add session_id to response
            response_data['session_id'] = session_id
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_response(self, user_message):
        """
        Generate a response based on the user's message
        """
        user_message_lower = user_message.lower()
        
        # Check for quick replies first
        quick_replies = QuickReply.objects.filter(is_active=True)
        for quick_reply in quick_replies:
            if quick_reply.text.lower() in user_message_lower:
                return {
                    'message': quick_reply.response,
                    'options': self.get_follow_up_options(quick_reply.text)
                }
        
        # Determine message category
        category = self.categorize_message(user_message_lower)
        
        # Get response from database
        try:
            response = ChatbotResponse.objects.filter(category=category, is_active=True).order_by('?').first()
            if response:
                return {
                    'message': response.message,
                    'options': self.get_options_for_category(category)
                }
        except Exception as e:
            print(f"Error retrieving response: {e}")
        
        # Fallback response
        return {
            'message': "I'm not sure I understand. Could you please rephrase your question?",
            'options': ['Donation Information', 'Find Projects', 'About HopeBridge']
        }
    
    def categorize_message(self, message):
        """
        Categorize the user message to determine the appropriate response
        """
        if any(word in message for word in ['hello', 'hi', 'hey', 'greetings']):
            return 'greeting'
        elif any(word in message for word in ['donate', 'donation', 'give', 'money', 'contribute']):
            return 'donation'
        elif any(word in message for word in ['project', 'campaign', 'cause', 'find']):
            return 'projects'
        elif any(word in message for word in ['about', 'who', 'what is', 'hopebridge']):
            return 'about'
        elif any(word in message for word in ['contact', 'email', 'phone', 'call', 'reach']):
            return 'contact'
        elif any(word in message for word in ['help', 'support', 'assistance']):
            return 'help'
        else:
            return 'default'
    
    def get_options_for_category(self, category):
        """
        Get quick reply options based on the message category
        """
        options_map = {
            'greeting': ['Donation Information', 'Find Projects', 'About HopeBridge'],
            'donation': ['How to donate?', 'Tax benefits', 'Back to main menu'],
            'projects': ['Education', 'Healthcare', 'Environment', 'Back to main menu'],
            'about': ['Our mission', 'How it works', 'Back to main menu'],
            'contact': ['Email us', 'Call us', 'Back to main menu'],
            'help': ['FAQs', 'Contact support', 'Back to main menu'],
            'default': ['Donation Information', 'Find Projects', 'About HopeBridge']
        }
        
        return options_map.get(category, ['Donation Information', 'Find Projects', 'About HopeBridge'])
    
    def get_follow_up_options(self, option_text):
        """
        Get follow-up options based on the selected quick reply
        """
        option_text_lower = option_text.lower()
        
        if 'donation' in option_text_lower or 'donate' in option_text_lower:
            return ['How to donate?', 'Tax benefits', 'Back to main menu']
        elif 'project' in option_text_lower or 'find' in option_text_lower:
            return ['Education', 'Healthcare', 'Environment', 'Back to main menu']
        elif 'about' in option_text_lower or 'mission' in option_text_lower:
            return ['Our mission', 'How it works', 'Back to main menu']
        elif 'back to main' in option_text_lower:
            return ['Donation Information', 'Find Projects', 'About HopeBridge']
        else:
            return ['Donation Information', 'Find Projects', 'About HopeBridge']

class ChatMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chat messages (admin only)
    """
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = ChatMessage.objects.all()
        session_id = self.request.query_params.get('session_id', None)
        if session_id is not None:
            queryset = queryset.filter(session_id=session_id)
        return queryset

class QuickReplyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for quick replies (admin only)
    """
    queryset = QuickReply.objects.all()
    serializer_class = QuickReplySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class ChatbotResponseViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chatbot responses (admin only)
    """
    queryset = ChatbotResponse.objects.all()
    serializer_class = ChatbotResponseSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = ChatbotResponse.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class ChatSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for chat sessions (admin only)
    """
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
