@@ .. @@
     # API endpoints
     path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
+    path('api/auth/logout/', include('rest_framework.urls')),
     path('api/auth/', include('accounts.api.urls')),
     path('api/items/', include('item.api.urls')),
     path('api/conversations/', include('conversation.api.urls')),
     path('api/', include('core.api.urls')),
+    
+    # Django Allauth URLs
+    path('accounts/', include('allauth.urls')),
 ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)