from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category', 'brand', 'price', 'old_price', 'status', 'stock_quantity', 'is_featured', 'is_new', 'is_active', 'views_count']
    list_filter    = ['status', 'is_featured', 'is_new', 'is_active', 'category', 'brand']
    search_fields  = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable  = ['status', 'is_featured', 'is_new', 'is_active']
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'discount_percent', 'is_on_sale']
    inlines        = [ProductImageInline]
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'slug', 'category', 'brand', 'description'),
        }),
        ('Prix', {
            'fields': ('price', 'old_price', 'discount_percent', 'is_on_sale'),
        }),
        ('Statut', {
            'fields': ('status', 'stock_quantity', 'is_featured', 'is_new', 'is_active'),
        }),
        ('Caractéristiques', {
            'fields': ('specifications',),
            'classes': ('collapse',),
        }),
        ('Statistiques', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_primary', 'order']
    list_filter  = ['is_primary']
