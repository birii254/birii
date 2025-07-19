# Matrix Marketplace Backend

Django REST API backend for Matrix Marketplace.

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   ```bash
   cp .env.example .env
   # Update .env with your values
   ```

3. **Database Setup**:
   ```bash
   python manage.py migrate
   python manage.py create_categories
   python manage.py createsuperuser
   ```

4. **Run Development Server**:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- **Authentication**: `/api/auth/`
- **Items**: `/api/items/`
- **Categories**: `/api/categories/`
- **Conversations**: `/api/conversations/`

## Deployment

Deploy to Render using the provided `render.yaml` configuration.

### Environment Variables Required:
- `SECRET_KEY`
- `DEBUG`
- `FRONTEND_URL`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
- `REDIS_URL`
- `ALLOWED_HOSTS`