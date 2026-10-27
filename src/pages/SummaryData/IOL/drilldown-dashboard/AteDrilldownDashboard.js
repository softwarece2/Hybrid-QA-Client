import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  Fade,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShowChart,
  CheckCircle,
  Cancel,
  Devices,
  Assessment,
  FilterList,
  GetApp,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  Speed,
  VerifiedUser,
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { toast } from "react-toastify";
import SpecTrendModal from "./SpecTrendModal";

am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 8px 20px",
    // Inherit app shell bg — no nested grey panel (that caused the "detached" look)
    backgroundColor: "transparent",
    overflowX: "hidden",
    // Keep type metrics natural — avoid stretched-looking text
    fontStretch: "normal",
    letterSpacing: "normal",
    "& *": {
      fontStretch: "normal",
    },
  },
  pageHeader: {
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
    padding: "4px 2px 10px",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontWeight: 700,
    color: theme.palette.primary.main,
    lineHeight: 1.3,
    letterSpacing: "normal",
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#607080",
    fontSize: 13,
    maxWidth: 760,
    lineHeight: 1.4,
    letterSpacing: "normal",
    fontWeight: 400,
  },
  filterBar: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "nowrap",
    padding: "8px 0 12px",
    marginBottom: 12,
    // Flat on page bg — no floating white card
    backgroundColor: "transparent",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
      alignItems: "stretch",
    },
  },
  filterField: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "normal",
    textTransform: "none",
    color: "#546e7a",
    lineHeight: 1.3,
  },
  productField: {
    flex: "1 1 240px",
    minWidth: 200,
    maxWidth: 400,
  },
  dateField: {
    flex: "0 0 160px",
    width: 160,
    [theme.breakpoints.down("sm")]: {
      flex: "1 1 140px",
      width: "auto",
    },
  },
  stageField: {
    flexShrink: 0,
  },
  stageShell: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    height: 40,
    padding: "3px 4px",
    borderRadius: 20,
    backgroundColor: "rgba(25, 118, 210, 0.08)",
    border: "1px solid rgba(25, 118, 210, 0.16)",
    boxSizing: "border-box",
  },
  stageChip: {
    height: 32,
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 16,
    minWidth: 42,
    letterSpacing: "normal",
    transition: "background-color 0.15s ease, color 0.15s ease",
  },
  stageChipActive: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "#fff !important",
    boxShadow: "none",
  },
  stageChipIdle: {
    backgroundColor: "transparent !important",
    color: "#455a64 !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.65) !important",
    },
  },
  analyzeBtn: {
    height: 40,
    minWidth: 110,
    fontWeight: 600,
    borderRadius: 6,
    flexShrink: 0,
    textTransform: "none",
    fontSize: 14,
    letterSpacing: "normal",
    boxShadow: "none",
    "&:hover": { boxShadow: "none" },
  },
  controlInput: {
    height: 40,
    fontSize: 14,
    backgroundColor: "#fff",
    borderRadius: 6,
    letterSpacing: "normal",
  },
  kpiCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "none",
    cursor: "default",
    // Soft tint of the page — not a floating white slab
    backgroundColor: "rgba(255,255,255,0.55)",
    height: "100%",
    transition: "border-color 0.15s ease, background-color 0.15s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.85)",
      borderColor: "rgba(0,0,0,0.12)",
    },
  },
  kpiAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  kpiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  kpiValue: {
    fontWeight: 700,
    fontSize: 26,
    lineHeight: 1.2,
    letterSpacing: "normal",
  },
  kpiMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#607080",
    fontWeight: 400,
    letterSpacing: "normal",
  },
  kpiClickable: {
    cursor: "pointer",
  },
  insightStrip: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    padding: "8px 4px",
    backgroundColor: "transparent",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  chartCard: {
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "none",
    backgroundColor: "rgba(255,255,255,0.55)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chartHeader: {
    padding: "10px 14px !important",
  },
  donutContainer: {
    width: "100%",
    height: 270,
    minHeight: 270,
    maxHeight: 270,
    overflow: "hidden",
  },
  barChartContainer: {
    width: "100%",
    height: 270,
    minHeight: 270,
    maxHeight: 270,
    overflow: "hidden",
  },
  paretoChartContainer: {
    width: "100%",
    height: 270,
    minHeight: 270,
    maxHeight: 270,
    overflow: "hidden",
  },
  paramInsightCard: {
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    padding: "10px 12px",
    borderRadius: 6,
    backgroundColor: "rgba(255, 235, 238, 0.45)",
    border: "1px solid rgba(211, 47, 47, 0.18)",
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    "& th": {
      color: "#ffffff",
      fontWeight: 700,
      fontSize: 12,
      padding: "10px 12px",
    },
  },
  subTable: {
    backgroundColor: "#f8fafc",
    margin: "6px 0",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
  },
  badgePass: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: 700,
  },
  badgeFail: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    fontWeight: 700,
  },
  clickableRow: {
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  viewToggle: {
    "& .MuiButton-root": {
      textTransform: "none",
      fontWeight: 700,
      fontSize: 11,
      padding: "4px 12px",
      minWidth: 0,
    },
  },
}));

// Helper functions for fiscal year calculation (1st April of current financial year)
const getFiscalYearStart = () => {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan, 3 = April
  const startYear = currentMonth >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear}-04-01`;
};

const getTodayDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function AteDrilldownDashboard() {
  const classes = useStyles();
  const theme = useTheme();

  // Filters
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductObj, setSelectedProductObj] = useState(null);
  const [fromDate, setFromDate] = useState(getFiscalYearStart());
  const [toDate, setToDate] = useState(getTodayDate());
  const [isQa, setIsQa] = useState("");

  // Level 1: Overview
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Level 2: Grouped Test Failures & Pareto
  const [testFailures, setTestFailures] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [chartViewMode, setChartViewMode] = useState("bar"); // "bar" | "pareto" | "rate"

  // Level 3: Failed Devices for selected test
  const [selectedTest, setSelectedTest] = useState(null);
  const [failedDevices, setFailedDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Level 4: Spec Trend Modal
  const [trendModalSpec, setTrendModalSpec] = useState(null);
  const [trendModalOpen, setTrendModalOpen] = useState(false);

  // Chart and Section Refs
  const donutRef = useRef(null);
  const barChartRef = useRef(null);
  const paretoChartRef = useRef(null);
  const level2SectionRef = useRef(null);
  const level3SectionRef = useRef(null);

  // Load product list with EP codes on mount
  useEffect(() => {
    axiosInstanceAte("spec/getAllProductWithEpCode")
      .then(({ data }) => {
        if (data && Array.isArray(data)) {
          const cleaned = data.map((p) => ({
            ...p,
            cleanedLabel: (p.productNameEpCode || "").replace(/\r?\n/g, " ").trim(),
          }));
          setProducts(cleaned);
        }
      })
      .catch((err) => console.error("Error loading products", err));
  }, []);

  // Smooth scroll helper
  const scrollToRef = (ref) => {
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  function handleSearch(stageOverride) {
    if (!selectedProduct) {
      toast.info("Please select a Product or EP Code from the dropdown");
      return;
    }

    const stageValue = stageOverride !== undefined ? stageOverride : isQa;

    setSelectedTest(null);
    setFailedDevices([]);

    // Fetch Level 1 Overview
    setLoadingOverview(true);
    axiosInstanceIol("ateDrilldownDash/getOverview", {
      params: {
        productId: selectedProduct,
        fromDate,
        toDate,
        isQa: stageValue !== "" ? stageValue : undefined,
      },
    })
      .then(({ data }) => {
        setOverview(data);
      })
      .catch((err) => console.error("Error loading overview", err))
      .finally(() => setLoadingOverview(false));

    // Fetch Level 2 Grouped Failures by Test
    setLoadingTests(true);
    axiosInstanceIol("ateDrilldownDash/getFailuresByTest", {
      params: {
        productId: selectedProduct,
        fromDate,
        toDate,
        isQa: stageValue !== "" ? stageValue : undefined,
      },
    })
      .then(({ data }) => {
        setTestFailures(data || []);
      })
      .catch((err) => console.error("Error loading test failures", err))
      .finally(() => setLoadingTests(false));
  }

  // Handle stage filter quick clicks (All, QA, QC)
  const handleStageChange = (newStage) => {
    setIsQa(newStage);
    if (selectedProduct) {
      handleSearch(newStage);
    }
  };

  // Level 1 Donut Chart — skip when no devices tested (0/0 labels stack on top of each other)
  useLayoutEffect(() => {
    if (!overview || !donutRef.current) return;

    const passed = Number(overview.passedDevices) || 0;
    const failed = Number(overview.failedDevices) || 0;
    const total = passed + failed;
    if (total <= 0) {
      // Clear any previous chart DOM leftovers
      donutRef.current.innerHTML = "";
      return;
    }

    const chart = am4core.create(donutRef.current, am4charts.PieChart);
    chart.innerRadius = am4core.percent(50);
    chart.radius = am4core.percent(85);
    chart.logo.disabled = true;
    chart.padding(5, 15, 5, 15);

    chart.data = [
      { status: "Passed Devices", count: passed, color: am4core.color("#2e7d32") },
      { status: "Failed Devices", count: failed, color: am4core.color("#d32f2f") },
    ].filter((d) => d.count > 0);

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "status";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    pieSeries.slices.template.tooltipText =
      "{category}: [bold]{value}[/] devices ({value.percent.formatNumber('#.0')}%)";
    pieSeries.alignLabels = true;
    pieSeries.labels.template.fontSize = 11;
    pieSeries.labels.template.text = "{category}: {value.percent.formatNumber('#.0')}%";
    // Never show labels for zero slices (prevents stacked "0.0%" text)
    pieSeries.labels.template.adapter.add("text", (text, target) => {
      const val = target.dataItem ? Number(target.dataItem.values.value.value) : 0;
      return val > 0 ? text : "";
    });
    pieSeries.ticks.template.adapter.add("disabled", (disabled, target) => {
      const val = target.dataItem ? Number(target.dataItem.values.value.value) : 0;
      return val <= 0 ? true : disabled;
    });

    pieSeries.slices.template.events.on("hit", (ev) => {
      const dataItem = ev.target.dataItem?.dataContext;
      if (dataItem?.status?.includes("Fail")) {
        scrollToRef(level2SectionRef);
      }
    });

    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.fontSize = 11;

    return () => {
      chart.dispose();
    };
  }, [overview]);

  // Level 2 Bar Chart (Comparative Pass vs Fail)
  // No ScrollbarX to completely eliminate canvas resize vibration
  useLayoutEffect(() => {
    if (!testFailures || testFailures.length === 0 || chartViewMode !== "bar" || !barChartRef.current) return;

    const chart = am4core.create(barChartRef.current, am4charts.XYChart);
    chart.logo.disabled = true;
    // Extra left padding (35px) ensures long rotated test names like "TVNE-4B(M1) - Pre Inspection" are never cut off
    chart.padding(10, 15, 10, 35);

    chart.data = testFailures.map((t) => ({
      testId: t.testId,
      testName: t.testName,
      failed: t.failedDevicesCount,
      passed: t.passedDevicesCount,
      total: t.totalTestedDevices,
    }));

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "testName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 25;
    categoryAxis.renderer.labels.template.rotation = -30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.labels.template.maxWidth = 160;
    categoryAxis.renderer.labels.template.truncate = false;
    categoryAxis.renderer.labels.template.wrap = true;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of Devices";
    valueAxis.title.fontSize = 11;

    const seriesFailed = chart.series.push(new am4charts.ColumnSeries());
    seriesFailed.dataFields.valueY = "failed";
    seriesFailed.dataFields.categoryX = "testName";
    seriesFailed.name = "Failed Devices";
    seriesFailed.columns.template.fill = am4core.color("#d32f2f");
    seriesFailed.columns.template.stroke = am4core.color("#b71c1c");
    seriesFailed.columns.template.tooltipText = "{name}: [bold]{valueY}[/] devices (Click to drilldown)";
    seriesFailed.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    seriesFailed.columns.template.events.on("hit", (ev) => {
      const item = ev.target.dataItem?.dataContext;
      if (item) {
        handleSelectTest({ testId: item.testId, testName: item.testName });
      }
    });

    const seriesPassed = chart.series.push(new am4charts.ColumnSeries());
    seriesPassed.dataFields.valueY = "passed";
    seriesPassed.dataFields.categoryX = "testName";
    seriesPassed.name = "Passed Devices";
    seriesPassed.columns.template.fill = am4core.color("#2e7d32");
    seriesPassed.columns.template.stroke = am4core.color("#1b5e20");
    seriesPassed.columns.template.tooltipText = "{name}: [bold]{valueY}[/] devices";

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.fontSize = 11;

    return () => {
      chart.dispose();
    };
  }, [testFailures, chartViewMode]);

  // Level 2 Pareto 80/20 Analysis Chart (Cumulative Defect Concentration)
  // No ScrollbarX to completely eliminate canvas resize vibration
  useLayoutEffect(() => {
    if (!testFailures || testFailures.length === 0 || chartViewMode !== "pareto" || !paretoChartRef.current) return;

    const chart = am4core.create(paretoChartRef.current, am4charts.XYChart);
    chart.logo.disabled = true;
    chart.padding(10, 15, 10, 35); // Generous left padding prevents label cut-off

    // Sort descending by failed count
    const sorted = [...testFailures].sort((a, b) => b.failedDevicesCount - a.failedDevicesCount);
    const totalFailures = sorted.reduce((sum, item) => sum + item.failedDevicesCount, 0);

    let runningSum = 0;
    chart.data = sorted.map((item) => {
      runningSum += item.failedDevicesCount;
      const cumulativePct = totalFailures > 0 ? Math.round((runningSum / totalFailures) * 100) : 0;
      const percentShare = totalFailures > 0 ? Math.round((item.failedDevicesCount / totalFailures) * 100) : 0;
      return {
        testId: item.testId,
        testName: item.testName,
        failed: item.failedDevicesCount,
        cumulativePct,
        percentShare,
      };
    });

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "testName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 25;
    categoryAxis.renderer.labels.template.rotation = -30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.labels.template.maxWidth = 160;
    categoryAxis.renderer.labels.template.truncate = false;
    categoryAxis.renderer.labels.template.wrap = true;

    // Left Y Axis: Failure Counts
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Defect Count (Devices Failed)";
    valueAxis.title.fontSize = 11;

    // Right Y Axis: Cumulative Percentage
    const pctAxis = chart.yAxes.push(new am4charts.ValueAxis());
    pctAxis.renderer.opposite = true;
    pctAxis.min = 0;
    pctAxis.max = 100;
    pctAxis.strictMinMax = true;
    pctAxis.title.text = "Cumulative Defects (%)";
    pctAxis.title.fontSize = 11;
    pctAxis.renderer.grid.template.disabled = true;

    // 80% Pareto Cutoff Guide Line
    const pareto80Guide = pctAxis.axisRanges.create();
    pareto80Guide.value = 80;
    pareto80Guide.grid.stroke = am4core.color("#1976d2");
    pareto80Guide.grid.strokeWidth = 2;
    pareto80Guide.grid.strokeDasharray = "4,4";
    pareto80Guide.label.text = "80% Pareto Cutoff (Vital Few)";
    pareto80Guide.label.fill = am4core.color("#1976d2");
    pareto80Guide.label.fontSize = 11;

    // Bar Series: Failure Count
    const barSeries = chart.series.push(new am4charts.ColumnSeries());
    barSeries.dataFields.valueY = "failed";
    barSeries.dataFields.categoryX = "testName";
    barSeries.name = "Defect Count";
    barSeries.columns.template.fill = am4core.color("#d32f2f");
    barSeries.columns.template.stroke = am4core.color("#b71c1c");
    barSeries.columns.template.tooltipText =
      "[bold]{categoryX}[/]\nDefects: [bold]{valueY}[/] devices ({percentShare}% share)\nClick to inspect devices";
    barSeries.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    barSeries.columns.template.events.on("hit", (ev) => {
      const item = ev.target.dataItem?.dataContext;
      if (item) {
        handleSelectTest({ testId: item.testId, testName: item.testName });
      }
    });

    // Line Series: Cumulative Percentage Curve
    const lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "cumulativePct";
    lineSeries.dataFields.categoryX = "testName";
    lineSeries.yAxis = pctAxis;
    lineSeries.name = "Cumulative Defect %";
    lineSeries.stroke = am4core.color("#f57c00");
    lineSeries.strokeWidth = 3;

    const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 5;
    bullet.circle.fill = am4core.color("#f57c00");
    bullet.circle.stroke = am4core.color("#fff");
    bullet.circle.strokeWidth = 2;
    bullet.tooltipText = "Cumulative Defects: [bold]{valueY}%[/]";

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.fontSize = 11;

    return () => {
      chart.dispose();
    };
  }, [testFailures, chartViewMode]);

  // Fail-rate ranking (derived from existing testFailures — no extra API)
  useLayoutEffect(() => {
    if (!testFailures || testFailures.length === 0 || chartViewMode !== "rate" || !barChartRef.current) return;

    const chart = am4core.create(barChartRef.current, am4charts.XYChart);
    chart.logo.disabled = true;
    chart.padding(8, 16, 8, 10);

    const sorted = [...testFailures]
      .filter((t) => (t.failedDevicesCount || 0) > 0 || (t.failRate || 0) > 0)
      .sort((a, b) => (b.failRate || 0) - (a.failRate || 0));

    chart.data = (sorted.length ? sorted : [...testFailures]).map((t) => ({
      testId: t.testId,
      testName: t.testName,
      failRate: t.failRate || 0,
      failed: t.failedDevicesCount || 0,
    }));

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "testName";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 18;
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.labels.template.maxWidth = 150;
    categoryAxis.renderer.labels.template.truncate = true;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.title.text = "Fail Rate %";
    valueAxis.title.fontSize = 11;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "failRate";
    series.dataFields.categoryY = "testName";
    series.columns.template.fill = am4core.color("#ef6c00");
    series.columns.template.strokeOpacity = 0;
    series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}%[/] fail ({failed} devices)";
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.column.cornerRadiusTopRight = 4;
    series.columns.template.column.cornerRadiusBottomRight = 4;

    series.columns.template.events.on("hit", (ev) => {
      const item = ev.target.dataItem?.dataContext;
      if (item) {
        handleSelectTest({ testId: item.testId, testName: item.testName });
      }
    });

    return () => {
      chart.dispose();
    };
  }, [testFailures, chartViewMode]);

  function handleSelectTest(test) {
    setSelectedTest(test);
    setLoadingDevices(true);
    axiosInstanceIol("ateDrilldownDash/getFailedDevicesForTest", {
      params: {
        productId: selectedProduct,
        testId: test.testId,
        fromDate,
        toDate,
        isQa: isQa !== "" ? isQa : undefined,
      },
    })
      .then(({ data }) => {
        // Safety net: drop WRN* / registration_type=3 placeholders if any slip through
        const rows = (data || []).filter((d) => {
          if (d.registrationType === 3 || d.registrationNoType === 3) return false;
          const sn = String(d.serialNo || "").trim().toUpperCase();
          return !sn.startsWith("WRN");
        });
        setFailedDevices(rows);
        scrollToRef(level3SectionRef);
      })
      .catch((err) => console.error("Error loading failed devices", err))
      .finally(() => setLoadingDevices(false));
  }

  function handleOpenSpecTrend(param) {
    setTrendModalSpec({
      specId: param.specId,
      paramName: param.paramName,
      paramCode: param.paramCode,
      tyClauseNo: param.tyClauseNo,
      testName: param.testName || selectedTest?.testName,
      testId: param.testId || selectedTest?.testId,
    });
    setTrendModalOpen(true);
  }

  // Export Quality Audit Failure Report to CSV
  const handleExportCsv = () => {
    if (!failedDevices || failedDevices.length === 0) {
      toast.info("No failure records to export");
      return;
    }

    const headers = [
      "Serial / Reg No",
      "Date Failed",
      "Round",
      "Stage",
      "Inspector",
      "Test Name",
      "Spec ID",
      "Parameter Name",
      "Clause / Code",
      "Min Limit",
      "Max Limit",
      "Unit",
      "Observed Value",
      "Status",
      "Failure Reason",
      "Remarks",
    ];

    const rows = [];
    failedDevices.forEach((dev) => {
      if (dev.failedParameters && dev.failedParameters.length > 0) {
        dev.failedParameters.forEach((p) => {
          rows.push([
            dev.serialNo,
            dev.submittedDate || "",
            dev.roundId || 1,
            dev.isQa ? "QA" : "QC",
            `"${(dev.submittedByName || "").replace(/"/g, '""')}"`,
            `"${(p.testName || selectedTest?.testName || "").replace(/"/g, '""')}"`,
            p.specId,
            `"${(p.paramName || "").replace(/"/g, '""')}"`,
            `"${(p.tyClauseNo || p.paramCode || "").replace(/"/g, '""')}"`,
            p.minLimit != null ? p.minLimit : "",
            p.maxLimit != null ? p.maxLimit : "",
            p.unit || "",
            `"${(p.obsValue || "").replace(/"/g, '""')}"`,
            p.paramStatus || "Fail",
            `"${(p.failureReason || "").replace(/"/g, '""')}"`,
            `"${(p.remarks || "").replace(/"/g, '""')}"`,
          ]);
        });
      } else {
        rows.push([
          dev.serialNo,
          dev.submittedDate || "",
          dev.roundId || 1,
          dev.isQa ? "QA" : "QC",
          `"${(dev.submittedByName || "").replace(/"/g, '""')}"`,
          `"${(selectedTest?.testName || "").replace(/"/g, '""')}"`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "Fail",
          "Inspection Round Failure",
          "",
        ]);
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ATE_Quality_Failures_${selectedTest?.testId || "Report"}_${getTodayDate()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Quality Failure Report exported successfully!");
  };

  const getQualityHealthBadge = (passRate) => {
    if (passRate >= 90) {
      return { label: "Excellent (Within Spec)", color: "#2e7d32", bgColor: "#e8f5e9" };
    }
    if (passRate >= 75) {
      return { label: "Stable (Minor Rework Needed)", color: "#f57c00", bgColor: "#fff3e0" };
    }
    return { label: "At Risk (Action Required)", color: "#d32f2f", bgColor: "#ffebee" };
  };

  const stageOptions = [
    { value: "", label: "All" },
    { value: "false", label: "QC" },
    { value: "true", label: "QA" },
  ];

  const healthBadge = overview ? getQualityHealthBadge(overview.passRate) : null;
  const chartTitle =
    chartViewMode === "pareto"
      ? "Pareto — Vital Few Tests (80/20)"
      : chartViewMode === "rate"
      ? "Fail Rate by Test"
      : "Level 2 · Failures Grouped by Test";

  const topFailingTest = [...(testFailures || [])]
    .filter((t) => (t.failedDevicesCount || 0) > 0)
    .sort((a, b) => (b.failedDevicesCount || 0) - (a.failedDevicesCount || 0))[0];

  const topFailingParams = (() => {
    if (!failedDevices || failedDevices.length === 0) return [];
    const counts = {};
    failedDevices.forEach((dev) => {
      (dev.failedParameters || []).forEach((p) => {
        const key = p.paramName || p.paramCode || `Spec ${p.specId}`;
        if (!counts[key]) {
          counts[key] = { name: key, count: 0, specId: p.specId, sample: p };
        }
        counts[key].count += 1;
      });
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  })();

  const renderKpi = ({ label, value, meta, color, icon, accent, onClick }) => (
    <Card
      className={`${classes.kpiCard} ${onClick ? classes.kpiClickable : ""}`}
      onClick={onClick}
      elevation={0}
    >
      <div className={classes.kpiAccent} style={{ backgroundColor: accent }} />
      <CardContent style={{ padding: "12px 14px 12px 16px" }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box minWidth={0}>
            <Typography className={classes.filterLabel}>{label}</Typography>
            <Typography className={classes.kpiValue} style={{ color }}>
              {value}
            </Typography>
            {meta && <Typography className={classes.kpiMeta}>{meta}</Typography>}
          </Box>
          <div className={classes.kpiIconWrap} style={{ backgroundColor: `${accent}14` }}>
            {icon}
          </div>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className={classes.root}>
      <div className={classes.pageHeader}>
        <Box>
          <Typography variant="h5" className={classes.headerTitle}>
            ATE Quality & Failure Drilldown Analytics
          </Typography>
          <Typography className={classes.headerSubtitle}>
            End-to-end quality inspection yield, failure grouping by test, Pareto 80/20 root cause, and parameter SPC trends.
          </Typography>
        </Box>
        {healthBadge && (
          <Chip
            icon={<VerifiedUser style={{ color: healthBadge.color, fontSize: 18 }} />}
            label={`${healthBadge.label} · ${overview.passRate}% yield`}
            style={{
              backgroundColor: healthBadge.bgColor,
              color: healthBadge.color,
              fontWeight: 600,
              height: 30,
              letterSpacing: "normal",
              border: `1px solid ${healthBadge.color}33`,
            }}
          />
        )}
      </div>

      {/* Single-row filter bar — From / To / Stage intentionally larger */}
      <div className={classes.filterBar}>
        <div className={`${classes.filterField} ${classes.productField}`}>
          <span className={classes.filterLabel}>Product — EP code</span>
          <Autocomplete
            id="product-ep-code-search"
            options={products}
            getOptionLabel={(option) => {
              if (!option) return "";
              return `${option.cleanedLabel || option.productNameEpCode || ""}`;
            }}
            filterOptions={(options, { inputValue }) => {
              const query = inputValue.toLowerCase().trim();
              if (!query) return options;
              return options.filter((opt) => {
                const matchText = `${opt.cleanedLabel} ${opt.productId} ${opt.partNumberId}`.toLowerCase();
                return matchText.includes(query);
              });
            }}
            value={products.find((p) => p.productId === selectedProduct) || selectedProductObj || null}
            onChange={(event, newValue) => {
              setSelectedProductObj(newValue);
              setSelectedProduct(newValue ? newValue.productId : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search product or EP code…"
                InputProps={{
                  ...params.InputProps,
                  style: {
                    ...(params.InputProps?.style || {}),
                    height: 40,
                    fontSize: 14,
                    backgroundColor: "#fff",
                    borderRadius: 6,
                    letterSpacing: "normal",
                  },
                }}
              />
            )}
          />
        </div>

        <div className={`${classes.filterField} ${classes.dateField}`}>
          <span className={classes.filterLabel}>From date</span>
          <TextField
            type="date"
            fullWidth
            variant="outlined"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputProps={{
              style: {
                height: 40,
                fontSize: 14,
                backgroundColor: "#fff",
                borderRadius: 6,
                letterSpacing: "normal",
              },
            }}
            inputProps={{ style: { paddingTop: 10, paddingBottom: 10, letterSpacing: "normal" } }}
          />
        </div>

        <div className={`${classes.filterField} ${classes.dateField}`}>
          <span className={classes.filterLabel}>To date</span>
          <TextField
            type="date"
            fullWidth
            variant="outlined"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputProps={{
              style: {
                height: 40,
                fontSize: 14,
                backgroundColor: "#fff",
                borderRadius: 6,
                letterSpacing: "normal",
              },
            }}
            inputProps={{ style: { paddingTop: 10, paddingBottom: 10, letterSpacing: "normal" } }}
          />
        </div>

        <div className={`${classes.filterField} ${classes.stageField}`}>
          <span className={classes.filterLabel}>Inspection stage</span>
          <div className={classes.stageShell} role="group" aria-label="Inspection stage">
            {stageOptions.map((opt) => (
              <Chip
                key={opt.label}
                label={opt.label}
                clickable
                onClick={() => handleStageChange(opt.value)}
                className={`${classes.stageChip} ${
                  isQa === opt.value ? classes.stageChipActive : classes.stageChipIdle
                }`}
              />
            ))}
          </div>
        </div>

        <div className={classes.filterField} style={{ marginLeft: "auto" }}>
          <span className={classes.filterLabel} style={{ opacity: 0 }}>
            Run
          </span>
          <Button
            variant="contained"
            color="primary"
            className={classes.analyzeBtn}
            startIcon={<FilterList />}
            onClick={() => handleSearch()}
          >
            Analyze
          </Button>
        </div>
      </div>

      {(loadingOverview || loadingTests) && (
        <Fade in timeout={250}>
          <LinearProgress style={{ marginBottom: 12, borderRadius: 4, height: 3 }} />
        </Fade>
      )}

      {overview && (
        <Fade in timeout={350}>
          <Box mb={1.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                {renderKpi({
                  label: "Total devices tested",
                  value: overview.totalTestedDevices,
                  meta:
                    overview.totalTestsConducted != null
                      ? `${overview.totalTestsConducted} inspection rounds`
                      : "Unique serial / registration units",
                  color: theme.palette.primary.main,
                  accent: theme.palette.primary.main,
                  icon: <Devices style={{ color: theme.palette.primary.main, fontSize: 22 }} />,
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderKpi({
                  label: "Passed devices",
                  value: overview.passedDevices,
                  meta: `Pass rate ${overview.passRate}%`,
                  color: "#2e7d32",
                  accent: "#2e7d32",
                  icon: <CheckCircle style={{ color: "#2e7d32", fontSize: 22 }} />,
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderKpi({
                  label: "Failed devices",
                  value: overview.failedDevices,
                  meta: `Fail rate ${overview.failRate}% · click to drill down`,
                  color: "#d32f2f",
                  accent: "#d32f2f",
                  icon: <Cancel style={{ color: "#d32f2f", fontSize: 22 }} />,
                  onClick: () => scrollToRef(level2SectionRef),
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderKpi({
                  label: "Quality yield index",
                  value: `${overview.passRate}%`,
                  meta: "Overall process conformance",
                  color: "#ef6c00",
                  accent: "#ff9800",
                  icon: <Speed style={{ color: "#ef6c00", fontSize: 22 }} />,
                })}
              </Grid>
            </Grid>

            {(topFailingTest || (testFailures && testFailures.length > 0)) && (
              <div className={classes.insightStrip} style={{ marginTop: 12 }}>
                <Assessment style={{ color: theme.palette.primary.main, fontSize: 18 }} />
                <Typography variant="body2" style={{ fontWeight: 700, color: "#334155" }}>
                  {testFailures.filter((t) => (t.failedDevicesCount || 0) > 0).length} test(s) with failures
                </Typography>
                {topFailingTest && (
                  <>
                    <Divider orientation="vertical" flexItem style={{ margin: "0 4px" }} />
                    <Typography variant="body2" color="textSecondary">
                      Highest impact:&nbsp;
                      <strong style={{ color: "#b71c1c" }}>{topFailingTest.testName}</strong>
                      &nbsp;({topFailingTest.failedDevicesCount} failed · {topFailingTest.failRate}%)
                    </Typography>
                    <Button
                      size="small"
                      color="secondary"
                      style={{ textTransform: "none", fontWeight: 700, marginLeft: "auto" }}
                      onClick={() => handleSelectTest(topFailingTest)}
                    >
                      Open devices
                    </Button>
                  </>
                )}
              </div>
            )}
          </Box>
        </Fade>
      )}

      {overview && (
        <Fade in timeout={400}>
          <Grid container spacing={1} alignItems="stretch">
            <Grid item xs={12} md={4} style={{ display: "flex" }}>
              <Card className={classes.chartCard} style={{ width: "100%" }}>
                <CardHeader
                  className={classes.chartHeader}
                  avatar={<PieChartIcon color="primary" style={{ fontSize: 20 }} />}
                  title={<Typography variant="subtitle2" style={{ fontWeight: 700 }}>Pass vs Fail Distribution</Typography>}
                />
                <Divider />
                <CardContent style={{ flex: 1, padding: "8px 12px 12px" }}>
                  {(Number(overview.passedDevices) || 0) + (Number(overview.failedDevices) || 0) <= 0 ? (
                    <Box
                      className={classes.donutContainer}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      <PieChartIcon style={{ fontSize: 36, color: "#cfd8dc", marginBottom: 8 }} />
                      <Typography variant="body2" color="textSecondary" align="center" style={{ fontWeight: 600 }}>
                        No devices tested for this selection
                      </Typography>
                      <Typography variant="caption" color="textSecondary" align="center">
                        Try another product, date range, or stage
                      </Typography>
                    </Box>
                  ) : (
                    <div ref={donutRef} className={classes.donutContainer} />
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8} style={{ display: "flex" }}>
              <Card className={classes.chartCard} ref={level2SectionRef} style={{ width: "100%" }}>
                <CardHeader
                  className={classes.chartHeader}
                  avatar={
                    chartViewMode === "pareto" ? (
                      <TimelineIcon style={{ color: "#f57c00", fontSize: 20 }} />
                    ) : chartViewMode === "rate" ? (
                      <Assessment style={{ color: "#ef6c00", fontSize: 20 }} />
                    ) : (
                      <BarChartIcon style={{ color: "#d32f2f", fontSize: 20 }} />
                    )
                  }
                  action={
                    <ButtonGroup size="small" variant="outlined" className={classes.viewToggle} style={{ marginRight: 4 }}>
                      <Button
                        variant={chartViewMode === "bar" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setChartViewMode("bar")}
                      >
                        Compare
                      </Button>
                      <Button
                        variant={chartViewMode === "pareto" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setChartViewMode("pareto")}
                      >
                        Pareto
                      </Button>
                      <Button
                        variant={chartViewMode === "rate" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setChartViewMode("rate")}
                      >
                        Fail %
                      </Button>
                    </ButtonGroup>
                  }
                  title={<Typography variant="subtitle2" style={{ fontWeight: 700 }}>{chartTitle}</Typography>}
                />
                <Divider />
                <CardContent style={{ flex: 1, padding: "8px 12px 12px" }}>
                  {testFailures.length > 0 ? (
                    chartViewMode === "pareto" ? (
                      <div ref={paretoChartRef} className={classes.paretoChartContainer} />
                    ) : (
                      <div ref={barChartRef} className={classes.barChartContainer} />
                    )
                  ) : (
                    <Typography color="textSecondary" align="center" style={{ padding: 48, fontSize: 13 }}>
                      No failures for this selection.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}

      {testFailures.length > 0 && (
        <Fade in timeout={450}>
          <Box mt={1.5} mb={1.5}>
            <Card className={classes.chartCard}>
              <CardHeader
                className={classes.chartHeader}
                title={<Typography variant="subtitle2" style={{ fontWeight: 700 }}>Test Summary</Typography>}
              />
              <Divider />
              <TableContainer>
                <Table size="small">
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell>Test</TableCell>
                      <TableCell align="center">Tested</TableCell>
                      <TableCell align="center">Failed</TableCell>
                      <TableCell align="center">Passed</TableCell>
                      <TableCell align="center">Fail %</TableCell>
                      <TableCell align="center" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testFailures.map((t) => (
                      <TableRow
                        key={t.testId}
                        className={classes.clickableRow}
                        selected={selectedTest?.testId === t.testId}
                        onClick={() => handleSelectTest(t)}
                      >
                        <TableCell style={{ fontWeight: 600, fontSize: 13 }}>{t.testName}</TableCell>
                        <TableCell align="center">{t.totalTestedDevices}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={t.failedDevicesCount}
                            size="small"
                            className={t.failedDevicesCount > 0 ? classes.badgeFail : classes.badgePass}
                            style={{ height: 22 }}
                          />
                        </TableCell>
                        <TableCell align="center">{t.passedDevicesCount}</TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            style={{ fontWeight: 700, color: t.failRate > 0 ? "#d32f2f" : "#2e7d32" }}
                          >
                            {t.failRate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant={selectedTest?.testId === t.testId ? "contained" : "text"}
                            size="small"
                            color="secondary"
                            style={{ textTransform: "none", fontWeight: 600 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTest(t);
                            }}
                          >
                            {selectedTest?.testId === t.testId ? "Open" : "Devices"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Fade>
      )}

      {selectedTest && (
        <Fade in timeout={400}>
          <Box mb={2} ref={level3SectionRef}>
            <Card className={classes.chartCard} style={{ border: "1px solid #ffcdd2" }}>
              <CardHeader
                className={classes.chartHeader}
                style={{ backgroundColor: "#fff5f5" }}
                title={
                  <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" style={{ gap: 8 }}>
                    <Typography variant="subtitle2" style={{ fontWeight: 700, color: "#b71c1c" }}>
                      Failed devices · {selectedTest.testName}
                      <Typography component="span" variant="caption" color="textSecondary" style={{ marginLeft: 8, fontWeight: 600 }}>
                        {failedDevices.length} round(s)
                      </Typography>
                    </Typography>
                    <Box display="flex" style={{ gap: 6 }}>
                      <Button
                        variant="contained"
                        size="small"
                        style={{ backgroundColor: "#2e7d32", color: "#fff", fontWeight: 700, textTransform: "none" }}
                        startIcon={<GetApp />}
                        onClick={handleExportCsv}
                      >
                        Export
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        style={{ textTransform: "none" }}
                        onClick={() => {
                          setSelectedTest(null);
                          setFailedDevices([]);
                        }}
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                }
              />

              {loadingDevices && <LinearProgress />}

              {!loadingDevices && topFailingParams.length > 0 && (
                <div className={classes.paramInsightCard}>
                  <Typography variant="caption" style={{ fontWeight: 600, color: "#b71c1c", letterSpacing: "normal" }}>
                    Top failing parameters (this test)
                  </Typography>
                  <Box display="flex" flexWrap="wrap" style={{ gap: 8, marginTop: 8 }}>
                    {topFailingParams.map((p) => (
                      <Chip
                        key={p.name}
                        label={`${p.name} · ${p.count}`}
                        size="small"
                        clickable
                        onClick={() => handleOpenSpecTrend(p.sample)}
                        className={classes.badgeFail}
                        style={{ height: 26, fontWeight: 700 }}
                      />
                    ))}
                  </Box>
                </div>
              )}

              <TableContainer>
                <Table size="small">
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell style={{ width: 36 }} />
                      <TableCell>Serial / Reg</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Round</TableCell>
                      <TableCell align="center">Stage</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Inspector</TableCell>
                      <TableCell align="center">Specs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failedDevices.length === 0 && !loadingDevices && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" style={{ padding: 20 }}>
                          <Typography color="textSecondary" variant="body2">
                            No failed devices for this test.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {failedDevices.map((dev, idx) => (
                      <DeviceRow
                        key={dev.inspRoundId || `${dev.serialNo}-${idx}`}
                        device={dev}
                        classes={classes}
                        theme={theme}
                        onOpenSpecTrend={handleOpenSpecTrend}
                        defaultOpen={idx === 0}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Fade>
      )}

      <SpecTrendModal
        open={trendModalOpen}
        onClose={() => setTrendModalOpen(false)}
        specInfo={trendModalSpec}
        filterParams={{
          selectedProduct,
          fromDate,
          toDate,
          isQa,
        }}
      />
    </div>
  );
}

// Collapsible Device Row — first row opens by default when the Level-3 table loads
function DeviceRow({ device, classes, theme, onOpenSpecTrend, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen, device.inspRoundId, device.serialNo]);

  return (
    <>
      <TableRow
        className={classes.clickableRow}
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: open ? "#fff5f5" : "inherit" }}
      >
        <TableCell>
          <IconButton size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell style={{ fontWeight: 700, color: theme.palette.primary.main }}>{device.serialNo}</TableCell>
        <TableCell>{device.submittedDate || "—"}</TableCell>
        <TableCell align="center">{device.roundId || 1}</TableCell>
        <TableCell align="center">
          <Chip
            label={device.isQa ? "QA" : "QC"}
            size="small"
            style={{
              height: 22,
              backgroundColor: device.isQa ? "#e3f2fd" : "#fff8e1",
              color: device.isQa ? "#1565c0" : "#f57f17",
              fontWeight: 700,
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Chip label={device.roundStatus || "Fail"} size="small" className={classes.badgeFail} style={{ height: 22 }} />
        </TableCell>
        <TableCell align="center">{device.submittedByName || "—"}</TableCell>
        <TableCell align="center">
          <Chip
            label={device.failedParamCount || device.failedParameters?.length || 0}
            size="small"
            color="secondary"
            style={{ height: 22 }}
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout={280} unmountOnExit>
            <Box margin={1.5}>
              <Typography variant="caption" style={{ fontWeight: 700, color: "#b71c1c", display: "block", marginBottom: 6 }}>
                Failed parameters · {device.serialNo}
              </Typography>
              <Table size="small" className={classes.subTable}>
                <TableHead style={{ backgroundColor: "#e2e8f0" }}>
                  <TableRow>
                    <TableCell>Spec</TableCell>
                    <TableCell>Parameter</TableCell>
                    <TableCell>Clause</TableCell>
                    <TableCell align="center">Limits</TableCell>
                    <TableCell align="center">Observed</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell align="center">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(!device.failedParameters || device.failedParameters.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="caption" color="textSecondary">
                          No parameter detail for this round.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {device.failedParameters?.map((param) => (
                    <TableRow key={param.tvne1paId || param.specId} hover>
                      <TableCell>{param.specId}</TableCell>
                      <TableCell style={{ fontWeight: 700 }}>{param.paramName}</TableCell>
                      <TableCell>{param.tyClauseNo || param.paramCode || "—"}</TableCell>
                      <TableCell align="center">
                        <Typography variant="caption" style={{ fontWeight: 600 }}>
                          [{param.minLimit != null ? param.minLimit : "−∞"} –{" "}
                          {param.maxLimit != null ? param.maxLimit : "+∞"} {param.unit || ""}]
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" style={{ fontWeight: 800, color: "#d32f2f" }}>
                          {param.obsValue || "—"} {param.unit || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" style={{ color: "#c62828", fontWeight: 600 }}>
                          {param.failureReason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{param.remarks || "—"}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Spec trend">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onOpenSpecTrend(param)}
                            style={{ backgroundColor: "#e3f2fd" }}
                          >
                            <ShowChart color="primary" fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
