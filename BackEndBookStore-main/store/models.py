from django.db import models

# Create your models here.

class Book(models.Model):
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('history', 'History'),
        ('science', 'Science'),
    ]


    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField(blank=True)
    status = models.CharField(default="undefined" , max_length= 100)
    
    genre = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='fiction'
    )


