import React, { Component, useState } from "react";
import "./Tabs.css";
import NewCustomerForm from "./NewCustomerForm";
import ContactsForm from "./ContactsForm";
import DescriptionForm from "./DescriptionForm";
import BrandSupplyForm from "./BrandSupplyForm";
import CRUD from "../../../../_services/CRUD";
import DataSanitizer from "../DataSanitizer";
const CustomerRecordForm = ({ user, data, surveySubmitted, newRecord, suppliers }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState(data || {});

  const tabs = [
    {
      name: "Customer Information",
      label: "Information",
      render: (tab) => (
        <NewCustomerForm
          data={formData[tab.name]}
          onTabSubmit={(data) => onTabSubmit(tab, data)}
        />
      ),
    },
    {
      name: "Customer Contacts",
      label: "Contacts",
      render: (tab) => (
        <ContactsForm
          data={formData[tab.name]}
          onTabSubmit={(data) => onTabSubmit(tab, data)}
        />
      ),
    },
    {
      name: "Customer Description",
      label: "Description",
      render: (tab) => (
        <DescriptionForm
          data={formData[tab.name]}
          onTabSubmit={(data) => onTabSubmit(tab, data)}
        />
      ),
    },
    {
      name: "Brand(s) Supplied",
      label: "Brands",
      render: (tab) => (
        <BrandSupplyForm
          data={formData[tab.name]}
          onTabSubmit={(data) => onTabSubmit(tab, data)}
          suppliers={suppliers}
        />
      ),
    },
  ];
  const [stage, setStage] = useState(data ? tabs.length : 0);
  const onTabSubmit = ({ name, pos }, data) => {
    setFormData({ ...formData, [name]: data });
    setTab(tabs.length - 1 > pos ? pos + 1 : tabs.length - 1);
    setStage(stage <= pos ? pos + 1 : stage);
  };
  const submitSurvey = () => {
    let sanitized = DataSanitizer.sanitize(formData);

    if (newRecord) {
      CRUD.create("/tracking/survey", user.token, sanitized, {
        onSuccess: surveySubmitted,
        onFail: surveySubmitted,
      });
    } else {
      let customerId = sanitized["Customer Information"].id;
      console.log(sanitized)
      CRUD.update(`/tracking/survey/${customerId}`, user.token, sanitized, {
        onSuccess: surveySubmitted,
        onFail: surveySubmitted,
      });
    }
  };
  return (
    <div className="customer-record-form">
      <div className="tab-buttons">
        {tabs.map((t, pos) => (
          <button
            key={pos}
            disabled={pos > stage}
            onClick={() => setTab(pos)}
            className={tab === pos ? "btn-active" : ""}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map(
          (T, pos) => tab === pos && <T.render key={T.name} name={T.name} pos={pos} />
        )}
      </div>
      <div className="tab-footer">
        <button
          disabled={stage !== tabs.length}
          type="button"
          className="w-100 btn"
          onClick={submitSurvey}
        >
          {newRecord ? "Submit customer survey" : "Update customer survey"}
        </button>
      </div>
    </div>
  );
};

export default CustomerRecordForm;
