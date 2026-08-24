from rest_framework import serializers
from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

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
            'created_at',
        ]