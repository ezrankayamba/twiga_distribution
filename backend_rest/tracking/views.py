from rest_framework import generics, permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from . import serializers
from . import models
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, renderer_classes
import re
from . import utils
from . import imports
import io


class CustomerListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['customers']
    serializer_class = serializers.CustomerSerializer

    def get_queryset(self):
        name = self.request.GET.get('name', '')
        region = self.request.GET.get('region', None)
        supplier = self.request.GET.get('supplier', None)
        category = self.request.GET.get('category', None)
        filt = {'name__contains': name}
        if region:
            filt['region_id'] = region
        if supplier:
            filt['distributor_id'] = supplier
        if category:
            filt['category_id'] = category

        return models.Customer.objects.filter(**filt)

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        customer = models.Customer.objects.create(**data)
        return Response(self.get_serializer(customer).data)


class SupplierListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []
    serializer_class = serializers.CustomerSerializer

    def get_queryset(self):
        return models.Customer.objects.filter(category__is_supplier=True)


class ListCustomersForMap(APIView):
    def get(self, request):
        return Response({
            'result': 0,
            'message': 'Successfully fetched customers for map',
            'data': serializers.CustomerSerializer(models.Customer.objects.all(), many=True).data
        })

    def post(self, request):
        filt = request.data
        print(filt)
        return Response({
            'result': 0,
            'message': 'Successfully fetched customers for map',
            'data': serializers.CustomerSerializer(models.Customer.objects.filter(**filt), many=True).data
        })


class CustomerSurveyDataView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = []

    def get(self, request, customer_id):
        print('Customer: ', customer_id)
        cust = models.Customer.objects.get(pk=customer_id)
        info = serializers.CustomerSerializer(cust).data
        info['location'] = utils.serializer_loc(info['lat'], info['lng'])
        contacts = serializers.ContactSerializer(models.Contact.objects.filter(customer=cust), many=True).data
        desc = serializers.DescriptionSerializer(models.Description.objects.filter(customer=cust).first()).data
        supply = serializers.RecordSerializer(models.Record.objects.filter(
            customer=cust, trushed=False), many=True).data
        res = {
            'Customer Information': info,
            'Customer Contacts': contacts,
            'Customer Description': desc,
            'Brand(s) Supplied': supply
        }
        return Response(res)

    def post(self, request):
        data = request.data
        utils.save_new_survey(data)

        return Response({
            'result': 0,
            'message': 'Successfully submited survey data'
        })

    def put(self, request, customer_id):
        data = request.data
        utils.update_survey(data, customer_id)
        return Response({
            'result': 0,
            'message': 'Successfully submited survey data'
        })


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    model = models.Customer
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['customers']
    serializer_class = serializers.CustomerSerializer

    def get_queryset(self):
        return models.Customer.objects.all()


class RecordListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['customers']
    serializer_class = serializers.RecordSerializer

    def get_queryset(self):
        remarks = self.request.GET.get('remarks', '')
        customer = self.request.GET.get('customer', None)
        filt = {'remarks__contains': remarks}
        if customer:
            filt['customer_id'] = customer
        return models.Record.objects.filter(**filt)

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        record = models.Record.objects.create(**data)
        return Response(self.get_serializer(record).data)


class RecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    model = models.Record
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['customers']
    serializer_class = serializers.RecordSerializer

    def get_queryset(self):
        return models.Record.objects.all()


class BulkCustomerUpload(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES['file']
        excel_file = io.BytesIO(file.read())
        imports.import_customers(excel_file)
        return Response({'result': 0, 'message': 'Successfully uploaded in bulk'})
