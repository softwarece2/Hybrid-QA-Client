import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import MButton from "@material-ui/core/Button";
// import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 25,
  },
}));

const InActive = (props) => {
  const classes = useStyles();

  return (
    <MButton
      {...props}
      style={{ fontSize: "0.875rem", textTransform: "none", color: "#cb0000", backgroundColor: "#ff7d654d" }}
      size="small"
      classes={{
        disabled: classes.disable,
        root: classes.root,
      }}
    >
      {props.children}Inactive
    </MButton>
  );
};

export default InActive;
