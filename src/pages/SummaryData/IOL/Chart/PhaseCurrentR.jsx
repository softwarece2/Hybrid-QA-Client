import React, { useLayoutEffect, useRef, useState } from "react";
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
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

let url = "iol/getPhCurrR";
const PhaseCurrentR = ({ params}) => {
  const classes = useStyles();
  const chartRef = useRef(null);
  const [data, setData] = useState({cp: 0, ckp: 0, })


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
    const {  productTypeId,  fromDate, toDate,testTypeId } = params;

    axiosInstanceIol(url, {
      params: {
        productTypeId,
        testTypeId, fromDate, toDate
      },
    }).then(({ data }) => {
        chart.data =  data.voltDtos.map((c) => ({ device: c.label, value: c.value || 0 }));
        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "device";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.grid.template.opacity = 0.5;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "none"; // Disable cursor behavior
        chart.tooltip.background.fillOpacity = 0.8;
 // Disable amCharts logo
 chart.logo.disabled = true;
        // Set minZoomCount to control the number of data points visible at a time
       

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
        valueAxis.renderer.grid.template.opacity = 0.5;
        valueAxis.max = 2.5; // Set maximum value for Y-axis
        valueAxis.min = 0.5; // Set minimum value for Y-axis

        // Add horizontal baseline at value 50
        let range = valueAxis.axisRanges.create();
        range.value = 2; // The value at which the line will appear

        range.grid.stroke = am4core.color("#ff0000"); // Line color
        range.grid.strokeWidth = 3; // Line width
        range.grid.strokeOpacity = 1; // Line opacity
        range.grid.strokeDasharray = 5;
        // // Slant the labels

        // Create series
        function createSeries(field, name, color, threshold, exceedColor) {
          const series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "device";
          series.name = name;

          // Set the default stroke (line) color
          series.stroke = am4core.color(color);
          series.strokeWidth = 3;

          // Optionally, set the default fill color for bullets or other elements if needed
          series.fill = am4core.color(color);

          // Optional: Add bullets and set their color
          let bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = am4core.color("#fff");
          bullet.circle.strokeWidth = 2;

          // Adapter for bullet fill color
          bullet.adapter.add("fill", (fill, target) => {
            if (target.dataItem && target.dataItem.values.valueY) {
              const value = target.dataItem.values.valueY.value;
              return value > 2 ? am4core.color(exceedColor) : am4core.color(color);
            }
            return am4core.color(color);
          });

          // Adapter for line color (if needed)
          series.adapter.add("stroke", (stroke, target) => {
            if (target.dataItem && target.dataItem.values.valueY) {
              const value = target.dataItem.values.valueY.value;
              return value > threshold ? am4core.color(exceedColor) : am4core.color(color);
            }
            return am4core.color(color);
          });
        }

        // Call the function to create a series
        createSeries("value", "Device Number", "#177e17", 2, "#FF0000");

        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 12; // Set your desired font size here
        chart.legend.width = am4core.percent(100); // Set the legend width (e.g., 100% of the chart width)
        chart.legend.height = 15; // Set the legend height (e.g., 50 pixels)
        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        // Add bullets (markers)
        setData({cp: data.cp, ckp: data.ckp,mean:data.mean,stdDev:data.stdDev,median:data.median})
        // console.log(data, chart.data, "datat");
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
        title={<Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>Phase Current (R) - CKP = {Number(data.ckp).toFixed(2)} CP = {Number(data.cp).toFixed(2)} Mean={Number(data.mean).toFixed(3)}  StdDev(√)={Number(data.stdDev).toFixed(2)} Median={Number(data.median).toFixed(3)}</Typography>}
      />
      
      <div ref={chartRef} className={classes.chartContainer} />
    </Card>
  );
};

export default PhaseCurrentR;
