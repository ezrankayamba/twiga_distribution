import React, { Component } from "react";
import { connect } from "react-redux";
import CrudTable from "../../../utils/crud/CrudTable";
import Modal from "../../../modal/Modal";
import CommonForm from "../../../utils/form/CommonForm";
import MatIcon from "../../../utils/icons/MatIcon";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class ContactsForm extends Component {
  constructor(props) {
    super(props);
    let { data } = this.props;
    if (data) {
      data = data.map((r, idx) => {
        return { ...r, idx };
      });
    }
    this.state = {
      records: data || [],
      newRecord: false,
    };
    this.onNewRecordSubmit = this.onNewRecordSubmit.bind(this);
  }

  onDelete(row) {
    const { records } = this.state;
    this.setState({ records: records.filter((r) => r.idx !== row.idx) });
  }

  onNewRecordSubmit(data) {
    this.setState({ newRecord: false });
    let records = this.state.records;
    let max = Math.max(records.map((r) => r.idx));
    console.log(data);
    records.push({ ...data, idx: max + 1 });
    this.setState({ records });
  }

  render() {
    const { setup } = this.props;
    const { records, newRecord } = this.state;
    const notEmpty = (val) => val || false;
    const errorMsg = "This field is required";
    const columns = [
      {
        field: "name",
        title: "Name",
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
      { field: "position", title: "Position" },
      { field: "email", title: "Email" },
      { field: "mobile", title: "Mobile phone(s)", many: true },
      {
        field: "action",
        title: "Action",
        render: (row) => {
          return (
            <button
              className="btn btn-sm btn-link text-danger p-0"
              onClick={() => this.onDelete(row)}
            >
              <MatIcon name="delete" />
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
    return (
      <div>
        <div className="d-flex justify-content-between">
          <div>List of contacts</div>
          <div>
            <button
              type="button"
              className="btn btn-sm btn-link float-right pt-0 pb-0"
              onClick={() => this.setState({ newRecord: true })}
            >
              <MatIcon name="add" />
            </button>
          </div>
        </div>
        <CrudTable columns={columns} data={records} />
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
            You need to add atleast one contact
          </p>
        )}
        {newRecord && (
          <Modal
            modalId="contactsForm"
            title="New Record"
            handleClose={() => this.setState({ newRecord: false })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default ContactsForm;
