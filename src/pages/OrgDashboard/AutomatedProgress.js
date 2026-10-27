import React, { useLayoutEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    height: "270px",
    marginTop: 8,
  },
  root: {
    minHeight: 235,
    width: "100%",
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

const AutomatedProgress = ({ selectedMonth, selectedYear }) => {
  const classes = useStyles();
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);

    // Set chart background color
    chart.background.fill = am4core.color("#ffffff"); // Change to your desired background color
    chart.background.fillOpacity = 1; // Ensure the background is fully opaque

    // Set plot area background color
    chart.plotContainer.background.fill = am4core.color("#ffffff"); // Change to your desired plot area background color
    chart.plotContainer.background.fillOpacity = 1; // Ensure the plot area background is fully opaque

    // Add data
    chart.data = [
      { firm: "BEL Machalipatnam", totalTests: 40, rangeTests: 35 },
      { firm: "BEL Hyderabad", totalTests: 30, rangeTests: 28 },
      { firm: "BEL Bg Cx", totalTests: 27, rangeTests: 10 },
      // { firm: "ASHOK LEYLAND", totalTests: 50, rangeTests: 33 },
      { firm: "IOL DEHRADUN", totalTests: 50, rangeTests: 47 },
      { firm: "L&T", totalTests: 50, rangeTests: 30 },
      { firm: "SOLARS", totalTests: 20, rangeTests: 12 },
      { firm: "BDL Bhanur", totalTests: 20, rangeTests: 12 },
      // { firm: "TCL Kanpur", totalTests: 20, rangeTests: 12 },
      { firm: "FGK Kanpur", totalTests: 20, rangeTests: 12 },
      { firm: "TCL AVADI", totalTests: 20, rangeTests: 12 },
    ];

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "firm";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.opacity = 0.3;
 // Disable amCharts logo
 chart.logo.disabled = true;
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "none"; // Disable cursor behavior
    chart.tooltip.background.fillOpacity = 0.8;

   
      categoryAxis.renderer.labels.template.rotation = -45;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "none";
      categoryAxis.renderer.labels.template.fontSize = 10;
      categoryAxis.renderer.labels.template.maxWidth = 80; // Set the maximum width
      categoryAxis.renderer.labels.template.truncate = true; // Enable wrapping

      // Add tooltip to show full text on hover
      // categoryAxis.renderer.labels.template.tooltipText = "{category}";
      // categoryAxis.renderer.labels.template.tooltipPosition = "fixed";
      // categoryAxis.renderer.labels.template.tooltip.dy = -10; // Adjust tooltip position if needed
    


    // Slant the labels
    //  categoryAxis.renderer.labels.template.rotation = -45;
    //  categoryAxis.renderer.labels.template.horizontalCenter = "right";
    //  categoryAxis.renderer.labels.template.verticalCenter = "none";

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.grid.template.opacity = 0.3;

    // Create series
    function createSeries(field, name, color) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "firm";
      series.name = name;
      // series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.fill = am4core.color(color, 0.8);
      series.columns.template.stroke = am4core.color(color);

      // // Add labels
      // const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      // labelBullet.label.text = "{valueY}";
      // labelBullet.label.fill = am4core.color("#000");
      // labelBullet.locationY = 0.5;
    }

    createSeries("totalTests", "Total No. of Tests", "#A1DD70");
    createSeries("rangeTests", "Tests within Controlled Range", "#5DADE2");

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.fontSize = 12;
    chart.legend.width = am4core.percent(100); // Set the legend width (e.g., 100% of the chart width)
    chart.legend.height = 15; // Set the legend height (e.g., 50 pixels)
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    // Cleanup chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className={classes.chartContainer} />;
};

export default AutomatedProgress;
