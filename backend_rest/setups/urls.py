from django.urls import path, include
from . import views

urlpatterns = [
    path('regions', views.RegionListView.as_view()),
    path('regions/<int:pk>', views.RegionManageView.as_view()),
    path('brands', views.BrandListView.as_view()),
    path('brands/<int:pk>', views.BrandManageView.as_view()),
    path('categories', views.CategoryListView.as_view()),
    path('categories/<int:pk>', views.CategoryManageView.as_view()),
    path('districts', views.DistrictListView.as_view()),
    path('districts/<int:pk>', views.DistrictManageView.as_view()),
    path('counts', views.SetupCounts.as_view()),
]

