import React from 'react';

const getInput = ({type, options}, {value, ...rest}) => {
    if (type === 'select') {
        return <select {...rest}>
            {!value && <option value="">---Select---</option>}
            {options && options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
    } else {
        return <input
            type={type}
            {...rest}
        />
    }
}
const ComputedInput = ({field, ...rest}) => {
    return getInput(field, rest)
}

export default ComputedInput;