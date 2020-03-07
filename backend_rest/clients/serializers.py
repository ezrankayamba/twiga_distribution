from . import models
from rest_framework import serializers
from users.serializers import UserSerializer


class ClientUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = models.ClientUser
        fields = ('id', 'user', 'created_at', 'updated_at')


class ClientSerializer(serializers.ModelSerializer):
    users = ClientUserSerializer(many=True, read_only=True)

    class Meta:
        model = models.Client
        fields = ('id', 'name', 'account', 'created_at', 'updated_at', 'users')
