from django.shortcuts import render, redirect
from django.core.management import call_command

from item.models import Category, Item

from .forms import SignupForm

def home(request):
    items = Item.objects.filter(status='active', admin_approved=True)[0:6]
    categories = Category.objects.filter(is_active=True)
    
    # Ensure categories exist - create them if they don't
    if not categories.exists():
        try:
            call_command('create_categories')
            categories = Category.objects.filter(is_active=True)
        except Exception as e:
            # Log the error but don't break the page
            pass

    return render(request, 'core/home.html', {
        'categories': categories,
        'items': items,
    })

def index(request):
    items = Item.objects.filter(status='active', admin_approved=True)[0:6]
    categories = Category.objects.filter(is_active=True)
    
    # Ensure categories exist - create them if they don't
    if not categories.exists():
        try:
            call_command('create_categories')
            categories = Category.objects.filter(is_active=True)
        except Exception as e:
            # Log the error but don't break the page
            pass

    return render(request, 'core/index.html', {
        'categories': categories,
        'items': items,
    })

def contact(request):
    return render(request, 'core/contact.html')

def featured(request):
    return render(request, 'core/featured.html')

def order_protection(request):
    return render(request, 'core/order_protection.html')

def become_supplier(request):
    return render(request, 'core/become_supplier.html')

def help_center(request):
    return render(request, 'core/help_center.html')

def buyer_central(request):
    return render(request, 'core/buyer_central.html')

def faq(request):
    return render(request, 'core/faq.html')

def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)

        if form.is_valid():
            form.save()

            return redirect('/login/')
    else:
        form = SignupForm()

    return render(request, 'core/signup.html', {
        'form': form
    })