from django.contrib import admin
from .models import GiftCardDesign, GiftCard, GiftCardRedemption

@admin.register(GiftCardDesign)
class GiftCardDesignAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(GiftCard)
class GiftCardAdmin(admin.ModelAdmin):
    list_display = ('code', 'amount', 'sender_name', 'recipient_name', 'status', 'card_type', 'purchased_at')
    list_filter = ('status', 'card_type', 'purchased_at')
    search_fields = ('code', 'sender_name', 'sender_email', 'recipient_name', 'recipient_email')
    readonly_fields = ('code', 'purchased_at', 'redeemed_at')
    fieldsets = (
        (None, {
            'fields': ('code', 'amount', 'design', 'status', 'card_type')
        }),
        ('Sender Information', {
            'fields': ('sender_name', 'sender_email')
        }),
        ('Recipient Information', {
            'fields': ('recipient_name', 'recipient_email', 'message')
        }),
        ('Transaction Information', {
            'fields': ('payment_id', 'purchased_at', 'expiration_date', 'redeemed_at', 'created_by', 'redeemed_by')
        }),
    )

@admin.register(GiftCardRedemption)
class GiftCardRedemptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'gift_card', 'redeemed_by', 'nonprofit_name', 'amount', 'redeemed_at')
    list_filter = ('redeemed_at',)
    search_fields = ('gift_card__code', 'redeemed_by__email', 'nonprofit_name')
    readonly_fields = ('redeemed_at',)
