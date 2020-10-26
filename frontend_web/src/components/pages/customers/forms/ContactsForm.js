import React, { Component } from "react";
import { connect } from "react-redux";
import CrudTable from "../../../utils/crud/CrudTable";
import Modal from "../../../modal/Modal";
import CommonForm from "../../../utils/form/CommonForm";
import MatIcon from "../../../utils/icons/MatIcon";
import Numbers from "../../../../_helpers/Numbers";

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
      selected: null,
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
    if (data.idx) {
      records = records.filter((r) => parseInt(r.idx) !== parseInt(data.idx));
    }

    let idx = Math.max(records.map((r) => r.idx)) + 1;
    console.log(data);
    records.push({ ...data, idx });
    this.setState({ records });
  }
  onRowClick(_, selected) {
    console.log("Selected: ", selected);
    this.setState({ selected, newRecord: true });
  }
  render() {
    const { setup } = this.props;
    const { records, newRecord, selected } = this.state;
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
        field: "name",
        title: "Name",
        value: selected ? selected.name : null,
        validator: {
          valid: notEmpty,
          error: errorMsg,
        },
      },
      { field: "position", title: "Position", value: selected ? selected.position : null },
      { field: "email", title: "Email", value: selected ? selected.email : null },
      { field: "email_alt", title: "Alt. Email", value: selected ? selected.email_alt : null },
      { field: "mobile", title: "Mobile phone", value: selected ? selected.mobile : null },
      { field: "mobile_alt", title: "Alt. Mobile phone", value: selected ? selected.mobile_alt : null },
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
              }
              }
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
        <CrudTable onRowClick={this.onRowClick.bind(this)} columns={columns} data={records.map(r => {
          return {
            ...r, mobile: Numbers.mobile(r.mobile), mobile_alt: Numbers.mobile(r.mobile_alt)
          }
        })} />
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
            title="Contact Person"
            handleClose={() => this.setState({ newRecord: false, selected: null })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default ContactsForm;
