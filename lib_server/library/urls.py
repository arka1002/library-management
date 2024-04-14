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
]