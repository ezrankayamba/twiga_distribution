from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    name = models.CharField(max_length=100, unique=True)
    account = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class ClientUser(models.Model):
    user = models.OneToOneField(User, related_name="client_user", on_delete=models.CASCADE, null=True, blank=True)
    client = models.ForeignKey(to=Client, related_name="users", on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False, null=True)

    class Meta:
        ordering = ['-created_at']
