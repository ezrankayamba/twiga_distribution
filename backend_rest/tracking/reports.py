from django.db.models import Sum, Count
from django.db.models import Case, When, Q, Value, CharField
from django.db.models import DateTimeField, ExpressionWrapper, F, DurationField
from django.http import JsonResponse
from . import models as m


def get_share_by_category(request):
    qs = m.Record.objects.annotate(sup=Case(When(brand__name__iexact='Twiga', then=Value('Twiga')), default=Value('Others'), output_field=CharField()),
                                   cat=F('customer__category__name')).values('cat', 'sup').annotate(count=Count('id')).order_by('sup')
    return JsonResponse({'data': list(qs)})


def get_share_by_region(request):
    qs = m.Record.objects.annotate(sup=Case(When(brand__name__iexact='Twiga', then=Value('Twiga')), default=Value('Others'), output_field=CharField()),
                                   reg=F('customer__region__name')).values('reg', 'sup').annotate(count=Count('id')).order_by('sup')
    return JsonResponse({'data': list(qs)})
