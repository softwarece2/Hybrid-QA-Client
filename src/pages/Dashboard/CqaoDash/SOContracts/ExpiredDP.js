import React from "react";

//material ui-core
import { Card, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//component
import PODP from "../Charts/PODP";

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

export default function ExpiredDp() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
        <CardHeader className={classes.card} disableTypography title={<Typography style={{fontSize: "0.875rem"}}>POs with expired DP</Typography>} />
        <PODP />
      </Card>
    </>
  );
}
