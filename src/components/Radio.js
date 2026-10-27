import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
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
    radio = {
      label1: "label1",
      value1: "value1",
      value2: "value2",
      label2: "label2",
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
      <RadioGroup row name={labelText} value={value} onChange={handleChange}>
        <FormControlLabel
          value={radio?.value1}
          control={<Radio size="small" color="primary" />}
          label={radio?.label1}
        />
        <FormControlLabel
          value={radio?.value2}
          control={<Radio size="small" color="primary" />}
          label={radio?.label2}
        />
      </RadioGroup>
    </FormControl>
  );
}
