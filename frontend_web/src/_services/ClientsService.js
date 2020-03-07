import {apiDelete, apiGet, apiGetPaginated, apiPost, apiUpdate} from "./WebService";
import {BASE_URL} from "../conf";

let url = `${BASE_URL}/clients/`

export const fetchClients = (token, page,cb) => {
    apiGetPaginated(url, token, page)
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
export const getClient = (token, id, cb) => {
    apiGet(url + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createClient = (token, body, cb) => {
    apiPost(url, body, token)
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
export const deleteClient = (token, id, cb) => {
    apiDelete(url + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const deleteSelectedClients = (token, ids, cb) => {
    apiPost(url + "deletes", ids, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const createClientUser = (token, body, cb) => {
    apiPost(BASE_URL + "/clients/create-user", body, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
