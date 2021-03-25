from django.db.models import (
    Model,
    BooleanField,
    CharField,
    TextField,
    DateTimeField,
    OneToOneField,
    ForeignKey,
    CASCADE,
    PROTECT,
)
from django.contrib.auth import get_user_model

User = get_user_model()


class Department(Model):
    name = CharField(max_length=255)


class Position(Model):
    name = CharField(max_length=255)
    department = ForeignKey(Department, on_delete=PROTECT)


class Profile(Model):
    user = OneToOneField(User, on_delete=CASCADE, primary_key=True, related_name='profile')
    mentor = ForeignKey(User, on_delete=PROTECT, related_name='trainees')
    department = ForeignKey(Department, on_delete=PROTECT)
    position = ForeignKey(Position, on_delete=PROTECT)
    telegram = CharField(max_length=255)
    phone = CharField(max_length=255)


class Event(Model):
    user = ForeignKey(User, on_delete=PROTECT, related_name='events')
    name = CharField(max_length=255)
    description = TextField()
    date = DateTimeField()
    completed = BooleanField()
