import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
import { Grid, Paper, Typography } from "@material-ui/core";
// import TableComponent from "components/table";
// import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "80%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  padding: {
    paddingBottom: 10,
  },
}));

export default function ApplicationForm() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} align="right">
            <Typography style={{ fontWeight: "bold" }}>Appx 'A'</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              (Refers to Para 6 of SOP)
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography style={{ fontWeight: "bold" }}>
              <u>APPLICATION FORM FOR VIRTUAL INSPECTION</u>
            </Typography>
            <Typography>
              {" "}
              (To be submitted by firm on its letter pad)
            </Typography>
          </Grid>
          <br />
          <Grid item xs={6} style={{ marginTop: "16px" }}>
            <Typography>Inspection Request No: …………………</Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <Typography>Date……………………</Typography>
          </Grid>

          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <Typography>SQAO/CQA</Typography>
            <Typography>……………………………………………</Typography>
            <Typography>……………………………………………</Typography>
            <Typography>……………………………………………</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b>1.</b> &nbsp; I/ We hereby offer the following stores for
              Virtual Inspection of DGQA. Details are as under:
              <ol type="a">
                <li>DGQA registration No ………………………… valid up to ……………………</li>
                <li>Nomenclature of the Store/Item</li>
                <li>Total Quantity on order</li>
                <li>Quality offered for inspection</li>
                <li>Place of Virtual Inspection</li>
                <li>Date and time of Virtual Inspection</li>
              </ol>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b>2.</b> &nbsp; IT Infrastructure for Virtual Inspection
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b>3.</b> &nbsp; Instruments for inspection
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <b>4.</b> &nbsp; Skill matrix of inspection coordinator(s)
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography style={{ fontWeight: "bold" }}>
              <b>5.</b> &nbsp;<u>Declaration</u>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              5.1 &nbsp; We/I declare to unddertake that virtual inspection
              results are binding on the supplier or his authorised
              representative. Virtual inspection is deemed to have bound by all
              the laws, regulations and contractual requirements. Quality and
              financial claims can be rasied, in the event of breach of trust.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              5.2 &nbsp; The false declaration, misleading declaration, wilful
              hiding of any part of non-conformity can render our firm to be
              blacklisted. Depending on the severity, the case can even lead to
              punitive actions against the responsible persons including the
              inspection coordinator(s)
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              5.3 &nbsp; The provisions contained in this SOP are binding on us.
              The proceedings in the event of misleading virtual inspection
              results, the same shall be subjected to law of land.
            </Typography>
          </Grid>

          <Grid item xs={12} align="right">
            <Typography>Authorised Signatory with Seal</Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
