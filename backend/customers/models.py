from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomerManager

class Customer(AbstractUser):
    username        = None
    email           = models.EmailField(unique=True)
    phone           = models.CharField(max_length=20, blank=True)
    default_address = models.TextField(blank=True)
    default_zone    = models.CharField(max_length=100, blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []
    objects         = CustomerManager()

    class Meta:
        verbose_name        = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.email
