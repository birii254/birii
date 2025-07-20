from rest_framework import serializers
from ..models import Item, Category
from accounts.api.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'items_count']
    
    def get_items_count(self, obj):
        return obj.items.filter(status='active', admin_approved=True).count()

class ItemSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    is_favorited = serializers.SerializerMethodField()
    get_all_images = serializers.SerializerMethodField()
    
    class Meta:
        model = Item
        fields = [
            'id', 'name', 'description', 'price', 'condition', 'status',
            'image', 'image_2', 'image_3', 'image_4', 'image_5',
            'location', 'delivery_available', 'pickup_available',
            'views', 'favorites', 'is_featured', 'is_urgent', 'is_negotiable',
            'created_by', 'category', 'category_id', 'created_at', 'updated_at',
            'is_favorited', 'get_all_images'
        ]
        read_only_fields = ['views', 'favorites', 'created_by', 'created_at', 'updated_at']
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.item_favorites.filter(user=request.user).exists()
        return False
    
    def get_get_all_images(self, obj):
        return obj.get_all_images()