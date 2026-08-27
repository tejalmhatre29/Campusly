from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    organizer_id = serializers.ReadOnlyField(source='organizer.id')
    organizer_name = serializers.SerializerMethodField()

    def get_organizer_name(self, obj):
        name = f"{obj.organizer.first_name} {obj.organizer.last_name}".strip()
        return name or obj.organizer.username

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
            'organizer_id',
            'organizer_name',
            'created_at',
        ]

        read_only_fields = [
            'organizer',
            'organizer_id',
            'organizer_name',
            'created_at',
        ]