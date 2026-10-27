import React from "react";
//Material ui-core
import { Card, CardContent, Typography, Grid, CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
    fontSize: 11,
  },
  size: {
    fontSize: "0.875rem",
  },
}));

export default function QAPs() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>QAPs</Typography>}
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography align="left" className={classes.size}>
                Pending with CQAE(WE):
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
