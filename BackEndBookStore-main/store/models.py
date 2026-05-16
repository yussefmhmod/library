from django.db import models

# Create your models here.

class Book(models.Model):
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('history', 'History'),
        ('science', 'Science'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.TextField(blank=True)
    status = models.CharField(default="undefined" , max_length= 255)
    quantity = models.IntegerField(default=0)
    
    genre = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='fiction'
    )
class User (models.Model):
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    
class BorrowRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)
    returned = models.BooleanField(default=False)

