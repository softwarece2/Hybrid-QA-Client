import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import TextField from "components/TextField";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  typo: {
    fontSize: "0.875rem",
  },
}));

export default function PORegister() {
  const classes = useStyles();


  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>Sub-Standard Report Register</Typography>}
        />
        <CardContent justifyContent="center">
          <Grid container spacing={0} justifyContent="center">
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Date of Receipt of SSR" placeholder="Date of Receipt of SSR" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText=" Item Nomenclature" placeholder="Item Nomenclature" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Part No" placeholder="Part No" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Received Form" placeholder="Received Form" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Name of Manufacture" placeholder="name of Manufacture" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Nature of Defect" placeholder="Nature of Defect" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Defect Attributed to" placeholder="Defect Attributed to" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Date Rec. for Closure" placeholder="Date Rec. for Closure" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <MultilineTextField size="small" labelText="Date Closed" placeholder="Date Closed" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <MultilineTextField
                    size="small"
                    labelText="Remedial Measures Suggested/Remarks"
                    placeholder="Remedial Measures Suggested/Remarks"
                  />
                </Grid>
              </Grid>
              <br />

              <Grid item xs={12} align="center">
                <Button size="small" color="primary" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* </Grid> */}
        </CardContent>
      </Card>
    </div>
  );
}
