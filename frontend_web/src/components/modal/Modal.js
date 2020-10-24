import "./Modal.css";
import React, { Component } from "react";
import { IconClose } from "../utils/icons/Incons";
import MatIcon from "../utils/icons/MatIcon";
import ReactDom from "react-dom"

function Modal({
  modalId,
  handleClose,
  content,
  title,
  footer,
  large
}) {
  const otherClick = (e) => {
    if (e.target.id === modalId) {
      handleClose();
    }
  }


  const showHideClassName = "modal display-block";
  return ReactDom.createPortal(
    <div
      className={showHideClassName}
      onClick={otherClick}
      id={modalId}
    >
      <div className={large ? "modal-main large" : "modal-main"}>
        <div className="modal-header">
          {title && <h5 className="modal-title">{title}</h5>}
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-link text-warning btn-sm"
              onClick={handleClose}
            >
              <MatIcon name="close" />
            </button>
          </div>
        </div>
        <div className="modal-content">{content}</div>
        {footer && (
          <div className="modal-footer">
            <div className="float-right">{footer}</div>
          </div>
        )}
      </div>
    </div>, document.getElementById("portal")
  );
}

export default Modal;
