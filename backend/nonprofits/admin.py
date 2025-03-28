from django.contrib import admin
from .models import Nonprofit, NonprofitProject, Testimonial, Resource, Survey

@admin.register(Nonprofit)
class NonprofitAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'focus_area', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'country', 'focus_area')
    search_fields = ('name', 'description', 'mission')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')

@admin.register(NonprofitProject)
class NonprofitProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'nonprofit', 'goal_amount', 'current_amount', 'is_active', 'created_at')
    list_filter = ('is_active', 'nonprofit')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'nonprofit', 'country', 'is_featured', 'created_at')
    list_filter = ('is_featured', 'country', 'nonprofit')
    search_fields = ('content', 'author_name')
    readonly_fields = ('created_at',)

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'is_premium', 'created_at')
    list_filter = ('resource_type', 'is_premium')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('name', 'organization', 'feedback')
    readonly_fields = ('created_at',)
