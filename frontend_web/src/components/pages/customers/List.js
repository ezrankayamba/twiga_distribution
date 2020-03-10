import React, {Component} from 'react';

import {
    createCustomer, deleteCustomer,
    fetchCustomers,
    updateCustomer
} from "../../../_services/CustomersService";
import {connect} from "react-redux";
import BasicCrudView from "../../utils/BasicCrudView";
import CommonForm from "../../utils/CommonForm";
import CloseableModel from "../../modal/ClosableModal";
import LoadingIndicator from "../../utils/LoadingIndicator";
import {IconPlus, IconTrash} from "../../utils/Incons";
import DetailModal from "./DetailModal";
import Modal from "../../modal/Modal";
import NewCustomerForm from "./forms/NewCustomerForm";


@connect((state) => {
    return {
        user: state.auth.user
    }
})
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            openAdd: false,
            pages: 1,
            pageNo: 1,
            isLoading: false,
            openDetail: false,
            selected: null
        }

        this.doUpdate = this.doUpdate.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onPageChange = this.onPageChange.bind(this)
        this.doAdd = this.doAdd.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    onPageChange(pageNo) {
        this.setState({pageNo})
        this.refresh(pageNo)
    }

    refresh(page = 1) {
        this.setState({isLoading: true}, () =>
            fetchCustomers(this.props.user.token, page, (res) => {
                if (res) {
                    this.setState({
                        clients: res.data, isLoading: false,
                        pages: parseInt(res.pages)
                    })
                }
            }))
    }

    componentDidMount() {
        this.refresh()
    }

    onDelete(e, params) {
        e.stopPropagation()
        deleteCustomer(this.props.user.token, params.id, (res) => {
            this.refresh()
        })
    }

    doAdd(params, cb) {
        this.setState({isLoading: true})
        let body = {...params}
        createCustomer(this.props.user.token, body, (res) => {
            if (cb) cb(true)
            this.setState({openAdd: false}, () => this.refresh())
        });
    }

    doUpdate(params) {
        let body = {id: params.id, name: params.name, account: params.account}
        updateCustomer(this.props.user.token, body, params.id, (res) => {
            params.cb()
            this.refresh()
        })
    }

    onClose(e) {
        this.setState({openAdd: false})
    }

    onRowClick(e, row) {
        console.log(row)
        this.setState({selected: row, openDetail: true}, () => console.log(this.state))
    }

    render() {
        let {clients, pages, pageNo, openDetail, selected} = this.state;
        let data = {
            records: clients,
            headers: [
                {field: 'id', title: 'ID'},
                {field: 'name', title: 'Name'},
                {field: 'location', title: 'Location'},
                {field: 'distributor', title: 'Distributor'},
                {field: 'region', title: 'Region'},
                {field: 'customer_type', title: 'Type'},
                {field: 'created_at', title: 'Created'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <button className="btn btn-sm btn-link text-danger"
                                               onClick={(e) => this.onDelete(e, rowData)}><IconTrash/></button>
                },
            ],
            title: 'List of customers'
        }

        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        return (
            <div className="row">
                <div className="col">
                    <div className="row pt-2 pb-2 d-flex">
                        <div className="col-md">
                            <h5>List of clients</h5>
                        </div>
                        <div className="col-md">
                            <div className="btn-group float-md-right">
                                <button className="btn btn-link p-0" onClick={() => this.setState({openAdd: true})}>
                                    <IconPlus/></button>
                            </div>
                        </div>
                    </div>
                    <BasicCrudView onRowClick={this.onRowClick.bind(this)} pagination={pagination} data={data}
                                   onUpdate={this.doUpdate} onDelete={this.onDelete} onAdd={this.doAdd} toolbar={true}/>
                    {openDetail && selected &&
                    <Modal title={selected.name} modalId="customerDetailModel" show={openDetail}
                           handleClose={() => this.setState({
                               selected: null,
                               openDetails: false
                           }, this.refresh)}
                           content={<DetailModal client={selected}/>}/>}
                    {this.state.openAdd && <NewCustomerForm onSubmit={this.doAdd} onClose={this.onClose}/>}
                    {this.state.isLoading && <LoadingIndicator isLoading={this.state.isLoading}/>}
                </div>
            </div>
        );
    }
}

export default List;
