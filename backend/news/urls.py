from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'news'

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'articles', views.ArticleViewSet)
router.register(r'videos', views.VideoViewSet)
router.register(r'featured-stories', views.FeaturedStoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Shortcut URLs for common requests
    path('featured-story/', views.FeaturedStoryViewSet.as_view({'get': 'active'}), name='active-featured-story'),
] 