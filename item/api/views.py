from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.db.models import Q, F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Item, Category, ItemFavorite, ItemView
from .serializers import ItemSerializer, CategorySerializer
from .filters import ItemFilter

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('name')
    serializer_class = CategorySerializer
    permission_classes = []

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(status='active', admin_approved=True)
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ItemFilter
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['created_at', 'price', 'views', 'favorites']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            return queryset
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track view
        ip_address = get_client_ip(request)
        view, created = ItemView.objects.get_or_create(
            item=instance,
            user=request.user if request.user.is_authenticated else None,
            ip_address=ip_address
        )
        
        if created:
            Item.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        item = self.get_object()
        related_items = Item.objects.filter(
            category=item.category,
            status='active',
            admin_approved=True
        ).exclude(pk=pk)[:3]
        
        serializer = self.get_serializer(related_items, many=True)
        return Response(serializer.data)

class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, item_id):
        item = get_object_or_404(Item, id=item_id)
        favorite, created = ItemFavorite.objects.get_or_create(
            item=item, 
            user=request.user
        )
        
        if not created:
            favorite.delete()
            Item.objects.filter(pk=item_id).update(favorites=F('favorites') - 1)
            favorited = False
        else:
            Item.objects.filter(pk=item_id).update(favorites=F('favorites') + 1)
            favorited = True
        
        return Response({
            'favorited': favorited,
            'favorites_count': item.favorites
        })