import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import MButton from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 25,
  },
}));

const Active = (props) => {
  const classes = useStyles();

  return (
    <MButton
      {...props}
      style={{ fontSize: "0.875rem", textTransform: "none", color: "#1b5e20", backgroundColor: "#c8e6c9" }}
      size="small"
      classes={{
        disabled: classes.disable,
        root: classes.root,
      }}
    >
      {props.children}Active
    </MButton>
  );
};

export default Active;
