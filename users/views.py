from os import remove
from typing import (
    Type,
)
from django.http import Http404
from rest_framework.decorators import action
from rest_framework.generics import (
    GenericAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.serializers import (
    Serializer,
)
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.exceptions import NotFound, ValidationError, MethodNotAllowed
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_auth.registration.views import VerifyEmailView as VerifyEmailViewBase

from config.settings import STATIC_DIR
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

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(user=user)


class TraineeViewSet(ModelViewSet):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        user = self.request.user
        return user.trainees

    @action(detail=True, methods=['get'])
    def events(self, request: Request, **kwargs):
        trainee = self.get_object()
        events = trainee.user.events
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


class DocumentViewSet(ViewSet):
    directory = STATIC_DIR / 'documents'

    def create(self, request: Request):
        uploaded_file = request.data['document']
        uploaded_file.read()
        path = self.directory / uploaded_file.name
        self.directory.mkdir(parents=True, exist_ok=True)
        with open(path, 'wb') as file:
            file.write(uploaded_file.read())
        return Response({'detail': 'uploaded'}, 201)

    def list(self, request: Request):
        files = []
        for file in self.directory.iterdir():
            if file.name == '.gitignore':
                continue
            files.append({
                'name': file.stem,
                'link': f'/static/documents/{file.name}',
            })
        return Response(files)

    def destroy(self, request: Request, pk=None):
        file_name = pk
        for file in self.directory.iterdir():
            if file.stem == file_name:
                remove(file)
                return Response(None, 204)
        raise NotFound()
