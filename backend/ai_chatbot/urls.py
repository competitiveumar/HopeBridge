from django.urls import path
from .views import ChatbotQueryView
from backend.urls import direct_chatbot_response

urlpatterns = [
    path('query/', ChatbotQueryView.as_view(), name='chatbot-query'),
    path('direct/', direct_chatbot_response, name='direct-chatbot-in-app'),
] 