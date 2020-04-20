import React, { Component } from "react";
import { connect } from "react-redux";
import { IconAdd } from "../../utils/icons/Incons";
import CrudTable from "../../utils/crud/CrudTable";
import Modal from "../../modal/Modal";
import CommonForm from "../../utils/form/CommonForm";
import CRUD from "../../../_services/CRUD";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      pages: 1,
      pageNo: 1,
      isLoading: false,
      newRecord: false,
      form: null,
      formData: {},
      formDataLoaded: false,
    };
    this.onNewRecordSubmit = this.onNewRecordSubmit.bind(this);
  }

  onPageChange(pageNo) {
    this.setState({ pageNo });
    this.refresh();
  }

  refresh() {
    const { setup, user } = this.props;
    CRUD.list(setup.path, user.token, {
      onSuccess: (records) => {
        this.setState({ records });
      },
      onFail: (err) => console.log(err),
    });
  }

  componentDidMount() {
    this.refresh();
    this.prepareForm();
  }
  nextData(pos, list, cb) {
    const { setup, user } = this.props;
    const { formData } = this.state;
    let path = list[pos].path;
    CRUD.list(path, user.token, {
      onSuccess: (records) => {
        this.setState({ formData: { ...formData, [path]: records } });
        if (pos < list.length - 1) {
          this.nextData(pos + 1, list, cb);
        } else {
          cb(true);
        }
      },
    });
  }
  prepareForm() {
    const { setup } = this.props;
    const toFetch = setup.columns
      .filter((c) => c.fk)
      .map((c) => {
        return {
          path: c.fk,
        };
      });
    if (toFetch.length) {
      this.nextData(0, toFetch, (res) => {
        this.setState({ formDataLoaded: true });
        const meta = {
          fields: setup.columns
            .filter((c) => c.field !== "id")
            .map((c) => {
              return {
                name: c.field,
                label: c.title,
                type: c.fk ? "select" : "text",
                options: c.fk ? this.state.formData[c.fk] : undefined,
                ...c,
              };
            }),
          onSubmit: this.onNewRecordSubmit,
        };
        this.setState({ form: meta, formDataLoaded: true });
      });
    } else {
      const meta = {
        fields: setup.columns
          .filter((c) => c.field !== "id")
          .map((c) => {
            console.log(c);
            return {
              name: c.field,
              label: c.title,
              ...c,
            };
          }),
        onSubmit: this.onNewRecordSubmit,
      };
      this.setState({ form: meta, formDataLoaded: true });
    }
  }
  onNewRecordSubmit(data) {
    this.setState({ newRecord: false });
    const { setup, user } = this.props;
    CRUD.create(setup.path, user.token, data, {
      onSuccess: (res) => {
        console.log(res);
        this.refresh();
      },
      onFail: (err) => console.log(err),
    });
  }

  render() {
    const { setup } = this.props;
    const { records, newRecord, form, isLoading, formDataLoaded } = this.state;
    return (
      <div>
        <div className="d-flex justify-content-between">
          <div>List of {setup.name}</div>
          <div>
            <button
              type="button"
              disabled={!formDataLoaded}
              className="btn btn-sm btn-link float-right pt-0 pb-0"
              onClick={() => this.setState({ newRecord: true })}
            >
              <IconAdd />
            </button>
          </div>
        </div>
        <CrudTable columns={setup.columns} data={records} />
        {newRecord && (
          <Modal
            modalId="setupForm"
            title="New Record"
            handleClose={() => this.setState({ newRecord: false })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default List;
