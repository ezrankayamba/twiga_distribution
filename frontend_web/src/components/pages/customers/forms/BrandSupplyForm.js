import React, { Component } from "react";
import { connect } from "react-redux";
import { IconAdd } from "../../../utils/icons/Incons";
import CrudTable from "../../../utils/crud/CrudTable";
import Modal from "../../../modal/Modal";
import CommonForm from "../../../utils/form/CommonForm";
import CRUD from "../../../../_services/CRUD";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class BrandSupplyForm extends Component {
  constructor(props) {
    super(props);
    const data = this.props.data || [];

    this.state = {
      records: data,
      newRecord: false,
      brands: [],
      suppliers: [],
    };
    this.onNewRecordSubmit = this.onNewRecordSubmit.bind(this);
  }

  refresh() {}

  componentDidMount() {
    CRUD.list("/tracking/suppliers", this.props.user.token, {
      onSuccess: (suppliers) => this.setState({ suppliers }),
    });
    CRUD.list("/setups/brands", this.props.user.token, {
      onSuccess: (brands) => this.setState({ brands }),
    });
  }

  onNewRecordSubmit(data) {
    this.setState({ newRecord: false });
    let records = this.state.records;
    console.log(data);
    let brand = this.state.brands.find((b) => (b.id = data.brand_id));
    records.push({ ...data, brand: brand });
    this.setState({ records });
  }

  render() {
    const { setup } = this.props;
    const { records, newRecord, suppliers, brands } = this.state;
    const notEmpty = (val) => val || false;
    const errorMsg = "This field is required";
    const columns = [
      {
        field: "brand_id",
        title: "Cement Brand",
        type: "select",
        options: brands,
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
      {
        field: "supplier_id",
        title: "Supplied By",
        type: "select",
        options: suppliers,
      },
      {
        field: "volume",
        title: "Est. monthly volume",
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
    ];
    const form = {
      fields: columns
        .filter((c) => c.field !== "id")
        .map((c) => {
          return {
            name: c.field,
            label: c.title,
            ...c,
          };
        }),
      onSubmit: this.onNewRecordSubmit,
    };

    return (
      <div>
        <div className="d-flex justify-content-between">
          <div>List of supplies</div>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-link float-right pt-0 pb-0"
              onClick={() => this.setState({ newRecord: true })}
            >
              <IconAdd />
            </button>
          </div>
        </div>
        <CrudTable
          columns={columns}
          data={records.map((r) => {
            return { ...r, brand_id: r.brand ? r.brand.name : r.brand_id };
          })}
        />
        {records.length > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-primary mt-2"
            onClick={() => this.props.onTabSubmit(records)}
          >
            Save Data
          </button>
        )}
        {records.length === 0 && (
          <p className="pt-2 text-danger">
            You need to add atleast one brand supply
          </p>
        )}
        {newRecord && (
          <Modal
            modalId="brandSupplyForm"
            title="New Record"
            handleClose={() => this.setState({ newRecord: false })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default BrandSupplyForm;
