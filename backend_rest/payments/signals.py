from django.db.models import signals as sig
from django.dispatch import receiver
from . import models
from . import imports
import threading


class LoadingThread(threading.Thread):
    def __init__(self, bf, **kwargs):
        self.bf = bf
        super(LoadingThread, self).__init__(**kwargs)

    def run(self):
        print('Load data for: ', self.bf.file)
        imports.import_batch(self.bf.file, self.bf.batch)
        batch = self.bf.batch
        batch.status = 1
        batch.save()


@receiver(sig.post_save, sender=models.BatchFile)
def load_file_data(sender, instance, created, raw, using, **kwargs):
    if created:
        LoadingThread(instance).start()
