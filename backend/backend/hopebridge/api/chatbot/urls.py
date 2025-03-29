from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatbotMessageView,
    ChatMessageViewSet,
    QuickReplyViewSet,
    ChatbotResponseViewSet,
    ChatSessionViewSet
)

router = DefaultRouter()
router.register(r'messages', ChatMessageViewSet)
router.register(r'quick-replies', QuickReplyViewSet)
router.register(r'responses', ChatbotResponseViewSet)
router.register(r'sessions', ChatSessionViewSet)

urlpatterns = [
    path('message/', ChatbotMessageView.as_view(), name='chatbot-message'),
    path('admin/', include(router.urls)),
] 