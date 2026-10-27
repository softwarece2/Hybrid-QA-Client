

// import { useEffect, useLayoutEffect, useState } from "react";
// //material ui
// import {
//   Card,
//   CardHeader,
//   Grid,
//   InputLabel,
//   makeStyles,
//   TextField,
//   Typography,
// } from "@material-ui/core";
// import "date-fns";
// //charts
// import * as am4charts from "@amcharts/amcharts4/charts";
// import * as am4core from "@amcharts/amcharts4/core";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { Autocomplete } from "@material-ui/lab";
// import { Controller, useForm, useWatch } from "react-hook-form";
// import {
//   getYearWiseData
// } from "Redux/Actions/Graph/GraphAction";
// //redux
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useDispatch, useSelector } from "react-redux";
// import { yearDetails } from "Redux/Actions/SupplyOrder/SODropdownAction";
// import * as yup from "yup";

// am4core.useTheme(am4themes_animated);

// const useStyles = makeStyles((theme) => ({
//   root: {
//     minHeight: "235px",
//     width: "100%",
//   },
//   card: {
//     padding: 2,
//     color: "white",
//     backgroundColor: theme.palette.primary.main,
//   },
// }));

// const schema = yup.object().shape({
//   yearListId: yup.number().required("Year is required"),
//   // fromDate: yup.date().required("From Date is required"),
//   // toDate: yup.date().required("To Date is required"),
// });

// const defaultValues = {
//   yearListId: -1,
//   type: "1", // Default to yearly
//   // fromDate: new Date(),
//   // toDate: new Date(),
// };

// export default function CqaoInoteGraph1(props) {
//   const classes = useStyles();
//   const dispatch = useDispatch();

//   const { setValue, control, watch } = useForm({
//     defaultValues,
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });

//   const loggedInUser = useSelector((store) => store.loggedInUser);
//   const fiveYearDetails = useSelector(
//     (store) => store.soDropdownReducer.yearListDetails
//   );

//   const typeWatcher = useWatch({ control, name: "type" });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [graphData, setGraphData] = useState([]);

//   const Types = [
//     { term: "Yearly", value: "1" },
//     { term: "Quarterly", value: "3" },
//     { term: "Monthly", value: "2" },
//   ];

//   useEffect(() => {
//     dispatch(yearDetails());
//   }, []);

//   useEffect(() => {
//     if (Array.isArray(fiveYearDetails) && fiveYearDetails.length > 0) {
//       setValue("yearListId", fiveYearDetails[0]);
//       handleForYearWise(fiveYearDetails[0], "1");
//     }
//   }, [fiveYearDetails]);

//   const handleForYearWise = async (year, type) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getYearWiseData(year, type, loggedInUser?.salesGrpId);

//       const formattedData = res?.map((item) => ({
//         key: item.key,
//         approved: parseInt(item.approved, 10),
//         order: parseInt(item.order, 10),
//       }));

//       console.log("formattedData: ", formattedData);
//       setGraphData(formattedData);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Error fetching data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useLayoutEffect(() => {
//     let chart = am4core.create("CqaoINoteGraph", am4charts.XYChart);
//     chart.data = graphData;
//     var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//     categoryAxis.dataFields.category = "key";
//     //  categoryAxis.numberFormatter.numberFormat = "#";
//     categoryAxis.renderer.inversed = false;
//     categoryAxis.renderer.grid.template.location = 13;
//     categoryAxis.renderer.cellStartLocation = 0.1;
//     categoryAxis.renderer.cellEndLocation = 0.9;
//     categoryAxis.renderer.labels.template.rotation = -15;
//     categoryAxis.renderer.labels.template.fontSize = "0.75rem";
//     categoryAxis.labelFrequency = 0;
//     categoryAxis.renderer.minGridDistance = 30;
//     categoryAxis.maxWidth = 80;
//     categoryAxis.renderer.maxCategoryWidth = 40;

//     var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     valueAxis.renderer.opposite = false;
//     valueAxis.renderer.minGridDistance = 100;
//     valueAxis.roundToInt = true;
//     valueAxis.min = 0;
//     valueAxis.strictMin = 0; // Force minimum to 0
//     valueAxis.renderer.minWidth = 50;

//     //export option
//     chart.exporting.menu = new am4core.ExportMenu();
//     chart.exporting.menu.align = "right";
//     chart.exporting.menu.verticalAlign = "top";

//     // Create series
//     function createSeries(field, name, color) {
//       var series = chart.series.push(new am4charts.ColumnSeries());
//       series.dataFields.valueY = field;
//       series.dataFields.categoryX = "key";
//       series.name = name;
//       series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
//       series.columns.template.fill = am4core.color(color);
//       series.columns.template.height = am4core.percent(100);
//       series.sequencedInterpolation = true;
//       series.columns.template.width = 20;
//       series.columns.template.column.fill = am4core.color(color);
//       series.columns.template.strokeWidth = 0;
//       // series.columns.template.width =am4core.percent(80);

//       //bar radius
//       series.columns.template.column.cornerRadiusTopLeft = 8;
//       series.columns.template.column.cornerRadiusTopRight = 8;
//       series.columns.template.column.fillOpacity = 0.8;

//       // on hover, make corner radiuses bigger
//       let hoverState = series.columns.template.column.states.create("hover");

//       hoverState.properties.fillOpacity = 1;

//       var valueLabel = series.bullets.push(new am4charts.LabelBullet());
//       valueLabel.label.text = "{valueX}";
//       valueLabel.label.horizontalCenter = "left";
//       valueLabel.label.dx = 10;
//       valueLabel.label.hideOversized = false;
//       valueLabel.label.truncate = false;

//       var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
//       // categoryLabel.label.text = "{name}";

//       categoryLabel.label.horizontalCenter = "right";
//       categoryLabel.label.dx = -10;
//       categoryLabel.label.fill = am4core.color("#fff");
//       categoryLabel.label.hideOversized = false;
//       categoryLabel.label.truncate = false;

//       // Cursor
//       // chart.cursor = new am4charts.XYCursor();
//     }

//     createSeries("approved", "Approved", "#4caf50");
//     createSeries("order", "Order", "#673ab7");

//     chart.legend = new am4charts.Legend();
  
//   }, [graphData]);

//   return (
//     <div>
//       <Card className={classes.root}>
//         <CardHeader
//           className={classes.card}
//           disableTypography
//           title={
//             <Typography style={{ fontSize: "0.875rem" }}>Challan</Typography>
//           }
//         />
//         <Grid
//           container
//           spacing={2}
//           style={{ marginBottom: "10px", padding: "4px" }}
//         >
//           <Grid item xs={4} sm={4} md={4} align="left">
//             <Controller
//               name="yearListId"
//               control={control}
//               render={({ field: { onChange, value } }) => {
//                 return (
//                   <>
//                     <InputLabel
//                       classes={{
//                         asterisk: classes.asterisk,
//                         root: classes.rootDrop,
//                       }}
//                       style={{ fontSize: "0.875rem" }}
//                     >
//                       {"Select FY"}
//                     </InputLabel>
//                     <Autocomplete
//                       options={fiveYearDetails}
//                       value={value || ""}
//                       labelText="Year"
//                       getOptionLabel={(o) => o}
//                       renderInput={(params) => (
//                         <TextField
//                           variant="outlined"
//                           {...params}
//                           InputProps={{
//                             ...params.InputProps,
//                             classes: {
//                               input: classes.input,
//                               root: classes.textFieldRoot,
//                             },
//                           }}
//                           size="small"
//                         />
//                       )}
//                       onChange={(e, v) => {
//                         onChange(v);
//                         handleForYearWise(v, typeWatcher);
//                       }}
//                     />
//                   </>
//                 );
//               }}
//             />
//           </Grid>
//           <Grid item xs={4} sm={4} md={4} align="left">
//             <Controller
//               name="type"
//               control={control}
//               render={({ field: { onChange, value } }) => {
//                 return (
//                   <>
//                     <InputLabel
//                       classes={{
//                         asterisk: classes.asterisk,
//                         root: classes.rootDrop,
//                       }}
//                       style={{ fontSize: "0.875rem", marginInline: "px" }}
//                     >
//                       {"Select Type"}
//                     </InputLabel>
//                     <Autocomplete
//                       options={Types}
//                       value={Types.find((item) => item?.value === value)} // Find by value
//                       labelText="Select Type"
//                       getOptionLabel={(o) => o.term}
//                       renderInput={(params) => (
//                         <TextField
//                           variant="outlined"
//                           {...params}
//                           InputProps={{
//                             ...params.InputProps,
//                             classes: {
//                               input: classes.input,
//                               root: classes.textFieldRoot,
//                             },
//                           }}
//                           size="small"
//                         />
//                       )}
//                       onChange={(e, v) => {
//                         onChange(v?.value ?? "-1");
//                         handleForYearWise(watch("yearListId"), v?.value);
//                       }}
//                     />
//                   </>
//                 );
//               }}
//             />
//           </Grid>
//         </Grid>
//         <div
//           id="CqaoINoteGraph"
//           style={{ width: "100%", height: "400px" }}
//         ></div>
//       </Card>
//     </div>
//   );
// }

