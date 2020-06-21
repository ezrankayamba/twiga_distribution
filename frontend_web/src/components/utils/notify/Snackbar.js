import React from "react";

class Snackbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
  }

  componentDidMount() {
    let done =
      this.props.done ||
      function () {
        console.log("Done internal");
      };

    setTimeout(() => {
      this.setState({ show: false }, () => done());
    }, this.props.timeout);
  }

  render() {
    console.log(this.state);
    const { error } = this.props;
    return (
      <div id="snackbar" className={`${error ? "error " : ""}show`}>
        {this.props.message}
      </div>
    );
  }
}

export default Snackbar;
