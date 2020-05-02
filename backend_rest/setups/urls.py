from django.urls import path, include
from . import views

urlpatterns = [
    path('regions', views.RegionListView.as_view()),
    path('brands', views.BrandListView.as_view()),
    path('categories', views.CategoryListView.as_view()),
    path('categories/<int:pk>', views.CategoryManageView.as_view()),
    path('districts', views.DistrictListView.as_view()),
    path('counts', views.SetupCounts.as_view()),
]
