from rest_framework import serializers
from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    uploader_name = serializers.SerializerMethodField()
    uploader_phone = serializers.ReadOnlyField(source='uploaded_by.phone_number')

    def get_uploader_name(self, obj):
        return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}".strip()

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
            'uploader_name',
            'uploader_phone',
            'created_at',
        ]