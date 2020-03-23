import React, {Component} from 'react';

import {connect} from "react-redux";
import BasicCrudView from "../../utils/BasicCrudView";
import LoadingIndicator from "../../utils/LoadingIndicator";
import {IconPlus, IconTrash} from "../../utils/Incons";
import NewRecordForm from "./forms/NewRecordForm";
import {DateTime} from "../../../_helpers/DateTime";
import {createRecord, deleteRecord, fetchRecords} from "../../../_services/RecordsService";


@connect((state) => {
    return {
        user: state.auth.user
    }
})
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            openAdd: false,
            pages: 1,
            pageNo: 1,
            isLoading: false,
            types: []
        }

        // this.doUpdate = this.doUpdate.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.doAdd = this.doAdd.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }
    componentDidMount() {
        this.refresh()
    }

    onPageChange(pageNo) {
        this.setState({pageNo})
        this.refresh(pageNo)
    }

    refresh(page = 1) {
        this.setState({isLoading: true}, () =>
            fetchRecords(this.props.user.token, page, (res) => {
                if (res) {
                    this.setState({
                        records: res.data.map(c => {
                            return {
                                ...c,
                                customer: c.customer.name,
                                created_at: DateTime.fmt(c.created_at),
                            }
                        }), isLoading: false,
                        pages: parseInt(res.pages)
                    })
                }
            }))
    }

    onDelete(e, params) {
        e.stopPropagation()
        deleteRecord(this.props.user.token, params.id, (res) => {
            this.refresh()
        })
    }

    doAdd(params, cb) {
        this.setState({isLoading: true})
        let body = {...params}
        console.log(body)
        createRecord(this.props.user.token, body, (res) => {
            if (cb) cb(true)
            this.setState({openAdd: false}, () => this.refresh())
        });
    }

    onClose(e) {
        this.setState({openAdd: false})
    }

    onRowClick(e, row) {
        console.log(row)
        this.setState({selected: row, openDetail: true}, () => console.log(this.state))
    }

    render() {
        let {records, pages, pageNo} = this.state;
        let data = {
            records: records,
            headers: [
                {field: 'id', title: 'ID'},
                {field: 'customer', title: 'Customer'},
                {field: 'volume', title: 'Volume'},
                {field: 'remarks', title: 'Remarks'},
                {field: 'created_at', title: 'Created'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <button className="btn btn-sm btn-link text-danger p-0"
                                               onClick={(e) => this.onDelete(e, rowData)}><IconTrash/></button>
                },
            ],
            title: 'List of records'
        }

        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        return (
            <div className="row">
                <div className="col">
                    <div className="row pt-2 pb-2 d-flex">
                        <div className="col-md">
                            <h5>{data.title}</h5>
                        </div>
                        <div className="col-md">
                            <div className="btn-group float-md-right">
                                <button className="btn btn-link p-0" onClick={() => this.setState({openAdd: true})}>
                                    <IconPlus/></button>
                            </div>
                        </div>
                    </div>
                    <BasicCrudView onRowClick={this.onRowClick.bind(this)} pagination={pagination} data={data}/>
                    {this.state.openAdd && <NewRecordForm onSubmit={this.doAdd} onClose={this.onClose}/>}
                    {this.state.isLoading && <LoadingIndicator isLoading={this.state.isLoading}/>}
                </div>
            </div>
        );
    }
}

export default List;
