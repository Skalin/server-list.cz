import {FormGroup} from "@material-ui/core";
import TextField from "@material-ui/core/es/TextField";
import React, {Component} from 'react';
import PropTypes from 'prop-types';



export class TextInput extends Component
{

    static propTypes = {
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        autofocus: PropTypes.bool,
        required: PropTypes.bool,
        callback: PropTypes.func.isRequired
    };

    constructor(props)
    {
        super(props);

        this.state = {
            name: this.props.name,
            label: this.props.label,
            required: this.props.required,
            autofocus: typeof this.props.autofocus === 'undefined' ? 0 : this.props.autofocus,
            callback: this.props.callback,
            value: this.props.value === undefined ? '' : this.props.value,
        };
    }

    onChange = (value) => {
        this.props.callback(value);
    };




    render = () => {
        return (
            <TextField name={this.state.name} required
                       label={this.state.label} autoFocus={this.state.autofocus}
                       onChange={this.onChange.bind(this)} value={this.state.value}/>
        );
    }
}