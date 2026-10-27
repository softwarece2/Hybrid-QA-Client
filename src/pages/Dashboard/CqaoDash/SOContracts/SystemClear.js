import React from "react";
//Material ui -core
import { Card, CardContent, Typography, Grid, CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 235,
    width: 400,
    [theme.breakpoints.up("md")]: {
      width: "80%",
      Height: "60%",
    },
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  size: {
    fontSize: "0.875rem",
  },
}));

export default function SystemClear() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>POs with expired</Typography>}
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography align="left" className={classes.size}>
                Systems Cleared (current FY) :
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align="left" className={classes.size}>
                Waivers accorded (current FY):
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align="left" className={classes.size}>
                Files for CQAO’s approval:
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
