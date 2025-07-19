from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'items', views.ItemViewSet)
router.register(r'categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('items/<int:item_id>/toggle-favorite/', views.ToggleFavoriteView.as_view(), name='toggle-favorite'),
]