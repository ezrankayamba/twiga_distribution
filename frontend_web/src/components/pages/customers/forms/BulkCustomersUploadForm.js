import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingIndicator from "../../../utils/loading/LoadingIndicator";
import Snackbar from "../../../utils/notify/Snackbar";
import CommonForm from "../../../utils/form/CommonForm";
import Modal from "../../../modal/Modal";
import CRUD from "../../../../_services/CRUD";
import { FormsHelper } from "../../../../_helpers/FormsHelper";

@connect((state) => {
  return {
    user: state.auth.user,
    loggedIn: state.auth.loggedIn,
  };
})
class BulkCustomersUploadForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: null,
      isLoading: false,
    };
  }
  onSubmit(data, cb) {
    let form = new FormData();
    Object.entries(data).forEach((entry) => {
      form.append(entry[0], entry[1]);
    });
    this.setState({ isLoading: true, snackbar: null });
    const { complete } = this.props;
    CRUD.uploadDocs(
      "/tracking/survey/bulk",
      this.props.user.token,
      form,
      (res) => {
        console.log(res);
        this.setState({
          isLoading: false,
          snackbar: {
            message: res.message,
            timeout: 5000,
            error: res.result !== 0,
            done: () => {
              if (complete) {
                complete(res);
              }
            },
          },
        });
      }
    );
  }

  render() {
    const { complete, invoice, onSubmit, readOnly } = this.props;

    const { snackbar, isLoading } = this.state;
    const title = `Customers - Bulk Upload`;
    let form = {
      fields: [
        {
          name: "file",
          label: "Customers File",
          validator: FormsHelper.notEmpty(),
          type: "file",
          accept: ".xls,.xlsx",
        },
      ],
      onSubmit: readOnly ? null : onSubmit || this.onSubmit.bind(this),
      enctype: "multipart/form-data",
    };
    return (
      <>
        <Modal
          modalId="bulkUploadForm"
          handleClose={() => complete(false)}
          show={true}
          title={title}
          content={
            <CommonForm
              meta={form}
              readOnly={readOnly}
              onClose={() => complete(false)}
            />
          }
        />
        {snackbar && <Snackbar {...snackbar} />}
        {isLoading && <LoadingIndicator isLoading={true} />}
      </>
    );
  }
}

export default BulkCustomersUploadForm;
