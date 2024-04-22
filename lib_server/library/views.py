from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render
from .models import Student, Book, AccountLogs
from .serializers import StudentSerializer, BookSerializer, AccountLogsSerializer, AccountLogsSerializer_v2
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

# just for testing
def foo(request):
    return HttpResponse("Hi Mom!")


def homepage(request):
    context = {}
    return render(request, "library/index.html", context)

def homepage_v2(request, student_id):
    context = {}
    return render(request, "library/index.html", context)

def homepage_v3(request):
    context = {}
    return render(request, "library/index.html", context)

def homepage_v4(request, book_id):
    context = {}
    return render(request, "library/index.html", context)


def student_list(request):
    if request.method == "GET":
        students = Student.objects.all()
        serializer = StudentSerializer(students, many = True)
        return JsonResponse(serializer.data, safe = False)


@csrf_exempt
def add_student(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = StudentSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)

        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def add_book(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = BookSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)

@csrf_exempt
def add_log(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = AccountLogsSerializer_v2(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)


@csrf_exempt
def update_student(request, student_id):
    if request.method == "POST":
        try:
            student = Student.objects.get(roll_no = student_id)
        except Student.DoesNotExist:
            return HttpResponse(status=404)

        data = JSONParser().parse(request)
        serializer = StudentSerializer(student, data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def edit_book(request, book_id):
    if request.method == "POST":
        try:
            book = Book.objects.get(book_id = book_id)
        except Book.DoesNotExist:
            return HttpResponse(status=404)

        data = JSONParser().parse(request)
        serializer = BookSerializer(book, data = data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)
    

@csrf_exempt
def mark_books_as_returned_by_students(request):
    # https://stackoverflow.com/q/60258388
    data = JSONParser().parse(request)
    # spam = []
    # for items in data:
    #     spam.append(items['id'])  #https://stackoverflow.com/a/32240735
    
    # accounts = AccountLogs.objects.filter(id__in=spam) # https://stackoverflow.com/a/4016804, https://docs.djangoproject.com/en/5.0/ref/models/querysets/#in

    # serializer = AccountLogsSerializer(accounts, data = data, many=True)
    # if serializer.is_valid():
    #     serializer.save()
    #     return JsonResponse(serializer.data)

    try:
        acc = AccountLogs.objects.get(id = data["id"])
    except AccountLogs.DoesNotExist:
        raise Http404("Account doesn't exist")
    serializer = AccountLogsSerializer(acc, data=data, many=False)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data)

    return HttpResponse("Hi")

@csrf_exempt
def delete_student(request, student_id):
    if request.method == "POST":
        try:
            student = Student.objects.get(roll_no = student_id)
        except Student.DoesNotExist:
            return HttpResponse(status=404)

        student.delete()
        return HttpResponse(status=204)

def student_detail(request, student_id):
    if request.method == "GET":
        student = Student.objects.get(roll_no = student_id)
        serializer = StudentSerializer(student, many = False)
        return JsonResponse(serializer.data, safe = False)

def book_list(request):
    books = Book.objects.all()
    serializer = BookSerializer(books, many = True)
    return JsonResponse(serializer.data, safe = False)


def book_details(request, book_id):
    if request.method == "GET":
        book_part = Book.objects.get(book_id = book_id)
        serializer = BookSerializer(book_part, many = False)
        return JsonResponse(serializer.data, safe = False)


def books_not_returned_by_student(request, roll_no):
    if request.method == "GET":
        # books = AccountLogs.objects.filter(roll_no = roll_no).filter(has_returned = False)
        # serializer = AccountLogsSerializer(books, many = True)
        # return JsonResponse(serializer.data, safe = False)
        books = AccountLogs.objects.filter(roll_no = roll_no, has_returned = False) # https://docs.djangoproject.com/en/5.0/topics/db/queries/#spanning-multi-valued-relationships
        serializer = AccountLogsSerializer(books, many = True)
        return JsonResponse(serializer.data, safe=False)
    

