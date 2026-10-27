import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import MButton from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  disable: {
    color: "grey !important",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    color: "red",
  },
  root: {
    backgroundColor: deepOrange[400],
    "&:hover": {
      backgroundColor: deepOrange[800],
    },
    "&:active": {
      backgroundColor: deepOrange[800],
    },
  },
}));

const SubmitButton = (props) => {
  const classes = useStyles();
  const { loading, isEditMode, style, ...otherProps } = props;

  return (
    <MButton
      {...otherProps}
      style={{ textTransform: "none", ...style }}
      classes={{
        disabled: classes.disable,
        root: props.isEditMode ? classes.root : "",
      }}
      data-testid="submitButton"
    >
      {props.loading && (
        <CircularProgress data-testid="submitButtonLoader" disableShrink size={24} className={classes.buttonProgress} />
      )}
      {props.isEditMode ? "Update" : "Submit"}
    </MButton>
  );
};

export default SubmitButton;
