from django.urls import path
from . import views

urlpatterns = [
    path('customers/register/',    views.RegisterView.as_view(),    name='customer-register'),
    path('customers/me/',          views.MeView.as_view(),          name='customer-me'),
    path('customers/me/orders/',   views.MyOrdersView.as_view(),    name='customer-orders'),
    path('customers/link-orders/', views.LinkOrdersView.as_view(),  name='customer-link-orders'),
]
