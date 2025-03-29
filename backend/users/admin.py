from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_phone_number')
    
    def get_phone_number(self, obj):
        return obj.profile.phone_number if hasattr(obj, 'profile') else ''
    get_phone_number.short_description = 'Phone Number'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Temporarily comment out custom user admin
# from django.contrib.auth import get_user_model
# from django.contrib.auth.admin import UserAdmin
# 
# User = get_user_model()
# 
# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
#     search_fields = ('username', 'email', 'first_name', 'last_name')
#     list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
#     
#     fieldsets = UserAdmin.fieldsets + (
#         ('Additional Information', {
#             'fields': ('phone_number', 'bio', 'profile_image'),
#         }),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         ('Additional Information', {
#             'fields': ('phone_number', 'bio', 'profile_image'),
#         }),
#     ) 