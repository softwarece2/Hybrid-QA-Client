/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useLayoutEffect, useState, useEffect } from "react";

//material ui
import {
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
import { getPoGraph } from "Redux/Actions/Graph/GraphAction";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useForm, useWatch } from "react-hook-form";

//redux
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  consignee,
  indenter,
  projectDetails,
  getSalesGrpForChart,
} from "Redux/Actions/SupplyOrder/SODropdownAction";

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
  indenterId: yup
    .string()
    .typeError("Required")
    .required(" Required"),
  consigneeIds: yup
    .array()
    .min(1, "Required")
    .typeError("Required")
    .required(" Required"),
});

const defaultValues = {
  salesGroupId: -1,
  indenterId: -1,
  consigneeIds: -1,
  type: "",
  projectDetailsId: -1,
};

export default function PoDdExpired(props) {
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

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const indentDetails = useSelector((store) => store.soDropdownReducer.indent);
  const consigneeDetails = useSelector(
    (store) => store.soDropdownReducer.consignee
  );


  const typeWatcher = useWatch({ control, name: "type" });
  const salesGroupWatcher = useWatch({ control, name: "salesGroupId" });
  const consigneeWatcher = useWatch({ control, name: "consigneeIds" });

  const indentorWatcher = useWatch({ control, name: "indenterId" });

  const [graphData, setGraphData] = useState([]);
  const [salesGrpData, setSalesGrpData] = useState([]);

  const Types = [
    // { id: "1", name: "Project wise" },
    { id: "2", name: "OPA wise" },
    { id: "3", name: "Consignee wise" },
  ];

  const handleEnter = (consigneeId, indentorId, salesGrpId) => {
    getPoGraph(loggedInUser?.orgId, consigneeId, indentorId, salesGrpId)
      .then((res) => {
        const data = res?.map((item) => ({ ...item, fill: "red" }));
        setGraphData(data);
      })
      .catch((err) => console.log("dashboard err", err));
  };

  useEffect(() => {
    // dispatch(indenter());
    // dispatch(consignee());
    dispatch(getSalesGrpForChart()).then((data) => {
      setSalesGrpData(data);
    });
    handleEnter(-1, -1, -1);
  }, []);

  useEffect(() => {
    salesGroupWatcher &&
      dispatch(projectDetails(loggedInUser?.orgId, salesGroupWatcher));
    handleEnter(consigneeWatcher, indentorWatcher, salesGroupWatcher);
  }, [salesGroupWatcher]);

  useEffect(() => {
    typeWatcher == 2
      ? dispatch(indenter())
      : typeWatcher == 3 && dispatch(consignee());
  }, [typeWatcher]);

 
  const handleIndentorChange = (id) => {
    setValue("projectDetailsId", -1);
    setValue("consigneeIds", -1);
    setValue("indenterId", id);
    handleEnter(-1, id, salesGroupWatcher);
  };

  const handleConsigneeChange = (id) => {
    setValue("projectDetailsId", -1);
    setValue("consigneeIds", id);
    setValue("indenterId", -1);
    handleEnter(id, -1, salesGroupWatcher);
  };

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

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    //bar size
    series.columns.template.width = am4core.percent(40);
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
    series.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
 
  }, [graphData]);

  // console.log("object", graphData);
  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={
            <Typography style={{ fontSize: "0.875rem" }}>
              Supply Order
            </Typography>
          }
        />
        <Grid container spacing={2} style={{ padding: 4, marginBottom: 8 }}>
          {/* <Grid item xs={12} sm={6} md={4} align="left">
            <Controller
              name="salesGroupId"
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
                      {"Select Sales Group"}
                    </InputLabel>

                    <Autocomplete
                      options={salesGrpData}
                      value={
                        salesGrpData.find((item) => item?.id === value) || ""
                      }
                      labelText="Sales Group"
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
                          // error={!!errors.consigneeIds}
                          // helperText={errors.consigneeIds?.message}
                        />
                      )}
                      onChange={(e, v) => {
                        // const data = v?.map((item) => item?.id);
                        onChange(v?.id ?? -1);
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid> */}
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
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid>

          {typeWatcher == 2 ? (
            <Grid item xs={12} sm={6} md={4} align="left">
              <Controller
                name="indenterId"
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
                        {"Indent/ OPA"}
                      </InputLabel>
                      <Autocomplete
                        options={indentDetails}
                        value={
                          indentDetails.find((item) => item.id === value) || ""
                        }
                        labelText="Indentor ID"
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
                          handleIndentorChange(v?.id ?? -1);
                        }}
                      />
                    </>
                  );
                }}
              />
            </Grid>
          ) : null}

          {typeWatcher == 3 ? (
            <Grid item xs={12} sm={6} md={4} align="left">
              <Controller
                name="consigneeIds"
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
                        {"Select Consignee"}
                      </InputLabel>

                      <Autocomplete
                        options={consigneeDetails}
                        value={
                          consigneeDetails.find((item) => item?.id === value) ||
                          ""
                        }
                        // getOptionValue={(option) => option["id"]}
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
                          // const data = v?.map((item) => item?.id);
                          handleConsigneeChange(v?.id ?? -1);
                        }}
                      />
                    </>
                  );
                }}
              />
            </Grid>
          ) : null}
        </Grid>

        <div id="PoDdExpired" style={{ height: "400px" }}></div>
      </Card>
    </div>
  );
}
