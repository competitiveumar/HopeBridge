from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rooms', views.ChatRoomViewSet, basename='chatroom')
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'transcripts', views.ChatTranscriptViewSet, basename='chattranscript')

urlpatterns = [
    path('', include(router.urls)),
    path('rooms/<int:room_pk>/messages/', views.MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='room-messages'),
    path('rooms/<int:room_pk>/messages/<int:pk>/', views.MessageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='room-message-detail'),
] 