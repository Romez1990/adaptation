from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('auth/', TemplateView.as_view(template_name='auth.html')),
    path('main/', TemplateView.as_view(template_name='main.html')),
]
