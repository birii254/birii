from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', include('core.urls')),
    path('items/', include('item.urls')),  # For traditional Django views
    path('dashboard/', include('dashboard.urls')),
    path('inbox/', include('conversation.urls')),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),

    # API endpoints - organized by version and app
    path('api/auth/', include('accounts.api.urls')),  # All auth endpoints
    path('api/items/', include('item.api.urls')),     # All item endpoints
    path('api/conversations/', include('conversation.api.urls')),
    path('api/core/', include('core.api.urls')),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# For serving media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)