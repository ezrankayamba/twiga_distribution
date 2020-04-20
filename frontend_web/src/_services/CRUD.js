import { apiGet, apiPost, apiUpdate } from "./WebService";
import { BASE_URL } from "../conf";

const CRUD = {
  list: (path, token, { onSuccess, onFail }) => {
    apiGet(`${BASE_URL}${path}`, token)
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
  create: (path, token, body, { onSuccess, onFail }) => {
    apiPost(`${BASE_URL}${path}`, body, token)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
  update: (path, token, body, { onSuccess, onFail }) => {
    apiUpdate(`${BASE_URL}${path}`, body, token)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => (onFail ? onFail(error) : console.log(error)));
  },
};

export default CRUD;
