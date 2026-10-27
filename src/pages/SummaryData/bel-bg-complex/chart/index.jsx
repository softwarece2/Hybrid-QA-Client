import { Grid, } from "@material-ui/core";
import StatisticsOfLeakTest from "./StatisticsOfLeakTest";
import LeakAndPressureTest from "./PressureAndLeakTest";
import PressureAndLeakCharts from "./PressureAndLeakCharts";


export default function ChartViewBELBgComplex({ firm, data }) {
 
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} >
        <PressureAndLeakCharts/>
      </Grid>
      <Grid item xs={12} >
        <LeakAndPressureTest data={data.leakTestResultDtos} />
      </Grid>

      <Grid item xs={6}>
        <StatisticsOfLeakTest />
      </Grid>
     
    </Grid>
  );
}
