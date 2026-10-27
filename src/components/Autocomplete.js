import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { InputLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.light,
  },
  roor: {
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
  },
}));

export default function ComboBox(
  {
    disabled = false,
    error,
    required,
    labelText,
    data,
    onChange,
    helperText,
    placeholder,
    value,
  },
  props
) {
  const classes = useStyles();

  return (
    <>
      <InputLabel
        // disabled={disabled}
        //error={error}
        classes={{
          asterisk: classes.asterisk,
          root: classes.roor,
        }}
        required={required}
      >
        {labelText}
      </InputLabel>

      <Autocomplete
        {...props}
        id="combo-box-demo"
        options={data ? data : [{id: "", name:""}]}
        value={value}
        disabled={disabled}
        onChange={onChange}
      getOptionLabel={((option) => option.name)}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            id="my-input"
            // fullWidth
            size="small"
            placeholder={placeholder}
            aria-describedby="my-helper-text"
            error={error}
            helperText={helperText}
          />
        )}
      />
    </>
  );
}
