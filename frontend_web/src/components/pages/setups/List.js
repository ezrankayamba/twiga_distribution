import React, { Component } from "react";
import { connect } from "react-redux";
import { IconAdd, IconTrash } from "../../utils/icons/Incons";
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
      selected: null,
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

  onDelete(row) {
    const { setup, user } = this.props;
    CRUD.delete(`${setup.path}/${row.id}`, user.token, {
      onSuccess: (res) => this.refresh(),
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
    const { selected } = this.state;
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
          encType: setup.encType,
          fields: setup.columns
            // .filter((c) => c.field !== "id")
            .map((c) => {
              return {
                name: c.field,
                label: c.field === "id" ? null : c.title,
                type: c.field === "id" ? "hidden" : c.fk ? "select" : "text",
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
        encType: setup.encType,
        fields: setup.columns
          //   .filter((c) => c.field !== "id")
          .map((c) => {
            return {
              name: c.field,
              label: c.field === "id" ? null : c.title,
              type: c.field === "id" ? "hidden" : c.type,
              ...c,
            };
          }),
        onSubmit: this.onNewRecordSubmit,
      };
      this.setState({ form: meta, formDataLoaded: true });
    }
  }
  onNewRecordSubmit(data) {
    this.setState({ newRecord: false, selected: null });
    const { setup, user } = this.props;
    console.log(setup);
    let form = new FormData();
    Object.entries(data).forEach((entry) => {
      let fld = setup.columns.find((c) => c.field === entry[0]);
      let check = fld && fld.type === "checkbox";
      let isFile = fld && fld.type === "file";
      let val = entry[1];
      if (check) {
        val = !entry[1] ? false : entry[1];
      }

      if (isFile && !(val instanceof File)) {
        console.log("File: ", val);
      } else {
        form.append(entry[0], val);
      }
    });

    const resHandlers = {
      onSuccess: (res) => {
        console.log(res);
        this.refresh();
      },
      onFail: (err) => console.log(err),
    };
    if (data.id) {
      const url = `${setup.path}/${data.id}`;
      CRUD.update(url, user.token, form, resHandlers, setup.encType);
    } else {
      CRUD.create(setup.path, user.token, form, resHandlers, setup.encType);
    }
  }

  onRowClick(_, data) {
    this.setState({ selected: data, newRecord: true });
  }

  render() {
    const { setup } = this.props;
    let { records, newRecord, form, formDataLoaded, selected } = this.state;
    form = {
      ...form,
      fields:
        form &&
        form.fields
          .filter((f) => f.name !== "action")
          .map((f) => {
            let value =
              selected && selected[f.name]
                ? selected[f.name]
                : f.type === "checkbox"
                ? false
                : null;
            return {
              ...f,
              value,
            };
          }),
    };

    const action = {
      field: "action",
      title: "Action",
      render: (row) => (
        <button
          className="btn btn-link p-0 text-danger"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            this.onDelete(row);
          }}
        >
          <IconTrash />
        </button>
      ),
    };

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
        <CrudTable
          columns={[...setup.columns, action]}
          data={records}
          onRowClick={this.onRowClick.bind(this)}
        />
        {newRecord && (
          <Modal
            modalId="setupForm"
            title="Setup Record"
            handleClose={() => this.setState({ newRecord: false })}
            content={<CommonForm meta={form} />}
          />
        )}
      </div>
    );
  }
}

export default List;
