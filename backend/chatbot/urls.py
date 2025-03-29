from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, ChatMessageViewSet, ChatFeedbackViewSet

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='chat-session')
router.register(r'messages', ChatMessageViewSet, basename='chat-message')
router.register(r'feedback', ChatFeedbackViewSet, basename='chat-feedback')

urlpatterns = [
    path('', include(router.urls)),
] 