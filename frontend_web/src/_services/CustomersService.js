import {apiDelete, apiGet, apiGetPaginated, apiPost, apiUpdate} from "./WebService";
import {BASE_URL} from "../conf";

let url = `${BASE_URL}/customers`

export const fetchCustomers = (token, page, cb) => {
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
export const createCustomer = (token, {location, ...rest}, cb) => {
    const locRegex = /^\(([-\d.]+), ([-\d.]+)\)$/
    let match = location.match(locRegex)
    let loc = {}
    if (match.length === 3) {
        loc['lat'] = parseFloat(match[1]).toFixed(8)
        loc['lng'] = parseFloat(match[2]).toFixed(8)
    }
    console.log(loc)
    apiPost(url, {...rest, ...loc}, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const updateCustomer = (token, body, id, cb) => {
    apiUpdate(url, body, id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
export const deleteCustomer = (token, id, cb) => {
    apiDelete(url + id, token)
        .then(cb)
        .catch(e => {
            console.error(e)
            cb(false)
        })
}
