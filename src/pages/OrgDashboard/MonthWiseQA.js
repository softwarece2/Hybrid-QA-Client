import React, { useLayoutEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axiosInstance from "pages/Services/AxiosInstanceRpt";

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

const MonthWiseQA = ({ selectedMonth, selectedYear, type }) => {
  const classes = useStyles();
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);

    // Set chart background color
    chart.background.fill = am4core.color("#fff"); // Change to your desired background color
    chart.background.fillOpacity = 1; // Ensure the background is fully opaque

    // Set plot area background color
    chart.plotContainer.background.fill = am4core.color("#fff"); // Change to your desired plot area background color
    chart.plotContainer.background.fillOpacity = 1; // Ensure the plot area background is fully opaque

    if (selectedMonth && selectedYear) {
      let url = "soDashboard/getSoDet";

      if (type === "QA") {
        url = "olDashboard/getOlDet";
      }

      axiosInstance(url, {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
      })
        .then(({ data }) => {
          chart.data = data.map((c) => ({ firm: c.orgName, value: c.count }));
          // Create axes
          const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "firm";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 20;
          categoryAxis.renderer.grid.template.opacity = 0.3;
          chart.logo.disabled = true;

          chart.cursor = new am4charts.XYCursor();
          chart.cursor.behavior = "none"; // Disable cursor behavior
          chart.tooltip.background.fillOpacity = 0.8;
          if (chart.data?.length > 4) {
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
          }

          const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          // valueAxis.renderer.minGridDistance = 100;
          valueAxis.renderer.grid.template.opacity = 0.3;

          // // Slant the labels

          // Create series
          function createSeries(field, name, color) {
            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "firm";
            series.stacked = true;
            series.name = name;
            series.columns.template.fill = am4core.color(color, 0.8);
            series.columns.template.stroke = am4core.color(color);
            // series.columns.template.width = am4core.percent(40);
            // series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
            // const labelBullet = series.bullets.push(new am4charts.LabelBullet());
            // labelBullet.label.text = "{valueY}";
            // labelBullet.label.fill = am4core.color("#000");
            // labelBullet.locationY = 0.5;
          }

          // Add a legend

          createSeries("value", "No. of QACL", "#A1DD70");

          chart.legend = new am4charts.Legend();
          chart.legend.labels.template.fontSize = 12; // Set your desired font size here
          chart.legend.width = am4core.percent(100); // Set the legend width (e.g., 100% of the chart width)
          chart.legend.height = 15; // Set the legend height (e.g., 50 pixels)
          let markerTemplate = chart.legend.markers.template;
          markerTemplate.width = 10;
          markerTemplate.height = 10;
          
          // Add bullets (markers)

          // console.log(data, chart.data, "datat");
        })
        .catch(console.log);
    }

    // console.log(chart.data, "dataaa");

    // Cleanup chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, [selectedMonth, selectedYear, type]);

  return <div ref={chartRef} className={classes.chartContainer} />;
};

export default MonthWiseQA;
