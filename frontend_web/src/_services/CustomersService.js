import {
  apiDelete,
  apiGet,
  apiGetPaginated,
  apiPost,
  apiUpdate,
} from "./WebService";
import { BASE_URL } from "../conf";

let url = `${BASE_URL}/tracking/customers`;

export const fetchCustomers = (token, page, filter, cb) => {
  apiGetPaginated(url, token, page, filter)
    .then((res) => {
      if (res.status === 200) {
        let { pages, records } = res.headers;
        cb({
          data: res.data,
          pages,
          records,
        });
      } else throw Error("Failure response: " + res.status);
    })
    .catch((e) => {
      console.error("Error", e);
      cb(false);
    });
};
export const createCustomer = (token, { location, ...rest }, cb) => {
  const locRegex = /^\(([-\d.]+), ([-\d.]+)\)$/;
  let match = location.match(locRegex);
  let extras = {};
  if (match.length === 3) {
    extras["lat"] = parseFloat(match[1]).toFixed(8);
    extras["lng"] = parseFloat(match[2]).toFixed(8);
  }

  let body = { ...rest, ...extras };
  console.log(body);
  apiPost(url, body, token)
    .then(cb)
    .catch((e) => {
      console.error(e);
      cb(false);
    });
};
export const updateCustomer = (token, body, id, cb) => {
  apiUpdate(url, body, id, token)
    .then(cb)
    .catch((e) => {
      console.error(e);
      cb(false);
    });
};
export const deleteCustomer = (token, id, cb) => {
  apiDelete(url + id, token)
    .then(cb)
    .catch((e) => {
      console.error(e);
      cb(false);
    });
};
