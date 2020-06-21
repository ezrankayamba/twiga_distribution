import React, { useState, useEffect } from "react";
import "./Setup.css";
import List from "./List";
import Modal from "../../modal/Modal";
import CRUD from "../../../_services/CRUD";
import MatIcon from "../../utils/icons/MatIcon";

const Setups = ({ user }) => {
  const [setups, setSetups] = useState([]);

  useEffect(() => {
    CRUD.list("/setups/counts", user.token, {
      onSuccess: (res) => {
        const setups = [
          {
            name: "Regions",
            path: "/setups/regions",
            count: res.regions,
            columns: [
              { field: "id", title: "ID" },
              { field: "name", title: "Name" },
              { field: "small", title: "Small" },
              { field: "medium", title: "Medium" },
              { field: "large", title: "Large" },
              { field: "xlarge", title: "X-Large" },
            ],
          },
          {
            name: "Districts",
            path: "/setups/districts",
            count: res.districts,
            columns: [
              { field: "id", title: "ID" },
              { field: "name", title: "Name" },
              {
                field: "region",
                title: "Region",
                render: (row) => (row.region ? row.region_name : null),
                fk: "/setups/regions",
              },
            ],
          },
          {
            name: "Brands",
            path: "/setups/brands",
            count: res.brands,
            columns: [
              { field: "id", title: "ID" },
              { field: "name", title: "Name" },
            ],
          },
          {
            name: "Categories",
            path: "/setups/categories",
            count: res.categories,
            encType: "multipart/form-data",
            columns: [
              { field: "id", title: "ID" },
              { field: "name", title: "Name" },
              {
                field: "icon",
                title: "Icon",
                type: "file",
                fileType: "image/png",
                render: (row) => (
                  <img
                    className="setups-icon-image"
                    src={row.icon}
                    alt="No image"
                  />
                ),
              },
              {
                field: "is_supplier",
                title: "Supplier",
                type: "checkbox",
                value: false,
                render: (row) => <span>{row.is_supplier ? "Yes" : "No"}</span>,
              },
            ],
          },
        ];
        setSetups(setups);
      },
      onFail: (err) => console.error(err),
    });
  }, []);

  const [setup, setSetup] = useState(null);
  const manageSetup = (selected) => {
    setSetup(selected);
  };
  return (
    <>
      <ul className="list-group">
        <h6>Manage Setups</h6>
        {setups.map((s) => (
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <button
              type="button"
              onClick={() => manageSetup(s)}
              className="btn btn-sm btn-link"
            >
              <MatIcon name="settings" /> <span className="ml-2">{s.name}</span>
            </button>
            <span className="badge badge-primary badge-pill">{s.count}</span>
          </li>
        ))}
      </ul>
      {setup && (
        <Modal
          title={setup.name}
          modalId="manageSetup"
          handleClose={() => setSetup(null)}
          content={<List setup={setup} />}
        />
      )}
    </>
  );
};

export default Setups;
