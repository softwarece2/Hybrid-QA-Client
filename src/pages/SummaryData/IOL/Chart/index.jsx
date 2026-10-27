import { Grid } from "@material-ui/core";
import VoltageGraph from "./VoltageGraph";
import PhaseCurrentR from "./PhaseCurrentR";
import PhaseCurrentS from "./PhaseCurrentS";
import PhaseCurrentT from "./PhaseCurrentT";
import MechSpeed9V from "./MechSpeed9V";
import MechSpeed14V from "./MechSpeed14V";

export default function IOLChartView({  params }) {

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <VoltageGraph  params={params} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentR  params={params} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentS  params={params} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PhaseCurrentT  params={params} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MechSpeed9V  params={params} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <MechSpeed14V  params={params} />
      </Grid>
    </Grid>
  );
}
