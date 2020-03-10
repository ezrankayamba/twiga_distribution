from . import models
from rest_framework import serializers
from users.serializers import UserSerializer


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Region
        fields = '__all__'


class DistributorSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Distributor
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Customer
        fields = '__all__'


class RecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Record
        fields = '__all__'
