"""
Champ image flexible : Cloudinary en production, ImageField en développement.
"""
import os


def get_image_field():
    """Retourne CloudinaryField si configuré, sinon ImageField."""
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    if cloud_name:
        from cloudinary.models import CloudinaryField
        return CloudinaryField
    else:
        from django.db.models import ImageField
        return ImageField


def FlexImageField(verbose_name='image', **kwargs):
    """Champ image compatible Cloudinary et local."""
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    if cloud_name:
        from cloudinary.models import CloudinaryField
        return CloudinaryField(verbose_name, **kwargs)
    else:
        from django.db.models import ImageField
        # ImageField n'a pas les mêmes kwargs que CloudinaryField
        safe_kwargs = {k: v for k, v in kwargs.items() if k in ('blank', 'null', 'upload_to')}
        safe_kwargs.setdefault('upload_to', 'images/')
        return ImageField(verbose_name=verbose_name, **safe_kwargs)
