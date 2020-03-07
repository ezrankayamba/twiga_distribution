from . import models
from .fsm import (FSM_STATE_LOADING, FSM_STATE_LOADED, FSM_STATE_INIT_PROC_FAILED,
                  FSM_STATE_READY_SEND, FSM_STATE_CANCELLED, FSM_STATE_UNDER_APPROVAL, FSM_STATE_SCHEDULED,
                  FSM_STATE_REJECTED, FSM_STATE_PAY_UNDER_PROC, FSM_STATE_PAY_PROC_COMPLETED, FSM_STATE_PAY_PROC_HALT)


class ActionExecutor(object):
    def cancel(self, **kwargs):
        id = kwargs['batch']
        batch = models.Batch.objects.get(pk=id)
        batch.status = FSM_STATE_CANCELLED
        batch.save()

    def send(self, **kwargs):
        id = kwargs['batch']
        batch = models.Batch.objects.get(pk=id)
        batch.status = FSM_STATE_UNDER_APPROVAL
        batch.save()

    def reject(self, **kwargs):
        id = kwargs['batch']
        print(f'Rejecting batch: {id}')
        batch = models.Batch.objects.get(pk=id)
        batch.status = FSM_STATE_REJECTED
        batch.save()

    def approve(self, **kwargs):
        id = kwargs['batch']
        print(f'Approving batch: {id}')
        batch = models.Batch.objects.get(pk=id)
        batch.status = FSM_STATE_SCHEDULED
        batch.save()

    def not_found(self, **kwargs):
        print('Action not implemented: ', kwargs)

    def execute(self, action, data=None):
        print("Action: ", action, data)
        fn = getattr(self, action, self.not_found)
        fn(**data)
