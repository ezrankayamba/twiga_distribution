import React, { Component } from "react";
import { connect } from "react-redux";
import { IconAdd } from "../../../utils/icons/Incons";
import CrudTable from "../../../utils/crud/CrudTable";
import Modal from "../../../modal/Modal";
import CommonForm from "../../../utils/form/CommonForm";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class ContactsForm extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    console.log(data);
    this.state = {
      records: data || [],
      newRecord: false,
    };
    this.onNewRecordSubmit = this.onNewRecordSubmit.bind(this);
  }

  refresh() {}

  componentDidMount() {
    this.refresh();
  }

  onNewRecordSubmit(data) {
    this.setState({ newRecord: false });
    let records = this.state.records;
    console.log(data);
    records.push(data);
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
      { field: "mobile", title: "Mobile phone(s)" },
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
          <div>List of contacts</div>
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
        <CrudTable columns={columns} data={records} />
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
