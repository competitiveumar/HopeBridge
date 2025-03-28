from django.contrib import admin
from .models import FocusArea, OrganizationType, Application, ApplicationDocument, ApplicationStatusHistory
from django.utils import timezone

@admin.register(FocusArea)
class FocusAreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(OrganizationType)
class OrganizationTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('name',)


class ApplicationDocumentInline(admin.TabularInline):
    model = ApplicationDocument
    extra = 0
    fields = ('document_type', 'file', 'description', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


class ApplicationStatusHistoryInline(admin.TabularInline):
    model = ApplicationStatusHistory
    extra = 0
    fields = ('status', 'notes', 'changed_by', 'changed_at')
    readonly_fields = ('changed_at',)
    ordering = ('-changed_at',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'organization_name', 'contact_full_name', 'email', 'status',
        'submitted_at', 'reviewed_at'
    )
    list_filter = ('status', 'organization_type', 'primary_focus_area', 'submitted_at')
    search_fields = (
        'organization_name', 'email', 'contact_first_name', 'contact_last_name',
        'contact_email', 'address', 'city', 'state'
    )
    readonly_fields = ('created_at', 'updated_at', 'submitted_at', 'ip_address')
    date_hierarchy = 'submitted_at'
    inlines = [ApplicationDocumentInline, ApplicationStatusHistoryInline]
    
    fieldsets = (
        ('Organization Information', {
            'fields': (
                'organization_name', 'email', 'phone', 'website',
                'address', 'city', 'state', 'zip_code'
            )
        }),
        ('Organization Details', {
            'fields': (
                'organization_type', 'tax_id_number', 'founding_year',
                'mission_statement', 'description'
            )
        }),
        ('Contact Information', {
            'fields': (
                'contact_first_name', 'contact_last_name', 'contact_email',
                'contact_phone', 'contact_position'
            )
        }),
        ('Additional Information', {
            'fields': (
                'primary_focus_area', 'annual_budget', 'staff_size',
                'has_volunteers', 'volunteer_count', 'additional_information'
            ),
            'classes': ('collapse',)
        }),
        ('Application Status', {
            'fields': ('status', 'status_notes', 'reviewer_notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'submitted_at', 'reviewed_at', 'reviewed_by', 'ip_address'),
            'classes': ('collapse',)
        }),
    )
    
    def contact_full_name(self, obj):
        return f"{obj.contact_first_name} {obj.contact_last_name}"
    contact_full_name.short_description = 'Contact Name'
    
    def save_model(self, request, obj, form, change):
        # Set reviewed_by if status changes from pending
        if change:
            old_obj = Application.objects.get(pk=obj.pk)
            if old_obj.status == 'pending' and obj.status != 'pending':
                obj.reviewed_by = request.user.get_full_name() or request.user.username
                obj.reviewed_at = timezone.now()
        
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        
        # Set changed_by for status history entries
        for instance in instances:
            if isinstance(instance, ApplicationStatusHistory):
                instance.changed_by = request.user.get_full_name() or request.user.username
        
        formset.save()


@admin.register(ApplicationDocument)
class ApplicationDocumentAdmin(admin.ModelAdmin):
    list_display = ('application', 'document_type', 'description', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('application__organization_name', 'document_type', 'description')
    date_hierarchy = 'uploaded_at'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return ('application', 'file', 'uploaded_at')
        return ('uploaded_at',) 