import React, { useEffect, useRef, useStyles } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import { Card, CardHeader, Typography } from "@material-ui/core";

const ClothInspection = ({ data = [] }) => {
  const classes = useStyles();
  const chartRef = useRef(null);
  useEffect(() => {
    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.background.fill = am4core.color("#fff");
    chart.background.fillOpacity = 1;
    chart.plotContainer.background.fill = am4core.color("#fff");
    chart.plotContainer.background.fillOpacity = 1;
    chart.scrollbarX = new am4core.Scrollbar();

    chart.data = data.map((c) => ({
      label: c.sampleName,
      ...c,
    }));
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "label";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.opacity = 0.3;
    // Disable amCharts logo
    chart.logo.disabled = true;

    if (chart.data?.length > 4) {
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "none";
      categoryAxis.renderer.labels.template.fontSize = 10;
      categoryAxis.renderer.labels.template.maxWidth = 150;
      categoryAxis.renderer.labels.template.truncate = true;
    }

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.grid.template.opacity = 0.3;

    function createSeries(field, name, colorField) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "label";
      series.name = name;
      series.stroke = am4core.color(colorField);
      series.fill = am4core.color(colorField);
      series.columns.template.tooltipText = `{label} - {name}: [bold]{valueY}[/]`;
      series.columns.template.tooltipY = 0;
    }

    createSeries("noOfPassed", "Passed", "#4CAF50");
    createSeries("noOfFailed", "Failed", "#F44336");
    createSeries("noOfNA", "Not Checked", "#9E9E9E");

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.card}
        disableTypography
        title={
          <Typography
            style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}
            align="center"
          >
            Graph View{" "}
          </Typography>
        }
      />
      <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>
    </Card>
  );
};

export default ClothInspection;
