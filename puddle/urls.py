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
    path('items/', include('item.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('inbox/', include('conversation.urls')),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),

    # API endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.api.urls')),
    path('api/items/', include('item.api.urls')),
    path('api/conversations/', include('conversation.api.urls')),
    path('api/', include('core.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
