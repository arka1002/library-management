from django.urls import path

from . import views

urlpatterns = [
    path("foo/", views.foo, name="foo"),
    path("", views.homepage, name="home"),
    path("details/students/", views.homepage, name="home"),
    path("list/students/", views.student_list, name = "list of students"),
    path("add/students/", views.add_student, name = "add a student"),
    path("list/students/<int:student_id>", views.student_detail, name = "details of a student"),
    path("details/students/<int:student_id>", views.homepage_v2, name = "details of a student html"),
    path("list/students/<int:student_id>/edit", views.update_student, name = "edit details of a student"),
    path("list/students/<int:student_id>/delete", views.delete_student, name = "delete details of a student"),
    path("list/books/", views.book_list, name = "List of books"),
    path("details/books/", views.homepage_v3, name = "List of books html"),
    path("add/books/", views.add_book, name = "add a book"),
    path("list/books/detail/<int:book_id>/", views.book_details, name = "details of a book"),
    path("list/books/edit/<int:book_id>/", views.edit_book, name = "details of a book"),
    path("details/books/<int:book_id>/", views.homepage_v4, name = "details of a book html"),
    path("list/account/not-returned/<int:roll_no>/", views.books_not_returned_by_student, name = "Books not returned by a student"),
    path("list/account/returned/", views.mark_books_as_returned_by_students, name="mark as returned"),
]