from django.urls import path, include
from . import views

urlpatterns = [
    path('batches/', views.BatchListView.as_view()),
    path('batches/<int:pk>', views.BatchDetailView.as_view()),
    path('batches/manual-create/', views.ManualEntryCreateBatchView.as_view()),
    path('batches/file-create/', views.FileUploadCreateBatchView.as_view()),
    path('batches/deletes', views.DeleteBatchesView.as_view()),
    path('fsm-states', views.FSMView.as_view()),
    path('execute-action', views.BatchActionExecutionView.as_view()),
]
