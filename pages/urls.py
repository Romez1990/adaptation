from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('auth/', TemplateView.as_view(template_name='index.html')),
    path('main/', TemplateView.as_view(template_name='main.html')),
    path('user/', TemplateView.as_view(template_name='user.html')),
    path('events/', TemplateView.as_view(template_name='events.html')),
    path('documents/', TemplateView.as_view(template_name='documents.html')),
    path('mentor/', TemplateView.as_view(template_name='mentor.html')),
]
