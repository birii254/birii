from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Traditional Django Views (for server-rendered pages)
    path('profile/', views.profile, name='profile'),
    path('favorites/', views.favorites, name='favorites'),
    path('settings/', views.settings, name='settings'),
    path('toggle-favorite/<int:item_id>/', views.toggle_favorite, name='toggle_favorite'),
    
    # API Endpoints (for React frontend)
    path('api/login/', views.LoginAPIView.as_view(), name='api-login'),
    path('api/profile/', views.ProfileAPIView.as_view(), name='api-profile'),
    path('api/register/', views.RegisterAPIView.as_view(), name='api-register'),
    
    # Add other API endpoints as needed
]