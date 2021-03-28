from os import remove
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.generics import (
    RetrieveUpdateAPIView,
)
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.exceptions import NotFound
from rest_framework.request import Request
from rest_framework.response import Response

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
    directory = settings.MEDIA_ROOT / 'documents'

    def create(self, request: Request):
        uploaded_file = request.data['document']
        path = self.directory / uploaded_file.name
        self.directory.mkdir(parents=True, exist_ok=True)
        with open(path, 'wb') as file:
            content = uploaded_file.read()
            file.write(content)
        return Response({'detail': 'uploaded'}, 201)

    def list(self, request: Request):
        files = []
        for file in self.directory.iterdir():
            if file.name == '.gitignore':
                continue
            files.append({
                'name': file.stem,
                'link': f'{settings.MEDIA_URL}documents/{file.name}',
            })
        return Response(files)

    def destroy(self, request: Request, pk=None):
        file_name = pk
        for file in self.directory.iterdir():
            if file.stem == file_name:
                remove(file)
                return Response(None, 204)
        raise NotFound()

    @action(detail=True, methods=['get'])
    def search(self, request: Request, pk=None):
        search_query = pk
        files = []
        for file in self.directory.iterdir():
            if file.name == '.gitignore':
                continue
            if search_query in file.name:
                files.append({
                    'name': file.stem,
                    'link': f'{settings.MEDIA_URL}documents/{file.name}',
                })
        return Response(files)
