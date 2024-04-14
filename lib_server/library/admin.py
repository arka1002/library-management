from django.contrib import admin
from .models import Book, Student, AccountLogs

admin_show_list = [ Book, Student, AccountLogs ]

admin.site.register(admin_show_list)