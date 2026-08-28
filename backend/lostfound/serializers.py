from rest_framework import serializers
from .models import LostFoundItem, LostFoundComment


class LostFoundItemSerializer(serializers.ModelSerializer):

    posted_by = serializers.ReadOnlyField(
        source="posted_by.username"
    )

    posted_by_id = serializers.ReadOnlyField(
        source="posted_by.id"
    )

    poster_name = serializers.SerializerMethodField()

    comment_count = serializers.SerializerMethodField()

    def get_poster_name(self, obj):
        name = f"{obj.posted_by.first_name} {obj.posted_by.last_name}".strip()
        return name or obj.posted_by.username

    def get_comment_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = LostFoundItem

        fields = [
            "id",
            "name",
            "item_type",
            "category",
            "description",
            "location",
            "date",
            "image",
            "posted_by",
            "posted_by_id",
            "poster_name",
            "status",
            "created_at",
            "comment_count",
        ]

        read_only_fields = [
            "posted_by",
            "posted_by_id",
            "poster_name",
            "status",
            "created_at",
            "comment_count",
        ]


class LostFoundCommentSerializer(serializers.ModelSerializer):

    user = serializers.ReadOnlyField(
        source="user.username"
    )

    user_id = serializers.ReadOnlyField(
        source="user.id"
    )

    commenter_name = serializers.SerializerMethodField()

    class Meta:
        model = LostFoundComment

        fields = [
            "id",
            "item",
            "user",
            "user_id",
            "commenter_name",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "user",
            "user_id",
            "commenter_name",
            "created_at",
        ]
