import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: "0.875rem",
    marginBottom: 5,
    marginLeft: 1,
    color: theme.palette.text.primary,
  },
  inputSize: {
    fontSize: "0.875rem",
    // color: "#000",
  },
  root: {
    borderRadius: 4,
    height: "80px",
  },
  helperText: {
    marginLeft: 4,
  },
}));

export default function NewTextField(props) {
  const classes = useStyles();
  return (
    <>
      {props.labelText && (
        <InputLabel disabled={props.disabled} className={classes.label}>
          {props.labelText} {props.required ? <span style={{ color: "red" }}>*</span> : null}
        </InputLabel>
      )}
      <TextField
        {...props}
        variant="standard"
        size="small"
       // fullWidth
        disabled={props.disabled}
        inputProps={{ ...props.inputProps }}
        InputProps={{
          classes: {
            input: classes.inputSize,
            root: classes.root,
          },
          ...props.InputProps,
        }}
        FormHelperTextProps={{
          classes: {
            root: classes.helperText,
          },
        }}
      />
    </>
  );
}
