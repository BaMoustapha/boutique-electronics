from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Customer
from .serializers import CustomerRegisterSerializer, CustomerSerializer
from orders.models import Order
from orders.serializers import OrderReadSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class   = CustomerRegisterSerializer
    permission_classes = [AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class   = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LinkOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        count = Order.objects.filter(
            customer_email=request.user.email,
            customer=None
        ).update(customer=request.user)
        return Response({'linked': count})


class MyOrdersView(generics.ListAPIView):
    serializer_class   = OrderReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(customer=self.request.user)
            .prefetch_related('items')
            .order_by('-created_at')
        )
