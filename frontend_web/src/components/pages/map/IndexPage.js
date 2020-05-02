import React, { Component } from "react";
import SurveyMapReport from "./SurveyMapReport";
import "./Map.css";
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
    return <SurveyMapReport user={this.props.user} />;
  }
}

export default IndexPage;
