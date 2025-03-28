from django.contrib import admin
from .models import TeamMember, Testimonial, Partner, ImpactStat

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'is_active')
    list_filter = ('is_active', 'role')
    search_fields = ('name', 'role', 'bio')
    ordering = ('order', 'name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'role', 'bio', 'avatar')
        }),
        ('Display Options', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author', 'organization', 'country', 'is_featured', 'is_active')
    list_filter = ('is_active', 'is_featured', 'country')
    search_fields = ('author', 'organization', 'quote')
    ordering = ('-is_featured', 'order', 'author')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('quote', 'author', 'organization', 'country', 'image')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'is_featured', 'is_active')
    list_filter = ('is_active', 'is_featured')
    search_fields = ('name', 'description')
    ordering = ('-is_featured', 'order', 'name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'logo', 'website', 'description')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ('title', 'value', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'value', 'description')
    ordering = ('order', 'title')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'value', 'description', 'icon')
        }),
        ('Display Options', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 