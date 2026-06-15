from rest_framework import serializers
from .models import Brand


def build_absolute_image_url(request, image_field) -> str | None:
    if not image_field:
        return None
    try:
        url = image_field.url
    except Exception:
        url = str(image_field) if image_field else None
    if not url:
        return None
    if url.startswith('http://') or url.startswith('https://'):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url


class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'description', 'is_featured', 'product_count']

    def get_logo(self, obj):
        return build_absolute_image_url(self.context.get('request'), obj.logo)


class BrandListSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'is_featured']

    def get_logo(self, obj):
        return build_absolute_image_url(self.context.get('request'), obj.logo)
