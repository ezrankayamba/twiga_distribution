# Generated by Django 3.0.2 on 2020-06-22 18:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('setups', '0005_auto_20200616_1848'),
        ('tracking', '0009_auto_20200620_1812'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.Category'),
        ),
    ]