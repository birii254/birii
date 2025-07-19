@@ .. @@
 urlpatterns = [
     path('categories/', views.CategoryListView.as_view(), name='category-list'),
     path('featured-items/', views.FeaturedItemsView.as_view(), name='featured-items'),
+    path('contact/', views.contact_form, name='contact-form'),
 ]