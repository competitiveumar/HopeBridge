from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DisasterCategoryViewSet,
    DisasterProjectViewSet,
    DisasterDonationViewSet,
    EmergencyResourceViewSet
)

router = DefaultRouter()
router.register(r'categories', DisasterCategoryViewSet)
router.register(r'projects', DisasterProjectViewSet)
router.register(r'donations', DisasterDonationViewSet)
router.register(r'resources', EmergencyResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 