import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { InputLabel, makeStyles } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.light,
  },
  root: {
    color: theme.palette.text.primary,
    // paddingBottom: theme.spacing(1),
    // paddingLeft: theme.spacing(1),
  },
  textFieldRoot: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    // height: 44,
  },
  input: {
    fontSize: "0.875rem",
    fontWeight: 500,
    // borderRadius: 20,
    color: pink[700],
    // padding: "4px 8px",
  },
}));

export default function AutoCompleteNew(
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
    getOptionLabel,
    label,
    minWidth,
    getOptionSelected,
    style
  },
  ...props
) {
  const classes = useStyles();

  return (
    <div style={{minWidth : minWidth? minWidth : "inherit" }}>
      {!!labelText && (
        <InputLabel
          // disabled={disabled}
          //error={error}
          classes={{
            asterisk: classes.asterisk,
            root: classes.root,
          }}
          required={required}
          style={{ fontSize: "0.875rem", textAlign:"left" }}
        >
          {labelText}
        </InputLabel>
      )}

      <Autocomplete
        {...props}
        options={data}
        style={style}
        size="small"
        value={value}
        disabled={disabled}
        onChange={onChange}
        getOptionLabel={getOptionLabel}
        getOptionSelected={getOptionSelected}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            InputProps={{
              ...params.InputProps,
              classes: {
                input: classes.input,
                root: classes.textFieldRoot,
              },
            }}
            label={label}
            size="small"
            placeholder={placeholder}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </div>
  );
}
