# Generated by Django 3.0.2 on 2020-06-20 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0004_record_trushed'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='share',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
    ]