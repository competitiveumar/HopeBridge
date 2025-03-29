from django.contrib import admin
from .models import Project, Donation, FundAllocation

class FundAllocationInline(admin.StackedInline):
    model = FundAllocation
    min_num = 1
    max_num = 1

class DonationInline(admin.TabularInline):
    model = Donation
    extra = 0
    readonly_fields = ['payment_id', 'created_at']
    fields = ['donor', 'amount', 'status', 'anonymous', 'created_at']
    can_delete = False

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'status', 'goal', 'raised', 'featured', 'created_at']
    list_filter = ['status', 'featured', 'categories']
    search_fields = ['title', 'description', 'organization']
    readonly_fields = ['raised']
    inlines = [FundAllocationInline, DonationInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'image', 'organization')
        }),
        ('Funding', {
            'fields': ('goal', 'raised', 'status')
        }),
        ('Categorization', {
            'fields': ('categories', 'location', 'featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at', 'raised']

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'donor_display', 'amount', 'status', 'created_at']
    list_filter = ['status', 'anonymous', 'created_at']
    search_fields = ['project__title', 'donor__username', 'donor__email', 'email', 'payment_id']
    readonly_fields = ['payment_id', 'created_at']
    
    def donor_display(self, obj):
        if obj.anonymous:
            return 'Anonymous'
        if obj.donor:
            return obj.donor.get_full_name() or obj.donor.username
        return obj.email or 'Unknown'
    donor_display.short_description = 'Donor' 