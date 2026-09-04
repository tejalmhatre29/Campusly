# Create your models here.
from django.db import models
from accounts.models import User


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('cultural', 'Cultural'),
        ('technical', 'Technical'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='other'
    )
    venue = models.CharField(max_length=200)
    event_date = models.DateTimeField()
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='organized_events'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    registration_enabled = models.BooleanField(
        default=False
    )

    registration_link = models.URLField(
        blank=True,
        null=True
    )

    registration_deadline = models.DateTimeField(
        blank=True,
        null=True
    )

    registration_details = models.TextField(
        blank=True
    )