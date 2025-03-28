from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'focus-areas', views.FocusAreaViewSet)
router.register(r'organization-types', views.OrganizationTypeViewSet)
router.register(r'applications', views.ApplicationViewSet)
router.register(r'documents', views.ApplicationDocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 