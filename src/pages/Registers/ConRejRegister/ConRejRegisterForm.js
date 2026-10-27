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
          title={<Typography style={{ fontSize: "0.875rem" }}>Consignee end Rejection Register</Typography>}
        />
        <CardContent justifyContent="center">
          <Grid container spacing={0} justifyContent="center">
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Date of Reporting" placeholder="Date of Reporting" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="File No." placeholder="File No." />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="SO/PO Number" placeholder="SO/PO Number" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="SO/PO Date" placeholder="SO Date" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Supplier ID" placeholder="Supplier ID" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={3}>
                  <MultilineTextField
                    size="small"
                    labelText="Firm Name &amp; Address"
                    placeholder="Firm Name &amp; Address"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <MultilineTextField size="small" labelText="ConsigneeID" placeholder="ConsigneeID" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Item Nomenclature" placeholder="Item Nomenclature" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Part No" placeholder="Part No" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Qty" placeholder="Qty" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Unit" placeholder="Unit" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Rate" placeholder="Rate" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Value in Rs" placeholder="Value in Rs" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Area" placeholder="Area" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Reasons for Observation" placeholder="Reason for Observation" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <TextField size="small" labelText="Reasons for Rejection" placeholder="Reason for Rejection" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="FFI initiated" placeholder="Area" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField size="small" labelText="Date Liquidated" placeholder="Date Liquidated" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <TextField size="small" labelText="ActionTaken" placeholder="ActionTaken" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <TextField size="small" labelText="Remarks" placeholder="Remarks" />
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2}>
                <Grid item xs={12} align="center">
                  <Button size="small" color="primary" variant="contained">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
