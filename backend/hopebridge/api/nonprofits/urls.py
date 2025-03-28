from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NonprofitViewSet, NonprofitProjectViewSet, TestimonialViewSet,
    ResourceViewSet, SurveyViewSet
)

router = DefaultRouter()
router.register(r'nonprofits', NonprofitViewSet)
router.register(r'projects', NonprofitProjectViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'surveys', SurveyViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 