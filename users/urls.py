from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_auth.views import LoginView, LogoutView
from rest_auth.registration.views import RegisterView

from config.settings import DEBUG
from .views import (
    ProfileView,
    PositionViewSet,
    DepartmentViewSet,
    EventViewSet,
    TraineeViewSet,
)

router = SimpleRouter()
router.register('position', PositionViewSet, basename='position')
router.register('department', DepartmentViewSet, basename='department')
router.register('event', EventViewSet, basename='event')

mentor_router = SimpleRouter()
mentor_router.register('trainee', TraineeViewSet, basename='trainee')

urlpatterns = [
    path('accounts/', include('allauth.urls')),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
    path('mentor/', include(mentor_router.urls)),
]

if DEBUG:
    urlpatterns += [
        path('session-auth/', include('rest_framework.urls')),
    ]
