# Generated by Django 3.0.2 on 2020-10-24 17:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('setups', '0005_auto_20200616_1848'),
        ('tracking', '0011_auto_20201024_0959'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.Category'),
        ),
        migrations.AlterField(
            model_name='customer',
            name='district',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.District'),
        ),
        migrations.AlterField(
            model_name='customer',
            name='region',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.Region'),
        ),
        migrations.AlterField(
            model_name='customer',
            name='town',
            field=models.CharField(default='None', max_length=100),
        ),
    ]
