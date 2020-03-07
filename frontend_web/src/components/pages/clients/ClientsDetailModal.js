import React, {Component} from 'react';
import {IconPlus, IconTrash} from "../../utils/Incons";
import BasicCrudView from "../../utils/BasicCrudView";
import {fetchRoles} from "../../../_services/AuthService";
import {connect} from "react-redux";
import Modal from "../../modal/Modal";
import CommonForm from "../../utils/CommonForm";
import {createClientUser} from "../../../_services/ClientsService";

@connect((state) => {
    return {
        user: state.auth.user,
        loggedIn: state.auth.loggedIn
    }
})
class ClientsDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {client: props.client, roles: [], openAdd: false}
    }

    componentDidMount() {
        fetchRoles(this.props.user.token, (res) => {
            this.setState({roles: res})
        })
    }

    onNewUserAdd(params, cb) {
        createClientUser(this.props.user.token, {...params, client_id: this.state.client.id}, (res) => {
            if (res) {
                cb(true)
                this.setState({openAdd: false, client: JSON.parse(res.client)}, () => {
                    cb(true)
                })
            }
        })
    }

    render() {
        const {roles, openAdd, client} = this.state
        let data = {
            records: client ? client.users.map(({user}) => {
                return {...user, role: user.profile && user.profile.role ? user.profile.role.name : "No role assigned"}
            }) : [],
            headers: [
                {field: 'id', title: 'UserID'},
                {field: 'username', title: 'Username'},
                {field: 'role', title: 'Role'},
                {
                    field: 'action', title: 'Action',
                    render: rowData => <button className="btn btn-sm btn-link text-danger"><IconTrash/></button>
                },
            ],
            title: 'List of users'
        }
        let form = {
            title: "User Form",
            fields: [
                {
                    name: 'username', label: "Username", validator: {
                        valid: (val) => val ? val.length >= 5 : false,
                        error: "Username should be at least 5 characters"
                    }
                },
                {name: 'role', label: "Role", type: "select", options: roles},
            ],
            onSubmit: this.onNewUserAdd.bind(this)
        }
        return (
            <div className="row">
                <div className="col">
                    <div className="row pt-2 pb-2 d-flex">
                        <div className="col-md">
                            <h5>List of users</h5>
                        </div>
                        <div className="col-md">
                            <div className="btn-group float-md-right">
                                <button className="btn btn-link p-0" onClick={() => this.setState({openAdd: true})}>
                                    <IconPlus/></button>
                            </div>
                        </div>
                    </div>
                    <BasicCrudView data={data}/>
                    {openAdd &&
                    <Modal title={form.title} modalId="addUserForm" handleClose={() => this.setState({openAdd: false})}
                           show={openAdd}
                           content={<CommonForm meta={{...form, title: null}}/>}/>}
                </div>
            </div>
        );
    }
}

export default ClientsDetailModal;