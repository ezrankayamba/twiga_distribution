import React, {Component} from 'react';
import Modal from "../../modal/Modal";
import CrudTable from "../../utils/CrudTable";
import {IconTrash} from "../../utils/Incons";

class ManualEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            id: 0,
            name: "ManualEntry",
            comments: "",
            error: "",
            showAdd: false,
            pages: 1,
            count: 0,
            pageNo: 1
        }
        this.handleChange = this.handleChange.bind(this)
        this.newComplete = this.newComplete.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
    }

    onPageChange(pageNo) {
        this.setState({pageNo})
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    doDeleteSelected(params) {
        params.cb()
    }

    doUpdate(params) {
        let {records} = this.state
        let record = {...params}
        this.setState({
            records: records.map(r1 => [record].find(r2 => r2.id === r1.id) || r1)
        }, () => {
            console.log(record, this.state)
        })
    }

    doDelete(params) {
        console.log(params)
        this.setState({records: this.state.records.filter(r => r.id !== params.id)})
    }

    onAdd(params, cb) {
        let {id} = this.state
        id++
        let record = {
            id: id,
            ...params
        }
        delete record.cb
        this.setState({
            error: "",
            id: id, records: [...this.state.records, record]
        }, () => {
            if (cb) cb(true)
        })
    }

    doSubmit() {
        if (!this.state.records.length) {
            this.setState({error: "You must add at least one record"})
        } else if (!this.state.comments) {
            this.setState({error: "Comments is mandatory"})
        } else {
            let batch = {
                name: this.state.name,
                comments: this.state.comments,
                records: this.state.records
            }
            console.log("Batch?", batch)
            this.props.complete(batch)
        }
    }

    newComplete(param) {
        this.props.complete(false);
        this.setState({openAdd: false})
    }

    render() {
        const {error, openAdd, records, pageNo} = this.state
        let count = records.length
        const pageSize = 5
        let pages = Math.ceil(count / pageSize)
        let from = (pageNo - 1) * pageSize
        let to = from + pageSize
        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        let pageRecords = records.slice(from, to)

        let data = {
            records: pageRecords,
            headers: [
                {
                    field: 'account', title: 'MSISDN', validator: {
                        valid: (val) => RegExp("^(|255|0)\\d{9}$").test(val),
                        error: "Invalid phone number"
                    }
                },
                {
                    field: 'amount', title: 'Amount', validator: {
                        valid: (val) => RegExp("^\\d{1,10}$").test(val),
                        error: "Invalid amount"
                    }
                },
                {
                    field: 'reason', title: 'Reason', validator: {
                        valid: (val) => val && val.length,
                        error: "Reason can not be blank"
                    }
                },
                {
                    field: 'actions',
                    title: '',
                    render: (row) => <button className="btn p-0 text-danger btn-link float-right"
                                             onClick={() => this.doDelete(row)}>
                        <IconTrash/></button>
                },
            ],
            title: null,
            exportable: false
        }
        const {open, complete} = this.props
        let tableOptions = {
            actionsColumnIndex: data.headers.length
        }

        return (
            <Modal modalId="manualEntry" show={open} handleClose={() => this.newComplete(false)} title="Manual Entry"
                   content={<div>
                       <textarea value={this.state.comments} onChange={this.handleChange} className="form-control mb-2"
                                 name="comments" rows="2" placeholder="Enter batch comments"></textarea>
                       <CrudTable pagination={pagination} tableId="manualEntryTable" columns={data.headers}
                                  data={data.records}
                                  onDeleteAll={this.doDeleteSelected.bind(this)}
                                  onUpdate={this.doUpdate.bind(this)}
                                  onDelete={this.doDelete.bind(this)}
                                  options={tableOptions}
                                  newRecord={
                                      {
                                          open: openAdd,
                                          onAdd: this.onAdd.bind(this),
                                          show: () => this.setState({openAdd: true}),
                                          hide: () => this.setState({openAdd: false})
                                      }
                                  }/>
                   </div>}
                   footer={<div className="btn-group">
                       <button className="btn btn-sm btn-outline-danger" onClick={() => complete(false)}>Cancel
                       </button>
                       <button className="btn btn-sm btn-outline-primary" onClick={this.doSubmit.bind(this)}>Submit
                       </button>
                   </div>}
                   error={error}
            />
        );
    }
}

export default ManualEntryForm;
