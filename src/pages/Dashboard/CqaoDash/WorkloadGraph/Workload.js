/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useState } from "react";

//material ui
import {
  Button,
  Card,
  CardHeader,
  Grid,
  InputLabel,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import "date-fns";

//charts
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Controller, useForm } from "react-hook-form";
import { getWorkloadGraph } from "Redux/Actions/Graph/GraphAction";

import moment from "moment";

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

const defaultValues = {
  startDate: "2017-01-01",
  endDate: moment(new Date()).format("YYYY-MM-DD"),
};

export default function Workload(props) {
  const classes = useStyles();


  const {
 
    handleSubmit,
    
    control,
   
  } = useForm({
    defaultValues,
    mode: "onChange",
    // resolver: yupResolver(schema),
  });

  const [graphData, setGraphData] = useState([]);



  const onFormSubmit = (data) => {
    console.log("akkjjkijk", data);
    getWorkloadGraph(data.startDate, data.endDate)
      .then((res) => {
        console.log("setGraphData1", res);
        const data = res?.map((item) => ({ ...item, fill: "red" }));
        setGraphData(data);
        console.log("setGraphData", graphData);
      })
      .catch((err) => console.log("dashboard err", err));
  };

  useEffect(() => {
    const value = {
      startDate: "2017-01-01",
      endDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    onFormSubmit(value);
  }, []);

  useLayoutEffect(() => {
    let chart = am4core.create("workloadManDays", am4charts.XYChart);

    // Add data
    chart.data = graphData;
    // Create chart instance

    // Add data
    // chart.data = [
    //   {
    //     year: 1,
    //     A: 23.5,
    //     B: 18.1,
    //   },
    //
    // ];

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "soOrderNo";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = false;
    categoryAxis.renderer.grid.template.location = 13;
    categoryAxis.renderer.labels.template.fontSize = "0.75rem";
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = false;
    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "soOrderNo";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.height = am4core.percent(100);
      series.columns.template.width = am4core.percent(40);
      series.sequencedInterpolation = true;
      series.columns.template.events.on("hit", (event) => {
        const column = event.target?.dataItem?.dataContext;
        console.log("column on click", column);
      });

      var valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueX}";
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      // categoryLabel.label.text = "{name}";

      categoryLabel.label.horizontalCenter = "right";
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color("#fff");
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }

    createSeries("estMandays", "Estimated Man Days");
    createSeries("actualMandays", "Actual Man Days");

    //Add legend
    chart.legend = new am4charts.Legend();
  }, [graphData]);

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Card className={classes.root}>
          <CardHeader
            className={classes.card}
            disableTypography
            title={
              <Typography style={{ fontSize: "0.875rem" }}>
                Inspector Workload
              </Typography>
            }
          />
          <Grid container spacing={2} style={{ padding: 4, marginBottom: 8 }}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} align="left">
              <Controller
                name="startDate"
                control={control}
                //value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.rootDrop,
                      }}
                      style={{ fontSize: "0.875rem" }}
                      // required={true}
                    >
                      {"Select Start Date"}
                    </InputLabel>
                    <TextField
                      variant="outlined"
                      labelText="Start Date"
                      placeholder="Start date"
                      onChange={onChange}
                      value={value}
                      type="date"
                      size="small"
                      required
                    />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} align="left">
              <Controller
                name="endDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.rootDrop,
                      }}
                      style={{ fontSize: "0.875rem" }}
                      // required={true}
                    >
                      {"Select End Date"}
                    </InputLabel>
                    <TextField
                      variant="outlined"
                      labelText="End Date"
                      placeholder="End date"
                      onChange={onChange}
                      value={value}
                      type="date"
                      size="small"
                      required
                    />
                  </>
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2}
              xl={2}
              align="left"
              style={{ padding: "25px 0px 0px  0px" }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSubmit(onFormSubmit)}
              >
                Enter
              </Button>
            </Grid>
          </Grid>

          <div
            id="workloadManDays"
            style={{ width: "100%", height: "400px" }}
          ></div>
        </Card>
      </form>
    </div>
  );
}
