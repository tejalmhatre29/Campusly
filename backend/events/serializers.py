from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    organizer_name = serializers.SerializerMethodField()

    def get_organizer_name(self, obj):
        return f"{obj.organizer.first_name} {obj.organizer.last_name}".strip()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'category',
            'venue',
            'event_date',
            'organizer',
            'organizer_name',
            'created_at',
        ]
        read_only_fields = [
            'organizer',
            'organizer_name',
            'created_at',
        ]