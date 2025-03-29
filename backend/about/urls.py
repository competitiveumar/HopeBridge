from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'team-members', views.TeamMemberViewSet)
router.register(r'testimonials', views.TestimonialViewSet)
router.register(r'partners', views.PartnerViewSet)
router.register(r'impact-stats', views.ImpactStatViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('page-data/', views.about_page_data, name='about-page-data'),
] 