import uuid
from django.db import models


def generate_order_number():
    return 'CMD-' + uuid.uuid4().hex[:8].upper()


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',   'En attente'),
        ('confirmed', 'Confirmée'),
        ('delivered', 'Livrée'),
        ('cancelled', 'Annulée'),
    ]

    order_number     = models.CharField(max_length=20, unique=True, editable=False)
    customer_name    = models.CharField(max_length=200, verbose_name='Nom du client')
    customer_phone   = models.CharField(max_length=20, verbose_name='Téléphone')
    customer_email   = models.EmailField(blank=True, verbose_name='Email')
    customer         = models.ForeignKey(
        'customers.Customer',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='orders',
        verbose_name='Compte client',
    )
    delivery_zone    = models.CharField(max_length=100, verbose_name='Zone de livraison')
    delivery_address = models.TextField(verbose_name='Adresse')
    note             = models.TextField(blank=True, verbose_name='Note')
    status           = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Statut'
    )
    total_amount     = models.DecimalField(
        max_digits=12, decimal_places=0, verbose_name='Total (FCFA)'
    )
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering            = ['-created_at']

    def __str__(self):
        return f'{self.order_number} — {self.customer_name}'

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Garantit l'unicité en cas de collision rare
            number = generate_order_number()
            while Order.objects.filter(order_number=number).exists():
                number = generate_order_number()
            self.order_number = number
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order         = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product       = models.ForeignKey(
        'products.Product', on_delete=models.PROTECT, verbose_name='Produit'
    )
    product_name  = models.CharField(max_length=300, verbose_name='Nom produit (snapshot)')
    product_price = models.DecimalField(
        max_digits=12, decimal_places=0, verbose_name='Prix unitaire (snapshot)'
    )
    quantity      = models.PositiveIntegerField(default=1, verbose_name='Quantité')
    subtotal      = models.DecimalField(
        max_digits=12, decimal_places=0, verbose_name='Sous-total'
    )

    class Meta:
        verbose_name        = 'Ligne de commande'
        verbose_name_plural = 'Lignes de commande'

    def __str__(self):
        return f'{self.quantity}× {self.product_name}'
