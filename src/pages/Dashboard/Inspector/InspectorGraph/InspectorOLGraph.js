//material ui-core
import { Card, CardHeader, makeStyles, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
//react-chart
import { Bar } from "react-chartjs-2";
import { WING_ID } from "../../../../Globals";

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
          fontSize: 50,
        },
      },
    ],
  },
};

const data = {
  labels: ["Status"],

  datasets: [
    {
      label: "Total",
      borderWidth: 0.5,
      borderColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
      backgroundColor: ["#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5", "#42A5F5"],
      data: [100],
      barPercentage: 0.3,
    },
    {
      label: "Completed",
      borderWidth: 0.5,
      borderColor: ["#9CCC65"],
      backgroundColor: ["#9CCC65"],
      data: [60],
      barPercentage: 0.3,
      // green #9CCC65 ,org #FF7043, bl #42A5F5"
    },

    {
      label: "InProgress",
      borderWidth: 0.5,
      borderColor: ["#FF7043"],
      backgroundColor: ["#FF7043"],
      data: [40],
      barPercentage: 0.3,
    },
    {
      label: "Pending",
      borderWidth: 0.5,
      borderColor: ["#b80000"],
      backgroundColor: ["#b80000 "],
      data: [20],
      barPercentage: 0.3,
    },
  ],
};

export default function InspectorOLGraph() {
  const classes = useStyles();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>{isArmy ? "QACL" : "Offering Letter"} Status</Typography>}
        />
        <Bar data={data} options={options} align="center" style={{ maxwidth: "40px" }} />
      </Card>
    </div>
  );
}
