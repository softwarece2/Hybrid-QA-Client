import React from "react";
import DeviceLineChart from "./chartNew";
import { Grid } from "@material-ui/core";

export default function ChartView({ params, specs }) {
  return (
    <Grid container spacing={2}>
      {specs.specDtos?.map((specObj) => (
        <Grid item xs={12} sm={12} md={12} lg={6} key={specObj.specId}>
          <DeviceLineChart params={params} specObj={specObj} />
        </Grid>
      ))}
    </Grid>
  );
}
