//Material ui-core
import { Grid } from "@material-ui/core";
import CqaoINoteGraph from "./INoteGraph/CqaoINoteGraph";
// import INoteGraph from "./INoteGraph/INoteGraph";

//Component
import OlDdExpired from "./OLGraph/OlDdExpired";
import PoDdExpired from "./SOGraph/PoDdExpired";
// import Workload from "./WorkloadGraph/Workload";


// COLOR
// categoryAxis.renderer.labels.template.rotation = 270;
// let range = categoryAxis.axisRanges.create();
// range.label.rotation = 0;

export default function CqaoDashboardMain() {
  // const classes = useStyles();

  return (
    <div c align="center">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <PoDdExpired />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <OlDdExpired />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <Workload />
        </Grid> */}
        {/* <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <INoteGraph />
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
         <CqaoINoteGraph/>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
        </Grid>

        {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <InHand />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <ExpiredDp />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <ExpiringDp />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <QAPs />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <OLs />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <ClearanceLetterGraph />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <ITCGraph />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <ClearanceLetterIssued />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <SystemClear />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center">
          <InspectionStatus />
        </Grid> */}
      </Grid>
    </div>
  );
}
