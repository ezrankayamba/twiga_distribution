import React, { Component } from "react";
import { connect } from "react-redux";
import CrudTable from "../../../utils/crud/CrudTable";
import Modal from "../../../modal/Modal";
import CommonForm from "../../../utils/form/CommonForm";
import CRUD from "../../../../_services/CRUD";
import { IconAdd, IconTrash } from "../../../utils/icons/Incons";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class BrandSupplyForm extends Component {
  constructor(props) {
    super(props);
    let { data } = this.props;
    if (data) {
      data = data.map((r, idx) => {
        return { ...r, idx: idx + 1 };
      });
    }

    this.state = {
      records: data || [],
      newRecord: false,
      brands: [],
      suppliers: [],
      selected: null,
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
    console.log("Data: ", data);
    let records = this.state.records;
    if (data.idx) {
      records = records.filter((r) => parseInt(r.idx) !== parseInt(data.idx));
    }
    let brand = this.state.brands.find(
      (b) => data.brand_id && b.id === parseInt(data.brand_id)
    );
    let supplier = this.state.suppliers.find(
      (b) => data.supplier_id && b.id === parseInt(data.supplier_id)
    );
    let idx = Math.max(records.map((r) => r.idx)) + 1;
    records.push({ ...data, brand, supplier, idx });
    this.setState({ records });
  }
  onDelete(row) {
    const { records } = this.state;
    this.setState({ records: records.filter((r) => r.idx !== row.idx) });
  }
  onRowClick(_, selected) {
    console.log("Selected: ", selected);
    this.setState({ selected, newRecord: true });
  }
  render() {
    const { records, newRecord, suppliers, brands, selected } = this.state;
    const notEmpty = (val) => val || false;
    const errorMsg = "This field is required";
    const columns = [
      {
        field: "id",
        type: "hidden",
        value: selected ? selected.id : null,
      },
      {
        field: "idx",
        type: "hidden",
        value: selected ? selected.idx : null,
      },
      {
        field: "brand_id",
        title: "Cement Brand",
        type: "select",
        options: brands,
        value: selected && selected.brand ? selected.brand.id : null,
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
      {
        field: "supplier_id",
        title: "Supplied By",
        type: "select",
        value: selected && selected.supplier ? selected.supplier.id : null,
        options: suppliers,
      },
      {
        field: "volume",
        title: "Est. monthly volume",
        value: selected ? selected.volume : null,
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
      {
        field: "action",
        title: "Action",
        render: (row) => {
          return (
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                this.onDelete(row);
              }}
            >
              <IconTrash />
            </button>
          );
        },
      },
    ];
    const form = {
      fields: columns
        .filter((c) => c.field !== "id" && !c.render)
        .map((c) => {
          return {
            name: c.field,
            label: c.title,
            ...c,
          };
        }),
      onSubmit: this.onNewRecordSubmit,
    };

    const brandName = (r) => {
      let brand = brands.find(
        (b) => b.id === (r.brand ? r.brand.id : r.brand_id)
      );
      return brand ? brand.name : r.brand_id;
    };
    const suppName = (r) => {
      console.log(r);
      let supp = suppliers.find(
        (b) => b.id === (r.supplier ? r.supplier.id : r.supplier_id)
      );
      return supp ? supp.name : r.supplier_id;
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
          onRowClick={this.onRowClick.bind(this)}
          columns={columns}
          data={records.map((r) => {
            return { ...r, brand_id: brandName(r), supplier_id: suppName(r) };
          })}
        />
        {records.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-primary mt-1 float-right"
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
            title="Supply Record"
            handleClose={() => this.setState({ newRecord: false })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default BrandSupplyForm;
