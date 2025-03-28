from django.contrib import admin
from .models import DisasterCategory, DisasterProject, DisasterDonation, EmergencyResource

@admin.register(DisasterCategory)
class DisasterCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')

@admin.register(DisasterProject)
class DisasterProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'funds_raised', 'funding_goal', 'progress_percentage', 'featured', 'created_at')
    list_filter = ('status', 'category', 'featured')
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at', 'progress_percentage')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category', 'description', 'image')
        }),
        ('Project Details', {
            'fields': ('location', 'status', 'funding_goal', 'funds_raised', 'progress_percentage', 'featured')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'created_at', 'updated_at')
        }),
    )

@admin.register(DisasterDonation)
class DisasterDonationAdmin(admin.ModelAdmin):
    list_display = ('project', 'amount', 'donor_name', 'anonymous', 'created_at')
    list_filter = ('anonymous', 'project')
    search_fields = ('donor_name', 'donor_email', 'message')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {
            'fields': ('project', 'amount', 'transaction_id')
        }),
        ('Donor Information', {
            'fields': ('donor_name', 'donor_email', 'anonymous', 'message')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

@admin.register(EmergencyResource)
class EmergencyResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'source', 'order', 'created_at')
    list_filter = ('source',)
    search_fields = ('title', 'description', 'content')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'content')
        }),
        ('Source Information', {
            'fields': ('source', 'source_url')
        }),
        ('Display Settings', {
            'fields': ('order',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
