import React from "react";

export const IconPlus = () => <i className="icon ion-plus-circled tx-24"></i>;
export const IconAdd = () => <i className="icon ion-plus-circled tx-24"></i>;
export const IconAddNew = ({ className }) => (
  <i className={`icon ion-plus-circled ${className}`}></i>
);
export const IconTrash = () => (
  <i className="icon ion-trash-b tx-16 pl-2 pr-2"></i>
);
export const IconHome = () => <i className="icon ion-ios-home-outline"></i>;
export const IconFirst = () => (
  <>
    <span className="pg-first"></span>
    <i className="icon ion-ios-arrow-back"></i>
  </>
);
export const IconPrev = () => <i className="icon ion-ios-arrow-back"></i>;
export const IconNext = () => <i className="icon ion-ios-arrow-right"></i>;
export const IconLast = () => (
  <>
    <i className="icon ion-ios-arrow-right"></i>
    <span className="pg-last"></span>
  </>
);
export const IconPayment = () => <i className="icon ion-card"></i>;
export const IconClient = () => (
  <i className="icon ion-ios-briefcase-outline"></i>
);
export const IconSignOut = () => <i className="icon ion-power"></i>;
export const IconSignIn = () => <i className="icon ion-power"></i>;
export const IconSettings = () => <i className="icon ion-android-settings"></i>;
export const IconPerson = () => <i className="icon ion-ios-person"></i>;
export const IconUsers = () => <i className="icon ion-ios-people"></i>;
export const IconMapReport = () => <i className="icon ion-map"></i>;
export const IconFile = () => <i className="icon ion-document-text tx-16"></i>;
export const IconUpload = () => <i className="icon ion-arrow-up-a"></i>;
export const IconManual = () => <i className="icon ion-grid"></i>;
export const IconBtnOpen = () => <i className="icon ion-ios-arrow-left"></i>;
export const IconBtnHide = () => <i className="icon ion-ios-arrow-right"></i>;
export const IconFilter = () => <i className="icon ion-funnel"></i>;
export const IconClose = () => <i className="ion ion-android-close tx-24"></i>;
export const IconCaptureLocation = () => (
  <i className="icon ion-android-locate tx-16"></i>
);
export const IconMap = () => <i className="icon ion-location tx-16"></i>;
export const IconSearch = () => <i className="ion ion-search-strong tx-16"></i>;
export const IconLoading = () => (
  <div className="loading">
    <i></i>
    <span>Loading ...</span>
  </div>
);
