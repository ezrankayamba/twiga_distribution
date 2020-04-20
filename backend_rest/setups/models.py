from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_supplier = models.BooleanField(default=False)


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    on_us = models.BooleanField(default=False)


class Region(models.Model):
    name = models.CharField(max_length=100, unique=True)
    small = models.DecimalField(decimal_places=2, max_digits=20)
    medium = models.DecimalField(decimal_places=2, max_digits=20)
    large = models.DecimalField(decimal_places=2, max_digits=20)
    xlarge = models.DecimalField(decimal_places=2, max_digits=20)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, null=True)
    updated_at = models.DateTimeField(
        auto_now=True, auto_now_add=False, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class District(models.Model):
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='districts')

    class Meta:
        unique_together = ['name', 'region']
