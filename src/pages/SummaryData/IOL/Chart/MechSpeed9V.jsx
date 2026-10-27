import React, { useLayoutEffect, useRef } from "react";
import { Card, CardHeader, Typography, makeStyles } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceIol from "../../../Services/AxiosInstanceIol";

am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    width: "100%",
    height: "400px",
    marginTop: 8,
  },
  root: {
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

const url = "iol/getMechSp9v";
const min = 121.2;
const max = 142.3;
export default function MechSpeed9V({ params}) {
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

    // Add horizontal scrollbar
    chart.scrollbarX = new am4core.Scrollbar();


    const {  productTypeId,  testTypeId,fromDate, toDate } = params;

    axiosInstanceIol(url, {
      params: {
        productTypeId,
        testTypeId, fromDate, toDate
      },
    }).then(({ data }) => {
        chart.data = data.map((c) => ({
          label: c.label,
          mechSp9vBack: c.mechSp9vBack,
          mechSp9vFor: c.mechSp9vFor,
          mechSp9vBackColor:
            c.mechSp9vBack < min || c.mechSp9vBack > max
              ? "tomato"
              : "#A1DD70",
          mechSp9vForColor:
            c.mechSp9vFor < min || c.mechSp9vFor > max ? "tomato" : "#70A1DD",
        }));
        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "label";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.grid.template.opacity = 0.5;

        // Set minZoomCount to control the number of data points visible at a time
        // categoryAxis.start = 0.0;
        // categoryAxis.end = 0.5;
        // categoryAxis.keepSelection = true;

        if (chart.data?.length > 4) {
          categoryAxis.renderer.labels.template.rotation = -45;
          categoryAxis.renderer.labels.template.horizontalCenter = "right";
          categoryAxis.renderer.labels.template.verticalCenter = "none";
          categoryAxis.renderer.labels.template.fontSize = 10;
          categoryAxis.renderer.labels.template.maxWidth = 80; // Set the maximum width
          categoryAxis.renderer.labels.template.truncate = true; // Enable wrapping
        }

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.renderer.minGridDistance = 100;
        valueAxis.renderer.grid.template.opacity = 0.8;
        valueAxis.max = 150; // Set maximum value for Y-axis
        valueAxis.min = 0; // Set minimum value for Y-axis

        // Add horizontal baseline at value 50
        let maxRange = valueAxis.axisRanges.create();
        maxRange.value = max; // The value at which the line will appear

        maxRange.grid.stroke = am4core.color("#ff0000"); // Line color
        maxRange.grid.strokeWidth = 3; // Line width
        maxRange.grid.strokeOpacity = 1; // Line opacity
        maxRange.grid.strokeDasharray = 5; // Line width

        // Add horizontal baseline at value 50
        let minRange = valueAxis.axisRanges.create();
        minRange.value = min; // The value at which the line will appear

        minRange.grid.stroke = am4core.color("#ff0000"); // Line color
        minRange.grid.strokeWidth = 3; // Line width
        minRange.grid.strokeOpacity = 1; // Line opacity
        minRange.grid.strokeDasharray = 5;
        minRange.grid.zIndex=2

        // // Slant the labels

        // Create series
        function createSeries(field, name, colorField) {
          const series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "label";
          series.name = name;
          
          // Set the fill and stroke color based on the custom color field
          series.columns.template.propertyFields.fill = colorField;
          series.columns.template.propertyFields.stroke = colorField;

          // Add opacity
          series.columns.template.fillOpacity = 0.7; // Adjust the fill opacity (0 is fully transparent, 1 is fully opaque)
          series.columns.template.strokeOpacity = 1; // Adjust the stroke opacity

          // Configure tooltip
          series.columns.template.tooltipText = `{name}: [bold]{valueY}[/]`;
          series.columns.template.tooltipY = 0;
          series.columns.template.zIndex=0;
        }

        // Call the function to create a series
        createSeries("mechSp9vFor", "Forward", "mechSp9vForColor");
        createSeries("mechSp9vBack", "Backward", "mechSp9vBackColor");

        // chart.legend = new am4charts.Legend();
        // chart.legend.labels.template.fontSize = 12; // Set your desired font size here
        // chart.legend.width = am4core.percent(100); // Set the legend width (e.g., 100% of the chart width)
        // chart.legend.height = 15; // Set the legend height (e.g., 50 pixels)
        // let markerTemplate = chart.legend.markers.template;
        // markerTemplate.width = 10;
        // markerTemplate.height = 10;
      })
      .catch(console.log);

    // console.log(chart.data, "dataaa");

    // Cleanup chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, [params]);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.card}
        disableTypography
        title={
          <Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>
            Mechanical Speed : 9V ( 121.2-142.3 )
          </Typography>
        }
      />
      <div ref={chartRef} className={classes.chartContainer} />
      <Typography variant="caption" align="center">
        <ChartLegend bg="#70A1DDb3" /> Forward, <ChartLegend bg="#A1DD70b3" />
        &nbsp;Backward, <ChartLegend bg="#ff0000b3" /> Out of range
      </Typography>
    </Card>
  );
}

export function ChartLegend({ bg }) {
  return (
    <div
      style={{
        display: "inline-block",
        height: 10,
        width: 10,
        backgroundColor: bg,
        borderRadius:10
      }}
    ></div>
  );
}
