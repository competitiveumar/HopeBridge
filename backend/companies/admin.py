from django.contrib import admin
from .models import CompanyPartnership, PartnershipApplication

@admin.register(CompanyPartnership)
class CompanyPartnershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'partnership_type', 'featured', 'created_at')
    list_filter = ('partnership_type', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'logo', 'description')
        }),
        ('Partnership Details', {
            'fields': ('partnership_type', 'website', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PartnershipApplication)
class PartnershipApplicationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'contact_name', 'email', 'partnership_type', 'status', 'created_at')
    list_filter = ('partnership_type', 'status')
    search_fields = ('company_name', 'contact_name', 'email', 'message')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('company_name', 'contact_name', 'email', 'phone')
        }),
        ('Application Details', {
            'fields': ('partnership_type', 'message', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 