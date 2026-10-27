import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: theme.spacing(0.5),
  },
  secondary: {
    // backgroundColor: theme.palette.secondary.light,
    "& .MuiButton-label": {
      color: "#000000",
    },
  },
  primary: {
    // backgroundColor: theme.palette.primary.light,
    "& .MuiButton-label": {
      color: "#000000",
    },
  },
}));

export default function ActionBtn(props) {
  const { color, children, onClick } = props;
  const classes = useStyles();

  return (
    <IconButton className={`${classes.root} ${classes[color]}`} onClick={onClick}>
      {children}
    </IconButton>
  );
}
