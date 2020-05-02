import React, { Component, useEffect, useState } from "react";
import CommonForm from "../../../utils/form/CommonForm";
import CRUD from "../../../../_services/CRUD";
import { IconFilter } from "../../../utils/icons/Incons";

const FilterForm = ({ user, onSubmit }) => {
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    CRUD.list("/setups/regions", user.token, {
      onSuccess: (res) => setRegions(res),
      onFail: (err) => console.log(err),
    });
    CRUD.list("/setups/categories", user.token, {
      onSuccess: (res) => setCategories(res),
      onFail: (err) => console.log(err),
    });
    CRUD.list("/tracking/suppliers", user.token, {
      onSuccess: (res) => setSuppliers(res),
      onFail: (err) => console.log(err),
    });
  }, []);
  const form = {
    onSubmit,
    btnLabel: (
      <>
        <IconFilter /> <span className="ml-2">Filter</span>
      </>
    ),
    fields: [
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: categories,
        all: "---All categories---",
      },
      {
        name: "supplier_id",
        label: "Supplied By",
        type: "select",
        options: suppliers,
        all: "---All suppliers---",
      },
      {
        name: "region_id",
        label: "Region",
        type: "select",
        options: regions,
        all: "---All regions---",
      },
    ],
  };
  return (
    <div className="filter-form">
      <CommonForm meta={form} />
    </div>
  );
};

export default FilterForm;
