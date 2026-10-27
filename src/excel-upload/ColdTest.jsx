import React, { useEffect, useRef, useState } from "react";
import ExcelUpload from "./upload";
import {
  Button,
  Dialog,
  IconButton,
  LinearProgress,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "pages/Services/AxiosInstanceIol";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle, StyledTableRow } from "Utils";
import { Print, Visibility } from "@material-ui/icons";
import axiosInstanceIol from "../pages/Services/AxiosInstanceIol";
import { ORG_TYPE } from "Redux/Types";
import { OPEN_RI } from "Redux/Types";
import { loggedInUser } from "Redux/Reducer/User";
import { useDispatch } from "react-redux";
import ActionButton from "components/ActionButton";
import Widget from "widget";
import VideoInspection from "video/cv2";
import CameraRequest from "video/cameraRequest/CameraRequest";
import { PaperComponent } from "Utils/D3Tree";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import { VideoPlayer } from "pages/SOModule/OL/Edit";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { getAllCameraRequests } from "pages/Services/URLs";

// import axiosInstance from "pages/Services/AxiosInstanceTransaction";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 0,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
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
  tableBorder: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  root: {
    borderRight: "1px solid lightgrey",
    padding: "0px 4px",
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))(TableCell);

export default function ColdTest({ ol, selectedUploadRow, rowData, isHotTest, regNo, selectedTest, roundTest, olNum }) {

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState(null);
  const [value, setValue] = useState(0);
  const productId = ol.productId;
  const testId = selectedTest.testId;
  const devId = regNo.id;
  const componentRef = useRef();
  const [open, setOpen] = useState(false);
  const [openCam, setOpenCam] = useState(false);
  const [openCameraReq, setOpenCameraReq] = useState(false);
  const [openSavedVideo, setOpenSavedVideo] = useState(false);
  const [videoCamAccess, setVideoCamAccess] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState(false);
  const dispatch = useDispatch();
  const orgTypeId = loggedInUser?.orgTypeId;
  const isQC = (orgTypeId === ORG_TYPE.FIRM);
  console.log("ColdTest ol", ol);
  console.log("ColdTest olNum", olNum);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  //state to check if any cameras are toggled ON
  const [activeCams, setActiveCams]=useState(0);
  //method passed from parent Widget to VideoInspection child, to get number of active cameras
  const checkActiveCams = (value)=>{
    setActiveCams(value);
  }
  //conditional close function lets you close window only if cameras are off. Minimize is allowed.
  const handleVideoInspectionClose = ()=>{
    if(activeCams>0){
      let warn = "";
      (activeCams===1) ? warn = "1 camera stream is still running, please turn it off." : warn = activeCams + " camera streams are still running, please turn them off.";
      toast.info(warn);
    }else{
      setOpenCam(false);
    }
  }
  function getColdTestRecord() {
    let url = `iol/getByInspRoundId/${roundTest?.id}/${isHotTest ? 0 : 1}`;

    setLoading(true);
    axiosInstanceIol(url)
      .then(({ data }) => {
        console.log("ColdTestRecord Data", data);
        setRecords(data);
        setValue(data.testType || 0)
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to get Data");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getColdTestRecord();
  }, []);

  async function checkVideoCameraAccessByTest() {
    try {
      const { data } = await axiosInstanceAte(getAllCameraRequests);
      let statusText = `Camera Access to test ${selectedTest.testName}`;
      // console.log("camAccess " + JSON.stringify(data));

      // .find() returns the first object that matches the condition
      const matchingRecord = data.find(item =>
        Number(item.testId) === Number(testId)
      );
      if (!matchingRecord) {
        console.warn("No camera request record found for testId:", testId);
        setOpenCam(false);
        return;
      }
      const requestStatus = matchingRecord?.statusId;
      switch (requestStatus) {
        case 1:
          statusText += ` pending approval.`;
          toast.info(statusText);
          break;
        case 2:
          statusText += ` approved.`;
          setVideoCamAccess(true);
          setOpenCam(true);
          toast.success(statusText);
          break;
        case 3:
          statusText += ` denied.`;
          setOpenCam(false);
          toast.error(statusText);
          break;

        default:
          statusText += ` unknown statusId.`;
          console.warn(statusText);
          setOpenCam(false);
          break;
      }
    } catch (error) {
      console.error("Error checking camera access:", error);
    }
  }
  useEffect(() => {
    if (!isQC) checkVideoCameraAccessByTest();
    // console.log("ol",ol);
  }, []);

  const details = (
    <div ref={componentRef}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Typography>
          Device No.: <b>{regNo?.registerNo} </b>
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <div>
            <span
              style={{
                width: 10,
                height: 10,
                padding: "1px",
                borderRadius: 8,
                marginRight: 4,
                background: "green",
                display: "inline-block",
              }}
            ></span>
            Values are in expected range
          </div>
          <div>
            <span
              style={{
                width: 10,
                height: 10,
                padding: "1px",
                borderRadius: 8,
                background: "red",
                marginRight: 4,
                display: "inline-block",
              }}
            ></span>
            Values are out of expected range
          </div>
        </div>
      </div>

      <div style={{ minHeight: 600 }}>
        {value === 0 ? (
          <Table size="small" stickyHeader style={{ borderLeft: "1px solid lightgrey" }}>
            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={5} style={{ padding: 0 }}>
                  {loading && <LinearProgress />}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell colSpan={3}>
                  Device No.: <b>{records?.deviceNo || ""} </b>
                  {records?.deviceNo && regNo?.registerNo && records?.deviceNo !== regNo?.registerNo ? " - Device Name Mismatch" : ""}
                </StyledTableCell>
                <StyledTableCell>DATED: {records?.testDate || ""}</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell colSpan={4}>Para 1.5.2</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>1.</b>
                </StyledTableCell>
                <StyledTableCell>27 Volts. ± 1V</StyledTableCell>
                <StyledTableCell>
                  {records?.volt && (
                    <span
                      style={{
                        color: records?.volt >= 26 && records?.volt <= 28 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.volt} V`}</b>
                    </span>
                  )}
                </StyledTableCell>

                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>2.</b>
                </StyledTableCell>
                <StyledTableCell>Phase Current</StyledTableCell>
                <StyledTableCell>
                  R (&lt;= 2.0A) -&nbsp;
                  {records?.phCurrR && (
                    <span
                      style={{
                        color: records?.phCurrR <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrR} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  S (&lt;= 2.3A) - &nbsp;
                  {records?.phCurrS && (
                    <span
                      style={{
                        color: records?.phCurrS <= 2.3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrS} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  T (&lt;= 2.0A) - &nbsp;
                  {records?.phCurrT && (
                    <span
                      style={{
                        color: records?.phCurrT <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrT} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>3.</b>
                </StyledTableCell>
                <StyledTableCell>Ocular Heating</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.ocularHeating?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.ocularHeating || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>4.</b>
                </StyledTableCell>
                <StyledTableCell>Commander</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.commander?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.commander || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>5.</b>
                </StyledTableCell>
                <StyledTableCell>Auto/man</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.autoMan?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.autoMan || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>6.</b>
                </StyledTableCell>
                <StyledTableCell>Recharge Time ≤ 3 sec</StyledTableCell>
                <StyledTableCell>
                  Time -{" "}
                  {records?.rcTime && (
                    <span
                      style={{
                        color: records?.rcTime <= 3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.rcTime} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  BID &nbsp;
                  <span
                    style={{
                      color: /^-+$/.test(records?.rcTimeBid) ? "green" : "red",
                    }}
                  >
                    <b>{records?.rcTimeBid}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell>
                  D.S. 800±80 -{" "}
                  {records?.rcTimeDs && (
                    <span
                      style={{
                        color: records?.rcTimeDs >= 720 && records?.rcTimeDs <= 880 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.rcTimeDs} M`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>7.</b>
                </StyledTableCell>
                <StyledTableCell>Work off D Time ≤ 5 sec</StyledTableCell>
                <StyledTableCell>
                  Time -{" "}
                  {records?.workOffDTime && (
                    <span
                      style={{
                        color: records?.workOffDTime <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.workOffDTime} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  BID{" "}
                  <span
                    style={{
                      color: /^-+$/.test(records?.workOffDBid) ? "green" : "red",
                    }}
                  >
                    <b>{records?.workOffDBid || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell>
                  D.S. 800±80 -
                  {records?.workOffDDs && (
                    <span
                      style={{
                        color: records?.workOffDDs >= 720 && records?.workOffDDs <= 880 ? "green" : "red",
                      }}
                    >
                      <b> {`${records?.workOffDDs} M`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>8.</b>
                </StyledTableCell>
                <StyledTableCell>Failure of emission signal</StyledTableCell>
                <StyledTableCell>Signal {records?.failureSingle || ""}</StyledTableCell>
                <StyledTableCell>
                  BID{" "}
                  <span
                    style={{
                      color: /^-+$/.test(records?.failureSingleBid) ? "green" : "red",
                    }}
                  >
                    <b>{records?.failureSingleBid}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell>D.S. 800±80 - {records && `${records?.failureSingleDs || ""} M`}</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>9.</b>
                </StyledTableCell>
                <StyledTableCell>Multiple Arresting ≤ 1'</StyledTableCell>
                <StyledTableCell>
                  {records?.mutliArresting && (
                    <span
                      style={{
                        color: records?.mutliArresting <= 1 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mutliArresting}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>10.</b>
                </StyledTableCell>
                <StyledTableCell>Signal of rotary tranformer ≤ 120 mV</StyledTableCell>
                <StyledTableCell>
                  {records?.singnalRotaryTrans && (
                    <span
                      style={{
                        color: records?.singnalRotaryTrans <= 120 ? "green" : "red",
                      }}
                    >
                      <b> {`${records?.singnalRotaryTrans}mV`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>11.</b>
                </StyledTableCell>
                <StyledTableCell>Fire Contact Point ± 4 +0.8'</StyledTableCell>
                <StyledTableCell>{records?.fireContact || ""}</StyledTableCell>
                <StyledTableCell>
                  <b>{records?.fireContactBid || ""}</b>
                </StyledTableCell>
                <StyledTableCell>
                  <b>{records?.fireContactDs || ""}</b>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>12.</b>
                </StyledTableCell>
                <StyledTableCell>Compensation ≤ 1'</StyledTableCell>
                <StyledTableCell>
                  {records?.compensation && (
                    <span
                      style={{
                        color: records?.compensation <= 1 ? "green" : "red",
                      }}
                    >
                      <b> {records?.compensation} </b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>M/G Fire OK/Not OK</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.compMgFire?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.compMgFire || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>13.</b>
                </StyledTableCell>
                <StyledTableCell>Voltage of Control console</StyledTableCell>
                <StyledTableCell>Clockwise</StyledTableCell>
                <StyledTableCell>Anticlockwise</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Soft</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltSoftClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltSoftAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltSoftClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltSoftAntiClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Hard</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltHardClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltHardAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltHardClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltHardAntiClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Zero</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltZeroClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltZeroAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>14.</b>
                </StyledTableCell>
                <StyledTableCell>Safe Contact Point</StyledTableCell>
                <StyledTableCell>
                  5V &nbsp; &nbsp;{" "}
                  <span
                    style={{
                      color: records?.safeContPt5v?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.safeContPt5v || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell>
                  9V &nbsp; &nbsp;{" "}
                  <span
                    style={{
                      color: records?.safeContPt9v?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.safeContPt9v || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>15.</b>
                </StyledTableCell>
                <StyledTableCell>Blocking</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.blocking?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.blocking || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>16.</b>
                </StyledTableCell>
                <StyledTableCell>Maximum aiming speed</StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Current</StyledTableCell>
                <StyledTableCell>Current</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Upward ≥ 3.5⁰/sec</StyledTableCell>
                <StyledTableCell>
                  {records?.maxUpwCurrSpeed && (
                    <span
                      style={{
                        color: records?.maxUpwCurrSpeed >= 3.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.maxUpwCurrSpeed} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>P1 (0.8 to 1.4A)</StyledTableCell>
                <StyledTableCell>
                  {records?.maxUpwCurrP1 && (
                    <span
                      style={{
                        color: records?.maxUpwCurrP1 >= 0.8 && records?.maxUpwCurrP1 <= 1.4 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.maxUpwCurrP1} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Downward ≥ 3.5⁰/sec</StyledTableCell>
                <StyledTableCell>
                  {records?.maxDownCurrSpeed && (
                    <span
                      style={{
                        color: records?.maxDownCurrSpeed >= 3.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.maxDownCurrSpeed} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>P2 (0.8 to 1.4A)</StyledTableCell>
                <StyledTableCell>
                  {" "}
                  {records?.maxDownCurrP2 && (
                    <span
                      style={{
                        color: records?.maxDownCurrP2 >= 0.8 && records?.maxDownCurrP2 <= 1.4 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.maxDownCurrP2} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>17.</b>
                </StyledTableCell>
                <StyledTableCell>Minimum aiming speed (≤ 3'/sec)</StyledTableCell>
                <StyledTableCell>
                  Upward{" "}
                  {records?.minAimSpeedUp && (
                    <span
                      style={{
                        color: records?.minAimSpeedUp <= 3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.minAimSpeedUp} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  Downward{" "}
                  {records?.minAimSpeedDown && (
                    <span
                      style={{
                        color: records?.minAimSpeedDown <= 3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.minAimSpeedDown} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>18.</b>
                </StyledTableCell>
                <StyledTableCell>Eveness of line of sight &lt; 5 jerks in 30 sec</StyledTableCell>
                <StyledTableCell>Up {records?.evenessSightUp || ""}</StyledTableCell>
                <StyledTableCell>Down {records?.evenessSightUp || ""}</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>19.</b>
                </StyledTableCell>
                <StyledTableCell>Zero setting ± 40 M</StyledTableCell>
                <StyledTableCell>
                  <b>{records?.zeroSetting || ""}</b>M
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>20.</b>
                </StyledTableCell>
                <StyledTableCell>Mech. Speed:</StyledTableCell>
                <StyledTableCell>Forward</StyledTableCell>
                <StyledTableCell>Backward</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>9v (121.2 - 142.3) Sec</StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp9vForw && (
                    <span
                      style={{
                        color: records?.mechSp9vForw >= 121.2 && records?.mechSp9vForw <= 142.3 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp9vForw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp9vBackw && (
                    <span
                      style={{
                        color: records?.mechSp9vBackw >= 121.2 && records?.mechSp9vBackw <= 142.3 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp9vBackw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>14v (78.1-91.7) Sec</StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp14vForw && (
                    <span
                      style={{
                        color: records?.mechSp14vForw >= 78.1 && records?.mechSp14vForw <= 91.7 ? "green" : "red",
                      }}
                    >
                      <b> {records?.mechSp14vForw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp14vBackw && (
                    <span
                      style={{
                        color: records?.mechSp14vBackw >= 78.1 && records?.mechSp14vBackw <= 91.7 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp14vBackw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Phase Current</StyledTableCell>
                <StyledTableCell>
                  R (&lt;= 2.0A){" "}
                  {records?.mechSpPhCurrR && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrR <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrR} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  S (&lt;= 2.3A){" "}
                  {records?.mechSpPhCurrS && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrS <= 2.3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrS} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  T (&lt;= 2.0A){" "}
                  {records?.mechSpPhCurrT && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrT <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrT} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>21.</b>
                </StyledTableCell>
                <StyledTableCell>Drift Speed: ≤ 50.4'/min</StyledTableCell>
                <StyledTableCell>
                  0° <b>{`${records?.driftSpeedPl0Deg || ""} /min`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  '-5° <b>{`${records?.driftSpeedMi5Deg || ""} /min`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  '+15° <b>{`${records?.driftSpeedPl0Deg || ""} /min`}</b>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>22.</b>
                </StyledTableCell>
                <StyledTableCell>Illumination (OK/Not OK)</StyledTableCell>
                <StyledTableCell>
                  <span
                    style={{
                      color: records?.illumination?.toLowerCase() === "ok" ? "green" : "red",
                    }}
                  >
                    <b>{records?.illumination || ""}</b>
                  </span>
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>23.</b>
                </StyledTableCell>
                <StyledTableCell>Projectile speed time:</StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>APDS- HEF ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpApdsHef && (
                    <span
                      style={{
                        color: records?.projSpApdsHef <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b> {`${records?.projSpApdsHef} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>APDS-HEAT ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpApdsHeat && (
                    <span
                      style={{
                        color: records?.projSpApdsHeat <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpApdsHeat} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>HEF- HEAT ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHefHeat && (
                    <span
                      style={{
                        color: records?.projSpHefHeat <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHefHeat} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>HEAT-HEF ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHeatHef && (
                    <span
                      style={{
                        color: records?.projSpHeatHef <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHeatHef} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>HEAT-APDS ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHeatApds && (
                    <span
                      style={{
                        color: records?.projSpHeatApds <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHeatApds} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>HEF-APDS ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHefApds && (
                    <span
                      style={{
                        color: records?.projSpHefApds <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHefApds} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>24.</b>
                </StyledTableCell>
                <StyledTableCell>Parallelism ≤ 90"</StyledTableCell>
                <StyledTableCell>
                  {records?.parallelism && (
                    <span
                      style={{
                        color: records?.parallelism <= 90 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.parallelism} "`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell> </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>25.</b>
                </StyledTableCell>
                <StyledTableCell>Torque of handwheel-</StyledTableCell>
                <StyledTableCell>
                  <b>{records?.torqHandwheel || ""}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell> </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Table size="small" stickyHeader style={{ borderLeft: "1px solid lightgrey" }}>
            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={5} style={{ padding: 0 }}>
                  {loading && <LinearProgress />}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell colSpan={3}>
                  Device No.: <b>{records?.deviceNo || ""} </b>
                </StyledTableCell>
                <StyledTableCell>DATED: {records?.testDate || ""}</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell colSpan={4}>Para 1.5.2</StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>1.</b>
                </StyledTableCell>
                <StyledTableCell>27 Volts. ± 1V</StyledTableCell>
                <StyledTableCell>
                  {records?.volt && (
                    <span
                      style={{
                        color: records?.volt >= 26 && records?.volt <= 28 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.volt} V`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>2.</b>
                </StyledTableCell>
                <StyledTableCell>Phase Current</StyledTableCell>
                <StyledTableCell>
                  R (&lt;= 2.0A) -&nbsp;
                  {records?.phCurrR && (
                    <span
                      style={{
                        color: records?.phCurrR <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrR} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  S (&lt;= 2.3A) - &nbsp;
                  {records?.phCurrS && (
                    <span
                      style={{
                        color: records?.phCurrS <= 2.3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrS} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  T (&lt;= 2.0A) - &nbsp;
                  {records?.phCurrT && (
                    <span
                      style={{
                        color: records?.phCurrT <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.phCurrT} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>10.</b>
                </StyledTableCell>
                <StyledTableCell>Signal of rotary tranformer ≤ 120 mV</StyledTableCell>
                <StyledTableCell>
                  {records?.singnalRotaryTrans && (
                    <span
                      style={{
                        color: records?.singnalRotaryTrans <= 120 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.singnalRotaryTrans}mV`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>13.</b>
                </StyledTableCell>
                <StyledTableCell>Voltage of Control console</StyledTableCell>
                <StyledTableCell>Clockwise</StyledTableCell>
                <StyledTableCell>Anticlockwise</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Soft</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltSoftClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltSoftAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltSoftClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltSoftAntiClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Hard</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltHardClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltHardAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltHardClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltHardAntiClockP2} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Zero</StyledTableCell>
                <StyledTableCell>
                  P1 <b>{records && `${records?.voltZeroClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell>
                  P2 <b>{records && `${records?.voltZeroAntiClockP1} V`}</b>
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">
                  <b>20.</b>
                </StyledTableCell>
                <StyledTableCell>Mech. Speed:</StyledTableCell>
                <StyledTableCell>Forward</StyledTableCell>
                <StyledTableCell>Backward</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>9v (121.2 - 142.3) Sec</StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp9vForw && (
                    <span
                      style={{
                        color: records?.mechSp9vForw >= 121.2 && records?.mechSp9vForw <= 142.3 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp9vForw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp9vBackw && (
                    <span
                      style={{
                        color: records?.mechSp9vBackw >= 121.2 && records?.mechSp9vBackw <= 142.3 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp9vBackw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>14v (78.1-91.7) Sec</StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp14vForw && (
                    <span
                      style={{
                        color: records?.mechSp14vForw >= 78.1 && records?.mechSp14vForw <= 91.7 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp14vForw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {records?.mechSp14vBackw && (
                    <span
                      style={{
                        color: records?.mechSp14vBackw >= 78.1 && records?.mechSp14vBackw <= 91.7 ? "green" : "red",
                      }}
                    >
                      <b>{records?.mechSp14vBackw}</b> sec
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Phase Current</StyledTableCell>
                <StyledTableCell>
                  R (&lt;= 2.0A){" "}
                  {records?.mechSpPhCurrR && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrR <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrR} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  S (&lt;= 2.3A){" "}
                  {records?.mechSpPhCurrS && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrS <= 2.3 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrS} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  T (&lt;= 2.0A){" "}
                  {records?.mechSpPhCurrT && (
                    <span
                      style={{
                        color: records?.mechSpPhCurrT <= 2 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.mechSpPhCurrT} A`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center">
                  <b>23.</b>
                </StyledTableCell>
                <StyledTableCell>Projectile speed time:</StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
                <StyledTableCell> </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>APDS- HEF ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpApdsHef && (
                    <span
                      style={{
                        color: records?.projSpApdsHef <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpApdsHef} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>APDS-HEAT ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpApdsHeat && (
                    <span
                      style={{
                        color: records?.projSpApdsHeat <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpApdsHeat} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>HEF- HEAT ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHefHeat && (
                    <span
                      style={{
                        color: records?.projSpHefHeat <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHefHeat} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>HEAT-HEF ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHeatHef && (
                    <span
                      style={{
                        color: records?.projSpHeatHef <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHeatHef} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>HEAT-APDS ≤ 2.5 sec</StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHeatApds && (
                    <span
                      style={{
                        color: records?.projSpHeatApds <= 2.5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHeatApds} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell>HEF-APDS ≤ 5sec </StyledTableCell>
                <StyledTableCell>
                  {records?.projSpHefApds && (
                    <span
                      style={{
                        color: records?.projSpHefApds <= 5 ? "green" : "red",
                      }}
                    >
                      <b>{`${records?.projSpHefApds} Sec`}</b>
                    </span>
                  )}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>

        )}
        {records?.id && (
          <div alignItems="center" style={{ display: 'flex', gap: '1800px', padding: "8px 16px" }}>
            <IconButton
              size="small"
              color="secondary"
              onClick={handlePrint}
            >

            </IconButton>
            <Button variant="contained" color="secondary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  const isExcelUploaded = (fileUploadStatus) => {
    setFileUploadStatus(fileUploadStatus);
  }

  return (
    <>
      {/* <Typography align="center" variant="h5" style={{ fontWeight: '600' }}>{isHotTest ? 'Zero Point Stand Test - HOT' : 'Zero Point Stand Test - COLD'}</Typography> */}
      {!records?.id && (
        <div style={{ display: "inline-block" }}>
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
              label="Semi-Automatic" //0
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLabel,
              }}
            />
            <Tab
              label="Automatic" //1
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLabel,
              }}
            />
          </Tabs>
        </div>
      )}
      <>

      </>
      {records?.id && (
        <div style={{ padding: "4px 0px", border: "1px solid skyblue", backgroundColor: "aliceblue", borderRadius: 4 }}>
          <Typography variant="h6" color="secondary" align="center">
            <b>{value === 1 ? "Automatic" : "Semi-Automatic"}</b>
          </Typography>


        </div>
      )}
      {!rowData?.isView && !records?.id && (
        <ExcelUpload
          selectedUploadRow={selectedUploadRow}
          getRecord={getColdTestRecord}
          rowData={rowData}
          selectedTab={value}
          isHotTest={isHotTest}
          productId={productId}
          devId={devId}
          testId={testId}
          ol={ol}
          records={records}
          regNo={regNo}
          roundTest={roundTest}
          onSubmit={isExcelUploaded}
        />
      )}
      <div style={{ position: "relative", display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button
          disabled={isQC || fileUploadStatus}
          size="small"
          style={(isQC || fileUploadStatus) ? {
            backgroundColor: "grey",
            color: "white",
            minWidth: 100,
          } : {
            backgroundColor: "green",
            color: "white",
            minWidth: 100,
          }}
          variant="contained"
          onClick={() => {
            if (orgTypeId === ORG_TYPE.QA_AGENCY) {
              setOpenCameraReq(true);
            } else {
              //TODO: check the rowData 
              dispatch({ type: OPEN_RI, olNumber: ol?.offerLetterNo, lineItemNo: rowData?.soLineItemNo, devId: rowData?.devId, testId: rowData?.testId, productId: rowData?.productId });

            }
          }}
        >
          Video Camera Request
        </Button>

        <Button
          disabled={fileUploadStatus}
          size="small"
          style={(fileUploadStatus) ? {
            backgroundColor: "grey",
            color: "white",
            minWidth: 100,
          } : {
            backgroundColor: "green",
            color: "white",
            minWidth: 100,
          }}
          variant="contained"
          onClick={() => {
            if (orgTypeId === ORG_TYPE.QA_AGENCY || ORG_TYPE.FIRM) {
              // console.log("orgTypeId: ", orgTypeId);
              setOpenCam(true);
            } else {
              //TODO: check the rowData 
              dispatch({ type: OPEN_RI, olNumber: ol?.offerLetterNo, lineItemNo: rowData?.soLineItemNo, devId: rowData?.devId, testId: rowData?.testId, productId: rowData?.productId });

            }
          }}
        >
          Video Cam
        </Button>
        {openCam && (
          <Widget title={"Video Inspection"} onClose={handleVideoInspectionClose}>
            <VideoInspection checkActiveCams={checkActiveCams} regNo={regNo} olNum={olNum} olId={ol?.offerLetterId} olLiNum={ol?.soLineItemNo} olLiId={ol?.id} devId={regNo?.id} testId={testId} productId={selectedTest.productId} testName={selectedTest.testName} isQc={isQC} />
          </Widget>
        )}
        {openCameraReq && orgTypeId != 2
          && (
            <Dialog open maxWidth={"lg"} fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}>
              <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenCameraReq(false)} style={{ cursor: "move" }}>
                Video Camera Request Window
              </DialogTitle>
              <DialogContent>
                {/* <WebCam rowData={rowData} olNumber={ol?.offerLetterNo} onClose={() => setOpenCam(false)} />
                <VideoInspection lineItemNo={rowData?.soLineItemNo} olNumber={ol?.offerLetterNo} devId={rowData?.devId} testId={rowData?.testId} productId={rowData?.productId} onClose={() => setOpenCam(false)} /> */}
                <CameraRequest
                  olId={ol?.offerLetterId}
                  testId={testId}
                  testName={selectedTest.testName}
                  olNumber={ol?.offerLetterNo}
                  onClose={() => setOpenCameraReq(false)}
                  olLiId={ol?.id}
                  devId={regNo?.id}
                  ol={ol}
                />
              </DialogContent>
            </Dialog>
          )}
        {openSavedVideo && <VideoPlayer onClose={() => setOpenSavedVideo(false)} loggedInUser={loggedInUser} olNumber={ol?.offerLetterNo} devId={devId} testId={testId} />}
        <ActionButton
          fullWidth
          variant="contained"
          size="medium"
          color="primary"
          obs={"video"}
          startIcon={<VideocamOutlinedIcon />}
          onClick={() => {
            setOpenSavedVideo(true);
          }}
        // disabled={!rowData?.isReturned}
        >
          Saved Videos
        </ActionButton>
      </div>



      {details}

      <Dialog open={open} fullWidth maxWidth={"lg"}>
        <DialogTitle onClose={() => setOpen(false)}>Print</DialogTitle>
        <DialogContent>{details}</DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
