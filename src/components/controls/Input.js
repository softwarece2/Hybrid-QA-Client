import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value, size, maxRows, error = null, onChange, ...other } = props;
    return (

        <TextField
            variant="outlined"
            label={label}
            
            name={name}
            value={value}
            size="small"
            fullWidth
            maxRows={maxRows}
            onChange={onChange}
            {...other}
            {...(error && { error: true, helperText: error })}
        />
    )
}
