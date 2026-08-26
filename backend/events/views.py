from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Event
from .serializers import EventSerializer


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('event_date')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)