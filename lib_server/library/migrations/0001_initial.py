# Generated by Django 5.0.4 on 2024-04-12 11:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('book_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=500)),
                ('author', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('roll_no', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=500)),
                ('middle_name', models.CharField(max_length=500)),
                ('last_name', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='AccountLogs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checked_out', models.DateTimeField()),
                ('due_date', models.DateTimeField()),
                ('book_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='library.book')),
                ('roll_no', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='library.student')),
            ],
        ),
    ]