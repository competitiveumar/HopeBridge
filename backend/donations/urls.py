from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, DonationViewSet, FundAllocationViewSet, CartItemViewSet, CreatePaymentIntentView, StripeWebhookView, ExchangeRateViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'donations', DonationViewSet, basename='donation')
router.register(r'fund-allocations', FundAllocationViewSet)
router.register(r'cart-items', CartItemViewSet, basename='cart-item')
router.register(r'exchange-rates', ExchangeRateViewSet, basename='exchange-rate')

urlpatterns = [
    path('', include(router.urls)),
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('stripe-webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
] 