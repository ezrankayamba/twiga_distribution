from django.urls import path, include
from . import views

urlpatterns = [
    path('customers', views.CustomerListView.as_view()),
    path('suppliers', views.SupplierListView.as_view()),
    path('customers/<int:pk>', views.CustomerDetailView.as_view()),
    path('records', views.RecordListView.as_view()),
    path('survey', views.CustomerSurveyDataView.as_view()),
    path('survey/<int:customer_id>', views.CustomerSurveyDataView.as_view()),
]
