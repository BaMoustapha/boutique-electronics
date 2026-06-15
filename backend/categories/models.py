from django.db import models
from core.fields import FlexImageField


class Category(models.Model):
    name        = models.CharField(max_length=200, verbose_name='Nom')
    slug        = models.SlugField(unique=True)
    parent      = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.SET_NULL,
        verbose_name='Catégorie parente',
    )
    image       = FlexImageField('image', blank=True, null=True)
    icon        = models.CharField(max_length=50, blank=True, verbose_name='Icône Lucide')
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    is_active   = models.BooleanField(default=True, verbose_name='Active')

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['order', 'name']

    def __str__(self):
        if self.parent:
            return f'{self.parent.name} > {self.name}'
        return self.name

    @property
    def product_count(self):
        # Inclure les produits des sous-catégories directes
        from products.models import Product
        child_ids = list(self.children.values_list('id', flat=True))
        category_ids = [self.id] + child_ids
        return Product.objects.filter(category_id__in=category_ids, is_active=True).count()
