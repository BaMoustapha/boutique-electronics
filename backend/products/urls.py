from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

# Endpoint de recherche séparé (alias sur la liste avec filtre search)
urlpatterns = router.urls + [
    path('search/', ProductViewSet.as_view({'get': 'list'}), name='product-search'),
]
