import { Grid, Typography } from "@material-ui/core";
import VoltageGraph from "./VoltageGraph";
import PhaseCurrentR from "./PhaseCurrentR";
import PhaseCurrentS from "./PhaseCurrentS";
import PhaseCurrentT from "./PhaseCurrentT";
import MechSpeed9V from "./MechSpeed9V";
import MechSpeed14V from "./MechSpeed14V";

export default function IOLChartView({ productTypeId, params, testTypeId }) {
  if (testTypeId === "") {
    return (
      <Typography align="center" variant="h6" color="textSecondary" style={{ paddingBlock: 20 }}>
        Select Test type
      </Typography>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <VoltageGraph productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentR productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentS productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentT productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MechSpeed9V productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MechSpeed14V productTypeId={productTypeId} params={params} testTypeId={testTypeId} />
      </Grid>
    </Grid>
  );
}
