from django.db import models

# https://stackoverflow.com/q/2870070
class Book(models.Model):
    # the id should be a primary key ?? with a string ????
    # idek ?? --> https://docs.djangoproject.com/en/5.0/ref/models/fields/#primary-key , https://docs.djangoproject.com/en/5.0/ref/models/fields/#charfield
    # i'll use it later - https://docs.djangoproject.com/en/5.0/ref/validators/#minlengthvalidator

    book_id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=200)

    # https://stackoverflow.com/a/61845461
    # https://docs.djangoproject.com/en/5.0/ref/models/instances/#django.db.models.Model.__str__
    def __str__(self):
        # https://docs.python.org/3/tutorial/inputoutput.html#the-string-format-method
        return "{0}".format(self.title)

class Student(models.Model):
    roll_no = models.CharField(max_length=100, primary_key=True)
    first_name = models.CharField(max_length=500)
    middle_name = models.CharField(max_length=500, blank=True)
    last_name = models.CharField(max_length=500)

    def __str__(self):
        return "{0} {1} {2}".format(self.first_name, self.middle_name, self.last_name)

class AccountLogs(models.Model):
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE)
    roll_no = models.ForeignKey(Student, on_delete=models.CASCADE)
    # https://docs.djangoproject.com/en/5.0/ref/models/fields/#datetimefield
    checked_out = models.DateTimeField()
    due_date = models.DateTimeField()

    # implement a function like - https://docs.djangoproject.com/en/5.0/intro/tutorial02/#id5
    # see - https://docs.python.org/3/library/datetime.html#module-datetime
    # see - https://docs.djangoproject.com/en/5.0/ref/utils/#module-django.utils.timezone
    ## or maybe do it in js

    def __str__(self):
        return "Book -> {0} is handed to student -> {1} on date -> {2}, its due on date -> {3}".format(self.book_id, self.roll_no, self.checked_out, self.due_date)