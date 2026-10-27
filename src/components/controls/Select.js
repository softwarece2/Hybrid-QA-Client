import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';


export default function Select(props) {

    const { name, label, value, error = null, onChange, options } = props;

    return (
        <FormControl variant="outlined"
            {...(error && { error: true })}
            
            >
            <InputLabel>{label}</InputLabel> 
            <MuiSelect
                label={label}
              
                name={name}
                value={value}
                style={{ height: "47px" }}
                onChange={onChange}>
                <MenuItem value="">None</MenuItem>
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)
                    )
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
