from . import models
from rest_framework import serializers
from users.serializers import UserSerializer
from setups.serializers import CategorySerializer, RegionSerializer, BrandSerializer


class ContactSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Contact
        fields = '__all__'


class DescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Description
        fields = '__all__'


class RecordSerializer(serializers.ModelSerializer):
    # customer = CustomerSerializer(many=False, read_only=True)
    brand = BrandSerializer(many=False, read_only=True)
    # supplier = CustomerSerializer(many=False, read_only=True)

    class Meta:
        model = models.Record
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    category = CategorySerializer
    region = RegionSerializer(many=False, read_only=True)
    records = RecordSerializer(many=True, read_only=True)

    class Meta:
        model = models.Customer
        fields = '__all__'
        depth = 3
