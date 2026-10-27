/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useLayoutEffect, useState } from "react";
//material ui
import { Card, CardHeader, Grid, InputLabel, makeStyles, TextField, Typography } from "@material-ui/core";
import "date-fns";

//charts
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useForm, useWatch } from "react-hook-form";
import { getInoteGraphProjectWise, getInoteGraphYearWise } from "Redux/Actions/Graph/GraphAction";

//redux
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {  projectDetailsForGraph, yearDetails } from "Redux/Actions/SupplyOrder/SODropdownAction";
import * as yup from "yup";

am4core.useTheme(am4themes_animated);

const useStyles = makeStyles(theme => ({
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
  // indenterId: yup
  //   .string()
  //   .typeError("required")
  //   .required(" required"),
  // consigneeIds: yup
  //   .array()
  //   .min(1, "required")
  //   .typeError("required")
  //   .required(" required"),
});

const defaultValues = {
  yearListId: 2024,
  type: "1",
  term: "1",
};

export default function INoteGraph(props) {
  const classes = useStyles();
  
  const dispatch = useDispatch();

  const {

    setValue,
    control,
   
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const Types = [
    { id: "1", name: "Year wise" },
    { id: "2", name: "Project wise" },
  ];

  const YearTypes = [
    { id: "1", name: "Yearly" },
    { id: "2", name: "Monthly" },
    { id: "3", name: "Quarterly" },
  ];


  const fiveYearDetails = useSelector(store => store.soDropdownReducer.yearListDetails);
  const [projectDetails ,setProjectDetails]= useState([]);

  const yearWatcher = useWatch({ control, name: "yearListId" });
  const typeWatcher = useWatch({ control, name: "type" });
  const termWatcher = useWatch({ control, name: "term" });
  const [graphData, setGraphData] = useState([]);

  const handleForYearWise = (year, term) => {
    console.log(year, term);
    getInoteGraphYearWise(year, term)
      .then(res => {
        const data = res?.map(item => ({ ...item, fill: "red" }));
        setGraphData(data);
        console.log("graphdata", graphData);
      })
      .catch(err => console.log("dashboard err", err));
  };
  const handleForProjectWise = id => {
    getInoteGraphProjectWise(id)
      .then(res => {
        const data = res?.map(item => ({ ...item, fill: "red" }));
        setGraphData(data);
        console.log("graphdataaproject", graphData);
      })
      .catch(err => console.log("dashboard err", err));
  };
  const projectsList=()=>{
    dispatch(projectDetailsForGraph()).then(res=>{setProjectDetails(res);
      console.log("ye3rgsqqwe",res)})
}
  // const handleYear = value => {
  //   setValue("yearListId", value);
  //   handleSelect(value);
  // };
  const handleProjectChange = id => {
    handleForProjectWise(id);
  };

  const handleYearChange = (year, term) => {
  
    handleForYearWise(year, term);
    console.log(yearWatcher, termWatcher, "thisssss is watcher");
  };

  useEffect(() => {
    dispatch(yearDetails());
    projectsList();
  }, []);

  // useEffect(() => {
  //   typeWatcher == 2 ? projectsList(): typeWatcher == 3 && projectsList();
  // }, [typeWatcher]);

  // useEffect(() => {
  //   // salesGroupWatcher && dispatch(projectDetails(loggedInUser?.orgId, salesGroupWatcher));
  //   typeWatcher === 1 && handleForYearWise(yearWatcher, termWatcher);
  //   typeWatcher === 2 && handleForProjectWise(202);
  //   handleForProjectWise(202);
  // }, []);

  useEffect(() => {
    if (Array.isArray(fiveYearDetails) && fiveYearDetails.length > 0) {
      setValue("yearListId", fiveYearDetails[0]);
      // setValue("term", 1);
      //handleForYearWise(fiveYearDetails[0]);
    }
  }, [fiveYearDetails]);
  useEffect(() => {
    // salesGroupWatcher && dispatch(projectDetails(loggedInUser?.orgId, salesGroupWatcher));
    handleForYearWise(2024, 1);
    // handleForProjectWise(202);
  }, []);

  console.log("fiveYearDetails", fiveYearDetails);

  useLayoutEffect(() => {
    let chart = am4core.create("INoteGraph", am4charts.XYChart);

    // Add data
    chart.data = graphData;
    // Create chart instance

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "key";
    categoryAxis.numberFormatter.numberFormat = "#";
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
      series.dataFields.categoryX = "key";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;
      series.columns.template.width =typeWatcher==2&&am4core.percent(8)|| termWatcher==1&&am4core.percent(7)||termWatcher==2&&am4core.percent(80)||termWatcher==3&&am4core.percent(24)  ;
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

    createSeries("inote", "I-Note");
    createSeries("formIV", "Form IV");

    //Add legend
    chart.legend = new am4charts.Legend();
  }, [graphData]);

  console.log("object", graphData);
  return (
    <div>
      <Card className={classes.root}>
        <CardHeader className={classes.card} disableTypography title={<Typography style={{ fontSize: "0.875rem" }}>I-Note/ Form IV</Typography>} />
        <Grid container spacing={2} style={{ padding: 4, marginBottom: 8 }}>
          <Grid item xs={12} sm={6} md={4} align="left">
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      // disabled={disabled}
                      //error={error}
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
                      value={Types.find(item => item?.id === value)}
                      labelText="Select Type"
                      getOptionLabel={o => o.name}
                      renderInput={params => (
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
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} align="left">
            {typeWatcher == 1 ? (
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
                        getOptionLabel={o => o}
                        renderInput={params => (
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
                          handleYearChange(v, termWatcher);
                        }}
                      />
                    </>
                  );
                }}
              />
            ) : null}
            {typeWatcher == 2 ? (
              <Controller
                name="project"
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
                        {"Select Project"}
                      </InputLabel>

                      <Autocomplete
                        options={projectDetails}
                        value={value || ""}
                        labelText="Project"
                        getOptionLabel={o => o.name}
                        renderInput={params => (
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
                          ///onChange(v?.id);
                          handleProjectChange(v?.id);
                        }}
                      />
                    </>
                  );
                }}
              />
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6} md={4} align="left">
            {typeWatcher == 1 ? (
              <Controller
                name="term"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <>
                      <InputLabel
                        // disabled={disabled}
                        //error={error}
                        classes={{
                          asterisk: classes.asterisk,
                          root: classes.rootDrop,
                        }}
                        style={{ fontSize: "0.875rem" }}
                        // required={true}
                      >
                        {"Select Term"}
                      </InputLabel>
                      <Autocomplete
                        options={YearTypes}
                        value={YearTypes.find(item => item?.id === value)}
                        labelText="Select Type"
                        getOptionLabel={o => o.name}
                        renderInput={params => (
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
                          onChange(v?.id);
                          console.log("v", v?.id);
                          handleYearChange(yearWatcher, v?.id);
                        }}
                      />
                    </>
                  );
                }}
              />
            ) : null}
          </Grid>
        </Grid>

        <div id="INoteGraph" style={{ width: "100%", height: "400px" }}></div>
      </Card>
    </div>
  );
}
