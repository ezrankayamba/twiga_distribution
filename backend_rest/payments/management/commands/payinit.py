from django.core.management.base import BaseCommand, CommandError
from payments import tasks
import time


class Command(BaseCommand):

    def handle(self, *args, **options):
        self.stdout.write("Initial processing")
        print("Initial processing")
        while(True):
            tasks.load_files()
            time.sleep(10)
            self.stdout.write("Next loading ...")
            print("Next loading ...")
