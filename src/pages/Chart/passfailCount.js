// import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import * as am4core from "@amcharts/amcharts4/core";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { Backdrop, Card, CardHeader, CircularProgress, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
// import { ArrowBack } from "@material-ui/icons";
// import { getLast10YearsWithNextYear, ORG_TYPE, Quarters } from "Globals.js";
// import { useSelector } from "react-redux";
// import axiosInstance from "pages/Services/AxiosInstanceRpt";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     minHeight: 235,
//     width: "100%",
//   },
//   card: {
//     padding: 2,
//     color: "white",
//     backgroundColor: theme.palette.primary.main,
//   },
// }));
// am4core.useTheme(am4themes_animated);

// const url = "stats/v2/observations";

// const currentYear = new Date().getFullYear() + 1;
// const MAX_LEVEL = 3;
// export default function PassFailCount() {
//   const classes = useStyles();
//   const loggedInUser = useSelector(store=> store.loggedInUser)
//   const chartRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedCharts, setSelectedCharts] = useState([]);
//   const [chartData, setChartData] = useState({});
//   const [year, setYear] = useState(currentYear);
//   const [quarter, setQuarter] = useState("");
//   const isQA = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;

//   // console.log(selectedCharts, "selectedCharts", chartData);

//   const createChart = useCallback((data) => {
//     if (!data) return;
//     if (chartRef.current) {
//       chartRef.current.dispose();
//     }

//     const chart = am4core.create("drill-down-chart", am4charts.XYChart);
//     chartRef.current = chart;

//     chart.data = data;
//     chart.legend = new am4charts.Legend();
//     chart.scrollbarX = new am4core.Scrollbar();
//     chart.scrollbarY = new am4core.Scrollbar();

//     chart.mouseWheelBehavior = "zoomX";

//     chart.cursor = new am4charts.XYCursor();
//     chart.cursor.behavior = "zoomXY"; // Disable cursor behavior
//     chart.cursor.align = "none";

//     chart.tooltip.background.fillOpacity = 0.8;
//     // Create category axis
//     const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//     categoryAxis.dataFields.category = "id";
//     categoryAxis.renderer.grid.template.location = 0;
//     categoryAxis.renderer.cellStartLocation = 0.1;
//     categoryAxis.renderer.cellEndLocation = 0.9;
//     categoryAxis.start = 0;
//     // categoryAxis.maxZoomCount= 10;
//     // categoryAxis.minZoomCount = 10;
//     chart.maxZoomFactor = 5;

//     // Create value axis
//     const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//     valueAxis.title.text = "Count (Pass/Fail)";
//     valueAxis.renderer.opposite = false;
//     valueAxis.renderer.minGridDistance = 100;
//     valueAxis.roundToInt = true;
//     valueAxis.min = 0;
//     valueAxis.strictMin = 0; // Force minimum to 0
//     valueAxis.renderer.minWidth = 50;

//     // const main = chart.series.push(new am4charts.ColumnSeries());
//     // main.dataFields.valueY = "cumulative";
//     // main.dataFields.categoryX = "category";
//     // main.name = "Cumulative";
//     // main.columns.template.fill = "#87ceeb8a";
//     // main.columns.template.strokeOpacity = 0.1;
//     // main.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
//     // main.columns.template.tooltipY = 20;
//     // main.columns.template.events.on("hit", (ev) => {
//     //   setSelectedCharts((ps) => {
//     //     if (ps.length === MAX_LEVEL) {
//     //       return ps;
//     //     }
//     //     return [
//     //       ...ps,
//     //       ev.target.dataItem.dataContext.id + ":" + ev.target.dataItem.dataContext.type + ":" + ev.target.dataItem.dataContext.category,
//     //     ];
//     //   });
//     // });

//     function createColumnSeries(name, valueY, fillColor, tooltipY) {
//       const s = chart.series.push(new am4charts.ColumnSeries());
//       s.dataFields.valueY = valueY;
//       s.dataFields.categoryX = "id";
//       s.name = name;
//       s.columns.template.fill = fillColor;
//       s.columns.template.opacity = 0.4;
//       s.columns.template.strokeWidth = 0;
//       s.columns.template.tooltipY = tooltipY;
//       s.columns.template.column.cornerRadiusTopLeft = 8;
//       s.columns.template.column.cornerRadiusTopRight = 8;

//       s.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
//       s.columns.template.events.on("hit", (ev) => {
//         setSelectedCharts((ps) => {
//           if (ps.length === MAX_LEVEL) {
//             return ps;
//           }
//           return [...ps, ev.target.dataItem.dataContext.type + ":" + ev.target.dataItem.dataContext.id];
//         });
//       });
//     }

//     createColumnSeries("Pass", "passCount", "#00aa0055", 10);
//     createColumnSeries("Fail", "failCount", "#d14e4eaa", 20);
//   }, []);

//   const goBack = useCallback(() => {
//     if (selectedCharts.length <= 0) return;

//     setSelectedCharts((ps) => {
//       let newLength = ps.length - 1;
//       return ps.slice(0, newLength);
//     });
//   }, [selectedCharts.length]);

//   const getChartData = useCallback(() => {
//     setLoading(true);
//     let params = {
//       fy: year,
//       quarter: quarter || undefined,
//       isQA:isQA.toString()
//     };
//     selectedCharts.forEach((ch, i) => {
//       const [type, id] = ch.split(":");
//       if (i === 0) {
//         params = {
//           ...params,
//           productId: id,
//         };
//       } else if (i === 1) {
//         params = {
//           ...params,
//           testId: id,
//         };
//       } else if (i === 2) {
//         params = {
//           ...params,
//           specId: id,
//         };
//       }
//     });
//     const key = JSON.stringify(params);
//     if (key in chartData) {
//       createChart(chartData[key]);
//       setLoading(false);
//     } else {
//       axiosInstance(url, {
//         params,
//       })
//         .then(({ data }) => {
//           createChart(data);
//           setChartData((ps) => ({ ...ps, [key]: data }));
//         })
//         .catch((e) => {
//           console.log(e);
//           // toast.error("Failed to get");
//           goBack();
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [year, quarter, isQA, selectedCharts, chartData, createChart, goBack]);

//   useLayoutEffect(() => {
//     getChartData();
//   }, [getChartData]);

//   return (
//     <Card className={classes.root}>
//       <CardHeader
//         className={classes.card}
//         disableTypography
//         title={
//           <Typography align="Center" style={{ fontSize: "0.875rem" }}>
//             Pass / Fail
//           </Typography>
//         }
//       />
//       <div style={{ display: "flex", gap: 8, margin: 8, marginBottom: 0 }}>
//         <TextField
//           select
//           SelectProps={{ native: true }}
//           label="Select Year"
//           InputLabelProps={{ shrink: true }}
//           style={{ width: 300 }}
//           onChange={(e) => {
//             setYear(e.target.value);
//           }}
//           variant="outlined"
//           size="small"
//         >
//           {getLast10YearsWithNextYear().map((y) => (
//             <option value={y} key={y}>
//               {y}
//             </option>
//           ))}
//         </TextField>

//         <TextField
//           select
//           SelectProps={{ native: true }}
//           label="Select Quarter"
//           InputLabelProps={{ shrink: true }}
//           style={{ width: 300 }}
//           onChange={(e) => {
//             setQuarter(e.target.value);
//           }}
//           variant="outlined"
//           size="small"
//         >
//           <option value={""}>Select</option>
//           {Quarters().map((q) => (
//             <option value={q.value} key={q.value}>
//               {q.label}
//             </option>
//           ))}
//         </TextField>
//       </div>

//       <Backdrop
//         open={loading}
//         style={{
//           zIndex: 2,
//           position: "absolute",
//           backgroundColor: "#ffffff80",
//           backdropFilter: "blur(1px)",
//           alignItems: "flex-start",
//           paddingTop: "20%",
//         }}
//       >
//         <Typography>Loading please wait...</Typography>
//         <CircularProgress size={16} disableShrink />
//       </Backdrop>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: 20 }}>
//         <div>
//           {selectedCharts.map((chart, i, a) => {
//             const type = chart;
//             return (
//               <Typography
//                 onClick={() => setSelectedCharts((ps) => ps.slice(0, i))}
//                 style={{ cursor: "pointer" }}
//                 component={"span"}
//                 key={chart}
//                 variant="subtitle1"
//               >
//                 {i > 0 && " ➤ "}

//                 {i === a.length - 1 ? (
//                   <Typography component="span" color="secondary">
//                     {type}
//                   </Typography>
//                 ) : (
//                   type
//                 )}
//               </Typography>
//             );
//           })}
//         </div>

//         <IconButton
//           title="Back"
//           color="secondary"
//           size="small"
//           onClick={goBack}
//           disabled={loading}
//           style={{ display: selectedCharts.length > 0 ? "inherit" : "none", textTransform: "capitalize" }}
//         >
//           <ArrowBack />
//         </IconButton>
//       </div>

//       <div id="drill-down-chart" style={{ width: "100%", height: 600 }}></div>
//     </Card>
//   );
// }
