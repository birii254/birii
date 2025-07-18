# Generated by Django 4.2.16 on 2025-07-17 09:38

import cloudinary.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('item', '0003_itemfavorite_itemview_alter_item_options_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None)),
                ('profile_picture', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='profile_pics')),
                ('bio', models.TextField(blank=True, max_length=500)),
                ('location', models.CharField(blank=True, max_length=100)),
                ('country', django_countries.fields.CountryField(blank=True, max_length=2, null=True)),
                ('account_type', models.CharField(choices=[('individual', 'Individual'), ('business', 'Business')], default='individual', max_length=20)),
                ('is_verified', models.BooleanField(default=False)),
                ('verification_status', models.CharField(choices=[('pending', 'Pending'), ('verified', 'Verified'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3)),
                ('total_reviews', models.PositiveIntegerField(default=0)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('last_active', models.DateTimeField(auto_now=True)),
                ('is_suspended', models.BooleanField(default=False)),
                ('suspension_reason', models.TextField(blank=True)),
                ('business_name', models.CharField(blank=True, max_length=100)),
                ('business_registration', models.CharField(blank=True, max_length=50)),
                ('tax_id', models.CharField(blank=True, max_length=50)),
                ('email_notifications', models.BooleanField(default=True)),
                ('sms_notifications', models.BooleanField(default=False)),
                ('marketing_emails', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_type', models.CharField(choices=[('inappropriate_content', 'Inappropriate Content'), ('spam', 'Spam'), ('fraud', 'Fraud'), ('fake_listing', 'Fake Listing'), ('harassment', 'Harassment'), ('counterfeit', 'Counterfeit Products'), ('prohibited_items', 'Prohibited Items'), ('misleading_info', 'Misleading Information'), ('other', 'Other')], max_length=30)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('investigating', 'Investigating'), ('resolved', 'Resolved'), ('dismissed', 'Dismissed')], default='pending', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('reported_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='item.item')),
                ('reported_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reports_received', to=settings.AUTH_USER_MODEL)),
                ('reporter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports_made', to=settings.AUTH_USER_MODEL)),
                ('resolved_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='resolved_reports', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AdminAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_type', models.CharField(choices=[('suspend_user', 'Suspend User'), ('unsuspend_user', 'Unsuspend User'), ('remove_listing', 'Remove Listing'), ('verify_user', 'Verify User'), ('reject_verification', 'Reject Verification'), ('warning', 'Warning'), ('ban_user', 'Ban User'), ('feature_listing', 'Feature Listing'), ('unfeature_listing', 'Unfeature Listing')], max_length=30)),
                ('reason', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='admin_actions', to=settings.AUTH_USER_MODEL)),
                ('target_item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='item.item')),
                ('target_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='received_actions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.PositiveIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='item.item')),
                ('reviewed_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews_received', to=settings.AUTH_USER_MODEL)),
                ('reviewer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews_given', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('reviewer', 'reviewed_user', 'item')},
            },
        ),
    ]
