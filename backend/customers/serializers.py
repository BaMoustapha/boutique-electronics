from rest_framework import serializers
from .models import Customer

class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = Customer
        fields = ['email', 'password', 'first_name', 'last_name', 'phone']

    def create(self, validated_data):
        return Customer.objects.create_user(**validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Customer
        fields       = ['id', 'email', 'first_name', 'last_name', 'phone', 'default_address', 'default_zone']
        read_only_fields = ['id', 'email']
