@@ .. @@
 from rest_framework.permissions import IsAuthenticated
 from django.contrib.auth.models import User
+from django.core.files.storage import default_storage
+from django.core.files.base import ContentFile
 from .serializers import UserRegistrationSerializer, UserProfileSerializer
 from ..models import UserProfile
 from item.models import ItemFavorite
@@ .. @@
 class ProfileView(generics.RetrieveUpdateAPIView):
     serializer_class = UserProfileSerializer
     permission_classes = [IsAuthenticated]
+    
+    def get_serializer_context(self):
+        context = super().get_serializer_context()
+        context['request'] = self.request
+        return context
     
     def get_object(self):
         profile, created = UserProfile.objects.get_or_create(user=self.request.user)
         return profile
+    
+    def perform_update(self, serializer):
+        # Handle profile picture upload
+        if 'profile_picture' in self.request.FILES:
+            profile_picture = self.request.FILES['profile_picture']
+            # Save the file using Cloudinary (already configured in settings)
+            serializer.save(profile_picture=profile_picture)
+        else:
+            serializer.save()