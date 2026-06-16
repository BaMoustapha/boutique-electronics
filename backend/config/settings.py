import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-me-in-production')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
RENDER_HOSTNAME = os.getenv('RENDER_EXTERNAL_HOSTNAME', '')
if RENDER_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_HOSTNAME)

# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'cloudinary',
    'cloudinary_storage',
    # Local apps
    'categories',
    'brands',
    'products',
    'orders',
    'core',
    'customers',
]

AUTH_USER_MODEL = 'customers.Customer'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Base de données
DATABASE_URL = os.getenv('DATABASE_URL', '')
DB_ENGINE = os.getenv('DB_ENGINE', 'sqlite')  # 'sqlite' ou 'postgresql'

if DATABASE_URL:
    import dj_database_url
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL)}
elif DB_ENGINE == 'postgresql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME', 'boutique_db'),
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }
else:
    # SQLite par défaut (développement)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Validation des mots de passe
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Dakar'
USE_I18N = True
USE_TZ = True

# Fichiers statiques
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

CSRF_TRUSTED_ORIGINS = [f'https://{RENDER_HOSTNAME}'] if RENDER_HOSTNAME else []

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '')
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

if CLOUDINARY_CLOUD_NAME:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
        'API_KEY': os.getenv('CLOUDINARY_API_KEY', ''),
        'API_SECRET': os.getenv('CLOUDINARY_API_SECRET', ''),
        'SECURE': True,
    }
    STORAGES['default']['BACKEND'] = 'cloudinary_storage.storage.MediaCloudinaryStorage'

    # CloudinaryField (utilisé par FlexImageField) lit la config globale du SDK
    # `cloudinary`, pas CLOUDINARY_STORAGE — sans ceci, .url renvoie http:// et
    # Next.js (qui n'autorise que https pour res.cloudinary.com) bloque l'image.
    import cloudinary
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=os.getenv('CLOUDINARY_API_KEY', ''),
        api_secret=os.getenv('CLOUDINARY_API_SECRET', ''),
        secure=True,
    )

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardPagination',
    'PAGE_SIZE': 24,
    # Paramètre de recherche : ?q= (spec CLAUDE.md) — aussi supporté via ?search= dans ProductFilters
    'SEARCH_PARAM': 'q',
}

# CORS
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000'
).split(',')

CORS_ALLOW_CREDENTIALS = True

# JWT
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# Email (Gmail SMTP)
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'bam616173@gmail.com')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'Boutique Electronics <bam616173@gmail.com>')

EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST        = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT        = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS     = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER   = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
