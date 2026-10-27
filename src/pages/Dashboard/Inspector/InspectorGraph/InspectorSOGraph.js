/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

//material ui-core
import { Card, CardHeader, makeStyles, Typography } from "@material-ui/core";

//react-chart
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getsupplyOrder } from "Redux/Actions/BarGraph/SupplyOrderBarAction";

const useStyles = makeStyles((theme) => ({
  Title: {
    fontSize: "1rem",
  },
  root: {
    minHeight: 200,
    width: 450,
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

export default function InspectorSOGraph() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const inspMain = useSelector((store) => store.supplyOrderReducer.soStatus);
  useEffect(() => {
    dispatch(getsupplyOrder());
  }, []);
  console.log("dssdsd", inspMain?.total);
  const data = {
    labels: ["Status"],
    datasets: [
      {
        label: "Total",
        borderWidth: 0.5,
        borderColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
        backgroundColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
        data: [inspMain?.total],
        barPercentage: 0.3,
      },
      {
        label: "Completed",
        borderWidth: 0.5,
        borderColor: ["#9CCC65"],
        backgroundColor: ["#9CCC65"],
        data: [inspMain?.completed],
        barPercentage: 0.3,
        // green #9CCC65 ,org #FF7043, bl #42A5F5"
      },

      {
        label: "InProgress",
        borderWidth: 0.5,
        borderColor: ["#FF7043"],
        backgroundColor: ["#FF7043"],
        data: [inspMain?.inProgress],
        barPercentage: 0.3,
      },
      {
        label: "Pending",
        borderWidth: 0.5,
        borderColor: ["#b80000"],
        backgroundColor: ["#b80000 "],
        data: [inspMain?.total],
        barPercentage: 0.3,
      },
    ],
  };

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>Supply Order Status</Typography>}
        />
        <Bar data={data} options={options} align="center" style={{ maxwidth: "40px" }} />
      </Card>
    </div>
  );
}
