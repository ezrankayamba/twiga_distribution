from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import os

context_path = os.environ.get('DIST_BACKEND_CONTEX_PATH')
if context_path is None:
    context_path = ''
else:
    context_path = f'{context_path}/'

urlpatterns = [
    path(f'{context_path}admin/', admin.site.urls),
    path(f'{context_path}oauth2/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path(f'{context_path}users/', include('users.urls')),
    path(f'{context_path}', include('customers.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
