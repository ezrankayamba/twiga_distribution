import React, {Component} from 'react';
import CommonForm from "../../../utils/CommonForm";
import CloseableModel from "../../../modal/ClosableModal";

class NewCustomerForm extends Component {
    state={}
    onSubmit(data){
        console.log(data)
        this.props.onClose(false)
    }
    render() {
        let form = {
            title: "Add Record",
            fields: [
                {name: 'name', label: "Name"},
                {name: 'location', label: "Location", type: 'location'},
                {name: 'distributor', label: "Distributor", type: 'select', other: true},
                {name: 'region', label: "Region", type: 'select', other: true},
                {name: 'customer_type', label: "Type", type: 'select', other: true},
            ],
            onSubmit: this.onSubmit.bind(this)
        }
        const onClose = this.props.onClose
        return (
            <CloseableModel
                modalId="manageRecord"
                handleClose={onClose}
                show={true}
                content={<CommonForm meta={form} onClose={onClose}/>}/>
        );
    }
}

export default NewCustomerForm;
