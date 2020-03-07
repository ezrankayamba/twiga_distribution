import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    createBatch, createBatchFileUpload,
    createBatchManual,
    deleteBatch,
    deleteSelectedBatches,
    fetchBatches
} from "../../../_services/PaymentsService";
import BasicCrudView from "../../utils/BasicCrudView";
import ManualEntryForm from "./ManualEntryForm";
import FileUploadForm from "./FileUploadForm";
import BatchDetailPopup from "./BatchDetailPopup";
import BatchActionView from "./BatchActionView";
import {refreshFSM} from "../../../redux/fsm/actions";
import Numbers from "../../../_helpers/Numbers";
import {DateTime} from "../../../_helpers/DateTime";
import {IconFile, IconManual, IconUpload} from "../../utils/Incons";


@connect((state) => {
    return {
        user: state.auth.user,
        fsm: state.fsm
    }
}, {refreshFSM: refreshFSM})
class BatchListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
            manualEntry: false,
            fileUpload: false,
            isLoading: false,
            detail: false,
            selectedBatch: null,
            showModel: true,
            pages: 1,
            pageNo: 1
        }
        this.doAdd = this.doAdd.bind(this)
        this.doDelete = this.doDelete.bind(this)
        this.doDeleteSelected = this.doDeleteSelected.bind(this)
        this.onRowClick = this.onRowClick.bind(this)
        this.translate = this.translate.bind(this)
        this.refresh = this.refresh.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
    }

    onPageChange(pageNo) {
        this.setState({pageNo})
        this.refresh(pageNo)
    }

    onRowClick(e, row) {
        this.setState({
            selectedBatch: {
                ...row, records: row.records.map(r => {
                    return {
                        ...r,
                        amount: Numbers.fmt(parseFloat(r.amount))
                    }
                })
            }, detail: true
        })
    }

    translate(code) {
        let state = this.props.fsm.states.find(s => s.code === code)
        return state.name
    }

    manualEntryComplete(data) {
        this.setState({manualEntry: false})
        if (data.records && data.records.length) {
            this.setState({isLoading: true})
            createBatchManual(this.props.user.token, data, (res) => {
                this.refresh()
            })
        } else {
            console.error("The batch is empty")
        }
    }

    detailComplete(data) {
        this.setState({detail: false})
    }

    fileUploadComplete(data) {
        console.log(data)
        this.setState({fileUpload: false})
        if (data) {
            this.setState({isLoading: true})
            createBatchFileUpload(this.props.user.token, data, (res) => {
                console.log(res)
                this.refresh()
            })
        }
    }

    refresh(page = 1) {
        this.setState({isLoading: true, pageNo: page}, () => {
            fetchBatches(this.props.user.token, page, (res) => {
                if (res) {

                    this.setState({
                        payments: res.data.map(item => {
                            return {
                                ...item,
                                count: Numbers.fmt(item.records.length),
                                amount: Numbers.fmt(Numbers.sum(item.records.map(r => r.amount))),
                                statusText: this.translate(item.status),
                                created_at: DateTime.fmt(item.created_at)
                            }
                        }),
                        isLoading: false,
                        pages: parseInt(res.pages)
                    })
                }
            })
        })
    }

    componentDidMount() {
        this.props.refreshFSM(this.props.user.token, (res) => {
            this.refresh()
        })
    }

    doDelete(params) {
        deleteBatch(this.props.user.token, params.id, (res) => {
            params.cb()
            this.refresh()
        })
    }

    doDeleteSelected(params) {
        deleteSelectedBatches(this.props.user.token, params.ids, (res) => {
            params.cb()
            this.refresh()
        })
    }

    doAdd(params) {
        let body = {name: params.name, comments: params.comments}
        createBatch(this.props.user.token, body, (res) => {
            params.cb()
            this.refresh()
        });
    }


    render() {
        let data = {
            records: this.state.payments,
            headers: [
                {field: 'id', title: 'BatchID'},
                {field: 'name', title: 'Name'},
                {field: 'comments', title: 'Comments'},
                {field: 'count', title: 'Count'},
                {field: 'amount', title: 'Amount'},
                {field: 'created_at', title: 'Created'},
                {field: 'statusText', title: 'Status'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <BatchActionView rowData={rowData} complete={this.refresh}/>
                },
            ],
            title: 'List of batches'
        }
        const {isLoading, selectedBatch, pages, count, pageNo} = this.state
        let actions = [
            {
                tooltip: 'Refresh',
                isFreeAction: true,
                onClick: (evt, data) => {
                    this.refresh()
                }
            }
        ]
        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        return (
            <div className="row">
                <div className="col">
                    <div className="row pt-2 pb-2 d-flex">
                        <div className="col-md">
                            <h5>List of batches</h5>
                        </div>
                        <div className="col-md">
                            <div className="btn-group float-md-right">
                                <button className="btn btn-outline-primary p-2" onClick={() => {
                                    this.setState({manualEntry: true})
                                }}><IconManual/> Manual Entry
                                </button>
                                <button className="btn btn-outline-primary p-2" onClick={() => {
                                    this.setState({fileUpload: true})
                                }}><IconUpload/> Upload File
                                </button>
                            </div>
                        </div>
                    </div>
                    <BasicCrudView data={data} pagination={pagination} onDeleteAll={this.doDeleteSelected}
                                   isLoading={isLoading}
                                   actions={actions} onRowClick={this.onRowClick}/>
                    {this.state.manualEntry &&
                    <ManualEntryForm open={this.state.manualEntry} complete={this.manualEntryComplete.bind(this)}/>}
                    {this.state.fileUpload &&
                    <FileUploadForm open={this.state.fileUpload} complete={this.fileUploadComplete.bind(this)}/>}
                    {this.state.detail &&
                    <BatchDetailPopup open={this.state.detail} complete={this.detailComplete.bind(this)}
                                      batch={selectedBatch}/>}
                </div>
            </div>
        )
    }
}

export default BatchListView;
