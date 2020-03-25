import React, {Component} from 'react';

import {
    createCustomer, deleteCustomer,
    fetchCustomers,
    updateCustomer
} from "../../../_services/CustomersService";
import {connect} from "react-redux";
import BasicCrudView from "../../utils/crud/BasicCrudView";
import LoadingIndicator from "../../utils/loading/LoadingIndicator";
import {IconPlus, IconTrash} from "../../utils/icons/Incons";
import NewCustomerForm from "./forms/NewCustomerForm";
import {DateTime} from "../../../_helpers/DateTime";
import CRUD from "../../../_services/CRUD";


@connect((state) => {
    return {
        user: state.auth.user
    }
})
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            distributors: [],
            regions: [],
            openAdd: false,
            pages: 1,
            pageNo: 1,
            isLoading: false,
            types: []
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

    onSearch(data) {
        this.refresh(1, data)
    }

    refresh(page = 1, filter=null) {
        this.setState({isLoading: true}, () =>
            fetchCustomers(this.props.user.token, page, filter,(res) => {
                if (res) {
                    this.setState({
                        customers: res.data.map(c => {
                            return {
                                ...c,
                                distributor: c.distributor.name,
                                region: c.region.name,
                                created_at: DateTime.fmt(c.created_at),
                                customer_type: this.state.types.find(t => c.customer_type === t.id).name,
                                location: `(${c.lat}, ${c.lng})`
                            }
                        }), isLoading: false,
                        pages: parseInt(res.pages)
                    })
                }
            }))
    }

    componentDidMount() {

        CRUD.list("/types", this.props.user.token,
            {
                onSuccess: (types) => {
                    this.setState({types}, this.refresh)
                }
            })
        CRUD.list("/distributors", this.props.user.token,
            {
                onSuccess: (distributors) => {
                    this.setState({distributors})
                }
            })
        CRUD.list("/regions", this.props.user.token,
            {
                onSuccess: (regions) => {
                    this.setState({regions})
                }
            })

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
        console.log(body)
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
        let {customers, pages, pageNo, distributors, regions, types} = this.state;
        let data = {
            records: customers,
            headers: [
                {field: 'id', title: 'ID'},
                {
                    field: 'name', title: 'Name', search: {
                        type: 'input',
                        label: 'Customer Name',
                        name: 'name'
                    }
                },
                {field: 'location', title: 'Location'},
                {
                    field: 'distributor', title: 'Distributor', search: {
                        type: 'select',
                        label: 'Distributor',
                        options: distributors,
                        name: 'distributor'
                    }
                },
                {
                    field: 'region', title: 'Region', search: {
                        type: 'select',
                        label: 'Region',
                        options: regions,
                        name: 'region'
                    }
                },
                {
                    field: 'customer_type', title: 'Type', search: {
                        type: 'select',
                        label: 'Type',
                        options: types,
                        name: 'customer_type'
                    }
                },
                {field: 'created_at', title: 'Created'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <button className="btn btn-sm btn-link text-danger p-0"
                                               onClick={(e) => this.onDelete(e, rowData)}><IconTrash/></button>
                },
            ],
            title: 'List of customers',
            onSearch: this.onSearch.bind(this)
        }

        const pagination = {pages, pageNo, onPageChange: this.onPageChange}
        return (
            <div className="row">
                <div className="col">
                    <div className="row pt-2 pb-2 d-flex">
                        <div className="col">
                            <h5>{data.title}</h5>
                        </div>
                        <div className="col">
                            <div className="btn-group float-right">
                                <button className="btn btn-link p-0" onClick={() => this.setState({openAdd: true})}>
                                    <IconPlus/></button>
                            </div>
                        </div>
                    </div>
                    <BasicCrudView onRowClick={this.onRowClick.bind(this)} pagination={pagination} data={data}
                                   onUpdate={this.doUpdate} onDelete={this.onDelete} onAdd={this.doAdd} toolbar={true}/>
                    {this.state.openAdd && <NewCustomerForm onSubmit={this.doAdd} onClose={this.onClose}/>}
                    {this.state.isLoading && <LoadingIndicator isLoading={this.state.isLoading}/>}
                </div>
            </div>
        );
    }
}

export default List;
