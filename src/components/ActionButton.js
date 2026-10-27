import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import MButton from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 26,
  },
  obs: {
    borderRadius: 4,
    height: 26,
    width: 150,
  },
video: {
  borderRadius: 4,
  height: 26,
  width: 155,
},
  form: {
    borderRadius: 4,
    height: 26,
    width: 100,
  },
  tmr: {
    borderRadius: 4,
    height: 26,
    width: 80,
  },
  line: {
    borderRadius: 4,
    height: 26,
    width: 120,
  },
}));

const ActionButton = props => {
  const classes = useStyles();
  return (
    <MButton
    {...props}
    style={{ fontSize: "0.875rem", fontWeight: 400, textTransform: "none", ...props.style }}
      classes={
        props.obs === "obs"
          ? {
              disabled: classes.disable,
              root: classes.obs,
            }
          :   props.obs === "video"
          ? {
              disabled: classes.disable,
              root: classes.video,
            }
          : props.obs === "form"
          ? {
              disabled: classes.disable,
              root: classes.form,
            }
          : props.obs === "tmr"
          ? {
              disabled: classes.disable,
              root: classes.tmr,
            }
          : props.obs === "line"
          ? {
              disabled: classes.disable,
              root: classes.line,
            }
          : {
              disabled: classes.disable,
              root: classes.root,
            }
      }
    >
      {props.children}
    </MButton>
  );
};

export default ActionButton;
