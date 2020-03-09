from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.CustomerListView.as_view()),
    path('<int:pk>', views.CustomerDetailView.as_view()),
]
