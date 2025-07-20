import django_filters
from ..models import Item, Category

class ItemFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    condition = django_filters.MultipleChoiceFilter(choices=Item.CONDITION_CHOICES)
    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    is_featured = django_filters.BooleanFilter()
    is_negotiable = django_filters.BooleanFilter()
    delivery_available = django_filters.BooleanFilter()
    pickup_available = django_filters.BooleanFilter()
    
    class Meta:
        model = Item
        fields = [
            'category', 'condition', 'min_price', 'max_price', 'location',
            'is_featured', 'is_negotiable', 'delivery_available', 'pickup_available'
        ]