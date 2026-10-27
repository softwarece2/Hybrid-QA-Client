import React from "react";
//material ui-core
import { Card, CardHeader, makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";

//react-chart
import { Bar } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 235,
    width: 400,
    [theme.breakpoints.up("md")]: {
      width: "82%",
    },
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

const options = {
  type: "bar",
  scales: {
    yAxes: [
      {
        ticks: {
          // The y-axis value will start from zero
          beginAtZero: true,
        },
      },
    ],
  },

  legend: {
    labels: {
      fontSize: 15,
    },
  },
};

const data = {
  labels: [""],

  datasets: [
    {
      label: "Total",
      borderWidth: 0.5,
      borderColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
      backgroundColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
      data: [1000],
      barPercentage: 0.3,
    },
    {
      label: "With Formal DP ",
      borderWidth: 0.5,
      borderColor: ["#FF7043", "#FF7043", "#FF7043", "#FF7043", "#FF7043"],
      backgroundColor: ["#FF7043", "#FF7043", "#FF7043", "#FF7043", "#FF7043"],
      data: [2000],

      barPercentage: 0.3,
      // green #9CCC65 ,org #FF7043, bl #42A5F5
    },

    {
      label: "With Prov DP ",
      borderWidth: 0.5,
      borderColor: ["#9CCC65", "#9CCC65", "#9CCC65", "#9CCC65", "#9CCC65"],
      backgroundColor: ["#9CCC65", "#9CCC65", "#9CCC65", "#9CCC65", "#9CCC65"],
      data: [3000],
      barPercentage: 0.3,
    },
  ],
};

export default function ClearanceLetterIssued() {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{fontSize: "0.875rem"}}>Clearance Letter issued(current FY)</Typography>}
        />

        <Bar data={data} options={options} align="center" style={{ maxwidth: "40px" }} />
      </Card>
    </div>
  );
}
