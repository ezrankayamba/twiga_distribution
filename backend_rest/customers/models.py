from django.db import models
from django.contrib.auth.models import User

CUSTOMER_TYPES = [
    ('WHS', 'Whole Seller'),
    ('RET', 'Retail Seller'),
    ('BRK', 'Brick Maker'),
]


class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    small = models.DecimalField(decimal_places=2, max_digits=20)
    medium = models.DecimalField(decimal_places=2, max_digits=20)
    large = models.DecimalField(decimal_places=2, max_digits=20)
    xlarge = models.DecimalField(decimal_places=2, max_digits=20)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Customer(models.Model):
    name = models.CharField(max_length=100, unique=True)
    lat = models.DecimalField(decimal_places=6, max_digits=20)
    lon = models.DecimalField(decimal_places=6, max_digits=20)
    volume = models.DecimalField(decimal_places=2, max_digits=20)
    distributor = models.ForeignKey('Distributor', on_delete=models.CASCADE, related_name="customers")
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="customers")
    type = models.CharField(max_length=3, choices=CUSTOMER_TYPES)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Distributor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
