import React, {Component} from 'react';
import BatchListView from "./BatchListView";

class PaymentsIndexPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BatchListView/>
        )
    }
}

export default PaymentsIndexPage;