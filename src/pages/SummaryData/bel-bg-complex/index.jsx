import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  LinearProgress,
  Switch,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  withStyles,
} from "@material-ui/core";
import Button from "components/Button";
// import Main from "../OrgDashboard/Main";
import { StyledTableCell } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import ChartViewBELBgComplex from "./chart";
import UploadedImage from "./chart/UploadedImage";
import PhotoGrammetry from "./chart/PhotoGrammetry";
const useStyles = makeStyles((theme) => ({
  tabsRoot: {
    minHeight: 32,
    backgroundColor: theme.palette.grey[100],
    border: "1px solid lightgrey",
    borderRadius: 4,
  },

  tabRoot: {
    minHeight: 32,
    paddingInline: 16,
    margin: 0,

    color: theme.palette.primary.main,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.light,
      color: "white",
    },
  },

  tabLabel: {
    fontSize: "0.75rem", // Optional: adjust text size to match the dense layout
  },

  pass: {
    backgroundColor: "green",
    color: "white",
    width: "50px",
    border: "none",
    textAlign: "center",
  },
  fail: {
    backgroundColor: "red",
    color: "white",
    width: "50px",
    border: "none",
    textAlign: "center",
  },
}));

export const AntSwitch = withStyles((theme) => ({
  switchBase: {
    color: theme.palette.primary.main,
  },
  track: {
    backgroundColor: "blue",
  },
}))(Switch);

const TMRInitaial = {
  leakTestResultDtos: [],
  resultDtos: [],
  photogrammetryDtos: [],
};

export default function BELBgComplex({  firm, handleBack }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [isChartView, setIsChartView] = useState(false);
  const [recordsTMR, setTMRRecords] = useState(TMRInitaial);
  const [loading, setLoading] = useState(false); 
  const [viewType, setViewType] = useState(""); 

  const handle2DClick = () => {
    setViewType("2D"); // Open UploadImage
  };

  const handle3DClick = () => {
    setViewType("3D"); // Show PhotoGrammetry Component
 
  };
  useEffect(() => {
    setLoading(true);
    async function getLeakTestRecord() {
      try {
        const { data } = await axiosInstance("tmrResult/viewTmr/" + (value === 0 ? 102 : 103));

        setTMRRecords({
          leakTestResultDtos: data.leakTestResultDtos || [],
          resultDtos: data.resultDtos || [],
          photogrammetryDtos: data.photogrammetryDtos || [],
        });
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }

    getLeakTestRecord();
  }, [firm, value]);

return (
    <div>
   
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handleBack} size="small" variant="contained" color="secondary">
            Back
          </Button>
          <Typography style={{ flex: 1 }} variant="h5" color="secondary" align="center">
            {firm.orgName}
          </Typography>
          <div>
            <span>Data View</span>
            <AntSwitch checked={isChartView} onChange={(e) => setIsChartView(e.target.checked)} name="dataViewSwitch" />
            <span>Chart View</span>
          </div>
        </div>
      
      <div style={{ display: "inline-block", marginTop: 8 }}>
        <Tabs
          value={value}
          indicatorColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
          textColor="primary"
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="disabled tabs example"
          classes={{
            root: classes.tabsRoot,
            indicator: classes.indicator,
          }}
        >
          <Tab
            label="Leak & Pressure Test"
            classes={{
              root: classes.tabRoot,
              labelIcon: classes.tabLabel,
            }}
          />
          <Tab
            label="photogrammetry Test"
            classes={{
              root: classes.tabRoot,
              labelIcon: classes.tabLabel,
            }}
          />
        </Tabs>
      </div>

      {value === 0 && !isChartView && (
        <div>
          <Table size="small" stickyHeader style={{ borderLeft: "1px solid lightgrey" }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Test Name</StyledTableCell>
                <StyledTableCell>Comp Type</StyledTableCell>
                <StyledTableCell>Lo</StyledTableCell>
                <StyledTableCell>Result</StyledTableCell>
                <StyledTableCell>Hi</StyledTableCell>
                <StyledTableCell>Units</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={11} style={{ padding: 0 }}>
                  {loading && <LinearProgress />}
                </StyledTableCell>
              </TableRow>
              {recordsTMR.leakTestResultDtos.slice(0, -3).map((r, i) => (
                <TableRow key={i}>
                  <StyledTableCell>{r.testName}</StyledTableCell>
                  <StyledTableCell>{r.compType}</StyledTableCell>
                  <StyledTableCell>{r.lo}</StyledTableCell>
                  <StyledTableCell>{r.result}</StyledTableCell>
                  <StyledTableCell>{r.hi}</StyledTableCell>
                  <StyledTableCell>{r.units}</StyledTableCell>
                  <StyledTableCell>{r.status}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {value === 0 && isChartView && <ChartViewBELBgComplex firm={firm} data={recordsTMR} />}

      {value === 1 && isChartView && (
 
<div>
  {/* Buttons Fixed at the Top */}
  <div style={{ 
    display: "flex", 
    justifyContent: "center",  // Centers the buttons horizontally
    alignItems: "center",      // Aligns them vertically (optional)
    width: "100%",             // Ensures full width
    padding: "20px",           // Adds space from the top
    gap: "20px"
  }}>
    <Button variant="contained" color="primary" onClick={handle2DClick}>2D Visualization</Button>
    <Button variant="contained" color="secondary" onClick={handle3DClick}>3D Visualization</Button>
  </div>

  {/* Upload Image Section - Appears Below Without Affecting Buttons */}
  <div style={{ marginTop: "20px", textAlign: "center" }}>
    {viewType === "2D" && <UploadedImage />}
    {viewType === "3D" && <PhotoGrammetry />}
  </div>
</div>

    )}
      {value === 1 && !isChartView && (
        <div>
          <Table size="small" stickyHeader style={{ borderLeft: "1px solid lightgrey" }}>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell colSpan={3} align="center" style={{ borderLeft: "1px solid lightgrey" }}>
                  <b>Begin</b>
                </StyledTableCell>
                <StyledTableCell colSpan={3} align="center" style={{ borderLeft: "1px solid lightgrey" }}>
                  <b>End</b>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={3}
                  align="center"
                  style={{ borderLeft: "1px solid lightgrey", borderRight: "1px solid lightgrey" }}
                >
                  <b>Delta</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Name</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>X1(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Y1(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Z1(mm)</StyledTableCell>

                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>X2(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Y2(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Z2(mm)</StyledTableCell>

                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>dX(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>dY(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>dz(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Mag(mm)</StyledTableCell>
                <StyledTableCell style={{ borderLeft: "1px solid lightgrey" }}>Result</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={11} style={{ padding: 0 }}>
                  {loading && <LinearProgress />}
                </StyledTableCell>
              </TableRow>
              {recordsTMR.photogrammetryDtos.map((r, i) => (
                <TableRow key={i}>
                  <StyledTableCell>{r.name}</StyledTableCell>
                  <StyledTableCell>{r.beginX1}</StyledTableCell>
                  <StyledTableCell>{r.beginY1}</StyledTableCell>
                  <StyledTableCell>{r.beginZ1}</StyledTableCell>
                  <StyledTableCell>{r.endX2}</StyledTableCell>
                  <StyledTableCell>{r.endY2}</StyledTableCell>
                  <StyledTableCell>{r.endZ2}</StyledTableCell>
                  <StyledTableCell>{r.deltaDx}</StyledTableCell>
                  <StyledTableCell>{r.deltaDy}</StyledTableCell>
                  <StyledTableCell>{r.deltaDz}</StyledTableCell>
                  <StyledTableCell>{r.mag}</StyledTableCell>
                  <StyledTableCell>
                    {Math.abs(r.mag) < 1 ? <div className={classes.pass}>Pass</div> : <div className={classes.fail}>Fail</div>}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
        <div>
      </div>
    </div>
  );
}
