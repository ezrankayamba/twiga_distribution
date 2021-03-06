import React, { useState, useEffect } from "react";
import MapReport from "./forms/MapReport";
import { IconBtnHide, IconBtnOpen, IconFilter } from "../../utils/icons/Incons";
import FilterForm from "./forms/FilterForm";
import CRUD from "../../../_services/CRUD";
import ObjectUtils from "../../../_helpers/ObjectUtils";
import MatIcon from "../../utils/icons/MatIcon";
const SurveyMapReport = ({ user }) => {
  const [open, setOpen] = useState(true);
  const [surveys, setSurveys] = useState([]);
  const readRes = (res) => {
    if (res) {
      setSurveys(
        res.data.map((c) => {
          return {
            ...c,
            location: { lat: c.lat, lng: c.lng },
          };
        })
      );
    }
  };
  useEffect(() => {
    CRUD.list("/tracking/customers-for-map", user.token, {
      onSuccess: (res) => readRes(res),
      onFail: (err) => console.log(err),
    });
  }, []);
  const onSubmit = (data) => {
    console.log(data);
    CRUD.search(
      "/tracking/customers-for-map",
      user.token,
      ObjectUtils.onlyWithValues(data),
      {
        onSuccess: (res) => readRes(res),
        onFail: (err) => console.log(err),
      }
    );
  };
  return (
    <div className="map-report">
      <h6>Map Report</h6>
      <div className="report-map-container">
        <div className="map-content">
          <MapReport surveys={surveys} />
          <button
            className="open-hide btn p-1"
            type="button"
            onClick={() => setOpen(!open)}
          >
            <MatIcon name="filter_list" />
            {open ? (
              <MatIcon name="chevron_right" />
            ) : (
              <MatIcon name="chevron_left" />
            )}
          </button>
        </div>
        <div className={`map-filter${open ? "" : " hide"}`}>
          <FilterForm user={user} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};
export default SurveyMapReport;
