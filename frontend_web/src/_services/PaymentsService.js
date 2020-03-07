import {apiDelete, apiGet, apiGetPaginated, apiPost, apiUpdate} from "./WebService";
import {BASE_URL} from "../conf";

let url = `${BASE_URL}/payments/`

export const fetchBatches = (token, page, cb) => {
    apiGetPaginated(url + "batches", token, page)
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
export const getBatch = (token, id, cb) => {
    apiGet(url + "batches/" + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createBatch = (token, body, cb) => {
    apiPost(url + "batches/", body, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createBatchManual = (token, body, cb) => {
    apiPost(url + "batches/manual-create/", body, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createBatchFileUpload = (token, body, cb) => {
    apiPost(url + "batches/file-create/", body, token, 'multipart/form-data')
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const updateClient = (token, body, id, cb) => {
    apiUpdate(url, body, id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const deleteBatch = (token, id, cb) => {
    apiDelete(url + "batches/" + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}

export const deleteSelectedBatches = (token, ids, cb) => {
    apiPost(url + "batches/deletes", ids, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}