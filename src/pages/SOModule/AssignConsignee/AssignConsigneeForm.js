/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, CardContent, InputAdornment, Typography } from "@material-ui/core";

//components
import TextField from "../../../components/TextField";
import Button from "../../../components/Button";

//pages


//icons
import SearchIcon from "@material-ui/icons/Search";

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
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  searchInput: {
    width: "30%",
  },
}));

export default function AssignConsigneeForm() {
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
          title="Assign Consignee"
        />

        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.padding}>
              <Typography>
                <b>File No:</b> RE-1
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.padding}>
              <Typography>
                <b>Supply Order No:</b> 3212
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.padding}>
              <Typography>
                <b>SO Date:</b> 11-10-2022
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} className={classes.padding}>
              <Typography>
                <b>Receipt Date:</b> 12-10-2022
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={12} xl={12} className={classes.padding}>
              <Typography>
                <b>Description:</b> Description is the Pattern of narrative Development that aims to make object or group.
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ padding: "28px 18px 0px 18px" }}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <TextField select SelectProps={{ native: true }} labelText="Consignee ID" placeholder="Select Consignee ID">
                <option></option>
                <option>option2</option>
                <option>option3</option>
                <option>option4</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Quantity" placeholder="Enter Quantity" />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ padding: "0px 18px 0px 18px" }}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Qty to Issue" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Qty Issued" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Balance Qty" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} xl={12} align="center">
              <Button className={classes.button}>Submit</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Grid container spacing={2} alignItems="center" style={{ padding: "12px 0px 0px 0px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <AssignConsigneeStatus />
        </Grid>
      </Grid> */}
    </div>
  );
}
