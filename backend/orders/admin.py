from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model  = OrderItem
    extra  = 0
    fields = ['product', 'product_name', 'product_price', 'quantity', 'subtotal']
    readonly_fields = ['product_name', 'product_price', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display   = [
        'order_number', 'customer_name', 'customer_phone',
        'delivery_zone', 'total_amount_display', 'status_badge', 'created_at'
    ]
    list_filter    = ['status', 'delivery_zone', 'created_at']
    search_fields  = ['order_number', 'customer_name', 'customer_phone', 'customer_email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    list_editable  = ['status'] if False else []  # édition inline désactivée (sécurité)
    ordering       = ['-created_at']
    inlines        = [OrderItemInline]

    fieldsets = (
        ('Commande', {
            'fields': ('order_number', 'status', 'total_amount', 'created_at', 'updated_at')
        }),
        ('Client', {
            'fields': ('customer_name', 'customer_phone', 'customer_email')
        }),
        ('Livraison', {
            'fields': ('delivery_zone', 'delivery_address', 'note')
        }),
    )

    def total_amount_display(self, obj):
        return f"{int(obj.total_amount):,} F CFA".replace(',', '\u202f')
    total_amount_display.short_description = 'Total'

    def status_badge(self, obj):
        colors = {
            'pending':   '#f59e0b',
            'confirmed': '#3b82f6',
            'delivered': '#22c55e',
            'cancelled': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:9999px;font-size:12px">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Statut'
