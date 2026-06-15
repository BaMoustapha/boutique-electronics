import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category   = django_filters.CharFilter(field_name='category__slug', lookup_expr='exact')
    brand      = django_filters.CharFilter(field_name='brand__slug', lookup_expr='exact')
    min_price  = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price  = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    status     = django_filters.CharFilter(field_name='status', lookup_expr='exact')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    is_new     = django_filters.BooleanFilter(field_name='is_new')

    class Meta:
        model = Product
        fields = ['category', 'brand', 'min_price', 'max_price', 'status', 'is_featured', 'is_new']
