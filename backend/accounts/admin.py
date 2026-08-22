from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Campusly Information', {
            'fields': (
                'department',
                'year',
                'division',
                'phone_number',
                'profile_picture',
            )
        }),
    )