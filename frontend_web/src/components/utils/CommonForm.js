import React, {Component} from 'react';
import "./CommonForm.css"
import {IconClose} from "./Incons";
import ComputedInput from "./inputs/ComputedInput";

const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

class CommonForm extends Component {
    constructor(props) {
        super(props);
        let errors = {}
        let data = {}
        this.props.meta.fields.forEach((f) => {
            errors[f.name] = ""
            data[f.name] = null
        })
        this.state = {
            data,
            errors: errors
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    validateOne(name, value) {
        let errors = this.state.errors;
        let field = this.props.meta.fields.find((f) => f.name === name)
        if (field.validator) {
            let v = field.validator
            errors[field.name] = v.valid(value) ? "" : v.error ? v.error : "Invalid entry"
        }
        return errors
    }

    validateAll() {
        let tmp = {}
        for (const f of this.props.meta.fields) {
            let name = f.name
            let value = this.state.data[name]
            let errors = this.validateOne(name, value)
            tmp = {...tmp, ...errors}
        }
        return tmp
    }

    handleChange(event) {
        event.preventDefault();
        const {name, value} = event.target;
        let errors = this.validateOne(name, value)
        this.setState({errors, data: {...this.state.data, [name]: value}});
    };

    clearFormData() {
        let data = this.state.data
        Object.keys(data).forEach(function (key, index) {
            this[key] = ""
        }, data)
        this.setState({data})
    }

    handleSubmit(event) {
        event.preventDefault();
        let errors = this.validateAll()
        this.setState({errors})
        if (validateForm(this.state.errors)) {
            let onSubmit = this.props.meta.onSubmit
            if (onSubmit) {
                onSubmit(this.state.data, (res) => {
                    console.log("Res: ", res)
                    if (res) {
                        this.clearFormData()
                    }
                })
            }
        }
    };

    render() {
        const {errors, data} = this.state
        const {meta, onClose} = this.props
        const defaultClose = () => console.log("Not handled...")
        const handleClose = onClose || defaultClose
        return (
            <div className="form-wrap bg-light">
                {meta.title && <div className="form-header p-2">
                    <h5 className=""><span>{meta.title}</span></h5>
                    {onClose &&
                    <div className="float-right">
                        <button className="float-right btn btn-link p-0 text-warning" onClick={handleClose}>
                            <IconClose/>
                        </button>
                    </div>}
                </div>}

                <form onSubmit={this.handleSubmit} noValidate className="p-3">
                    {meta.fields.map(f => {
                        return (
                            <div key={f.name} className="mb-2">
                                <div className="form-group mb-0">
                                    <label htmlFor={f.name}>{f.label}</label>
                                    <ComputedInput field={f}
                                                   value={data[f.name] ? data[f.name] : ""}
                                                   name={f.name}
                                                   id={f.name}
                                                   className="form-control"
                                                   onChange={this.handleChange}
                                                   noValidate/>
                                    {errors[f.name].length > 0 && (
                                        <small className="text-danger small">{errors[f.name]}</small>
                                    )}
                                </div>
                                {f.info && <div className="info">
                                    <small>{f.info}</small>
                                </div>}
                            </div>
                        )
                    })}
                    <div className="submit pt-3">
                        <button className="btn btn-sm btn-primary">{meta.btnLabel || "Submit"}</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default CommonForm;
