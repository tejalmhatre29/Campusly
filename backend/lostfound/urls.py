from django.urls import path

from .views import (
    LostFoundListCreateView,
    LostFoundDetailView,
    MarkResolvedView,
    LostFoundCommentListCreateView,
    LostFoundCommentDeleteView,
)


urlpatterns = [

    # Lost & Found
    path(
        "",
        LostFoundListCreateView.as_view(),
        name="lostfound-list-create",
    ),

    path(
        "<int:pk>/",
        LostFoundDetailView.as_view(),
        name="lostfound-detail",
    ),

    path(
        "<int:pk>/resolve/",
        MarkResolvedView.as_view(),
        name="lostfound-resolve",
    ),

    # Comments
    path(
        "<int:item_id>/comments/",
        LostFoundCommentListCreateView.as_view(),
        name="lostfound-comments",
    ),

    path(
        "comments/<int:pk>/",
        LostFoundCommentDeleteView.as_view(),
        name="lostfound-comment-delete",
    ),
]
