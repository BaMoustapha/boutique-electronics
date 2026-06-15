# backend/customers/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Customer
from orders.models import Order


class RegisterTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        res = self.client.post(reverse('customer-register'), {
            'email': 'test@example.com',
            'password': 'motdepasse123',
            'first_name': 'Mamadou',
            'last_name': 'Diallo',
            'phone': '221771234567',
        }, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Customer.objects.filter(email='test@example.com').exists())

    def test_register_duplicate_email(self):
        Customer.objects.create_user(email='test@example.com', password='pass12345')
        res = self.client.post(reverse('customer-register'), {
            'email': 'test@example.com',
            'password': 'motdepasse123',
            'first_name': 'Autre',
            'last_name': 'Client',
        }, format='json')
        self.assertEqual(res.status_code, 400)

    def test_register_short_password(self):
        res = self.client.post(reverse('customer-register'), {
            'email': 'short@example.com',
            'password': '123',
        }, format='json')
        self.assertEqual(res.status_code, 400)


class MeTest(TestCase):
    def setUp(self):
        self.client   = APIClient()
        self.customer = Customer.objects.create_user(
            email='me@example.com',
            password='pass12345',
            first_name='Fatou',
            last_name='Sow',
        )
        token_res = self.client.post(reverse('token_obtain_pair'), {
            'email': 'me@example.com', 'password': 'pass12345'
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token_res.data["access"]}')

    def test_get_profile(self):
        res = self.client.get(reverse('customer-me'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['email'], 'me@example.com')

    def test_update_profile(self):
        res = self.client.put(reverse('customer-me'), {
            'first_name': 'Fatou',
            'last_name': 'Sow',
            'phone': '221771234567',
            'default_address': 'Mermoz, Dakar',
            'default_zone': 'Mermoz',
        }, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['default_zone'], 'Mermoz')

    def test_get_profile_unauthenticated(self):
        self.client.credentials()
        res = self.client.get(reverse('customer-me'))
        self.assertEqual(res.status_code, 401)


class LinkOrdersTest(TestCase):
    def setUp(self):
        self.client   = APIClient()
        self.customer = Customer.objects.create_user(
            email='buyer@example.com', password='pass12345'
        )
        Order.objects.create(
            customer_name='Buyer Test',
            customer_phone='221771234567',
            customer_email='buyer@example.com',
            delivery_zone='Mermoz',
            delivery_address='Rue 10',
            total_amount=50000,
        )
        token_res = self.client.post(reverse('token_obtain_pair'), {
            'email': 'buyer@example.com', 'password': 'pass12345'
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token_res.data["access"]}')

    def test_link_orders(self):
        res = self.client.post(reverse('customer-link-orders'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['linked'], 1)
        order = Order.objects.get(customer_email='buyer@example.com')
        self.assertEqual(order.customer, self.customer)

    def test_link_orders_my_orders(self):
        self.client.post(reverse('customer-link-orders'))
        res = self.client.get(reverse('customer-orders'))
        self.assertEqual(res.status_code, 200)
        results = res.data.get('results', res.data)
        self.assertEqual(len(results), 1)
