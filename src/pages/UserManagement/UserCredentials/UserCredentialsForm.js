import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, CardContent } from "@material-ui/core";

//components
import TextField from "../../../components/TextField";
import Button from "../../../components/Button";

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
}));

export default function UserCredentialsForm() {
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
          title="User Credentials"
        />

        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField select SelectProps={{ native: true }} labelText="User" placeholder="Enter User">
                <option>Enter User</option>
                <option>option2</option>
                <option>option3</option>
                <option>option4</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField type="date" labelText="Rank / Designation" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={classes.padding}>
              <TextField labelText="Login ID" placeholder="Enter Login ID" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField type="password" labelText="Password" placeholder="Enter Password" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField type="password" labelText="Confirm Password" placeholder="Enter Confirm Password" />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} xl={12} align="center">
              <Button className={classes.button}>Submit</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
