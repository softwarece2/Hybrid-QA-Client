import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { InputLabel, makeStyles } from "@material-ui/core";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

export default function ComboBox({ disabled, error, required, labelText, data, styles }, props) {
  const classes = useStyles();
  return (
    <>
      <InputLabel
        disabled={disabled}
        error={error}
        classes={{ asterisk: classes.asterisk, root: classes.roor }}
        required={required}
      >
        {labelText}
      </InputLabel>
      <Autocomplete
        {...props}
        multiple
        id="checkboxes-tags-demo"
        options={data}
        disabled={disabled}
        style={styles}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              color="primary"
            />
            {option.title}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            {...params}
            id="my-input"
            fullWidth
            size="small"
            aria-describedby="my-helper-text"
          />
        )}
      />
    </>
  );
}
