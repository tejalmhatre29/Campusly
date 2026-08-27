from django.urls import path

from .views import EventListCreateView, EventDeleteView


urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path(
        '<int:pk>/',
        EventDeleteView.as_view(),
        name='event-delete'
    ),
]