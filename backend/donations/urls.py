from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, DonationViewSet, CartItemViewSet, CreatePaymentIntentView, StripeWebhookView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'cart', CartItemViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('webhook/stripe/', StripeWebhookView.as_view(), name='stripe-webhook'),
] 