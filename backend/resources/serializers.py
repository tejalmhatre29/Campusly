from rest_framework import serializers
from .models import Resource, ResourceBookmark, ResourceLike


class ResourceSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.ReadOnlyField(
        source='uploaded_by.username'
    )

    uploaded_by_id = serializers.ReadOnlyField(
        source='uploaded_by.id'
    )

    uploader_name = serializers.SerializerMethodField()

    uploader_phone = serializers.ReadOnlyField(
        source='uploaded_by.phone_number'
    )

    like_count = serializers.SerializerMethodField()

    def get_uploader_name(self, obj):
        name = f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}".strip()
        return name or obj.uploaded_by.username

    def get_like_count(self, obj):
        return obj.likes.count()

    class Meta:
        model = Resource

        fields = [
            'id',
            'title',
            'description',
            'category',
            'subject',
            'file',
            'uploaded_by',
            'uploaded_by_id',
            'uploader_name',
            'uploader_phone',
            'created_at',
            'like_count',
        ]

        read_only_fields = [
            'uploaded_by',
            'uploaded_by_id',
            'uploader_name',
            'uploader_phone',
            'created_at',
            'like_count',
        ]


class ResourceBookmarkSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceBookmark
        fields = [
            'id',
            'resource',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]


class ResourceLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceLike
        fields = [
            'id',
            'resource',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]