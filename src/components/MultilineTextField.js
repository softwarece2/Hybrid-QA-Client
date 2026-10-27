import React from "react";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: "0.875rem",
    marginBottom: 2,
    marginLeft: 1,
    color: theme.palette.text.primary,
  },
  inputSize: {
    fontSize: "0.875rem",
    // margin: -6
    // marginLeft: -6,
    // marginTop: -6,
  },
  helperText: {
    marginLeft: 4,
  },
}));

export default function MultilineTextField(props) {
  const classes = useStyles();
  return (
    <>
      <InputLabel className={classes.label}>
        {props.labelText} {props.required ? <span style={{ color: "red" }}>*</span> : null}
      </InputLabel>
      <TextField
        {...props}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        InputProps={{
          classes: {
            input: classes.inputSize,
          },
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
