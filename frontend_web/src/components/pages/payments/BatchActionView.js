import React, {Component} from 'react';
import {connect} from "react-redux";
import {refreshFSM} from "../../../redux/fsm/actions";
import {executeAction} from "../../../_services/FSMService";

@connect((state) => {
    return {
        user: state.auth.user,
        fsm: state.fsm
    }
}, {refreshFSM: refreshFSM})
class BatchActionView extends Component {
    constructor(props) {
        super(props);
        this.executeAction = this.executeAction.bind(this)
    }

    executeAction(e, action, id) {
        e.preventDefault()
        e.stopPropagation()
        executeAction(this.props.user.token, {
            action: action, id: id, cb: (res) => {
                if (res) {
                    this.props.complete()
                }
            }
        })
    }

    getFsmState(code) {
        let state = this.props.fsm.states.find(s => s.code === code)
        return state
    }

    render() {
        const {rowData} = this.props
        let {actions} = this.getFsmState(rowData.status)
        if (actions) {
            let myPrivs = this.props.user.profile.role.privileges
            actions = actions.filter(a => myPrivs.includes(a.privilege))
        }
        return actions && actions.length ? (
            <div className="btn-group">
                {actions.map(a => <button key={a.name}
                                          className={a.warn ? "btn btn-sm btn-outline-danger" : "btn btn-sm btn-outline-primary"}
                                          onClick={(e) => this.executeAction(e, a.name, rowData.id)}>{a.title}</button>)}
            </div>
        ) : <span>Wait...</span>
    }
}

export default BatchActionView;