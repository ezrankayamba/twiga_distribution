from rest_framework import generics, permissions
from oauth2_provider.contrib.rest_framework import TokenHasScope
from . import serializers
from . import models
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer


class RegionListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []
    serializer_class = serializers.RegionSerializer
    modal_class = models.Region

    def get_queryset(self):
        return models.Region.objects.all()


class DistrictListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []
    serializer_class = serializers.DistrictSerializer

    def get_queryset(self):
        return models.District.objects.all()


class BrandListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []
    serializer_class = serializers.BrandSerializer

    def get_queryset(self):
        return models.Brand.objects.all()


class CategoryListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        return models.Category.objects.all()


class SetupCounts(APIView):
    def get(self, request):
        return Response({
            'regions': models.Region.objects.count(),
            'districts': models.District.objects.count(),
            'brands': models.Brand.objects.count(),
            'categories': models.Category.objects.count()
        })
