from django.shortcuts import render
from django.http import JsonResponse
from .models import Book
import json
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def get_books(request):
    books = list(Book.objects.values())
    return JsonResponse(books, safe= False)

@csrf_exempt
def add_book(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            book = Book.objects.create(
                title=data.get("title"),
                author=data.get("author"),
                genre=data.get("genre"),
               
                price=data.get("price"),
                description=data.get("description"),
                
            )

            return JsonResponse({
                "message": "Book added successfully",
                "id": book.id
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
    
@csrf_exempt    
def delete_book(request, id):
    if request.method == "DELETE":
        try:
            book = Book.objects.get(id=id)
            book.delete()
            return JsonResponse({"message": "deleted"})
        except Book.DoesNotExist:
            return JsonResponse({"error": "not found"}, status=404)

@csrf_exempt
def edit_book(request, id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            book = Book.objects.get(id=id)

            book.title = data.get("title", book.title)
            book.author = data.get("author", book.author)
            book.price = data.get("price", book.price)
            book.status = data.get("status", book.status)

            book.save()

            return JsonResponse({"message": "updated"})
        except Book.DoesNotExist:
            return JsonResponse({"error": "not found"}, status=404)
        
@csrf_exempt
def get_books_Search(request):

    books = Book.objects.all()

    data = []

    for book in books:
        data.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "status": book.status
        })

    return JsonResponse(data, safe=False)