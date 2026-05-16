from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('history', 'History'),
        ('science', 'Science'),
    ]

    title       = models.CharField(max_length=200)
    author      = models.CharField(max_length=100)
    price       = models.FloatField(default=0)
    description = models.TextField(blank=True)
    genre       = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='fiction')
    image       = models.URLField(blank=True, default='')
    quantity    = models.IntegerField(default=1)          # total physical copies
    status      = models.CharField(max_length=100, default='Available')

    def __str__(self):
        return self.title

    def update_status(self):
        """Auto-set status based on remaining quantity."""
        if self.quantity <= 0:
            self.status = 'Unavailable'
        else:
            self.status = 'Available'
        self.save()


class Borrow(models.Model):
    """One row per borrow event (active or returned)."""
    user        = models.ForeignKey(User,  on_delete=models.CASCADE, related_name='borrows')
    book        = models.ForeignKey(Book,  on_delete=models.CASCADE, related_name='borrows')
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_active   = models.BooleanField(default=True)   # True = currently borrowed

    class Meta:
        ordering = ['-borrow_date']

    def __str__(self):
        state = 'active' if self.is_active else 'returned'
        return f"{self.user.username} → {self.book.title} ({state})"
