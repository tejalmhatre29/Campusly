from django.db import models
from accounts.models import User


class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('notes', 'Notes'),
        ('pyq', 'Previous Year Questions'),
        ('book', 'Books'),
        ('assignment', 'Assignments'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='notes'
    )

    subject = models.CharField(max_length=100)

    file = models.FileField(
        upload_to='resources/'
    )

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resources'
    )

    downloads = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class ResourceBookmark(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resource_bookmarks'
    )

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.username} - {self.resource.title}"


class ResourceLike(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resource_likes'
    )

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name='likes'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.username} - {self.resource.title}"


class ResourceRating(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resource_ratings'
    )

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name='ratings'
    )

    rating = models.PositiveIntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.username} - {self.resource.title} - {self.rating}"