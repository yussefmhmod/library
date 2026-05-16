from django.urls import path
from . import views

urlpatterns = [ #add the function path
    path ("",views.get_books),
    path("books/", views.get_books),
    path("add/", views.add_book),
    path("delete/<int:id>/", views.delete_book),
    path("edit/<int:id>/", views.edit_book),
    path("books/search/", views.get_books_Search),
]