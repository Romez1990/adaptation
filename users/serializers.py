from django.core.validators import RegexValidator
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    Field,
    IntegerField,
    CharField,
    EmailField,
    DateTimeField,
    ListField,
    SerializerMethodField,
    HiddenField,
)
from rest_framework.exceptions import ValidationError
from rest_auth.models import TokenModel
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.utils import email_address_exists
from allauth.account import app_settings as allauth_settings

from .models import (
    User,
    Profile,
    Position,
    Department,
    Event,
)


class TimestampField(Field):
    def to_representation(self, value):
        return round(value.timestamp())


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'last_name', 'email', 'type', 'date_joined', 'department', 'position', 'telegram',
                  'phone']

    id = CharField(source='user.id', read_only=True)
    first_name = CharField(source='user.first_name', read_only=True)
    last_name = CharField(source='user.last_name', read_only=True)
    email = EmailField(source='user.email', read_only=True)
    date_joined = DateTimeField(source='user.date_joined', read_only=True)
    type = SerializerMethodField()
    department = CharField(source='department.name')
    position = CharField(source='position.name')

    def get_type(self, profile):
        user = profile.user
        if user.is_superuser:
            return 'admin'
        if user.is_staff:
            return 'mentor'
        return 'trainee'


class TokenSerializer(ModelSerializer):
    class Meta:
        model = TokenModel
        fields = ['token']

    token = CharField(source='key', max_length=40)


class RegisterSerializer(Serializer):
    pass


class PositionSerializer(ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'


class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class EventSerializer(ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    deadline = TimestampField()
