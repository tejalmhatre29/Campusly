from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Resource, ResourceBookmark
from .serializers import ResourceSerializer, ResourceBookmarkSerializer,ResourceLikeSerializer
from .models import Resource, ResourceBookmark, ResourceLike


class ResourceListCreateView(generics.ListCreateAPIView):
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class ResourceDeleteView(generics.DestroyAPIView):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(uploaded_by=self.request.user)

class MyBookmarksView(generics.ListAPIView):
    serializer_class = ResourceBookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResourceBookmark.objects.filter(
            user=self.request.user
        )


class BookmarkResourceView(generics.CreateAPIView):
    serializer_class = ResourceBookmarkSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        resource_id = self.request.data.get('resource')

        resource = Resource.objects.get(id=resource_id)

        ResourceBookmark.objects.get_or_create(
            user=self.request.user,
            resource=resource
        )


class RemoveBookmarkView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        resource_id = kwargs.get('resource_id')

        bookmark = ResourceBookmark.objects.filter(
            user=request.user,
            resource_id=resource_id
        ).first()

        if bookmark:
            bookmark.delete()

            return Response(
                {"message": "Bookmark removed"},
                status=200
            )

        return Response(
            {"message": "Bookmark not found"},
            status=404
        )

class LikeResourceView(generics.CreateAPIView):
    serializer_class = ResourceLikeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        resource_id = self.request.data.get('resource')

        resource = Resource.objects.get(id=resource_id)

        ResourceLike.objects.get_or_create(
            user=self.request.user,
            resource=resource
        )


class RemoveLikeView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        resource_id = kwargs.get('resource_id')

        like = ResourceLike.objects.filter(
            user=request.user,
            resource_id=resource_id
        ).first()

        if like:
            like.delete()

            return Response(
                {"message": "Like removed"},
                status=200
            )

        return Response(
            {"message": "Like not found"},
            status=404
        )
class MyLikesView(generics.ListAPIView):
    serializer_class = ResourceLikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ResourceLike.objects.filter(
            user=self.request.user
        )