@@ .. @@
 from rest_framework import generics
 from rest_framework.response import Response
+from rest_framework.decorators import api_view, permission_classes
+from rest_framework.permissions import AllowAny
 from item.models import Category, Item
 from item.api.serializers import CategorySerializer, ItemSerializer
 
@@ .. @@
     serializer_class = ItemSerializer
     permission_classes = []
+
+@api_view(['POST'])
+@permission_classes([AllowAny])
+def contact_form(request):
+    """Handle contact form submissions"""
+    try:
+        # Here you can process the contact form data
+        # For now, we'll just return success
+        # In production, you might want to save to database or send email
+        
+        data = request.data
+        required_fields = ['firstName', 'lastName', 'email', 'subject', 'message']
+        
+        for field in required_fields:
+            if not data.get(field):
+                return Response(
+                    {'error': f'{field} is required'}, 
+                    status=400
+                )
+        
+        # Process the contact form (save to DB, send email, etc.)
+        # For now, just return success
+        
+        return Response({'message': 'Contact form submitted successfully'})
+        
+    except Exception as e:
+        return Response(
+            {'error': 'Failed to submit contact form'}, 
+            status=500
+        )