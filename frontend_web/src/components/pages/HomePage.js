import React, { Component } from 'react';
import { connect } from "react-redux";
import ShareByCategoryGraph from './dashboard/ShareByCategoryGraph';
import ShareByRegionGraph from './dashboard/ShareByRegionGraph';

@connect((state) => {
    return {
        user: state.auth.user,
        loggedIn: state.auth.loggedIn
    }
})
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = { file: null }
        this.onChange = this.onChange.bind(this)
    }

    onSubmit(data) {
        console.log("Submitted data: ", data)
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] })
    }

    render() {
        return (
            <div className="dashboard">
                <ShareByCategoryGraph token={this.props.user.token} />
                <ShareByRegionGraph token={this.props.user.token} />
            </div>
        )
    }
}

export default HomePage;
