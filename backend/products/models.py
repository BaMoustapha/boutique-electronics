from django.db import models
from core.fields import FlexImageField


class Product(models.Model):
    STATUS_CHOICES = [
        ('in_stock',     'En stock'),
        ('low_stock',    'Stock limité'),
        ('out_of_stock', 'Rupture de stock'),
        ('on_order',     'Sur commande'),
    ]

    name           = models.CharField(max_length=300, verbose_name='Nom')
    slug           = models.SlugField(unique=True, max_length=350)
    category       = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='Catégorie',
    )
    brand          = models.ForeignKey(
        'brands.Brand',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name='Marque',
    )
    price          = models.DecimalField(max_digits=12, decimal_places=0, verbose_name='Prix (FCFA)')
    old_price      = models.DecimalField(
        max_digits=12, decimal_places=0,
        null=True, blank=True,
        verbose_name='Ancien prix (FCFA)',
    )
    description    = models.TextField(verbose_name='Description')
    specifications = models.JSONField(default=dict, blank=True, verbose_name='Caractéristiques')
    status         = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in_stock',
        verbose_name='Disponibilité',
    )
    stock_quantity = models.PositiveIntegerField(
        null=True, blank=True, verbose_name='Quantité en stock'
    )
    is_featured    = models.BooleanField(default=False, verbose_name='En vedette')
    is_new         = models.BooleanField(default=True, verbose_name='Nouveau')
    is_active      = models.BooleanField(default=True, verbose_name='Actif')
    views_count    = models.PositiveIntegerField(default=0, verbose_name='Vues')
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return int((1 - self.price / self.old_price) * 100)
        return 0

    @property
    def is_on_sale(self):
        return self.old_price is not None and self.old_price > self.price

    @property
    def primary_image(self):
        # Utilise self.images.all() pour bénéficier du prefetch_related cache
        # (évite le N+1 : .filter()/.first() bypassent le cache)
        all_images = self.images.all()
        primary = next((img for img in all_images if img.is_primary and img.image), None)
        img = primary or next((img for img in all_images if img.image), None)
        if not img:
            return None
        try:
            return img.image.url
        except Exception:
            return str(img.image) if img.image else None


class ProductImage(models.Model):
    product    = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image      = FlexImageField('image', blank=True, null=True)
    alt_text   = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False, verbose_name='Image principale')
    order      = models.PositiveIntegerField(default=0, verbose_name='Ordre')

    class Meta:
        verbose_name = 'Image produit'
        verbose_name_plural = 'Images produit'
        ordering = ['order']

    def __str__(self):
        return f'Image de {self.product.name}'
