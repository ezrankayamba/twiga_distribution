import React, { Component } from "react";
import CommonForm from "../../../utils/form/CommonForm";
import { connect } from "react-redux";
import CRUD from "../../../../_services/CRUD";
import { addNewOption, clearNewOptions } from "../../../../redux/forms/actions";
import { createCustomer } from "../../../../_services/CustomersService";

@connect(
  (state) => {
    return {
      user: state.auth.user,
    };
  },
  { addOption: addNewOption, clearOptions: clearNewOptions }
)
class NewCustomerForm extends Component {
  state = { popup: null, suppliers: [], regions: [], types: [], districts: [] };
  onSubmit(data) {
    this.props.onTabSubmit(data);
  }

  componentDidMount() {
    const data = this.props.data || {};
    CRUD.list("/tracking/suppliers", this.props.user.token, {
      onSuccess: (suppliers) => this.setState({ suppliers }),
    });
    CRUD.list("/setups/regions", this.props.user.token, {
      onSuccess: (regions) =>
        this.setState({ regions }, () => {
          let region_id = data.region ? data.region.id : data.region_id;
          let region = regions.find(
            (r) => region_id && r.id === parseInt(region_id)
          );
          this.setState({ districts: region ? region.districts : [] });
        }),
    });
    CRUD.list("/setups/categories", this.props.user.token, {
      onSuccess: (categories) => this.setState({ categories }),
    });
    this.props.clearOptions();
  }

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
    const { regions, suppliers, categories, districts } = this.state;
    const data = this.props.data || {};
    const notEmpty = (val) => val || false;
    const errorMsg = "This field is required";
    let form = {
      title: null,
      fields: [
        {
          name: "id",
          value: data.id,
          type: "hidden",
        },
        {
          name: "name",
          label: "Name",
          value: data.name,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "location",
          label: "Location",
          type: "location",
          value: data.location,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "region_id",
          label: "Region",
          type: "select",
          options: regions,
          linkedTo: ["district_id"],
          value: data.region ? data.region.id : data.region_id,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "district_id",
          label: "District",
          type: "select",
          options: districts,
          linkChanged: this.onRegionChanged.bind(this),
          value: data.district ? data.district.id : data.district_id,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "town",
          label: "Business Town",
          value: data.town,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "category_id",
          label: "Category",
          type: "select",
          options: categories,
          value: data.category ? data.category.id : data.category_id,
          validator: {
            valid: notEmpty,
            error: errorMsg,
          },
        },
        {
          name: "share",
          label: "Wallet Share",
          type: "number",
          value: data.share,
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

export default NewCustomerForm;
