from rest_framework import generics
from rest_framework.response import Response
from item.models import Category, Item
from item.api.serializers import CategorySerializer, ItemSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True).order_by('name')
    serializer_class = CategorySerializer
    permission_classes = []

class FeaturedItemsView(generics.ListAPIView):
    queryset = Item.objects.filter(
        status='active', 
        admin_approved=True, 
        is_featured=True
    ).order_by('-created_at')[:6]
    serializer_class = ItemSerializer
    permission_classes = []