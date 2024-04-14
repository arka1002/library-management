from django.http import HttpResponse
from django.shortcuts import render

# just for testing
def foo(request):
    return HttpResponse("Hi Mom!")


def homepage(request):
    context = {}
    return render(request, "library/index.html", context)