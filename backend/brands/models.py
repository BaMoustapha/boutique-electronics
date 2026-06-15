from django.db import models
from core.fields import FlexImageField


class Brand(models.Model):
    name        = models.CharField(max_length=100, verbose_name='Nom')
    slug        = models.SlugField(unique=True)
    logo        = FlexImageField('logo', blank=True, null=True)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False, verbose_name='En vedette')
    is_active   = models.BooleanField(default=True, verbose_name='Active')

    class Meta:
        verbose_name = 'Marque'
        verbose_name_plural = 'Marques'
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()
