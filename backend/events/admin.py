from django.contrib import admin
from .models import (
    EventCategory,
    Event,
    EventImage,
    EventRegistration,
    EventWorkshop,
    VolunteerPosition,
    VolunteerApplication
)

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


class EventImageInline(admin.TabularInline):
    model = Event.gallery_images.through
    extra = 1


@admin.register(EventImage)
class EventImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    readonly_fields = ('registration_date',)


class EventWorkshopInline(admin.TabularInline):
    model = EventWorkshop
    extra = 0


class VolunteerPositionInline(admin.TabularInline):
    model = VolunteerPosition
    extra = 0


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'start_date', 'end_date', 'location', 'is_virtual', 'is_featured', 'is_active')
    list_filter = ('status', 'is_virtual', 'is_featured', 'is_active', 'start_date')
    search_fields = ('title', 'description', 'location', 'city', 'country')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'short_description', 'status')
        }),
        ('Date and Location', {
            'fields': ('start_date', 'end_date', 'location', 'address', 'city', 'country', 'postal_code', 'is_virtual')
        }),
        ('Registration and Fundraising', {
            'fields': ('registration_required', 'registration_deadline', 'max_participants', 
                     'registration_fee', 'fundraising_goal', 'amount_raised')
        }),
        ('Categorization', {
            'fields': ('categories', 'tags', 'is_featured', 'is_active')
        }),
        ('Additional Info', {
            'fields': ('organizer', 'website_url', 'featured_image', 'created_at', 'updated_at')
        }),
    )
    inlines = [EventImageInline, EventWorkshopInline, VolunteerPositionInline, EventRegistrationInline]
    filter_horizontal = ('categories',)


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'registration_date', 'status', 'payment_status')
    list_filter = ('status', 'payment_status', 'registration_date')
    search_fields = ('user__username', 'user__email', 'event__title', 'notes')
    readonly_fields = ('registration_date',)
    date_hierarchy = 'registration_date'


@admin.register(EventWorkshop)
class EventWorkshopAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'start_time', 'end_time', 'host', 'is_active')
    list_filter = ('is_active', 'start_time')
    search_fields = ('title', 'description', 'event__title', 'host__username')


@admin.register(VolunteerPosition)
class VolunteerPositionAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'slots', 'filled_slots', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description', 'requirements', 'event__title')


class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'position', 'application_date', 'status')
    list_filter = ('status', 'application_date')
    search_fields = ('user__username', 'user__email', 'position__title', 'position__event__title', 'message')
    readonly_fields = ('application_date',)
    date_hierarchy = 'application_date'
    actions = ['approve_applications', 'reject_applications']
    
    def approve_applications(self, request, queryset):
        for application in queryset.filter(status='pending'):
            position = application.position
            if position.filled_slots < position.slots:
                application.status = 'approved'
                application.save()
                position.filled_slots += 1
                position.save()
        self.message_user(request, f"Selected applications have been approved.")
    
    def reject_applications(self, request, queryset):
        queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f"Selected applications have been rejected.")
    
    approve_applications.short_description = "Approve selected applications"
    reject_applications.short_description = "Reject selected applications"


admin.site.register(VolunteerApplication, VolunteerApplicationAdmin) 