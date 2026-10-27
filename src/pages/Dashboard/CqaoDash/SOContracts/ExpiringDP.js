import React from "react";
//Material ui-core
import { Card, Typography, CardHeader } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
//Component
import DP from "../Charts/DP";

// import ClearanceLetterIssued from "../ClearanceLetterIssued";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 235,
    width: 400,
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function ExpiringDp() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
        <CardHeader className={classes.card} disableTypography title={<Typography style={{fontSize: "0.875rem"}}>POs with expiring DP</Typography>} />
        <DP />
      </Card>
    </>
  );
}
