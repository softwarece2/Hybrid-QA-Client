import { makeStyles, TextareaAutosize } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  text: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    width: "100%",
  },
}));

const TextArea = (props) => {
  const classes = useStyles();
  return <TextareaAutosize {...props} className={classes?.text} />;
};

export default TextArea;
