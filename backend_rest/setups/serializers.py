from . import models
from rest_framework import serializers
from users.serializers import UserSerializer


class DistrictSerializer(serializers.ModelSerializer):
    region_name = serializers.ReadOnlyField(source="region.name")

    class Meta:
        model = models.District
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'


class RegionSerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(read_only=True, many=True)

    class Meta:
        model = models.Region
        fields = '__all__'
