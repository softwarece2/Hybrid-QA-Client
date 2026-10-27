import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
import Card from "@material-ui/core/Card";
import { Grid, CardContent, Typography } from "@material-ui/core";

//components

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
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
    // backgroundColor: "#C7D7B8",
  },
  cardContent1: {
    textAlign: "left",
    padding: 16,
    backgroundColor: "#C7D7B8",
  },
  cardContent2: {
    textAlign: "left",
    padding: 16,
    backgroundColor: "#FFC090",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  spacing: {
    // padding: "0px 12px 0px 12px",
  },
}));

export default function SODetailsDashboard() {
  const classes = useStyles();

  return (
    <div align="center">
      
        <Grid container spacing={2}>
          {/* ..............card1............... */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.spacing}  >
            <Card className={classes.card}>
              <CardContent className={classes.cardContent1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography>
                      <b>Items</b>
                    </Typography>
                    <Typography>Items Cleared : </Typography>
                    <Typography>Qty Cleared :</Typography>
                    <Typography>Qty Remaining :</Typography>
                    <Typography>Completed :</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* ..............card2............... */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.spacing}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography>
                      <b>Values</b>
                    </Typography>
                    <Typography>Total Value :</Typography>
                    <Typography>Prev Accepted Value :</Typography>
                    <Typography>Value Cleared :</Typography>
                    <Typography>Value Rejected :</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

    </div>
  );
}
