/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useLayoutEffect,useState } from "react";

//material ui
import { Card, CardHeader, Grid, InputLabel, makeStyles, TextField, Typography } from "@material-ui/core";
import "date-fns";

//charts
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useForm} from "react-hook-form";
import { getOLDetailsForDGQAGraph,} from "Redux/Actions/Graph/GraphAction";

//redux
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {  yearDetails } from "Redux/Actions/SupplyOrder/SODropdownAction";
import * as yup from "yup";

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

const schema = yup.object().shape({
  indenterId: yup.string().typeError("required").required(" required"),
  consigneeIds: yup.array().min(1, "required").typeError("required").required(" required"),
});

const defaultValues = {
  yearListId: -1,
  type: "2",
};

export default function OLGraph(props) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const {
  
    getValues,
    setValue,
    control,

  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });



  const fiveYearDetails = useSelector((store) => store.soDropdownReducer.yearListDetails);


  const [graphData, setGraphData] = useState([]);

  const Types = [
    { id: "2", name: "CQAE (WE)" },
    { id: "21", name: "SQAE(L)" },
    { id: "93", name: "QAE(N)" },
  ];


  const handleEnter = (orgId, year) => {
    if (year != null || (year != "" && orgId !== null) || orgId != "") {
      getOLDetailsForDGQAGraph(orgId, year)
        .then((res) => {
          const data = res?.map((item) => ({ ...item, fill: "red" }));
          setGraphData(data);
        })
        .catch((err) => console.log("dashboard err", err));
    }
  };


  useEffect(() => {
    dispatch(yearDetails());
  }, []);

  useEffect(() => {
    if (Array.isArray(fiveYearDetails) && fiveYearDetails.length > 0) {
      setValue("yearListId", fiveYearDetails[0]);
      // handleEnter(fiveYearDetails[0]);
    }
  }, [fiveYearDetails]);

  useEffect(() => {
    // salesGroupWatcher && dispatch(projectDetails(loggedInUser?.orgId, salesGroupWatcher));
    handleEnter(fiveYearDetails[0], 2);
    // handleForProjectWise(202);
  }, []);
  console.log("fiveYearDetails", fiveYearDetails);

  useLayoutEffect(() => {
    let chart = am4core.create("OlDdExpired", am4charts.XYChart);
    chart.data = graphData;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    //  categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = false;
    categoryAxis.renderer.grid.template.location = 13;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.labels.template.rotation = -15;
    categoryAxis.renderer.labels.template.fontSize = "0.75rem";
    categoryAxis.labelFrequency = 1;
    categoryAxis.renderer.minGridDistance = 50; // minimum distance between grid lines
    categoryAxis.maxWidth = 100; //

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = false;
    valueAxis.renderer.minGridDistance = 100;
    valueAxis.roundToInt = true;

    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "month";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;
      //series.columns.template.width = (typeWatcher == 2 && am4core.percent(5)) || (typeWatcher == 3 && am4core.percent(10)) || (typeWatcher == 1 && am4core.percent(80));

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

    createSeries("returned", "Returned");
    createSeries("cleared", "Cleared");

    //Add legend
    chart.legend = new am4charts.Legend();
  }, [graphData]);

  console.log("object", graphData);
  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>Offering Letter/ QACL</Typography>}
        />
        <Grid container spacing={2} style={{ padding: 4, marginBottom: 8 }}>
          <Grid item xs={12} sm={6} md={4} align="left">
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.rootDrop,
                      }}
                      style={{ fontSize: "0.875rem" }}
                      // required={true}
                    >
                      {"Select Type"}
                    </InputLabel>
                    <Autocomplete
                      options={Types}
                      value={Types.find((item) => item?.id === value)}
                      labelText="Select Type"
                      getOptionLabel={(o) => o.name}
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            classes: {
                              input: classes.input,
                              root: classes.textFieldRoot,
                            },
                          }}
                          size="small"
                        />
                      )}
                      onChange={(e, v) => {
                        onChange(v?.id ?? -1);
                        handleEnter(v?.id, getValues("yearListId"));
                        // v?.id==2&& projectsList();
                        // v?.id==3&&Inspectors();
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} align="left">
            <Controller
              name="yearListId"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.rootDrop,
                      }}
                      style={{ fontSize: "0.875rem" }}
                      // required={true}
                    >
                      {"Select FY"}
                    </InputLabel>

                    <Autocomplete
                      options={fiveYearDetails}
                      value={value || ""}
                      labelText="Year"
                      getOptionLabel={(o) => o}
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            classes: {
                              input: classes.input,
                              root: classes.textFieldRoot,
                            },
                          }}
                          size="small"
                          // error={!!errors.consigneeIds}
                          // helperText={errors.consigneeIds?.message}
                        />
                      )}
                      onChange={(e, v) => {
                        onChange(v);
                        handleEnter(getValues("type"), v);
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid>
        </Grid>

        <div id="OlDdExpired" style={{ width: "100%", height: "400px" }}></div>
      </Card>
    </div>
  );
}
