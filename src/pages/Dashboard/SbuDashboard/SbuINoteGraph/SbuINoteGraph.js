/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useState } from "react";
// Material UI
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
// Charts
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useForm } from "react-hook-form";
import {
  getINoteGraphDataForCqao,
} from "Redux/Actions/Graph/GraphAction";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { yearDetails } from "Redux/Actions/SupplyOrder/SODropdownAction";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  yearListId: yup.number().required("Year is required"),
});

const defaultValues = {
  yearListId: 2024,
};

export default function SbuINoteGraph({ data, setData }) {
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
  const fiveYearDetails = useSelector(
    (store) => store.soDropdownReducer.yearListDetails
  );


  const [graphData, setGraphData] = useState([]);

  const handleForYearWiseForCqao = (year) => {
    console.log(year);    
    const orgId = -1; 
    getINoteGraphDataForCqao(year, orgId)
      .then((res) => {
        const data = res?.map((item) => ({ ...item, fill: "red" }));
        setGraphData(data);
        console.log("graphdata", graphData);
      })
      .catch((err) => console.log("dashboard err", err));
  };
  
  const handleYearChange = (year) => {
    handleForYearWiseForCqao(year);
  };


  useEffect(() => {
    dispatch(yearDetails());
  }, []);

  useEffect(() => {
    if (Array.isArray(fiveYearDetails) && fiveYearDetails.length > 0) {
      setValue("yearListId", fiveYearDetails[0]);
    }
  }, [fiveYearDetails]);

  useEffect(() => {
    if (loggedInUser?.orgId === 2) handleForYearWiseForCqao(2024);
  }, []);

  useLayoutEffect(() => {
    let chart = am4core.create("SbuINote", am4charts.XYChart);

    chart.data = graphData;

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
    categoryAxis.renderer.minGridDistance = 50; 
    categoryAxis.maxWidth = 100; 

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Amount (in Cr)";
    valueAxis.title.fontWeight = 400;
    valueAxis.renderer.opposite = false;
    valueAxis.renderer.minGridDistance = 100;
    valueAxis.roundToInt = true;

    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "key";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;
      series.columns.template.width = am4core.percent(25);

      series.columns.template.fill = am4core.color("#f51111");

      var valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueX}";
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;

      var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.horizontalCenter = "right";
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color("#fff");
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;
    }

    createSeries("value", "SBU");

    chart.legend = new am4charts.Legend();
    chart.logo.disabled = true;
  }, [graphData]);

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={
            <Typography style={{ fontSize: "0.875rem" }}>SBU I-Note</Typography>
          }
        />
        <Grid container spacing={2} style={{ padding: 8, marginBottom: 8 }}>
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
                    >
                      {"Select FY"}
                    </InputLabel>

                    <Autocomplete
                      options={fiveYearDetails}
                      value={value || ""}
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
                        />
                      )}
                      onChange={(e, v) => {
                        onChange(v);
                        handleYearChange(v);
                      }}
                    />
                  </>
                );
              }}
            />
          </Grid>
        </Grid>

        <div id="SbuINote" style={{ width: "100%", height: "400px" }}></div>
      </Card>
    </div>
  );
}
