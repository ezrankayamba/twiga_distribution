import React, { Component } from "react";

import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "../../../_services/CustomersService";
import { connect } from "react-redux";
import BasicCrudView from "../../utils/crud/BasicCrudView";
import LoadingIndicator from "../../utils/loading/LoadingIndicator";
import { IconPlus, IconMap } from "../../utils/icons/Incons";
import { DateTime } from "../../../_helpers/DateTime";
import CRUD from "../../../_services/CRUD";
import CustomerRecordForm from "./forms/CustomerRecordForm";
import Modal from "../../modal/Modal";

@connect((state) => {
  return {
    user: state.auth.user,
  };
})
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      distributors: [],
      regions: [],
      openAdd: false,
      pages: 1,
      pageNo: 1,
      isLoading: false,
      types: [],
      selected: null,
    };

    this.doUpdate = this.doUpdate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.doAdd = this.doAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.surveySubmitted = this.surveySubmitted.bind(this);
  }

  onPageChange(pageNo) {
    this.setState({ pageNo });
    this.refresh(pageNo);
  }

  onSearch(data) {
    this.refresh(1, data);
  }

  refresh(page = 1, filter = null) {
    this.setState({ isLoading: true }, () =>
      fetchCustomers(this.props.user.token, page, filter, (res) => {
        if (res) {
          this.setState({
            customers: res.data.map((c) => {
              return {
                ...c,
                region: c.region.name,
                district: c.district.name,
                category: c.category.name,
                created_at: DateTime.fmt(c.created_at),
                location: `(${c.lat}, ${c.lng})`,
              };
            }),
            isLoading: false,
            pages: parseInt(res.pages),
          });
        }
      })
    );
  }

  componentDidMount() {
    CRUD.list("/setups/categories", this.props.user.token, {
      onSuccess: (categories) => {
        this.setState({ categories }, this.refresh);
      },
    });
    CRUD.list("/tracking/suppliers", this.props.user.token, {
      onSuccess: (suppliers) => {
        this.setState({ suppliers });
      },
    });
    CRUD.list("/setups/regions", this.props.user.token, {
      onSuccess: (regions) => {
        this.setState({ regions });
      },
    });
  }

  onDelete(e, params) {
    e.stopPropagation();
    deleteCustomer(this.props.user.token, params.id, (res) => {
      this.refresh();
    });
  }

  doAdd(params, cb) {
    this.setState({ isLoading: true });
    let body = { ...params };
    console.log(body);
    createCustomer(this.props.user.token, body, (res) => {
      if (cb) cb(true);
      this.setState({ openAdd: false }, () => this.refresh());
    });
  }

  doUpdate(params) {
    let body = { id: params.id, name: params.name, account: params.account };
    updateCustomer(this.props.user.token, body, params.id, (res) => {
      params.cb();
      this.refresh();
    });
  }

  onClose(e) {
    this.setState({ openAdd: false });
  }

  onRowClick(e, row) {
    CRUD.read(`/tracking/survey/${row.id}`, this.props.user.token, {
      onSuccess: (res) => {
        this.setState({ selected: res, openDetail: true });
      },
      onFail: (err) => console.error(err),
    });
  }
  surveySubmitted(res) {
    console.log(res);
    this.setState({ openAdd: false, openDetail: false, selected: null });
    this.refresh();
  }

  render() {
    let {
      customers,
      pages,
      pageNo,
      suppliers,
      regions,
      categories,
      openDetail,
      selected,
    } = this.state;
    let data = {
      records: customers,
      headers: [
        { field: "id", title: "ID" },
        {
          field: "name",
          title: "Name",
          search: {
            type: "input",
            label: "Customer Name",
            name: "name",
          },
        },
        {
          field: "location",
          title: "Location",
          render: (row) => (
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={(e) => {
                console.log(loc);
                e.stopPropagation();
              }}
            >
              <span className="pr-2">{row.location}</span> <IconMap />
            </button>
          ),
        },
        {
          field: "region",
          title: "Region",
          search: {
            type: "select",
            label: "Region",
            options: regions,
            name: "region",
          },
        },
        {
          field: "district",
          title: "District",
        },
        {
          field: "town",
          title: "Town",
        },
        {
          field: "share",
          title: "Share of wallet",
        },
        {
          field: "category",
          title: "Category",
          search: {
            type: "select",
            label: "Category",
            options: categories,
            name: "category",
          },
        },
      ],
      title: "List of customers",
      onSearch: this.onSearch.bind(this),
    };

    const pagination = { pages, pageNo, onPageChange: this.onPageChange };
    return (
      <>
        <div className="list-toolbar pt-2 pb-2 d-flex">
          <h5>{data.title}</h5>
          <div className="btn-group float-right">
            <button
              className="btn btn-link p-0"
              onClick={() => this.setState({ openAdd: true })}
            >
              <IconPlus />
            </button>
          </div>
        </div>
        <BasicCrudView
          onRowClick={this.onRowClick.bind(this)}
          pagination={pagination}
          data={data}
          onUpdate={this.doUpdate}
          onDelete={this.onDelete}
          onAdd={this.doAdd}
          toolbar={true}
        />
        {this.state.openAdd && (
          <Modal
            modalId="newCustomerForm"
            title="New Customer"
            handleClose={() => this.setState({ openAdd: false })}
            content={
              <CustomerRecordForm
                newRecord={true}
                surveySubmitted={this.surveySubmitted}
                user={this.props.user}
              />
            }
          />
        )}
        {openDetail && selected && (
          <Modal
            modalId="CustomerDetailsForm"
            title={selected["Customer Information"].name}
            handleClose={() =>
              this.setState({ openDetail: false, selected: null })
            }
            content={
              <CustomerRecordForm
                surveySubmitted={this.surveySubmitted}
                user={this.props.user}
                data={selected}
              />
            }
          />
        )}
        {this.state.isLoading && (
          <LoadingIndicator isLoading={this.state.isLoading} />
        )}
      </>
    );
  }
}

export default List;
