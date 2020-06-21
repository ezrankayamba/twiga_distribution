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

    for c in contacts:
        if 'idx' in c:
            del c['idx']
        c.update({'customer': customer})
        models.Contact.objects.create(**c)

        desc.update({'customer': customer})
        try:
            models.Description.objects.create(**desc)
        except Exception as e:
            print(e)
            print(desc)

    for c in supply:
        # print(c)
        if not c:
            continue
        if 'idx' in c:
            del c['idx']
        c.update({'customer': customer})
        try:
            models.Record.objects.create(**c)
        except Exception as e:
            print(e)
            print(c)


def update_survey(data, customer_id):
    # print(json.dumps(data))
    info = data['Customer Information']
    # print(info)
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
    models.Customer.objects.filter(id=customer_id).update(**info)
    models.Contact.objects.filter(customer=customer).delete()
    models.Record.objects.filter(customer=customer).update(trushed=True)

    for c in contacts:
        if 'idx' in c:
            del c['idx']
        c.update({'customer': customer})
        models.Contact.objects.create(**c)

        desc.update({'customer': customer})
        models.Description.objects.filter(customer=customer).update(**desc)

    for c in supply:
        # print(c)
        if 'idx' in c:
            del c['idx']
        c.update({'customer': customer})
        if 'id' in c:
            del c['id']
        models.Record.objects.create(**c)
