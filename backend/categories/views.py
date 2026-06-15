from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from .models import Category
from .serializers import CategorySerializer, CategoryListSerializer


class CategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    list    : GET /api/categories/                     → arbre des catégories racines
    retrieve: GET /api/categories/{slug}/              → détail d'une catégorie
    products: GET /api/categories/{slug}/products/     → produits (filtres + tri + pagination)
    """
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer

    def get_queryset(self):
        if self.action == 'list':
            return Category.objects.filter(is_active=True, parent=None).prefetch_related('children')
        return Category.objects.filter(is_active=True).prefetch_related('children')

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        from products.models import Product
        from products.serializers import ProductListSerializer
        from products.filters import ProductFilter
        from rest_framework.filters import OrderingFilter
        from core.pagination import StandardPagination

        category = self.get_object()
        child_ids = list(category.children.values_list('id', flat=True))
        category_ids = [category.id] + child_ids

        queryset = Product.objects.filter(
            category_id__in=category_ids,
            is_active=True,
        ).select_related('category', 'brand').prefetch_related('images')

        # Appliquer ProductFilter (brand, min_price, max_price, status, is_featured, is_new)
        filterset = ProductFilter(request.GET, queryset=queryset)
        queryset = filterset.qs

        # Appliquer le tri (?ordering=price, -price, -created_at, -views_count)
        ordering = request.GET.get('ordering', '-created_at')
        allowed_orderings = {'price', '-price', 'created_at', '-created_at', 'views_count', '-views_count', 'name', '-name'}
        if ordering in allowed_orderings:
            queryset = queryset.order_by(ordering)

        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
