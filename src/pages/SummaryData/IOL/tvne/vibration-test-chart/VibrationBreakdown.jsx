import React, { useLayoutEffect, useRef } from "react";
import { Card, CardHeader, Typography } from "@material-ui/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useStyles } from "../../Chart/VoltageGraph";

am4core.useTheme(am4themes_animated);

const url = "iolTvne/getVibrationBreakdownDets";
export default function VibrationBreakdown({ productTypeId, selectedYear }) {
  const classes = useStyles();
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.background.fill = am4core.color("#fff");
    chart.background.fillOpacity = 1;
    chart.plotContainer.background.fill = am4core.color("#fff");
    chart.plotContainer.background.fillOpacity = 1;
    chart.scrollbarX = new am4core.Scrollbar();

    axiosInstanceIol(url, {
      params: {
        productTypeId,
        year: new Date(selectedYear).getFullYear(),
      },
    })
      .then(({ data }) => {
        chart.data = Object.entries(data).map(([quarter, { breakdown = 0, no_breakdown = 0 }]) => ({
          quarter,
          breakdown,
          no_breakdown,
        }));

        chart.tooltip.background.fillOpacity = 0.8;

        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "quarter";
         // Disable amCharts logo
    chart.logo.disabled = true;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 10; // Reduce this to bring bars closer together
        categoryAxis.renderer.grid.template.opacity = 0.3;
        categoryAxis.renderer.labels.template.rotation = -45;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.fontSize = 12;
        //
        categoryAxis.renderer.cellStartLocation = 0.2;
        categoryAxis.renderer.cellEndLocation = 0.8;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.opacity = 0.3;
        valueAxis.extraMax = 0.05;

        function createSeries(field, name, color) {
          const series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "quarter";
          series.name = name;
          series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
          series.columns.template.fill = am4core.color(color);
          series.columns.template.stroke = am4core.color(color);

          // Reduce the gap between bars by increasing the width
          series.columns.template.width = am4core.percent(100); // Adjust this value as needed
          series.clustered = true; // Ensure bars are grouped, not stacked

          // Add labels on top of bars
          let labelBullet = series.bullets.push(new am4charts.LabelBullet());
          labelBullet.label.text = "{valueY}";
          labelBullet.label.fill = am4core.color("#000"); // Label color (black)
          labelBullet.label.dy = -10; // Position the label above the bar
          labelBullet.label.fontSize = 12; // Adjust the font size
        }

        // Create the series for 'breakdown' and 'no_breakdown'
        createSeries("no_breakdown", "No Breakdown", "#A3D9A5");
        createSeries("breakdown", "Breakdown", "#FF6F61");

        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fontSize = 12;
        chart.legend.width = am4core.percent(100);
        chart.legend.height = 15;
        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
      })
      .catch(console.log);

    return () => {
      chart.dispose();
    };
  }, [productTypeId, selectedYear]);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.card}
        disableTypography
        title={<Typography style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>Vibration Breakdown</Typography>}
      />
      <div ref={chartRef} className={classes.chartContainer} />
    </Card>
  );
}
