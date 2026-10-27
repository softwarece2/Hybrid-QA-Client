/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function OnRefresh() {
  const classes = useStyles();
  const navigate = useNavigate();
  const user = useSelector((store) => store.loggedInUser) || JSON.parse(localStorage.getItem("User"));
  useEffect(() => {
    if (!user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div className={classes.root}>
      <Typography style={{ fontSize: "32px" }}>Please Logout and Login Again!</Typography>
    </div>
  );
}
