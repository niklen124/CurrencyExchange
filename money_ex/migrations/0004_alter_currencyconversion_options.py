# Generated by Django 5.1.3 on 2025-01-21 21:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('money_ex', '0003_alter_currencyconversion_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='currencyconversion',
            options={'ordering': ['-timestamp']},
        ),
    ]
