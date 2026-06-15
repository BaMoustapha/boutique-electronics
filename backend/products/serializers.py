from rest_framework import serializers
from .models import Product, ProductImage
from categories.serializers import CategoryChildSerializer
from brands.serializers import BrandListSerializer


def make_absolute(request, url) -> str | None:
    """
    Garantit qu'une URL est absolue.
    - Déjà absolue (Cloudinary, https...) → retournée telle quelle
    - Relative (/media/...) → préfixée avec le domaine via request
    - image_field (ImageField/CloudinaryField) → on extrait .url d'abord
    """
    if not url:
        return None
    # Si c'est un champ image (pas une string), extraire l'URL
    if not isinstance(url, str):
        try:
            url = url.url
        except Exception:
            url = str(url) if url else None
    if not url:
        return None
    if url.startswith('http://') or url.startswith('https://'):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']

    def get_image(self, obj):
        request = self.context.get('request')
        return make_absolute(request, obj.image)


class ProductListSerializer(serializers.ModelSerializer):
    """Sérialiseur léger pour les grilles et listes."""
    category = CategoryChildSerializer(read_only=True)
    brand = BrandListSerializer(read_only=True)
    price = serializers.IntegerField()
    old_price = serializers.IntegerField(allow_null=True)
    primary_image = serializers.SerializerMethodField()
    discount_percent = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'brand',
            'price', 'old_price', 'discount_percent', 'is_on_sale',
            'status', 'stock_quantity', 'is_featured', 'is_new',
            'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        request = self.context.get('request')
        # obj.primary_image utilise le cache prefetch — pas de requête N+1
        img = obj.primary_image  # retourne un champ image ou None
        return make_absolute(request, img)


class ProductDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur complet pour la fiche produit."""
    category = CategoryChildSerializer(read_only=True)
    brand = BrandListSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    price = serializers.IntegerField()
    old_price = serializers.IntegerField(allow_null=True)
    primary_image = serializers.SerializerMethodField()
    discount_percent = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'brand',
            'price', 'old_price', 'discount_percent', 'is_on_sale',
            'description', 'specifications',
            'status', 'stock_quantity', 'is_featured', 'is_new',
            'images', 'primary_image',
            'views_count', 'created_at', 'updated_at',
        ]

    def get_primary_image(self, obj):
        request = self.context.get('request')
        img = obj.primary_image
        return make_absolute(request, img)
