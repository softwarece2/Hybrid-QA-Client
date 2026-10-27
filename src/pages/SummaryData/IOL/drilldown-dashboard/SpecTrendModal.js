import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  makeStyles,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { CheckCircle, Cancel, Timeline, Assessment, Info } from "@material-ui/icons";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";

am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    overflowY: "scroll", // Keeps scrollbar gutter stable, preventing infinite width resize oscillation (vibration)
    overflowX: "hidden",
    padding: "16px 24px",
  },
  chartContainer: {
    width: "100%",
    height: "320px",
    minHeight: "320px",
    maxHeight: "320px",
    marginTop: 8,
    overflow: "hidden",
  },
  pieContainer: {
    width: "100%",
    height: "250px",
    minHeight: "250px",
    maxHeight: "250px",
    overflow: "hidden",
  },
  barContainer: {
    width: "100%",
    height: "250px",
    minHeight: "250px",
    maxHeight: "250px",
    overflow: "hidden",
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBlock: 12,
  },
  chip: {
    fontWeight: 600,
    fontSize: 12,
  },
  logSection: {
    marginTop: 20,
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  logSectionTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#263238",
    padding: "12px 14px 10px",
    margin: 0,
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#fafafa",
  },
  tableContainer: {
    maxHeight: 240,
  },
  tableHeader: {
    // stickyHeader uses .MuiTableCell-stickyHeader (defaults to white bg / inherited color)
    "& th, & .MuiTableCell-stickyHeader, & .MuiTableCell-head": {
      fontWeight: 700,
      fontSize: 12,
      color: "#ffffff !important",
      backgroundColor: `${theme.palette.primary.main} !important`,
    },
  },
  badgePass: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: 600,
  },
  badgeFail: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    fontWeight: 600,
  },
  infoBanner: {
    padding: "10px 14px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
}));

export default function SpecTrendModal({ open, onClose, specInfo, filterParams }) {
  const classes = useStyles();
  const theme = useTheme();

  const chartRef = useRef(null);
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState(null);
  const [dialogReady, setDialogReady] = useState(false);

  // Fetch trend data whenever modal opens
  useEffect(() => {
    if (!open || !specInfo?.specId) return;

    setLoading(true);
    axiosInstanceIol("ateDrilldownDash/getSpecTrend", {
      params: {
        specId: specInfo.specId,
        productId: filterParams?.selectedProduct,
        testId: specInfo.testId,
        fromDate: filterParams?.fromDate,
        toDate: filterParams?.toDate,
        isQa: filterParams?.isQa !== "" ? filterParams?.isQa : undefined,
      },
    })
      .then(({ data }) => {
        setTrendData(data);
      })
      .catch((err) => {
        console.error("Error loading spec trend data", err);
      })
      .finally(() => setLoading(false));
  }, [open, specInfo, filterParams]);

  // Hide WITHOUT_REGISTRATION_NUMBER (type=3) placeholders like WRN0001 — backend-only test serials
  const visiblePoints = useMemo(() => {
    const points = trendData?.dataPoints || [];
    return points.filter((d) => {
      if (d.registrationType === 3 || d.registrationNoType === 3) return false;
      const sn = String(d.serialNo || "").trim().toUpperCase();
      if (sn.startsWith("WRN")) return false;
      return true;
    });
  }, [trendData]);

  const visiblePassCount = useMemo(
    () =>
      visiblePoints.filter(
        (d) => (d.status || "").toLowerCase().includes("pass") || d.status === "1"
      ).length,
    [visiblePoints]
  );
  const visibleFailCount = visiblePoints.length - visiblePassCount;
  const visiblePassRate =
    visiblePoints.length > 0 ? Math.round((visiblePassCount * 100) / visiblePoints.length) : 0;

  // Determine if this specification has numeric observation values or discrete/attributive values (e.g. "ok" / "not ok")
  const isAttributive = useMemo(() => {
    if (!visiblePoints.length) return false;
    const hasNumeric = visiblePoints.some(
      (d) => d.value !== null && d.value !== undefined && !isNaN(d.value)
    );
    return !hasNumeric;
  }, [visiblePoints]);

  // Case 1: Numeric Continuous SPC Chart (USL, LSL, UCL, LCL, Mean, Cp, Cpk)
  // Only mounts when dialog animation is completely ready (prevents resize vibration)
  useLayoutEffect(() => {
    if (!open || !dialogReady || !trendData || isAttributive || !chartRef.current || !visiblePoints.length) return;

    const chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.background.fill = am4core.color("#fff");
    chart.scrollbarX = new am4core.Scrollbar();
    chart.logo.disabled = true;
    chart.padding(10, 15, 15, 20);

    chart.data = visiblePoints.map((d) => ({
      device: d.serialNo || "N/A",
      value: d.value,
      rawVal: d.rawObsValue || d.value,
      status: d.status,
      date: d.submittedDate,
      round: d.roundId || 1,
    }));

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "device";
    categoryAxis.renderer.minGridDistance = 25;
    categoryAxis.renderer.labels.template.rotation = -40;
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `Observation (${trendData.unit || "Value"})`;
    valueAxis.title.fontSize = 12;

    // USL line
    if (trendData.maxLimit != null) {
      const maxRange = valueAxis.axisRanges.create();
      maxRange.value = trendData.maxLimit;
      maxRange.grid.stroke = am4core.color("#d32f2f");
      maxRange.grid.strokeWidth = 2;
      maxRange.grid.strokeDasharray = "4,4";
      maxRange.label.text = `USL (${trendData.maxLimit})`;
      maxRange.label.fill = am4core.color("#d32f2f");
    }

    // LSL line
    if (trendData.minLimit != null) {
      const minRange = valueAxis.axisRanges.create();
      minRange.value = trendData.minLimit;
      minRange.grid.stroke = am4core.color("#d32f2f");
      minRange.grid.strokeWidth = 2;
      minRange.grid.strokeDasharray = "4,4";
      minRange.label.text = `LSL (${trendData.minLimit})`;
      minRange.label.fill = am4core.color("#d32f2f");
    }

    // UCL line
    if (trendData.ucl != null) {
      const uclRange = valueAxis.axisRanges.create();
      uclRange.value = trendData.ucl;
      uclRange.grid.stroke = am4core.color("#f57c00");
      uclRange.grid.strokeWidth = 1.5;
      uclRange.grid.strokeDasharray = "2,2";
      uclRange.label.text = `UCL (${trendData.ucl})`;
      uclRange.label.fill = am4core.color("#f57c00");
    }

    // LCL line
    if (trendData.lcl != null) {
      const lclRange = valueAxis.axisRanges.create();
      lclRange.value = trendData.lcl;
      lclRange.grid.stroke = am4core.color("#f57c00");
      lclRange.grid.strokeWidth = 1.5;
      lclRange.grid.strokeDasharray = "2,2";
      lclRange.label.text = `LCL (${trendData.lcl})`;
      lclRange.label.fill = am4core.color("#f57c00");
    }

    // Mean line
    if (trendData.mean != null) {
      const meanRange = valueAxis.axisRanges.create();
      meanRange.value = trendData.mean;
      meanRange.grid.stroke = am4core.color("#1976d2");
      meanRange.grid.strokeWidth = 1.5;
      meanRange.label.text = `Mean (${trendData.mean})`;
      meanRange.label.fill = am4core.color("#1976d2");
    }

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "device";
    series.name = "Observed Value";
    series.stroke = am4core.color("#2e7d32");
    series.strokeWidth = 2;

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 5;
    bullet.circle.stroke = am4core.color("#fff");
    bullet.circle.strokeWidth = 2;

    bullet.adapter.add("fill", (fill, target) => {
      if (target.dataItem && target.dataItem.dataContext) {
        const item = target.dataItem.dataContext;
        if (item.status && item.status.toLowerCase().includes("fail")) {
          return am4core.color("#d32f2f");
        }
      }
      return am4core.color("#2e7d32");
    });

    bullet.tooltipText = "{device} (R{round}): [bold]{value}[/] {status}\nDate: {date}";

    chart.cursor = new am4charts.XYCursor();

    return () => {
      chart.dispose();
    };
  }, [open, dialogReady, trendData, isAttributive, visiblePoints]);

  // Case 2: Attributive / Qualitative Visualizations (Pass vs Fail Donut + Conformance Bar Strip)
  // Only mounts when dialog animation is completely ready (prevents resize vibration)
  useLayoutEffect(() => {
    if (!open || !dialogReady || !trendData || !isAttributive || !visiblePoints.length) return;

    let pieChart = null;
    let barChart = null;

    // 1. Donut breakdown: Pass vs Fail
    if (pieRef.current) {
      pieChart = am4core.create(pieRef.current, am4charts.PieChart);
      pieChart.innerRadius = am4core.percent(50);
      pieChart.logo.disabled = true;
      pieChart.padding(10, 25, 10, 25); // Ample padding prevents text from being cut off on edges

      pieChart.data = [
        { status: "Conforming (Pass)", count: visiblePassCount, color: am4core.color("#2e7d32") },
        { status: "Defect (Fail)", count: visibleFailCount, color: am4core.color("#d32f2f") },
      ];

      const pieSeries = pieChart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "status";
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.slices.template.tooltipText = "{category}: [bold]{value}[/] devices ({value.percent.formatNumber('#.0')}%)";
      pieSeries.alignLabels = false; // Prevents outer label clipping
      pieSeries.labels.template.fontSize = 11;
      pieSeries.labels.template.text = "{category}: {value.percent.formatNumber('#.0')}%";
      pieSeries.ticks.template.disabled = true;

      pieChart.legend = new am4charts.Legend();
      pieChart.legend.position = "bottom";
      pieChart.legend.fontSize = 11;
    }

    // 2. Device Observation Status Strip Chart (No Scrollbar to prevent layout vibration)
    if (barRef.current) {
      barChart = am4core.create(barRef.current, am4charts.XYChart);
      barChart.logo.disabled = true;
      // Extra top padding so "ok" / "not ok" labels above columns stay fully visible
      barChart.padding(28, 15, 15, 20);

      barChart.data = visiblePoints.map((d) => {
        const isPass = (d.status || "").toLowerCase().includes("pass") || d.status === "1";
        return {
          device: d.serialNo || "N/A",
          statusHeight: 1,
          rawObs: d.rawObsValue || (isPass ? "ok" : "not ok"),
          status: isPass ? "Pass" : "Fail",
          color: isPass ? am4core.color("#2e7d32") : am4core.color("#d32f2f"),
          date: d.submittedDate || "N/A",
          round: d.roundId || 1,
        };
      });

      const catAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
      catAxis.dataFields.category = "device";
      catAxis.renderer.minGridDistance = 25;
      catAxis.renderer.labels.template.rotation = -35;
      catAxis.renderer.labels.template.fontSize = 11;
      catAxis.renderer.labels.template.horizontalCenter = "right";
      catAxis.renderer.labels.template.verticalCenter = "middle";

      const valAxis = barChart.yAxes.push(new am4charts.ValueAxis());
      valAxis.min = 0;
      valAxis.max = 1.55;
      valAxis.strictMinMax = true;
      valAxis.renderer.labels.template.disabled = true;
      valAxis.title.text = "Visual Inspection Conformance";
      valAxis.title.fontSize = 11;

      const colSeries = barChart.series.push(new am4charts.ColumnSeries());
      colSeries.dataFields.valueY = "statusHeight";
      colSeries.dataFields.categoryX = "device";
      colSeries.columns.template.propertyFields.fill = "color";
      colSeries.columns.template.propertyFields.stroke = "color";
      colSeries.columns.template.tooltipText =
        "Device: [bold]{device}[/]\nObserved: [bold]{rawObs}[/]\nStatus: {status}\nDate: {date} (Round {round})";
      colSeries.columns.template.width = am4core.percent(55);

      // Place observed value ABOVE the bar (not centered inside it)
      const labelBullet = colSeries.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{rawObs}";
      labelBullet.label.fontSize = 11;
      labelBullet.label.fontWeight = "700";
      labelBullet.label.fill = am4core.color("#263238");
      labelBullet.label.verticalCenter = "bottom";
      labelBullet.label.dy = -6;
      labelBullet.locationY = 1;
    }

    return () => {
      if (pieChart) pieChart.dispose();
      if (barChart) barChart.dispose();
    };
  }, [open, dialogReady, trendData, isAttributive, visiblePoints, visiblePassCount, visibleFailCount]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionProps={{
        onEntered: () => setDialogReady(true),
        onExited: () => setDialogReady(false),
      }}
    >
      <DialogTitle style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #e0e0e0" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" style={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Parameter Analytics & Trend: {specInfo?.paramName || trendData?.paramName || "Specification"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Clause: <strong>{specInfo?.tyClauseNo || "N/A"}</strong> | Code:{" "}
              <strong>{specInfo?.paramCode || "N/A"}</strong> | Test:{" "}
              <strong>{specInfo?.testName || "Initial Test"}</strong>
              {!isAttributive && (
                <span>
                  {" "}
                  | Limits: [
                  {trendData?.minLimit != null ? trendData.minLimit : "-∞"} to{" "}
                  {trendData?.maxLimit != null ? trendData.maxLimit : "+∞"} {trendData?.unit || ""}]
                </span>
              )}
            </Typography>
          </Box>
          <Chip
            icon={isAttributive ? <Assessment /> : <Timeline />}
            label={isAttributive ? "Attributive / Qualitative Spec" : "Variable / Measurement Spec"}
            style={{
              backgroundColor: isAttributive ? "#e0f2fe" : "#e8f5e9",
              color: isAttributive ? "#0284c7" : "#2e7d32",
              fontWeight: 700,
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers className={classes.dialogContent}>
        {loading && <LinearProgress style={{ marginBottom: 12 }} />}

        {trendData && (
          <>
            {/* KPI Summary Chips (excludes WRN / registration_type=3 placeholders) */}
            <Box className={classes.chipContainer}>
              <Chip
                label={`Total Inspected: ${visiblePoints.length}`}
                variant="outlined"
                color="primary"
                className={classes.chip}
              />
              <Chip
                icon={<CheckCircle style={{ color: "#2e7d32" }} />}
                label={`Conforming (Pass): ${visiblePassCount} (${visiblePassRate}%)`}
                style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}
                className={classes.chip}
              />
              <Chip
                icon={<Cancel style={{ color: "#c62828" }} />}
                label={`Defects (Fail): ${visibleFailCount} (${visiblePoints.length ? 100 - visiblePassRate : 0}%)`}
                style={{ backgroundColor: "#ffebee", color: "#c62828" }}
                className={classes.chip}
              />

              {/* Statistical Process Control (SPC) chips for numeric variables */}
              {!isAttributive && (
                <>
                  {trendData.mean != null && (
                    <Chip label={`Process Mean (μ): ${trendData.mean}`} variant="outlined" className={classes.chip} />
                  )}
                  {trendData.stdDev != null && (
                    <Chip label={`StdDev (σ): ${trendData.stdDev}`} variant="outlined" className={classes.chip} />
                  )}
                  {trendData.median != null && (
                    <Chip label={`Median: ${trendData.median}`} variant="outlined" className={classes.chip} />
                  )}
                  {trendData.cp != null && (
                    <Chip
                      label={`Cp: ${trendData.cp}`}
                      style={{
                        backgroundColor: trendData.cp >= 1.33 ? "#e8f5e9" : "#fff3e0",
                        color: trendData.cp >= 1.33 ? "#2e7d32" : "#e65100",
                        fontWeight: 700,
                      }}
                      className={classes.chip}
                    />
                  )}
                  {trendData.cpk != null && (
                    <Chip
                      label={`Cpk: ${trendData.cpk} ${trendData.cpk >= 1.33 ? "(Capable)" : "(Needs Attention)"}`}
                      style={{
                        backgroundColor: trendData.cpk >= 1.33 ? "#e8f5e9" : "#ffebee",
                        color: trendData.cpk >= 1.33 ? "#2e7d32" : "#c62828",
                        fontWeight: 700,
                      }}
                      className={classes.chip}
                    />
                  )}
                </>
              )}
            </Box>

            {/* ATTRIBUTIVE SPECIFICATION VIEW */}
            {isAttributive ? (
              <Box>
                <div
                  className={classes.infoBanner}
                  style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <Info style={{ color: "#16a34a" }} />
                  <Typography variant="body2" style={{ color: "#166534" }}>
                    This parameter records discrete qualitative observations (e.g. <strong>"ok"</strong> / <strong>"not ok"</strong>, visual conformance).
                    Displaying device-by-device inspection status and overall compliance breakdown.
                  </Typography>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" style={{ padding: 12, borderRadius: 8, height: "100%" }}>
                      <Typography variant="subtitle2" style={{ fontWeight: 600, color: "#37474f" }}>
                        Compliance Ratio (Pass vs Defect)
                      </Typography>
                      <div ref={pieRef} className={classes.pieContainer} />
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Paper variant="outlined" style={{ padding: 12, borderRadius: 8, height: "100%" }}>
                      <Typography variant="subtitle2" style={{ fontWeight: 600, color: "#37474f" }}>
                        Device Inspection Status Strip (Green = Conforming, Red = Defect)
                      </Typography>
                      <div ref={barRef} className={classes.barContainer} />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              /* CONTINUOUS NUMERIC SPECIFICATION VIEW (SPC RUN CHART) */
              <Box>
                <div
                  className={classes.infoBanner}
                  style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                >
                  <Info style={{ color: "#2563eb" }} />
                  <Typography variant="body2" style={{ color: "#1e40af" }}>
                    Continuous measurement parameter with SPC Control Limits (Mean: {trendData.mean}, UCL: {trendData.ucl || "N/A"}, LCL: {trendData.lcl || "N/A"}) and Specification Tolerances (USL: {trendData.maxLimit != null ? trendData.maxLimit : "None"}, LSL: {trendData.minLimit != null ? trendData.minLimit : "None"}).
                  </Typography>
                </div>
                <div ref={chartRef} className={classes.chartContainer} />
              </Box>
            )}

            {/* AUDIT LOG TABLE — title lives inside the card so it never overlaps the border */}
            <div className={classes.logSection}>
              <Typography className={classes.logSectionTitle}>
                Device Inspection Log ({visiblePoints.length} Records)
              </Typography>
              <TableContainer className={classes.tableContainer}>
                <Table size="small" stickyHeader>
                  <TableHead className={classes.tableHeader}>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Serial / Reg No</TableCell>
                      <TableCell align="center">Inspection Date</TableCell>
                      <TableCell align="center">Round</TableCell>
                      <TableCell align="center">Stage</TableCell>
                      <TableCell align="center">Observed Result</TableCell>
                      <TableCell align="center">Conformance Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visiblePoints.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" style={{ padding: 16 }}>
                          <Typography variant="body2" color="textSecondary">
                            No inspection records after excluding placeholder serials (WRN / registration type 3).
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {visiblePoints.map((pt, idx) => {
                      const isPass = (pt.status || "").toLowerCase().includes("pass") || pt.status === "1";
                      return (
                        <TableRow key={`${pt.serialNo}-${idx}`} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell style={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            {pt.serialNo}
                          </TableCell>
                          <TableCell align="center">{pt.submittedDate || "N/A"}</TableCell>
                          <TableCell align="center">Round {pt.roundId || 1}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={pt.isQa ? "QA" : "QC"}
                              size="small"
                              style={{
                                backgroundColor: pt.isQa ? "#e3f2fd" : "#fff8e1",
                                color: pt.isQa ? "#1565c0" : "#f57f17",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              style={{
                                fontWeight: 700,
                                color: isPass ? "#2e7d32" : "#d32f2f",
                              }}
                            >
                              {pt.rawObsValue ||
                                (pt.value != null ? `${pt.value} ${trendData.unit || ""}` : "N/A")}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={isPass ? "Passed" : "Failed"}
                              size="small"
                              className={isPass ? classes.badgePass : classes.badgeFail}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions style={{ padding: "12px 24px" }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
