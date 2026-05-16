from django.urls import path
from . import views

urlpatterns = [
    # ── book listings ──────────────────────────────────────
    path("",                  views.get_books),
    path("books/",            views.get_books),
    path("books/search/",     views.get_books_Search),

    # ── single book detail ─────────────────────────────────
    path("detail/<int:id>/",       views.get_book_detail),       # user view
    path("admin-detail/<int:id>/", views.admin_book_detail),     # admin view

    # ── CRUD ──────────────────────────────────────────────
    path("add/",              views.add_book),
    path("delete/<int:id>/",  views.delete_book),
    path("edit/<int:id>/",    views.edit_book),

    # ── borrow / return ────────────────────────────────────
    path("borrow/<int:id>/",  views.borrow_book),
    path("return/<int:id>/",  views.return_book_view),

    # ── user-specific borrow history ───────────────────────
    path("my-borrows/",       views.my_borrows),
    path("my-history/",       views.my_history),

    # ── admin dashboard ────────────────────────────────────
    path("stats/",            views.admin_stats),
]
