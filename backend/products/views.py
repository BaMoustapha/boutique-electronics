from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import F
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer
from .filters import ProductFilter


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    list     : GET /api/products/                  → catalogue avec filtres
    retrieve : GET /api/products/{slug}/            → fiche produit
    related  : GET /api/products/{slug}/related/    → produits similaires
    featured : GET /api/products/featured/          → produits vedette
    new      : GET /api/products/new/               → nouveautés
    on_sale  : GET /api/products/on-sale/           → promotions
    search   : GET /api/search/?q=xxx               → recherche full-text
    """
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand__name', 'category__name']
    ordering_fields = ['price', 'created_at', 'views_count', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related(
            'category', 'brand'
        ).prefetch_related('images')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter le compteur de vues (F() évite les race conditions)
        Product.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(is_featured=True))
        page = self.paginate_queryset(queryset)
        serializer = ProductListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='new')
    def new(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(is_new=True))
        page = self.paginate_queryset(queryset)
        serializer = ProductListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='on-sale')
    def on_sale(self, request):
        # Produits avec un ancien prix supérieur au prix actuel
        queryset = self.filter_queryset(self.get_queryset().filter(
            old_price__isnull=False,
            old_price__gt=F('price'),
        ))
        page = self.paginate_queryset(queryset)
        serializer = ProductListSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['get'], url_path='related')
    def related(self, request, slug=None):
        product = self.get_object()
        queryset = self.get_queryset().filter(
            category=product.category
        ).exclude(pk=product.pk)[:8]
        serializer = ProductListSerializer(queryset, many=True)
        return Response(serializer.data)
