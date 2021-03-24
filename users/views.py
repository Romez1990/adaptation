from typing import (
    Type,
)
from django.http import Http404
from rest_framework.generics import (
    GenericAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.serializers import (
    Serializer,
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError, MethodNotAllowed
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_auth.registration.views import VerifyEmailView as VerifyEmailViewBase

from .models import (
    Position,
    Department,
    Event,
)
from .serializers import (
    ProfileSerializer,
    PositionSerializer,
    DepartmentSerializer,
    EventSerializer,
)


class ProfileView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user.profile


class PositionViewSet(ModelViewSet):
    serializer_class = PositionSerializer
    queryset = Position.objects.all()


class DepartmentViewSet(ModelViewSet):
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()


class EventViewSet(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
