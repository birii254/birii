@@ .. @@
 class UserProfileSerializer(serializers.ModelSerializer):
     user = UserSerializer(read_only=True)
+    first_name = serializers.CharField(source='user.first_name', required=False)
+    last_name = serializers.CharField(source='user.last_name', required=False)
+    email = serializers.EmailField(source='user.email', required=False)
     
     class Meta:
         model = UserProfile
-        fields = '__all__'
+        fields = [
+            'id', 'user', 'first_name', 'last_name', 'email',
+            'phone_number', 'profile_picture', 'bio', 'location', 
+            'country', 'account_type', 'business_name', 'is_verified',
+            'verification_status', 'rating', 'total_reviews',
+            'email_notifications', 'sms_notifications', 'marketing_emails',
+            'theme_preference', 'date_joined', 'last_active'
+        ]
+        read_only_fields = ['user', 'is_verified', 'verification_status', 'rating', 'total_reviews']
+    
+    def update(self, instance, validated_data):
+        # Handle user fields
+        user_data = {}
+        if 'user' in validated_data:
+            user_data = validated_data.pop('user')
+        
+        # Update user fields
+        user = instance.user
+        for attr, value in user_data.items():
+            setattr(user, attr, value)
+        user.save()
+        
+        # Update profile fields
+        for attr, value in validated_data.items():
+            setattr(instance, attr, value)
+        instance.save()
+        
+        return instance