import React, {Component} from 'react';
import CommonForm from "../../../utils/form/CommonForm";
import CloseableModel from "../../../modal/ClosableModal";
import {connect} from "react-redux";
import CRUD from "../../../../_services/CRUD";
import {addNewOption, clearNewOptions} from "../../../../redux/forms/actions";
import NewCustomerForm from "../../customers/forms/NewCustomerForm";

@connect((state) => {
    return {
        user: state.auth.user
    }
}, {addOption: addNewOption, clearOptions: clearNewOptions})
class NewRecordForm extends Component {
    state = {popup: null, customers: []}

    componentDidMount() {
        CRUD.list("/customers", this.props.user.token,
            {onSuccess: (customers) => this.setState({customers})})
        this.props.clearOptions()
    }

    onOtherSubmit(field, {id, name, ...rest}) {
        this.props.addOption(field, {id, name})
    }

    onClose(e) {
        this.setState({popup: null})
        // this.props.onClose(false)
    }

    onShowPopup(popup) {
        this.setState({popup})
    }

    render() {
        const {onSubmit} = this.props
        const {customers} = this.state
        let form = {
            title: "New Record",
            fields: [

                {
                    name: 'customer',
                    label: "Customer",
                    type: 'select',
                    options: customers,
                    other: true,
                    component: NewCustomerForm
                },
                {name: 'volume', label: "Monthly Volume"},
                {name: 'remarks', label: "Remarks"},
            ],
            onSubmit: onSubmit
        }
        const onClose = this.props.onClose
        const {popup} = this.state
        return (
            <>
                <CloseableModel
                    modalId="manageRecord-Record"
                    handleClose={onClose}
                    show={true}
                    content={<CommonForm meta={form} onClose={onClose}
                                         onShowPopup={this.onShowPopup.bind(this)}/>}/>
                {form.fields.filter(f => f.component).map(f => {
                    return popup && popup === f.name &&
                        <f.component onClose={this.onClose.bind(this)}
                                     onOtherSubmit={(data) => this.onOtherSubmit(f.name, data)}
                                     key={f.name}/>
                })}
            </>
        );
    }
}

export default NewRecordForm;
