import React from "react";
//Material ui core
import { Card, CardContent, Typography, Grid, CardHeader} from "@material-ui/core";
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
  },
  size: {
    fontSize: "0.875rem"
  }
}));

export default function InHand() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.root}>
        <CardHeader className={classes.card} disableTypography title={<Typography style={{fontSize: "0.875rem"}}>POs with expired DP</Typography>} />

        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>POs in Hand :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>: 123</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>Nos</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>: 456</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>Items</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>: 45</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>Qty</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>: 675</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>No. of Systems</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="left" className={classes.size}>: 500</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
