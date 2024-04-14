from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import Student
from .serializers import StudentSerializer
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