from django.db import models
from django.contrib.auth.models import User
from setups import models as s_models


class Customer(models.Model):
    name = models.CharField(max_length=100)
    lat = models.DecimalField(decimal_places=8, max_digits=20, null=True)
    lng = models.DecimalField(decimal_places=8, max_digits=20, null=True)
    supplier = models.ForeignKey('Customer', on_delete=models.CASCADE, related_name="customers", null=True)
    category = models.ForeignKey(s_models.Category, on_delete=models.CASCADE, related_name="customers", null=True)
    region = models.ForeignKey(s_models.Region, on_delete=models.CASCADE, related_name="customers", null=True)
    district = models.ForeignKey(s_models.District, on_delete=models.CASCADE, related_name="customers", null=True)
    town = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    share = models.DecimalField(max_digits=4, decimal_places=2)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class Description(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    fleet_size = models.DecimalField(max_digits=10, decimal_places=2)
    trucks = models.DecimalField(max_digits=10, decimal_places=2)
    system = models.CharField(max_length=100)
    outlets = models.DecimalField(max_digits=10, decimal_places=2)
    machines = models.DecimalField(max_digits=10, decimal_places=2)
    types = models.CharField(max_length=100)
    business = models.CharField(max_length=100)


class Contact(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100, null=True)
    mobile = models.CharField(max_length=100, null=True)
    email = models.CharField(max_length=100, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="contacts")


class Record(models.Model):
    volume = models.DecimalField(decimal_places=2, max_digits=20)
    remarks = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="records")
    brand = models.ForeignKey(s_models.Brand, on_delete=models.PROTECT)
    supplier = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="supplier_records", null=True)
    trushed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.created_at.month:2}/{self.created_at.year:4}'

    class Meta:
        ordering = ['-created_at']
