import { useLayoutEffect,  } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardHeader, Typography } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import Main from "../OrgDashboard/Main";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    height: "400px",
    marginTop: 8,
  },
  chartRoot: {
    minHeight: 235,
    width: "100%",
    textAlign: "center",
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function StatisticsOfLeakTest() {
  const classes = useStyles();

  useLayoutEffect(() => {
    let chart = am4core.create("chartRef2", am4charts.XYChart);
    axiosInstance("upload/getStatisticsOfLeakTest")
      .then(({ data }) => {
        chart.paddingRight = 20;

        chart.data = data;

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "lineItemappTestId";
        categoryAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "passed";
        series.dataFields.categoryX = "lineItemappTestId";
        series.name = "Passed";
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.columns.template.fill = am4core.color("#67b7dc",0.7);

        let series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "failed";
        series2.dataFields.categoryX = "lineItemappTestId";
        series2.name = "Failed";
        series2.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series2.columns.template.fill = am4core.color("#FF0000",0.7);

        chart.legend = new am4charts.Legend();
      })
      .catch(console.log);

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <Card className={classes.chartRoot}>
      <CardHeader
        className={classes.card}
        disableTypography
        title={<Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>Statistics Of Leak Test</Typography>}
      />
      <div id={"chartRef2"} className={classes.chartContainer} />
    </Card>
  );
}
