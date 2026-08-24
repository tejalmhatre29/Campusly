from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Resource
from .serializers import ResourceSerializer


class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)