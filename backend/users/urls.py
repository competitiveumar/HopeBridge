from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    MyTokenObtainPairView,
    RegisterView,
    UserProfileView,
    NotificationSettingsView,
    PasswordChangeView,
    UserDetailsView,
    get_user_info,
    logout_view,
    social_auth,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('notification-settings/', NotificationSettingsView.as_view(), name='notification-settings'),
    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
    path('me/', UserDetailsView.as_view(), name='user-details'),
    path('info/', get_user_info, name='user-info'),
    path('logout/', logout_view, name='logout'),
    path('social-auth/', social_auth, name='social-auth'),
] 