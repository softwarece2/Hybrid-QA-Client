import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//material-ui
import Card from "@material-ui/core/Card";
import { CardHeader, Grid, CardContent, FormControlLabel, Checkbox } from "@material-ui/core";

//components
import TextField from "../../../../../components/TextField";
import Button from "../../../../../components/Button";
import MultilineTextField from "../../../../../components/MultilineTextField";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "70%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "70%",
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

export default function ScrutinyForm() {
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
          title="Scrutiny"
        />

        <CardContent className={classes.cardContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Letter No" placeholder="Enter Letter No" size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField type="date" labelText="Letter Date" placeholder="Enter Letter Date" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField labelText="Subject" placeholder="Enter Subject" size="small" />
            </Grid>
            <Grid item xs={12} sm={8} md={4} lg={4} xl={4}>
              <MultilineTextField rows={4} labelText="Amendments" placeholder="Enter Amendments" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <TextField
                select
                SelectProps={{ native: true }}
                labelText="Amendments of"
                placeholder="Select Consignee ID"
              >
                <option></option>
                <option>option2</option>
                <option>option3</option>
                <option>option4</option>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={8} md={4} lg={4} xl={4}>
              <MultilineTextField rows={4} labelText="Remarks" placeholder="Enter Remarks" />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                label="Mark it to include in Inspection Certificate"
              />
            </Grid>
            <Grid item xs={12} xl={12} align="center">
              <Button className={classes.button}>Submit</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
