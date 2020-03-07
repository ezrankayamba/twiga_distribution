import {apiPost} from "./WebService";
import {BASE_URL} from "../conf";

export const executeAction = (token, {action, id, cb}) => {
    apiPost(BASE_URL + "/payments/execute-action", {batch: id, action: action}, token)
        .then(res => {
            cb(true)
        }).catch(error=>{
            console.error(error)
            cb(false)
    })
}