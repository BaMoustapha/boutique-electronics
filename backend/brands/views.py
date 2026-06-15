from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from .models import Brand
from .serializers import BrandSerializer, BrandListSerializer


class BrandViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    list    : GET /api/brands/                     → toutes les marques
    retrieve: GET /api/brands/{slug}/              → détail d'une marque
    products: GET /api/brands/{slug}/products/     → produits (filtres + tri + pagination)
    """
    queryset = Brand.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return BrandListSerializer
        return BrandSerializer

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        from products.models import Product
        from products.serializers import ProductListSerializer
        from products.filters import ProductFilter
        from core.pagination import StandardPagination

        brand = self.get_object()
        queryset = Product.objects.filter(
            brand=brand,
            is_active=True,
        ).select_related('category', 'brand').prefetch_related('images')

        # Appliquer ProductFilter (category, min_price, max_price, status, is_featured, is_new)
        filterset = ProductFilter(request.GET, queryset=queryset)
        queryset = filterset.qs

        # Appliquer le tri
        ordering = request.GET.get('ordering', '-created_at')
        allowed_orderings = {'price', '-price', 'created_at', '-created_at', 'views_count', '-views_count', 'name', '-name'}
        if ordering in allowed_orderings:
            queryset = queryset.order_by(ordering)

        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ProductListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
