from django.urls import path

from . import views

urlpatterns = [
    path("foo/", views.foo, name="foo"),
    path("", views.homepage, name="home"),
]