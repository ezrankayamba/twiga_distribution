import React from 'react';
import ComputedInput from "./ComputedInput";
import {IconAdd, IconCaptureLocation, IconMap} from "../Incons";
import LocationUtils from "../../../_helpers/LocationUtils";

const InputControl = ({field, errors, setChanged, ...rest}) => {
    const setVal = (name, val) => {
        let input = document.querySelector(`#${name}`)
        input.value = val
        const event = new Event('input', {bubbles: true})
        input.dispatchEvent(event)
    }
    let onOther = (e, f) => {
        e.stopPropagation()
        console.log(e, f)
    }
    let captLoc = (e) => {
        e.stopPropagation()
        LocationUtils.capture({
            onSuccess: (loc) => {
                console.log(loc, document.querySelector(`#${field.name}`))
                setVal(field.name, `(${loc.lat}, ${loc.lng})`)
            }, onFail: ({code, message}) => console.log(code, message)
        })
    }
    let selectFrmMap = (e, f) => {
        e.stopPropagation()
        console.log(e, f)
    }
    return <div className="form-group mb-0">
        <label htmlFor={field.name} className="d-flex justify-content-between mb-1">
            <span>{field.label}</span>
            {field.other &&
            <button type="button" className="btn btn-link p-0 pr-2" onClick={onOther}><IconAdd/></button>}
            {field.type === 'location' && <div>
                <button type="button" className="btn btn-link p-0 pl-2 pr-2" onClick={captLoc}><IconCaptureLocation/>
                </button>
                <button type="button" className="btn btn-link p-0 pl-2 pr-2" onClick={selectFrmMap}><IconMap/></button>
            </div>}
        </label>
        <ComputedInput field={field} {...rest}/>
        {errors[field.name].length > 0 && (
            <small className="text-danger small">{errors[field.name]}</small>
        )}
    </div>
}

export default InputControl;
