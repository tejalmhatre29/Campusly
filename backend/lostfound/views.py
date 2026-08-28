from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

from .models import LostFoundItem, LostFoundComment
from .serializers import (
    LostFoundItemSerializer,
    LostFoundCommentSerializer,
)


# --------------------------------------------------
# LIST ALL ITEMS + CREATE NEW ITEM
# --------------------------------------------------

class LostFoundListCreateView(generics.ListCreateAPIView):

    queryset = LostFoundItem.objects.all().order_by("-created_at")
    serializer_class = LostFoundItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


# --------------------------------------------------
# VIEW / UPDATE / DELETE SINGLE ITEM
# --------------------------------------------------

class LostFoundDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = LostFoundItem.objects.all()
    serializer_class = LostFoundItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):

        item = self.get_object()

        if item.posted_by != request.user:
            return Response(
                {"error": "You can only edit your own post."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):

        item = self.get_object()

        if item.posted_by != request.user:
            return Response(
                {"error": "You can only delete your own post."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(request, *args, **kwargs)


# --------------------------------------------------
# MARK ITEM AS RESOLVED
# --------------------------------------------------

class MarkResolvedView(generics.UpdateAPIView):

    queryset = LostFoundItem.objects.all()
    serializer_class = LostFoundItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):

        item = self.get_object()

        if item.posted_by != request.user:
            return Response(
                {"error": "You can only resolve your own post."},
                status=status.HTTP_403_FORBIDDEN,
            )

        item.status = "resolved"
        item.save()

        serializer = self.get_serializer(item)

        return Response(serializer.data)


# --------------------------------------------------
# LIST COMMENTS + ADD COMMENT
# --------------------------------------------------

class LostFoundCommentListCreateView(generics.ListCreateAPIView):

    serializer_class = LostFoundCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        item_id = self.kwargs["item_id"]

        return LostFoundComment.objects.filter(
            item_id=item_id
        ).order_by("created_at")

    def perform_create(self, serializer):

        item_id = self.kwargs["item_id"]

        item = get_object_or_404(
    LostFoundItem,
    id=item_id
)

        serializer.save(
            item=item,
            user=self.request.user
        )


# --------------------------------------------------
# DELETE OWN COMMENT
# --------------------------------------------------

class LostFoundCommentDeleteView(
    generics.DestroyAPIView
):

    queryset = LostFoundComment.objects.all()
    serializer_class = LostFoundCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):

        comment = self.get_object()

        if comment.user != request.user:
            return Response(
                {"error": "You can only delete your own comment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(request, *args, **kwargs)
