import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    marginTop: 8,
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
  },
  chartCard: {
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: "0.875rem", 
    paddingLeft: "1rem" ,
    textAlign: "center",
    width: "100%",
  },
}));

const pressureData = [
  { name: "15 PSI", Result: 15.09, Lo: 13.5, Hi: 16.5 },
  { name: "50 PSI", Result: 49.7, Lo: 45, Hi: 55 },
  { name: "75 PSI", Result: 75, Lo: 67.5, Hi: 82.5 },
  { name: "100 PSI", Result: 100.16, Lo: 90, Hi: 110 },
  { name: "150 PSI", Result: 149.84, Lo: 135, Hi: 165 },
  { name: "200 PSI", Result: 202, Lo: 195, Hi: 205 },
  { name: "Final 200 PSI", Result: 202.51, Lo: 195, Hi: 205 },
];

const leakageData = [
  { name: "15 PSI", Result: 15.35, Lo: 14.09, Hi: 16.09 },
  { name: "50 PSI", Result: 49.69, Lo: 48.7, Hi: 50.7 },
  { name: "75 PSI", Result: 74.96, Lo: 74, Hi: 76 },
  { name: "100 PSI", Result: 100.18, Lo: 99.16, Hi: 101.16 },
  { name: "150 PSI", Result: 149.93, Lo: 148.84, Hi: 150.84 },
  { name: "200 PSI", Result: 202.62, Lo: 197, Hi: 207 },
  { name: "Final 200 PSI", Result: 202.47, Lo: 201.51, Hi: 203.51 },
];

const PressureAndLeakCharts = () => {
  const classes = useStyles();

  return (
    <div className={classes.chartContainer}>
      {/* Control Chart */}
      <Card className={classes.chartCard}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography className={classes.headerTitle}>Initial Pressure Measurement Chart</Typography>}
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={pressureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Result" stroke="green" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Hi" stroke="red" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Lo" stroke="blue" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leakage Test Chart */}
      <Card className={classes.chartCard}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography className={classes.headerTitle}>Leakage Test Results Chart</Typography>}
        />
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={leakageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Result" stroke="green" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Hi" stroke="red" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Lo" stroke="blue" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PressureAndLeakCharts;
