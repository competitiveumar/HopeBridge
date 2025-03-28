"""
URL configuration for hopebridge project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Direct logo file at root
    path('logo.png', RedirectView.as_view(url=settings.STATIC_URL + 'logo.png', permanent=True)),
    
    # API endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/campaigns/', include('hopebridge.api.campaigns.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/nonprofits/', include('nonprofits.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/disasters/', include('disasters.urls')),
    path('api/chatbot/', include('ai_chatbot.urls')),
    path('api/', include('hopebridge.api.core.urls')),
    path('api/news/', include('news.urls', namespace='news')),
    path('api/gift-cards/', include('gift_cards.urls', namespace='gift_cards')),
    path('api/events/', include('events.urls')),
]

if settings.DEBUG:
    # Serve media files in development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Serve static files in development
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Always serve the React app for any other route
urlpatterns += [re_path(r'^.*$', index, name='index')] 