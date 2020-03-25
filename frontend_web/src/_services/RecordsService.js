import {apiDelete, apiGetPaginated, apiPost, apiUpdate} from "./WebService";
import {BASE_URL} from "../conf";

let url = `${BASE_URL}/records`

export const fetchRecords = (token, page, filter, cb) => {
    apiGetPaginated(url, token, page, filter)
        .then(res => {
            if (res.status === 200) {
                let {pages, records} = res.headers
                cb({
                    data: res.data,
                    pages, records
                })
            } else
                throw Error("Failure response: " + res.status)
        })
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createRecord = (token, {customer, ...rest}, cb) => {
    let extras = {
        customer_id: customer ? parseInt(`${customer}`) : null,
    }

    let body = {...rest, ...extras}
    console.log(body)
    apiPost(url, body, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const deleteRecord = (token, id, cb) => {
    apiDelete(url + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
