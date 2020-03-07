import React, {Component} from 'react';
import ClientList from "./ClientList";

class ClientsIndexPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<ClientList/>)
    }
}

export default ClientsIndexPage;