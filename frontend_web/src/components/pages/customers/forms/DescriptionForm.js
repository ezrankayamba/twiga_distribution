import React, { Component } from "react";
import CommonForm from "../../../utils/form/CommonForm";
import { connect } from "react-redux";
import { addNewOption, clearNewOptions } from "../../../../redux/forms/actions";

@connect(
  (state) => {
    return {
      user: state.auth.user,
    };
  },
  { addOption: addNewOption, clearOptions: clearNewOptions }
)
class DescriptionForm extends Component {
  state = {};
  onSubmit(data) {
    this.props.onTabSubmit(data);
  }

  componentDidMount() { }

  onOtherSubmit(field, { id, name }) {
    this.props.addOption(field, { id, name });
  }

  onClose() {
    this.setState({ popup: null });
  }

  onShowPopup(popup) {
    this.setState({ popup });
  }
  onRegionChanged(region) {
    this.setState({ districts: region.districts });
  }

  render() {
    const { onSubmit } = this.props;
    const data = this.props.data || {};
    const notEmpty = (val) => val || false;
    const errorMsg = "This field is required";
    let form = {
      title: null,
      fields: [
        {
          name: "fleet_size",
          label: "Fleet Size",
          type: "number",
          value: data.fleet_size || '0',
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "trucks",
          label: "Number of re-distribution trucks",
          type: "number",
          value: data.trucks || '0',
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "system",
          label: "IT system",
          value: data.system || 'None',
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "outlets",
          label: "Number of outlets",
          type: "number",
          value: data.outlets,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "machines",
          label: "Number of machines",
          type: "number",
          value: data.machines || '0',
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "types",
          label: "Type of machines",
          value: data.machines ? data.types : 'Not applicable',
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "business",
          label: "Type of business",
          value: data.business,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
      ],
      onSubmit: onSubmit ? onSubmit : this.onSubmit.bind(this),
      btnLabel: "Save data",
    };
    const onClose = this.props.onClose;
    return (
      <CommonForm
        meta={form}
        onClose={onClose}
        onShowPopup={this.onShowPopup.bind(this)}
      />
    );
  }
}

export default DescriptionForm;
