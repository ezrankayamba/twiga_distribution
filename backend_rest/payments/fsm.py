FSM_STATE_LOADING = 0
FSM_STATE_LOADED = 1
FSM_STATE_INIT_PROC_FAILED = -1
FSM_STATE_READY_SEND = 2
FSM_STATE_CANCELLED = -99
FSM_STATE_UNDER_APPROVAL = 3
FSM_STATE_SCHEDULED = 4
FSM_STATE_REJECTED = 5
FSM_STATE_PAY_UNDER_PROC = 10
FSM_STATE_PAY_PROC_COMPLETED = 12
FSM_STATE_PAY_PROC_HALT = 11


def get_states():
    states = [
        {
            'code': FSM_STATE_LOADING,
            'name': 'Batch loading',
            'is_final': False,
            'previous': None,
            'actions': None
        },
        {
            'code': FSM_STATE_LOADED,
            'name': 'Batch loaded',
            'is_final': False,
            'previous': [0, -1],
            'actions': None
        },
        {
            'code': FSM_STATE_INIT_PROC_FAILED,
            'name': 'Batch inititial processing failed',
            'is_final': False,
            'previous': [1],
            'actions': [
                {
                    'name': 'cancel',
                    'title': 'Cancel',
                    'privilege': 'Payments.initiatePayment',
                    'warn': True
                },
                {
                    'name': 'resolve',
                    'title': 'Resolve issues',
                    'privilege': 'Payments.initiatePayment',
                    'warn': False
                },
            ]
        },
        {
            'code': FSM_STATE_READY_SEND,
            'name': 'Ready to send for approval',
            'is_final': False,
            'previous': [1, 5],
            'actions': [
                {
                    'name': 'cancel',
                    'title': 'Cancel',
                    'privilege': 'Payments.initiatePayment',
                    'warn': True
                },
                {
                    'name': 'send',
                    'title': 'Send for approval',
                    'privilege': 'Payments.initiatePayment',
                    'warn': False
                }
            ]
        },
        {
            'code': FSM_STATE_CANCELLED,
            'name': 'Batch cancelled',
            'is_final': True,
            'previous': [1, -1]
        },
        {
            'code': FSM_STATE_UNDER_APPROVAL,
            'name': 'Batch under approval',
            'is_final': False,
            'previous': [3, 2],
            'actions': [
                {
                    'name': 'reject',
                    'title': 'Reject',
                    'privilege': 'Payments.approvePayments',
                    'warn': True
                },
                {
                    'name': 'approve',
                    'title': 'Approve',
                    'privilege': 'Payments.approvePayments',
                    'warn': False
                }
            ]
        },
        {
            'code': FSM_STATE_SCHEDULED,
            'name': 'Batch approval completed, waiting schedule due',
            'is_final': False,
            'previous': [3, 11]
        },
        {
            'code': FSM_STATE_REJECTED,
            'name': 'Batch rejected',
            'is_final': False,
            'previous': [3]
        },
        {
            'code': FSM_STATE_PAY_UNDER_PROC,
            'name': 'Batch payment under processing',
            'is_final': False,
            'previous': [4]
        },
        {
            'code': FSM_STATE_PAY_PROC_HALT,
            'name': 'Batch processing having issues',
            'is_final': False,
            'previous': [10]
        },
        {
            'code': FSM_STATE_PAY_PROC_COMPLETED,
            'name': 'Batch processing completed',
            'is_final': True,
            'previous': [10]
        },
    ]

    return states
