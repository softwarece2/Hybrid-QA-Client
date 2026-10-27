//Material ui-core
import { Grid } from "@material-ui/core";

// import CqaoINoteGraph from "./INoteGraph/CqaoINoteGraph";
// import INoteGraph from "./INoteGraph/INoteGraph";
import INoteGraphMain from "./INoteGraphMain";
import INoteValueGraphMain from "./INoteValueGraphMain";
import OLGraph from "./OLGraph";

//Component

import POGraph from "./POGraph";


// COLOR
// categoryAxis.renderer.labels.template.rotation = 270;
// let range = categoryAxis.axisRanges.create();
// range.label.rotation = 0;

export default function MainDashboard() {
  // const classes = useStyles();

  return (
    <div c align="center">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <POGraph />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <OLGraph />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <INoteGraphMain />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center">
          <INoteValueGraphMain />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="center"></Grid>

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
