from django.db import models
from django.conf import settings


class LostFoundItem(models.Model):

    ITEM_TYPE_CHOICES = [
        ("lost", "Lost"),
        ("found", "Found"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("resolved", "Resolved"),
    ]

    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("documents", "Documents"),
        ("accessories", "Accessories"),
        ("books", "Books"),
        ("clothing", "Clothing"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=200)

    item_type = models.CharField(
        max_length=10,
        choices=ITEM_TYPE_CHOICES
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES
    )

    description = models.TextField()

    location = models.CharField(max_length=200)

    date = models.DateField()

    image = models.ImageField(
        upload_to="lost_found/",
        blank=True,
        null=True
    )

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lost_found_items"
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LostFoundComment(models.Model):

    item = models.ForeignKey(
        LostFoundItem,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lost_found_comments"
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.item.name}"
