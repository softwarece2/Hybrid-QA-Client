import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import MButton from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
  },
}));

const Button = (props) => {
  const classes = useStyles();
        
  return (
    <MButton
      size="small"
      style={{ fontSize: "0.875rem", fontWeight: 400, textTransform: "none" }}
      {...props}
      classes={{
        disabled: classes.disable,
        root: classes.root,
      }}
    >
      {props.children}
    </MButton>
  );
};

export default Button;
