import React, {Component} from 'react';

import {
    createClient, createClientUser,
    deleteClient,
    deleteSelectedClients,
    fetchClients,
    updateClient
} from "../../../_services/ClientsService";
import {connect} from "react-redux";
import BasicCrudView from "../../utils/BasicCrudView";
import CommonForm from "../../utils/CommonForm";
import CloseableModel from "../../modal/ClosableModal";
import LoadingIndicator from "../../utils/LoadingIndicator";
import dayjs from "dayjs";
import {DateTime} from "../../../_helpers/DateTime";
import {IconPlus, IconTrash} from "../../utils/Incons";
import ClientsDetailModal from "./ClientsDetailModal";
import Modal from "../../modal/Modal";
import {createUser} from "../../../_services/AuthService";


@connect((state) => {
    return {
        user: state.auth.user
    }
})
class ClientList extends Component {
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
            fetchClients(this.props.user.token, page, (res) => {
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
        deleteClient(this.props.user.token, params.id, (res) => {
            this.refresh()
        })
    }

    doDeleteSelected(params) {
        deleteSelectedClients(this.props.user.token, params.ids, (res) => {
            params.cb()
            this.refresh()
        })
    }

    doAdd(params, cb) {
        this.setState({isLoading: true})
        let body = {...params}
        createClient(this.props.user.token, body, (res) => {
            if (cb) cb(true)
            this.setState({openAdd: false}, () => this.refresh())
        });
    }

    doUpdate(params) {
        let body = {id: params.id, name: params.name, account: params.account}
        updateClient(this.props.user.token, body, params.id, (res) => {
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
                {field: 'account', title: 'Account MSISDN'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <button className="btn btn-sm btn-link text-danger"
                                               onClick={(e) => this.onDelete(e, rowData)}><IconTrash/></button>
                },
            ],
            title: 'List of clients'
        }
        let form = {
            title: "Add Record",
            fields: [
                {
                    name: 'name', label: "Name", validator: {
                        valid: (val) => val ? val.length >= 3 : false,
                        error: "Name should be at least 3 characters"
                    }
                },
                {
                    name: 'account', label: "Account MSISDN", validator: {
                        valid: (val) => RegExp("^(|255|0)\\d{5,9}$").test(val),
                        error: "Invalid MSISDN"
                    }
                },
            ],
            onSubmit: this.doAdd
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
                                   onUpdate={this.doUpdate} onDelete={this.doDelete} onAdd={this.doAdd} toolbar={true}/>
                    {openDetail && selected &&
                    <Modal title={selected.name} modalId="clientDetailModel" show={openDetail}
                           handleClose={() => this.setState({
                               selected: null,
                               openDetails: false
                           }, this.refresh)}
                           content={<ClientsDetailModal client={selected}/>}/>}
                    {this.state.openAdd && <CloseableModel
                        modalId="manageRecord"
                        handleClose={this.onClose}
                        show={this.state.openAdd}
                        content={<CommonForm meta={form} onClose={this.onClose}/>}/>
                    }
                    {this.state.isLoading && <LoadingIndicator isLoading={this.state.isLoading}/>}
                </div>
            </div>
        );
    }
}

export default ClientList;
