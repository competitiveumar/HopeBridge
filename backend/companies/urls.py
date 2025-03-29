from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyPartnershipViewSet, PartnershipApplicationViewSet

router = DefaultRouter()
router.register(r'partnerships', CompanyPartnershipViewSet)
router.register(r'applications', PartnershipApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 