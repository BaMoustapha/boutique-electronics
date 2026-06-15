from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    model           = Customer
    list_display    = ['email', 'first_name', 'last_name', 'phone', 'is_active', 'date_joined']
    list_filter     = ['is_active', 'is_staff']
    search_fields   = ['email', 'first_name', 'last_name', 'phone']
    ordering        = ['-date_joined']
    fieldsets       = (
        (None,          {'fields': ('email', 'password')}),
        ('Infos',       {'fields': ('first_name', 'last_name', 'phone', 'default_address', 'default_zone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets   = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'password1', 'password2', 'first_name', 'last_name', 'phone'),
        }),
    )
