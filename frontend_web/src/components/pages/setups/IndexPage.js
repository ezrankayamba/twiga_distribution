import React, { Component } from "react";
import Setups from "./Setups";
import { connect } from "react-redux";
@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class IndexPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Setups user={this.props.user} />;
  }
}

export default IndexPage;
