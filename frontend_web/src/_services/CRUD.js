import { apiGet, apiPost, apiUpdate, apiDelete } from "./WebService";
import { BASE_URL } from "../conf";

const CRUD = {
  list: (path, token, { onSuccess, onFail }) => {
    apiGet(`${BASE_URL}${path}`, token)
      .then((list) => {
        onSuccess(list);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  delete: (path, token, { onSuccess, onFail }) => {
    apiDelete(`${BASE_URL}${path}`, token)
      .then((list) => {
        onSuccess(list);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  search: (path, token, params, { onSuccess, onFail }) => {
    apiPost(`${BASE_URL}${path}`, params, token)
      .then((list) => {
        onSuccess(list);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  read: (path, token, { onSuccess, onFail }) => {
    apiGet(`${BASE_URL}${path}`, token)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  create: (path, token, body, { onSuccess, onFail }, type) => {
    apiPost(`${BASE_URL}${path}`, body, token, type)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  update: (path, token, body, { onSuccess, onFail }, type) => {
    apiUpdate(`${BASE_URL}${path}`, body, token, type)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  uploadDocs: (path, token, body, cb, newDoc = true) => {
    console.log("Upload docs");
    if (newDoc) {
      apiPost(`${BASE_URL}${path}`, body, token, "multipart/form-data")
        .then(cb)
        .catch((e) => {
          console.error(e);
          cb(false);
        });
    } else {
      apiUpdate(`${BASE_URL}${path}`, body, null, token, "multipart/form-data")
        .then(cb)
        .catch((e) => {
          console.error(e);
          cb(false);
        });
    }
  },
};

export default CRUD;
