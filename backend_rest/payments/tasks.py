from background_task import background
from payments import models


def load_files():
    print("Loading files...")
    batch = models.Batch.objects.filter(status=1).first()
    count = 0
    while(batch):
        batch.status = 2
        batch.save()
        count += 1
        print(f'Batch processed: {count} - {batch.id}')
        batch = models.Batch.objects.filter(status=1).first()
    print(f'Initial processing completed by processing {count} batches')
