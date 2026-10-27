import { Grid, Typography } from "@material-ui/core";

import ColdCurrent from "./cold-test-chart/ColdCurrent";
import ColdAuto from "./cold-test-chart/ColdAuto";
import ColdPrism from "./cold-test-chart/ColdPrism";
import ColdLeak from "./leak-test/Leaktest";
import { WorkInProgress } from "../IOLDehradun";
import HeatStability from "./heat-stability/HeatStability";
import ImpactBreakDown from "./impact-test-chart/ImpactBreakdown";
import ImpactFlick from "./impact-test-chart/ImpactFlick";
import VibrationBreakdown from "./vibration-test-chart/VibrationBreakdown";
import VibrationFlick from "./vibration-test-chart/VibrationFlick";
import VibrationOperate from "./vibration-test-chart/VibrationOperate";

export default function IOLTVNEChartView({ productTypeId, testTypeId, params, selectedYear }) {
  if (testTypeId === "") {
    return (
      <Typography align="center" variant="h6" color="textSecondary" style={{ paddingBlock: 20 }}>
        Select Test type
      </Typography>
    );
  }

  if (testTypeId === 1) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <ColdCurrent productTypeId={productTypeId} params={params} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ColdAuto productTypeId={productTypeId} params={params} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ColdPrism productTypeId={productTypeId} params={params} />
        </Grid>
      </Grid>
    );
  }

  if (testTypeId === 2) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <HeatStability productTypeId={productTypeId} selectedYear={selectedYear} />
        </Grid>
      </Grid>
    );
  }

  if (testTypeId === 3) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <ImpactBreakDown productTypeId={productTypeId} params={params} selectedYear={selectedYear} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ImpactFlick productTypeId={productTypeId} params={params} selectedYear={selectedYear} />
        </Grid>
      </Grid>
    );
  }

  if (testTypeId === 4) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <VibrationBreakdown productTypeId={productTypeId} params={params} selectedYear={selectedYear} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <VibrationFlick productTypeId={productTypeId} params={params} selectedYear={selectedYear} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <VibrationOperate productTypeId={productTypeId} params={params} selectedYear={selectedYear} />
        </Grid>
      </Grid>
    );
  }

  if (testTypeId === 5) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <ColdLeak productTypeId={productTypeId} params={params} />
        </Grid>
      </Grid>
    );
  }

  return <WorkInProgress />;
}
