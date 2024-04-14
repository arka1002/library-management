from rest_framework import serializers
from .models import Book, Student, AccountLogs

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

class AccountLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountLogs
        fields = "__all__"