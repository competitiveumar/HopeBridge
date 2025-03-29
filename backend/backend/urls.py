from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from .views import index
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

# Simple health check endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok', 'message': 'API server is running'})

# Direct fallback chatbot endpoint - responds immediately without calling the AI service
@api_view(['POST'])
@permission_classes([AllowAny])
def direct_chatbot_response(request):
    query = request.data.get('query', '')
    query_lower = query.lower()
    
    # Provide a direct fallback response based on the query content
    if 'donate' in query_lower or 'donation' in query_lower:
        response = "You can make donations through our platform by visiting the 'Donations' section and choosing a cause. We support one-time and recurring donations to various humanitarian, educational, and environmental causes."
    elif 'payment' in query_lower or 'pay' in query_lower or 'method' in query_lower:
        response = "HopeBridge accepts credit/debit cards (Visa, MasterCard, American Express) via Stripe. You can securely save your payment information for future donations and manage your payment methods in your account settings."
    elif 'help' in query_lower or 'support' in query_lower:
        response = "HopeBridge provides support by connecting donors with people in need. Browse our available causes to find those you'd like to help, or contact our support team at support@hopebridge.org for assistance with your account or donations."
    elif 'campaign' in query_lower or 'fundraising' in query_lower or 'create' in query_lower:
        response = "HopeBridge does not offer campaign or fundraising services for individuals. We only work with verified nonprofit organizations that have been thoroughly vetted."
    elif 'nonprofit' in query_lower or 'organization' in query_lower or 'charity' in query_lower:
        response = "HopeBridge partners with verified nonprofit organizations worldwide. Each organization on our platform has been vetted to ensure legitimacy and impact. You can browse nonprofits by cause area or location."
    elif 'tax' in query_lower or 'deduct' in query_lower or 'receipt' in query_lower:
        response = "Donations made through HopeBridge to qualified nonprofit organizations are tax-deductible. You'll receive an electronic receipt for each donation, and you can access your donation history and annual tax summaries in your account dashboard."
    elif 'about' in query_lower or 'who' in query_lower or 'mission' in query_lower:
        response = "HopeBridge is a platform connecting donors with people and causes in need. Our mission is to make giving accessible, transparent, and impactful. We've helped fund thousands of projects across education, healthcare, disaster relief, and community development."
    elif 'secure' in query_lower or 'safe' in query_lower or 'privacy' in query_lower:
        response = "Your security is our priority. HopeBridge uses bank-level encryption to protect your data and financial information. We never share your personal details without permission and comply with all privacy regulations."
    else:
        response = "Welcome to HopeBridge! We connect donors with people in need. How can I assist you today? You can ask about donations, payment methods, or finding causes to support."
    
    return Response({'response': response})

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/disasters/', include('disasters.urls')),
    path('api/gift-cards/', include('gift_cards.urls', namespace='gift_cards')),
    path('api/health/', health_check, name='health_check'),
    
    # Add both chatbot endpoints
    path('api/chatbot/', include('ai_chatbot.urls')),
    # Direct fallback endpoint that bypasses the AI service
    path('api/chatbot/direct/', direct_chatbot_response, name='direct_chatbot'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 