from rest_framework import serializers
from .models import Category


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


class CategoryChildSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'image', 'order']

    def get_image(self, obj):
        return build_absolute_image_url(self.context.get('request'), obj.image)


class CategorySerializer(serializers.ModelSerializer):
    children = CategoryChildSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent', 'children',
            'image', 'icon', 'description', 'order', 'product_count',
        ]

    def get_image(self, obj):
        return build_absolute_image_url(self.context.get('request'), obj.image)


class CategoryListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    children = CategoryChildSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'children', 'icon', 'image', 'order']

    def get_image(self, obj):
        return build_absolute_image_url(self.context.get('request'), obj.image)
