from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity   = serializers.IntegerField(min_value=1, max_value=100)


class OrderCreateSerializer(serializers.Serializer):
    customer_name    = serializers.CharField(max_length=200)
    customer_phone   = serializers.CharField(max_length=20)
    customer_email   = serializers.EmailField(required=False, allow_blank=True, default='')
    delivery_zone    = serializers.CharField(max_length=100)
    delivery_address = serializers.CharField()
    note             = serializers.CharField(required=False, allow_blank=True, default='')
    items            = OrderItemInputSerializer(many=True, min_length=1)


class OrderItemReadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_price', 'quantity', 'subtotal']


class OrderReadSerializer(serializers.ModelSerializer):
    """Serializer complet — réservé aux endpoints authentifiés."""
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_phone', 'customer_email',
            'delivery_zone', 'delivery_address', 'note', 'status', 'total_amount',
            'items', 'created_at',
        ]


class OrderReadPublicSerializer(serializers.ModelSerializer):
    """Serializer public — retire customer_email pour limiter l'exposition PII."""
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'order_number', 'customer_name', 'customer_phone',
            'delivery_zone', 'delivery_address', 'note', 'status', 'total_amount',
            'items', 'created_at',
        ]
