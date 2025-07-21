from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile
from .forms import UserProfileForm, LoginForm, SignupForm
from item.models import Item, ItemFavorite
import json

# API Views
class LoginAPIView(TokenObtainPairView):
    """Enhanced JWT authentication with form validation and session support"""
    def post(self, request, *args, **kwargs):
        # Handle both API and traditional form submissions
        if request.content_type == 'application/json':
            try:
                data = json.loads(request.body)
                form = LoginForm(data=data)
            except json.JSONDecodeError:
                return Response(
                    {"detail": "Invalid JSON data"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            form = LoginForm(data=request.POST)
        
        if not form.is_valid():
            return Response(
                {
                    "status": "error",
                    "errors": form.errors,
                    "message": "Invalid credentials"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate for session if needed
        user = authenticate(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password']
        )
        
        if user:
            # Create JWT response
            response = super().post(request, *args, **kwargs)
            
            # Also create session if requested
            if request.data.get('create_session'):
                auth_login(request, user)
                
            return response
        
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

class ProfileAPIView(APIView):
    """Enhanced profile API with support for updates"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'phone_number': profile.phone_number,
            'location': profile.location,
            'profile_picture': request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None,
            'theme_preference': profile.theme_preference,
        })

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        form = UserProfileForm(request.data, request.FILES, instance=profile)
        
        if form.is_valid():
            form.save()
            return Response({"status": "success", "message": "Profile updated"})
        
        return Response(
            {"status": "error", "errors": form.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class RegisterAPIView(APIView):
    """User registration endpoint"""
    def post(self, request):
        form = SignupForm(request.data, request.FILES)
        
        if form.is_valid():
            user = form.save()
            
            # Create JWT tokens for immediate login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "status": "success",
                "message": "Registration successful",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(
            {"status": "error", "errors": form.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

# Existing Django Views (with API support)
@login_required
def profile(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            
            # Handle API-style response if requested
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    "status": "success",
                    "message": "Profile updated successfully!"
                })
                
            messages.success(request, 'Profile updated successfully!')
            return redirect('accounts:profile')
    else:
        form = UserProfileForm(instance=profile)
    
    context = {
        'form': form,
        'profile': profile,
    }
    return render(request, 'accounts/profile.html', context)

@login_required
def favorites(request):
    favorite_items = ItemFavorite.objects.filter(user=request.user).select_related('item')
    
    # API response if requested
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        favorites_data = [{
            'id': fav.item.id,
            'name': fav.item.name,
            'price': fav.item.price,
            'image': request.build_absolute_uri(fav.item.image.url) if fav.item.image else None
        } for fav in favorite_items]
        return JsonResponse({'favorites': favorites_data})
    
    context = {
        'favorite_items': favorite_items,
    }
    return render(request, 'accounts/favorites.html', context)

@login_required
@require_POST
def toggle_favorite(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    favorite, created = ItemFavorite.objects.get_or_create(item=item, user=request.user)
    
    if not created:
        favorite.delete()
        favorited = False
        item.favorites = max(0, item.favorites - 1)
    else:
        favorited = True
        item.favorites += 1
    
    item.save()
    
    return JsonResponse({
        'favorited': favorited,
        'favorites_count': item.favorites
    })

@login_required
def settings(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        theme = request.POST.get('theme', 'light')
        profile.theme_preference = theme
        profile.save()
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                "status": "success",
                "message": "Settings updated",
                "theme": theme
            })
            
        messages.success(request, 'Settings updated successfully!')
        return redirect('accounts:settings')
    
    context = {
        'profile': profile,
    }
    return render(request, 'accounts/settings.html', context)