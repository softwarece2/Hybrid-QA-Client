/* eslint-disable react-hooks/exhaustive-deps */
import React, {  useLayoutEffect, useState, useEffect } from "react";

//material ui
import {  Card, CardHeader, Grid,  makeStyles,  Typography } from "@material-ui/core";
import "date-fns";

//charts
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getPODetailsForDGQAGraph} from "Redux/Actions/Graph/GraphAction";


//redux
import { useDispatch} from "react-redux";


am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
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



export default function POGraph(props) {
  const classes = useStyles();
  const dispatch = useDispatch();



  const [graphData, setGraphData] = useState([]);



  useEffect(() => {

    dispatch(getPODetailsForDGQAGraph()).then((data) => {
      setGraphData(data);
    });
    //handleEnter(-1, -1, -1);
  }, []);


  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("PoDdExpired", am4charts.XYChart);


    // Add data
    chart.data = graphData;


    // // Add horizontal grid lines

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

    categoryAxis.dataFields.category = "label";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;

    categoryAxis.renderer.labels.template.rotation = -15;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;
    categoryAxis.renderer.labels.template.fontSize = "0.75rem";
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    categoryAxis.renderer.grid.template.location = 13;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    //export option
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    //  function createSeries(field, name) {
    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    //bar size
    series.columns.template.width = am4core.percent(16);
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "label";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;
    series.columns.template.events.on("hit", (event) => {
      const column = event.target?.dataItem?.dataContext;
      console.log("column on click", column);
    });

    console.log("series.dataFields", series.columns);

    series.tooltip.pointerOrientation = "vertical";

    //bar radius
    series.columns.template.column.cornerRadiusTopLeft = 0;
    series.columns.template.column.cornerRadiusTopRight = 0;
    series.columns.template.column.fillOpacity = 0.7;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    //colors
    chart.colors.list = [
      am4core.color("#4caf50"),
      am4core.color("#f44336"),
      am4core.color("#e53935"),
      am4core.color("#d32f2f"),
      am4core.color("#c62828"),
      am4core.color("#ffc107"),
      am4core.color("#03a9f4"),
      am4core.color("#039be5"),
      am4core.color("#0288d1"),
      am4core.color("#673ab7"),
    ];
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();


    // }createSeries("cleared", "Cleared");
  }, [graphData]);

  console.log("object", graphData);
  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>Supply/Purchase Order</Typography>}
        />
        <Grid container spacing={2} style={{ padding: 4, marginBottom: 54 }}>
          <Grid item xs={12} sm={6} md={4} align="left"></Grid>
          <Grid item xs={12} sm={6} md={4} align="left"></Grid>
        </Grid>

        <div id="PoDdExpired" style={{ height: "400px" }}></div>
      </Card>
    </div>
  );
}
