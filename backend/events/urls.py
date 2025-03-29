from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.EventCategoryViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'workshops', views.EventWorkshopViewSet)
router.register(r'volunteer-positions', views.VolunteerPositionViewSet)
router.register(r'volunteer-applications', views.VolunteerApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 