from django.core.management.base import BaseCommand
from item.models import Category
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Create initial categories for Matrix Marketplace'

    def handle(self, *args, **options):
        self.stdout.write('Starting category creation...')
        
        categories = [
            # Electronics & Appliances
            {'name': 'Electronics & Appliances', 'slug': 'electronics-appliances', 'category_type': 'electronics', 'icon': 'fas fa-laptop'},
            
            # Fashion & Beauty
            {'name': 'Fashion & Beauty', 'slug': 'fashion-beauty', 'category_type': 'fashion_beauty', 'icon': 'fas fa-tshirt'},
            
            # Home & Furniture
            {'name': 'Home & Furniture', 'slug': 'home-furniture', 'category_type': 'home_furniture', 'icon': 'fas fa-couch'},
            
            # Vehicles & Auto Parts
            {'name': 'Vehicles & Auto Parts', 'slug': 'vehicles-auto-parts', 'category_type': 'vehicles_auto', 'icon': 'fas fa-car'},
            
            # Property & Real Estate
            {'name': 'Property & Real Estate', 'slug': 'property-real-estate', 'category_type': 'property_real_estate', 'icon': 'fas fa-home'},
            
            # Jobs & Services
            {'name': 'Jobs & Services', 'slug': 'jobs-services', 'category_type': 'jobs_services', 'icon': 'fas fa-briefcase'},
            
            # Agriculture & Food
            {'name': 'Agriculture & Food', 'slug': 'agriculture-food', 'category_type': 'agriculture_food', 'icon': 'fas fa-seedling'},
            
            # Health & Wellness
            {'name': 'Health & Wellness', 'slug': 'health-wellness', 'category_type': 'health_wellness', 'icon': 'fas fa-heartbeat'},
            
            # Kids & Baby
            {'name': 'Kids & Baby', 'slug': 'kids-baby', 'category_type': 'kids_baby', 'icon': 'fas fa-baby'},
            
            # Education & Training
            {'name': 'Education & Training', 'slug': 'education-training', 'category_type': 'education_training', 'icon': 'fas fa-graduation-cap'},
            
            # Events & Entertainment
            {'name': 'Events & Entertainment', 'slug': 'events-entertainment', 'category_type': 'events_entertainment', 'icon': 'fas fa-music'},
            
            # Others
            {'name': 'Others', 'slug': 'others', 'category_type': 'others', 'icon': 'fas fa-ellipsis-h'},
        ]

        created_count = 0
        updated_count = 0
        
        for cat_data in categories:
            try:
                category, created = Category.objects.get_or_create(
                    slug=cat_data['slug'],
                    defaults=cat_data
                )
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created category: {category.name}')
                    )
                else:
                    # Update existing category with new data
                    for key, value in cat_data.items():
                        if key != 'slug':  # Don't update slug
                            setattr(category, key, value)
                    category.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'Updated existing category: {category.name}')
                    )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating/updating category {cat_data["name"]}: {str(e)}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Category management complete: {created_count} created, {updated_count} updated'
            )
        )