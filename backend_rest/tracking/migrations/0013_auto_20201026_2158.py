# Generated by Django 3.0.2 on 2020-10-26 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0012_auto_20201024_2057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='description',
            name='machines',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='description',
            name='outlets',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='description',
            name='trucks',
            field=models.IntegerField(default=0),
        ),
    ]