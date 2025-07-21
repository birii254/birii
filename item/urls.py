from django.urls import path, include
from . import views  # Traditional Django views
from .api.views import (
    CategoryViewSet,
    ItemViewSet,
    ToggleFavoriteView
)
from rest_framework.routers import DefaultRouter

app_name = 'item'

# Create a router for API endpoints
router = DefaultRouter()
router.register(r'api/categories', CategoryViewSet, basename='category')
router.register(r'api/items', ItemViewSet, basename='item')

urlpatterns = [
    # Traditional Django views
    path('', views.items, name='items'),
    path('new/', views.new, name='new'),
    path('<int:pk>/', views.detail, name='detail'),
    path('<int:pk>/delete/', views.delete, name='delete'),
    path('<int:pk>/edit/', views.edit, name='edit'),
    
    # Include the router URLs
    path('', include(router.urls)),
    
    # Additional API endpoints not covered by ViewSets
    path('api/items/<int:item_id>/toggle-favorite/', 
        ToggleFavoriteView.as_view(), 
        name='toggle-favorite'),
]