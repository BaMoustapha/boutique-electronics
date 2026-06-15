from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderCreateSerializer, OrderReadSerializer, OrderReadPublicSerializer
from .emails import send_order_notification, send_order_confirmation_to_customer


class OrderCreateView(APIView):
    """POST /api/orders/ — crée une commande (public, pas d'auth requise)."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Récupérer les produits et calculer le total
        product_ids = [item['product_id'] for item in data['items']]
        products = {p.id: p for p in Product.objects.filter(id__in=product_ids, is_active=True)}

        # Vérifier que tous les produits existent
        missing = [pid for pid in product_ids if pid not in products]
        if missing:
            return Response(
                {'detail': f'Produits introuvables : {missing}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = sum(
            products[item['product_id']].price * item['quantity']
            for item in data['items']
        )

        # Créer la commande
        order = Order.objects.create(
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            customer_email=data.get('customer_email', ''),
            delivery_zone=data['delivery_zone'],
            delivery_address=data['delivery_address'],
            note=data.get('note', ''),
            total_amount=total,
        )

        # Créer les lignes
        for item_data in data['items']:
            product = products[item_data['product_id']]
            qty = item_data['quantity']
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_price=product.price,
                quantity=qty,
                subtotal=product.price * qty,
            )

        # Envoyer les emails
        send_order_notification(order)
        send_order_confirmation_to_customer(order)

        return Response(
            OrderReadSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderDetailView(APIView):
    """GET /api/orders/{order_number}/ — consulte une commande par son numéro."""
    permission_classes = [AllowAny]

    def get(self, request, order_number):
        try:
            order = Order.objects.prefetch_related('items').get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderReadPublicSerializer(order).data)
