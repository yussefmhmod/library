from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Book, Borrow
import json


# ─── helpers ────────────────────────────────────────────────────────────────

def _book_dict(book):
    return {
        "id":          book.id,
        "title":       book.title,
        "author":      book.author,
        "genre":       book.genre,
        "price":       book.price,
        "description": book.description,
        "status":      book.status,
        "image":       book.image,
        "quantity":    book.quantity,
    }

def _fmt(dt):
    return dt.strftime("%d %b %Y") if dt else None


# ─── public book listing / search ───────────────────────────────────────────

def get_books(request):
    books = [_book_dict(b) for b in Book.objects.all()]
    return JsonResponse(books, safe=False)


def get_books_Search(request):
    books = [_book_dict(b) for b in Book.objects.all()]
    return JsonResponse(books, safe=False)


# ─── single book detail (user view) ─────────────────────────────────────────

def get_book_detail(request, id):
    try:
        book = Book.objects.get(id=id)
        data = _book_dict(book)
        # Tell the frontend whether *this* user already has it borrowed
        if request.user.is_authenticated:
            data['user_borrowed'] = Borrow.objects.filter(
                user=request.user, book=book, is_active=True
            ).exists()
        else:
            data['user_borrowed'] = False
        return JsonResponse(data)
    except Book.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)


# ─── single book detail (admin view) ────────────────────────────────────────

def admin_book_detail(request, id):
    try:
        book = Book.objects.get(id=id)
        data = _book_dict(book)

        active_borrows = Borrow.objects.filter(book=book, is_active=True).select_related('user')
        data['current_borrowers'] = [
            {
                "username":    b.user.username,
                "borrow_date": _fmt(b.borrow_date),
                "borrow_id":   b.id,
            }
            for b in active_borrows
        ]

        past = Borrow.objects.filter(book=book, is_active=False).select_related('user').order_by('-return_date')[:30]
        data['borrow_history'] = [
            {
                "username":    b.user.username,
                "borrow_date": _fmt(b.borrow_date),
                "return_date": _fmt(b.return_date),
            }
            for b in past
        ]

        return JsonResponse(data)
    except Book.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)


# ─── add / edit / delete ─────────────────────────────────────────────────────

@csrf_exempt
def add_book(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    try:
        data  = json.loads(request.body)
        qty   = int(data.get("quantity", 1))
        book  = Book.objects.create(
            title       = data.get("title", ""),
            author      = data.get("author", ""),
            genre       = data.get("genre", "fiction"),
            price       = float(data.get("price", 0)),
            description = data.get("description", ""),
            image       = data.get("image", ""),
            quantity    = qty,
            status      = "Available" if qty > 0 else "Unavailable",
        )
        return JsonResponse({"message": "Book added successfully", "id": book.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def delete_book(request, id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE only"}, status=405)
    try:
        Book.objects.get(id=id).delete()
        return JsonResponse({"message": "deleted"})
    except Book.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)


@csrf_exempt
def edit_book(request, id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT only"}, status=405)
    try:
        data = json.loads(request.body)
        book = Book.objects.get(id=id)
        book.title       = data.get("title",       book.title)
        book.author      = data.get("author",      book.author)
        book.price       = data.get("price",       book.price)
        book.description = data.get("description", book.description)
        book.image       = data.get("image",       book.image)
        book.genre       = data.get("genre",       book.genre)
        if "quantity" in data:
            book.quantity = int(data["quantity"])
            book.update_status()
        elif "status" in data:
            book.status = data["status"]
        book.save()
        return JsonResponse({"message": "updated"})
    except Book.DoesNotExist:
        return JsonResponse({"error": "not found"}, status=404)


# ─── borrow / return ─────────────────────────────────────────────────────────

@csrf_exempt
def borrow_book(request, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "not authenticated"}, status=401)
    try:
        book = Book.objects.get(id=id)

        # Already borrowed by this user?
        if Borrow.objects.filter(user=request.user, book=book, is_active=True).exists():
            return JsonResponse({"error": "You already have this book borrowed"}, status=400)

        if book.quantity <= 0:
            return JsonResponse({"error": "No copies available"}, status=400)

        Borrow.objects.create(user=request.user, book=book)
        book.quantity -= 1
        book.update_status()
        return JsonResponse({"message": "Borrowed successfully"})
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found"}, status=404)


@csrf_exempt
def return_book_view(request, id):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "not authenticated"}, status=401)
    try:
        book   = Book.objects.get(id=id)
        borrow = Borrow.objects.filter(user=request.user, book=book, is_active=True).first()
        if not borrow:
            return JsonResponse({"error": "You have not borrowed this book"}, status=400)
        borrow.is_active   = False
        borrow.return_date = timezone.now()
        borrow.save()
        book.quantity += 1
        book.update_status()
        return JsonResponse({"message": "Returned successfully"})
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found"}, status=404)


# ─── user borrow lists ────────────────────────────────────────────────────────

def my_borrows(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "not authenticated"}, status=401)

    active = Borrow.objects.filter(user=request.user, is_active=True).select_related('book')
    data = [
        {
            "borrow_id":   b.id,
            "book_id":     b.book.id,
            "title":       b.book.title,
            "author":      b.book.author,
            "genre":       b.book.genre,
            "image":       b.book.image,
            "borrow_date": _fmt(b.borrow_date),
            "status":      "Borrowed",
        }
        for b in active
    ]
    return JsonResponse({"active": data})


def my_history(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "not authenticated"}, status=401)

    past = Borrow.objects.filter(user=request.user, is_active=False).select_related('book')
    data = [
        {
            "borrow_id":   b.id,
            "book_id":     b.book.id,
            "title":       b.book.title,
            "author":      b.book.author,
            "genre":       b.book.genre,
            "image":       b.book.image,
            "borrow_date": _fmt(b.borrow_date),
            "return_date": _fmt(b.return_date),
            "status":      "Returned",
        }
        for b in past
    ]
    return JsonResponse({"history": data})


# ─── admin dashboard stats ────────────────────────────────────────────────────

def admin_stats(request):
    total_books    = Book.objects.count()
    available      = Book.objects.filter(status="Available").count()
    unavailable    = Book.objects.filter(status="Unavailable").count()
    active_borrows = Borrow.objects.filter(is_active=True).count()
    total_users    = User.objects.count()

    recent = (
        Borrow.objects
        .filter(is_active=True)
        .select_related('user', 'book')
        .order_by('-borrow_date')[:10]
    )
    recent_data = [
        {
            "username":    b.user.username,
            "book":        b.book.title,
            "borrow_date": _fmt(b.borrow_date),
        }
        for b in recent
    ]

    overdue_soon = []   # placeholder – extend with due_date field later

    return JsonResponse({
        "total_books":    total_books,
        "available":      available,
        "unavailable":    unavailable,
        "active_borrows": active_borrows,
        "total_users":    total_users,
        "recent_borrows": recent_data,
    })
