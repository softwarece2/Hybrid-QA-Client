import { useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardHeader, Typography } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
// import Main from "../OrgDashboard/Main";

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

export default function LeakAndPressureTest({ data }) {

  const classes = useStyles();

  useLayoutEffect(() => {
    let chart = am4core.create("chartRef1", am4charts.XYChart);

    chart.paddingRight = 20;
    const mappedData = [];
    let j = 0;
    while (j < data.length - 3) {
      const obj = {
        iniResult: "",
        leakResult: "",
        elapsedTime: "",
        pressureDrop: "",
        testName: "",
      };

      for (let i = 0; i < 4; i++) {
        const element = data[i + j];
        if (i === 0) {
          obj.iniResult = element.result;
        } else if (i === 1) {
          obj.leakResult = element.result;
          obj.testName = element.testName;
        } else if (i === 2) {
          obj.elapsedTime = element.testName;
        } else if (i === 3) {
          obj.pressureDrop = element.result;
        }
      }
      mappedData.push(obj);
      j += 4;
    }

    chart.data = mappedData;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

    if (chart.data?.length > 4) {
      // categoryAxis.renderer.labels.template.rotation = -15;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "none";
      categoryAxis.renderer.labels.template.fontSize = 10;
      // categoryAxis.renderer.labels.template.maxWidth = 150; // Set the maximum width
    }

    categoryAxis.dataFields.category = "testName";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    // Function to create a series with labels on top
    const createSeries = (field, name, color) => {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "testName";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.fill = am4core.color(color, 0.7);

      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.label.verticalCenter = "middle";
      labelBullet.label.dy = -10;
      labelBullet.label.fontSize = 14;
      labelBullet.label.fill = am4core.color("#000000");

      return series;
    };

    createSeries("iniResult", "Initial Result", "#67b7dc");
    createSeries("leakResult", "Leak Result", "#67b7ff");

    chart.legend = new am4charts.Legend();

    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <Card className={classes.chartRoot}>
      <CardHeader
        className={classes.card}
        disableTypography
        title={<Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>Pressure and Leak Test</Typography>}
      />
      <div id={"chartRef1"} className={classes.chartContainer} />
    </Card>
  );
}
