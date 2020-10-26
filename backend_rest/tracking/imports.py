import openpyxl
from zipfile import ZipFile
from django.core.files import File
from io import TextIOWrapper
import re
import io
from django.core.files.base import ContentFile
import threading
import xlsxwriter
import json
import traceback
from . import utils
from . import models
from setups import models as s_models


def get_val(ds, key, def_val=None):
    val = ds[key][1]
    return val.strip() if val and hasattr(val, 'strip') else val if val else def_val


def contact_person(data_set):
    return{
        "name": get_val(data_set, 'contact_person'),
        "position": get_val(data_set, 'contact_position'),
        "mobile": get_val(data_set, 'contact_phone'),
        "mobile_alt": get_val(data_set, 'contact_alternative_phone'),
        "email": get_val(data_set, 'contact_email'),
        "email_alt": get_val(data_set, 'contact_alternative_email'),
    }


def brand_supply(data_set):
    brand_name = get_val(data_set, 'brand')
    if not brand_name:
        return None
    brand = s_models.Brand.objects.filter(name=brand_name).first()
    if not brand:
        brand = s_models.Brand.objects.create(name=brand_name)

    supplier_name = get_val(data_set, 'supplier')
    if not supplier_name:
        return None
    supplier = models.Customer.objects.filter(name=supplier_name).first()
    if not supplier:
        cat_info = {
            'name': 'Cement Factory'
        }
        factory_category, _ = s_models.Category.objects.get_or_create(**cat_info)
        factory_category.is_supplier = True
        factory_category.save()
        supplier = models.Customer.objects.create(name=supplier_name, category=factory_category)
    else:
        category = supplier.category
        category.is_supplier = True
        category.save()

    return{
        "volume": get_val(data_set, 'monthly_sale'),
        "brand_id": brand.id,
        "supplier_id": supplier.id
    }


def customer_desc(data_set):
    print(data_set)
    return {
        "fleet_size": get_val(data_set, 'fleet_size', 0),
        "trucks": get_val(data_set, 'no_trucks', 0),
        "system": get_val(data_set, 'it_system'),
        "outlets": get_val(data_set, 'no_outlets', 0),
        "machines": get_val(data_set, 'no_machines', 0),
        "types": get_val(data_set, 'type_machines'),
        "business": get_val(data_set, 'type_business')
    }


def customer_info(data_set):
    region_name = get_val(data_set, 'region')
    region = s_models.Region.objects.filter(name=region_name).first()
    if not region:
        region = s_models.Region.objects.create(name=region_name)
    district_name = get_val(data_set, 'district')
    district = s_models.District.objects.filter(name=district_name, region=region).first()
    if not district:
        district = s_models.District.objects.create(name=district_name, region=region)
    category_name = get_val(data_set, 'category')
    if not category_name:
        return None
    category = s_models.Category.objects.filter(name=category_name).first()
    if not category:
        category = s_models.Category.objects.create(name=category_name)
    return {
        "name": data_set['name'][1],
        "town": data_set['town'][1],
        "share": 0,
        "region_id": region.id,
        "district_id": district.id,
        "category_id": category.id
    }


def process_record(data_in):
    data = {'Customer Information': customer_info(data_in), 'Customer Description': customer_desc(data_in)}
    return data


def import_customers(excel_file):
    wb = openpyxl.load_workbook(excel_file)
    data = {'region': '', 'district': '', 'town': '', 'name': '', 'contact_person': '', 'contact_position': '', 'contact_email': '', 'contact_alternative_email': '', 'contact_phone': '', 'contact_alternative_phone': '', 'brand': '', 'monthly_sale': '', 'category': '', 'supplier': '', 'supplier_alternative': '', 'share_twiga': '',
            'share_simba': '', 'share_dangote': '', 'share_nyati': '', 'share_tembo': '', 'share_camel': '', 'share_moshi': '', 'share_kilimanjaro': '', 'share_daimond': '', 'share_kisarawe': '', 'fleet_size': '', 'no_trucks': '', 'it_system': '', 'no_outlets': '', 'no_machines': '', 'type_machines': '', 'type_business': ''}

    def get_data(row, j, key, cache=False):
        return (True, row[j]) if row[j] else (False, data[key] if cache else None)
    batch = []

    def can_cash(j):
        return j in [0, 1, 2, 3]

    for ws in wb.worksheets:
        print("Sheet: ", ws.title)
        i = 0
        rows = []
        contact_persons = []
        brand_supplies = []
        basic_info = None
        for row in ws.values:
            print("Row: ", row)
            if i >= 3:  # first 2 are headers
                params = {}
                for j, key in enumerate(data.keys()):
                    state, val = get_data(row, j, key, can_cash(j))
                    data[key] = val
                    params[key] = (state, val)

                if params['name'][0]:  # Start customer
                    if basic_info:  # Next record
                        basic_info['Customer Contacts'] = contact_persons
                        basic_info['Brand(s) Supplied'] = brand_supplies
                        batch.append(basic_info)
                    else:
                        print("New ")

                    contact_persons = []
                    brand_supplies = []
                    basic_info = process_record(params)
                    contact_persons.append(contact_person(params))
                    brand_supplies.append(brand_supply(params))
                else:
                    if params['contact_person'][0]:
                        contact_persons.append(contact_person(params))
                    if params['brand'][0]:
                        brand_supplies.append(brand_supply(params))
            else:
                if len(row) < 32:
                    print('Not enough columns: ', len(row))
                    break
            i += 1
        if basic_info:  # Next record
            basic_info['Customer Contacts'] = contact_persons
            basic_info['Brand(s) Supplied'] = brand_supplies
            batch.append(basic_info)
    print("Records: ", len(batch))
    for line in batch:
        utils.save_new_survey(line)


def start():
    file = 'C:\\Users\\godfred.nkayamba\\Downloads\\fwdistributiontrackingtoolreview\\Copy of Distribution Tracking Tool (2020) - LAKE ZONE  KIGOMA.xlsx'
    with open(file, 'rb') as excel_file:
        import_customers(excel_file)


if __name__ == '__main__':
    start()
