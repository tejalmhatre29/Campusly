from django.urls import path

from .views import (
    ResourceListCreateView,
    ResourceDeleteView,
    BookmarkResourceView,
    RemoveBookmarkView,
    MyBookmarksView,
    LikeResourceView,
    RemoveLikeView,
    MyLikesView,
    DownloadResourceView,
    RateResourceView,
)


urlpatterns = [

    path(
        '',
        ResourceListCreateView.as_view(),
        name='resource-list-create'
    ),

    path(
    '<int:pk>/download/',
    DownloadResourceView.as_view(),
    name='download-resource'
),

path(
    '<int:pk>/',
    ResourceDeleteView.as_view(),
    name='resource-delete'
),

    path(
        'bookmark/',
        BookmarkResourceView.as_view(),
        name='bookmark-resource'
    ),

    path(
        'bookmark/<int:resource_id>/',
        RemoveBookmarkView.as_view(),
        name='remove-bookmark'
    ),

    path(
        'bookmarks/',
        MyBookmarksView.as_view(),
        name='my-bookmarks'
    ),

    path(
        'like/',
        LikeResourceView.as_view(),
        name='like-resource'
    ),

    path(
        'like/<int:resource_id>/',
        RemoveLikeView.as_view(),
        name='remove-like'
    ),

    path(
        'likes/',
        MyLikesView.as_view(),
        name='my-likes'
    ),

    path(
        'rate/',
        RateResourceView.as_view(),
        name='rate-resource'
    ),
]