# Generated by Django 3.0.2 on 2020-04-18 12:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('setups', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('is_supplier', models.BooleanField(default=False)),
                ('lat', models.DecimalField(decimal_places=8, max_digits=20, null=True)),
                ('lng', models.DecimalField(decimal_places=8, max_digits=20, null=True)),
                ('town', models.CharField(max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('share', models.DecimalField(decimal_places=2, max_digits=4)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.Category')),
                ('district', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.District')),
                ('region', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='setups.Region')),
                ('supplier', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customers', to='tracking.Customer')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('volume', models.DecimalField(decimal_places=2, max_digits=20)),
                ('remarks', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('brand', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='setups.Brand')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='records', to='tracking.Customer')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Description',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fleet_size', models.DecimalField(decimal_places=2, max_digits=10)),
                ('trucks', models.DecimalField(decimal_places=2, max_digits=10)),
                ('system', models.CharField(max_length=100)),
                ('outlets', models.DecimalField(decimal_places=2, max_digits=10)),
                ('machines', models.DecimalField(decimal_places=2, max_digits=10)),
                ('types', models.CharField(max_length=100)),
                ('business', models.CharField(max_length=100)),
                ('customer', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='tracking.Customer')),
            ],
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('position', models.CharField(max_length=100, null=True)),
                ('mobile', models.CharField(max_length=100, null=True)),
                ('email', models.CharField(max_length=100, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contacts', to='tracking.Customer')),
            ],
        ),
    ]
