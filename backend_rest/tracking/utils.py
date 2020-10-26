from . import models
import re
import json


def parse_loc(loc):
    if not loc:
        return None
    regex = '^\\(([-\\d\\.]+), ([-\\d\\.]+)\\)$'
    res = re.search(regex, loc)
    return {'lat': res.group(1), 'lng': res.group(2)} if res else None


def serializer_loc(lat, lng):
    return f'({lat}, {lng})' if lat else None


def save_new_survey(data):
    print(data)
    info = data['Customer Information']
    if not info:
        return None
    contacts = data['Customer Contacts']
    desc = data['Customer Description']
    supply = data['Brand(s) Supplied']

    if 'location' in info:
        loc = parse_loc(info['location'])
        del info['location']
        info.update(loc)
    customer = models.Customer.objects.filter(name=info['name']).first()
    if not customer:
        customer = models.Customer.objects.create(**info)
    else:
        models.Customer.objects.filter(pk=customer.id).update(**info)
        print("Updated customer: ", info)
    update_survey(data, customer.id)
    # for c in contacts:
    #     if 'idx' in c:
    #         del c['idx']
    #     c.update({'customer': customer})
    #     if c['name']:
    #         obj, created = models.Contact.objects.get_or_create(**c)

    # desc.update({'customer': customer})
    # try:
    #     obj, created = models.Description.objects.get_or_create(**desc)
    # except Exception as e:
    #     print(e)
    #     print(desc)

    # for c in supply:
    #     # print(c)
    #     if not c:
    #         continue
    #     if 'idx' in c:
    #         del c['idx']
    #     c.update({'customer': customer})
    #     try:
    #         obj, created = models.Record.objects.get_or_create(**c)
    #     except Exception as e:
    #         print(e)
    #         print(c)


def update_survey(data, customer_id):
    info = data['Customer Information']
    contacts = data['Customer Contacts']
    desc = data['Customer Description']
    supply = data['Brand(s) Supplied']
    if 'location' in info:
        loc = parse_loc(info['location'])
        # print(loc)
        del info['location']
        if loc:
            info.update(loc)
    customer = models.Customer.objects.get(pk=customer_id)
    customer.__dict__.update(**info)
    customer.save()

    models.Contact.objects.filter(customer=customer).delete()
    for c in contacts:
        if c and c['name']:
            if 'idx' in c:
                del c['idx']
            if 'id' in c:
                del c['id']
            c.update({'customer': customer})
            models.Contact.objects.create(**c)

    desc.update({'customer': customer})
    description = models.Description.objects.filter(customer=customer).first()
    if description:
        description.__dict__.update(**desc)
        description.save()

    models.Record.objects.filter(customer=customer).delete()
    for c in supply:
        if c and c['volume']:
            if 'idx' in c:
                del c['idx']
            c.update({'customer': customer})
            if 'id' in c:
                del c['id']
            models.Record.objects.create(**c)
