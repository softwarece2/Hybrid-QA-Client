import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, CardContent, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "50%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "60%",
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "85%",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "1rem",
  },
  cardContent: {
    textAlign: "left",
    padding: 16,
    backgroundColor: "#C7D7B8",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
}));

export default function LineItemsStatus() {
  const classes = useStyles();

  return (
    <div align="center">
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: classes.cardHeader,
            title: classes.cardTitle,
          }}
          style={{ textAlign: "left" }}
          title="Status of Balance Quantity"
        />

        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
              <Typography>Balance Quantity to Offer</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <Typography>: 456</Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
              <Typography>Balance Quantity remaining to assign for the lot</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <Typography>: 456</Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
              <Typography>Balance Quantity remaining to assign for consignee</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <Typography>: 456</Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
              <Typography>Balance Quantity to assign for items</Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <Typography>: 456</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
