from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GiftCardDesignViewSet, GiftCardViewSet, GiftCardRedemptionViewSet

router = DefaultRouter()
router.register(r'designs', GiftCardDesignViewSet)
router.register(r'cards', GiftCardViewSet, basename='gift-card')
router.register(r'redemptions', GiftCardRedemptionViewSet, basename='gift-card-redemption')

app_name = 'gift_cards'

urlpatterns = [
    path('', include(router.urls)),
] 