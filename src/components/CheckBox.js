import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.light,
  },
  root: {
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
  },
}));

export default function RadioButtonsGroup(
  {
    disabled,
    error,
    required,
    labelText,
    value,
    handleChange,
    check = {
      label1: "label1",
      value1: "value1",
      // value2: "value2",
      // label2: "label2",
    },
  },
  props
) {
  const classes = useStyles();

  return (
    <FormControl {...props}>
      <FormLabel
        disabled={disabled}
        error={error}
        classes={{ asterisk: classes.asterisk, root: classes.root }}
        required={required}
      >
        {labelText}
      </FormLabel>
      <FormGroup row name={labelText} value={value} onChange={handleChange}>
        <FormControlLabel
          value={check?.value1}
          control={<Checkbox size="small" color="primary" />}
          label={check?.label1}
        />
        {/* <FormControlLabel
          value={check?.value2}
          control={<Checkbox size="small" color="primary" />}
          label={check?.label2}
        /> */}
      </FormGroup>
    </FormControl>
  );
}
// comment added
