from . import models
from rest_framework import serializers


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Payment
        fields = ('id', 'account', "reason", 'amount', 'batch')


class BatchSerializer(serializers.ModelSerializer):
    records = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Batch
        fields = ('id', 'name', 'comments', 'created_at', 'updated_at', 'records', 'status')
