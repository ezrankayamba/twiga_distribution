from django.urls import path, include
from . import views, reports

urlpatterns = [
    path('customers', views.CustomerListView.as_view()),
    path('suppliers', views.SupplierListView.as_view()),
    path('customers/<int:pk>', views.CustomerDetailView.as_view()),
    path('records', views.RecordListView.as_view()),
    path('survey', views.CustomerSurveyDataView.as_view()),
    path('survey/bulk', views.BulkCustomerUpload.as_view()),
    path('survey/<int:customer_id>', views.CustomerSurveyDataView.as_view()),
    path('customers-for-map', views.ListCustomersForMap.as_view()),
    path('reports/share-by-category', reports.get_share_by_category),
    path('reports/share-by-region', reports.get_share_by_region),
]
