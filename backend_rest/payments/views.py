from rest_framework import generics, permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from . import serializers
from . import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from . import imports
from . import fsm
from . import actions


class BatchListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']
    serializer_class = serializers.BatchSerializer

    def get_queryset(self):
        return models.Batch.objects.all()


class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    model = models.Batch
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']
    serializer_class = serializers.BatchSerializer

    def get_queryset(self):
        return models.Batch.objects.all()


class DeleteBatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']

    def post(self, request, format=None):
        ids = request.data
        models.Batch.objects.filter(pk__in=ids).delete()
        return Response({
            'status': 0,
            'message': f'Successfully deleted {len(ids)} records'
        })


class ManualEntryCreateBatchView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']

    def post(self, request, format=None):
        data = request.data
        batch = models.Batch.objects.create(name=data['name'], comments=data['comments'], status=1)
        records = data['records']
        for r in records:
            models.Payment.objects.create(account=r['account'], amount=r['amount'], reason=r['reason'], batch=batch)

        return Response({
            'status': 0,
            'message': f'Successfully created {len(records)} records',
            'batchId': 123
        })


class FileUploadCreateBatchView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, format=None):
        data = request.data
        batch = models.Batch.objects.create(name=data['name'], comments=data['comments'])
        excel_file = request.FILES['file']
        print(excel_file)
        # imports.import_batch(excel_file, batch)
        models.BatchFile.objects.create(file=excel_file, batch=batch)
        return Response({
            'status': 0,
            'message': f'Successfully created -- records',
            'batchId': 123
        })


class FSMView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments']

    def get(self, request, format=None):
        return Response(fsm.get_states())


class BatchActionExecutionView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['payments', 'clients']

    def post(self, request, format=None):
        data = request.data
        action = data['action']
        executor = actions.ActionExecutor()
        executor.execute(action, data=data)
        return Response({
            'status': 0,
            'message': f'Successfully executed batch action: {action}'
        })
