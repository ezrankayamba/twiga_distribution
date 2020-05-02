import "./Modal.css";
import React, { Component } from "react";
import { IconClose } from "../utils/icons/Incons";

class Modal extends Component {
  otherClick(e) {
    const { modalId, handleClose } = this.props;
    if (e.target.id === modalId) {
      handleClose();
    }
  }

  render() {
    const {
      modalId,
      handleClose,
      content,
      title,
      footer,
      large,
      error,
    } = this.props;
    const showHideClassName = "modal display-block";
    return (
      <div
        className={showHideClassName}
        onClick={this.otherClick.bind(this)}
        id={modalId}
      >
        <div className={large ? "modal-main p-0 large" : "modal-main p-0"}>
          <div className="row m-0 p-1 pl-2 pr-2 modal-header">
            {title && (
              <div className="col p-0">
                <h5 className="modal-title">{title}</h5>
              </div>
            )}
            <div className="col p-0">
              <div className="btb-group float-right ml-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-warning"
                  onClick={handleClose}
                >
                  <IconClose />
                </button>
              </div>
            </div>
          </div>
          <div className="row m-0 pl-2 pr-2 my-modal-content">
            <div className="col p-0">{content}</div>
          </div>
          {footer && (
            <div className="bg-light row m-0 p-2 my-modal-footer">
              <div className="col p-0">
                {error && <i className="text-danger">{error}</i>}
                <div className="float-right">{footer}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Modal;
