from django.contrib import admin
from . import models

admin.site.register(models.Record)
admin.site.register(models.Customer)
admin.site.register(models.Contact)
admin.site.register(models.Description)
