import openpyxl
from . import models


def import_batch(excel_file, batch=None):
    wb = openpyxl.load_workbook(excel_file)
    ws = wb.active
    i = 0
    for row in ws.values:
        if i:
            dict = {}
            try:
                dict['account'] = row[0]
                dict['amount'] = row[1]
                dict['reason'] = row[2]
                dict['batch'] = batch
                print(dict)
                models.Payment.objects.create(**dict)
            except Exception as e:
                print(e)
        else:
            if len(row) < 2:
                print('Not enough columns')
                break
        i += 1
