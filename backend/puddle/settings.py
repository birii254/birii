@@ .. @@
 # Email Configuration
-EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
-EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
-EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
-EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
-EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
-EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
-DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@matrixmarketplace.com')
+# Use Resend for email in production, console for development
+if DEBUG:
+    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
+else:
+    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
+    EMAIL_HOST = 'smtp.resend.com'
+    EMAIL_PORT = 587
+    EMAIL_USE_TLS = True
+    EMAIL_HOST_USER = 'resend'
+    EMAIL_HOST_PASSWORD = config('RESEND_API_KEY', default='')
+    DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@matrixmarketplace.com')
+
+# Resend API Key
+RESEND_API_KEY = config('RESEND_API_KEY', default='')