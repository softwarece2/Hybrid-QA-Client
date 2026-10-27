import React, { useState } from "react";
import {
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  // DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Box,
  DialogContent,
} from "@material-ui/core";
import {
  ArrowRight,
  ArrowLeft,
  // CenterFocusStrong,
  // RotateRight,
  // RotateLeft,
  ZoomIn,
  ZoomOut,
  ArrowDropUp,
  ArrowDropDown,
} from "@material-ui/icons";
import axios from "axios";
import { vmsBaseUrl } from "./CameraPlayer";
// import axiosInstance from "pages/Services/AxiosInstance";

const iconButtonJoyStickStyle = {
  backgroundColor: "#2d82dd",
  margin: 1,
  color: "white",
};
// const iconButtonZoomStyle = {
//   backgroundColor: "#ffcfcf",
//   margin: 4,
//   color: "red",
// };
// const iconButtonTiltStyle = {
//   backgroundColor: "#f2ffcd",
//   margin: 4,
//   color: "darkGreen",
// };

const ControlPanel = ({ onControlClick, cam, socket }) => {
  console.log(cam, "=========== control panel============", socket);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingStop, setLoadingStop] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState();

  const vms_access_token = JSON.parse(
    sessionStorage.getItem("vms_access_token")
  );

  async function handleStarRecording() {
    setLoadingStart(true);
    try {
      const config = {
        method: "post",
        url:
          vmsBaseUrl +
          "/gateway/tenant/1/site/100/device/camera/" +
          cam.cameraId +
          "?action=startRecording",
        headers: {
          Authorization: "Bearer " + vms_access_token,
          userId: 1000,
        },
      };
      await axios(config);
      setIsRecordingStarted(true);
    } catch (error) {
      console.log(error);
    }
    setLoadingStart(false);
  }

  async function handleStopRecording() {
    setLoadingStop(true);
    try {
      const config = {
        method: "post",
        url:
          vmsBaseUrl +
          "/gateway/tenant/1/site/100/device/camera/" +
          cam.cameraId +
          "?action=stopRecording",
        headers: {
          Authorization: "Bearer " + vms_access_token,
          userId: 1000,
        },
      };
      await axios(config);
      setIsRecordingStarted(false);
    } catch (error) {
      console.log(error);
    }
    setLoadingStop(false);
  }

  async function handleSubmit() {
    console.log(startDate,endDate);
    if (!startDate && !endDate) {
      alert("required");
      return;
    }

    try {
      const req = {
        name: "test_" + Date.now(),
        description: "",
        downloadPath: "D:\\new1\\",
        isProprietaryFormatEnable: false,
        proprietaryInstance: {
          isWaterMarkingOn: false,
          needproprietaryPlayer: true,
          watermarkImagePosition: "CENTER",
          watermarkImageOpacity: 0.1,
        },
        isStandardFormatEnable: true,
        standardInstance: {
          isWaterMarkingOn: false,
          isTimeStampEnable: false,
          MediaFormat: "mp4",
          watermarkImagePosition: "CENTER",
          watermarkImageOpacity: 0.1,
        },
        numberofExport: 1,
        isCompressFormat: false,
        exportInstance: [
          {
            cameraId: cam.cameraId,
            cameraName: "Camera_172.16.68.245",

            startTime: new Date(startDate).getTime(),
            endTime: new Date(endDate).getTime(),
          },
        ],
        isImageMasking: false,
      };
        const config = {
          method: "post",
          url: vmsBaseUrl + "/gateway/tenant/1/site/100/export",
          headers: {
            Authorization: "Bearer " + vms_access_token,
            userId: 1000,
          },
          data: req,
        };
      const { data } = await axios(config);
      setDownloadUrl(data.url + data.name + ".zip");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogContent>
          <Box mb={2}>
            <TextField
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              id="startdatetime-local"
              label="Select Start DateTime"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box>
            <TextField
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              id="enddatetime-local"
              label="Select End DateTime"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          {downloadUrl && (
            <Typography style={{ color: "royalblue" }}>
              <a href={downloadUrl}> Click here to Download file </a>
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="small"
          >
            Submit
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="secondary"
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 4,
          padding: 4,
          backgroundColor: "#eeeeee9e",
          minWidth: 150,
        }}
      >
        <Button
          disabled={!cam.isPtzCapable}
          onClick={() => onControlClick(cam, "up")}
          color="primary"
          style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
        >
          <ArrowDropUp />
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            disabled={!cam.isPtzCapable}
            style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
            color="primary"
            onClick={() => onControlClick(cam, "left")}
          >
            <ArrowLeft />
          </Button>
          <div style={{ minHeight: 40, minWidth: 40 }}> </div>
          {/* <Button
          disabled={!cam.isPtzCapable}
          style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
          onClick={() => onControlClick(cam, "center")}
        >
          <CenterFocusStrong />
        </Button> */}
          <Button
            disabled={!cam.isPtzCapable}
            style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
            color="primary"
            onClick={() => onControlClick(cam, "right")}
          >
            <ArrowRight />
          </Button>
        </div>
        <Button
          disabled={!cam.isPtzCapable}
          style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
          color="primary"
          onClick={() => onControlClick(cam, "down")}
        >
          <ArrowDropDown />
        </Button>
        <Divider style={{ marginBlock: 8 }} flexItem />
        {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          disabled={!cam.isPtzCapable}
          style={cam.isPtzCapable ? iconButtonTiltStyle : {}}
          onClick={() => onControlClick(cam, "rotateLeft")}
        >
          <RotateLeft />
        </IconButton>
        <IconButton
          disabled={!cam.isPtzCapable}
          style={cam.isPtzCapable ? iconButtonTiltStyle : {}}
          onClick={() => onControlClick(cam, "rotateRight")}
        >
          <RotateRight />
        </IconButton>
      </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            disabled={!cam.isPtzCapable}
            style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
            onClick={() => onControlClick(cam, "zoomOut")}
          >
            <ZoomOut />
          </IconButton>
          <IconButton
            disabled={!cam.isPtzCapable}
            style={cam.isPtzCapable ? iconButtonJoyStickStyle : {}}
            onClick={() => onControlClick(cam, "zoomIn")}
          >
            <ZoomIn />
          </IconButton>
        </div>
        <Button
          onClick={handleStarRecording}
          size="small"
          variant="outlined"
          color="primary"
          disabled={loadingStart || isRecordingStarted}
        >
          {loadingStart && <CircularProgress size={24} />}Start Recording
        </Button>
        <Button
          onClick={handleStopRecording}
          size="small"
          variant="outlined"
          color="secondary"
          disabled={loadingStop}
        >
          {loadingStop && <CircularProgress size={24} />} Stop Recording
        </Button>
        <Button
          onClick={() => {
            setOpen(true);
            setDownloadUrl();
          }}
          size="small"
          variant="outlined"
          color="secondary"
        >
          Export Video
        </Button>
      </div>
    </>
  );
};

export default ControlPanel;
