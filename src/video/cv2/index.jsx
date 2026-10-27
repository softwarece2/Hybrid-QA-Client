import { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import AxiosInstanceVideo from "pages/Services/AxiosInstanceVideo";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { Videocam, ChatRounded } from "@material-ui/icons";
import CameraPlayers from "./CameraPlayers";
import Chat from "chat";
import { toast } from "react-toastify";
import { CV2_IP } from "config";

export default function VideoInspection({
  camAccess,
  olNum,
  olId,
  olLiNum,
  olLiId,
  productId,
  testId,
  testName,
  devId,
  isQc,
  regNo,
  checkActiveCams
}) {
  const [selectedCam, setSelectedCam] = useState([]);
  const [allVmsCameras, setAllVmsCameras] = useState({
    ip_cams: [],
    usb_cams: [],
    ip_map: {},
    usb_map: {},
  });

  //  camera_url comes directly from backend
  const [camUrls, setCamUrls] = useState({});
  const [showChat, setShowChat] = useState(false);

  //  FETCH CAMERAS (this already initializes them on backend)
  async function getAllCams() {
    try {
      let apiData = {};
      //if QC user, they should have access to all cameras (fetch from python server directly)
      //if QA, they should have access to cameras mapped to test
      if(isQc){
        // console.log("loggedInUser isQC: " + isQc);
        const response = await AxiosInstanceVideo(`/get_cams`, {
          method: "POST",
          data: {
            user_id: 4,
          },
        });
        apiData = response.data;
      }else{ 
        if (!camAccess) {
          toast.error("Camera Access unavailable, please request access");
          return;
        }
        const response = await axiosInstanceAte(`/sbuCameraMapping/getByIpList/${testId}`, {
          method: "GET",
          // data: {
          //   user_id: 4,
          // },
        });
        apiData = response.data; 
      }
      // console.log("data api: ",apiData);
      const ip_cams = Object.keys(apiData);
      const ip_map = {};
      const urls = {};

      ip_cams.forEach((ip) => {
        ip_map[ip] = apiData[ip].name;
        urls[ip] = apiData[ip].url; //  IMPORTANT: already usable
      });

      setAllVmsCameras({
        ip_cams,
        usb_cams: [],
        ip_map,
        usb_map: {},
      });

      setCamUrls(urls);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getAllCams();
    // console.log("olId: "+olId+" lineItemId: "+olLiId);
  }, []);

  //  TOGGLE STREAM (correct endpoints)
  const handleToggle = async (cam, type) => {
    const key = `${cam}_${type}`;
    const isSelected = selectedCam.includes(key);

    const nextSelected = isSelected
      ? selectedCam.filter((c) => c !== key)
      : [...selectedCam, key];

    setSelectedCam(nextSelected);

    const cameraUrl = camUrls[cam];
    if (!cameraUrl) return;


    try {
      const endpoint = isSelected ? "stop_stream" : "start_stream";

      await fetch(
        `${CV2_IP}/${endpoint}/${cameraUrl}`
      );
    } catch (err) {
      console.error(err);
    }
  };
  //Pass number of active cameras to parent Widget
  useEffect(()=>{
    checkActiveCams(selectedCam.length);
  },[selectedCam]);

  //Fallback in case of user closes the browser with cameras running.
  //Won't stop the streams but will warn the user to turn them off.
  const handleBrowserClose = (event)=>{
    let warn = "";
    (selectedCam.length===1) ? warn = "1 camera stream is still running, please turn it off." : warn = selectedCam.length + " camera streams are still running, please turn them off.";
    toast.info(warn);
    event.preventDefault();
    event.returnValue="";
  }
  useEffect(()=>{
    if(selectedCam.length===0) return;
    window.addEventListener("beforeunload",handleBrowserClose);
    return()=>{
      window.removeEventListener("beforeunload",handleBrowserClose);
    }
  },[selectedCam])
  return (
    <Box style={{ display: "flex", gap: 8, minHeight: 500 }}>
      {/* Sidebar */}
      <div
        style={{
          alignSelf: "flex-start",
          borderRight: "1px solid rgb(211,240,253)",
          borderLeft: "1px solid rgb(211,240,253)",
          borderBottom: "1px solid rgb(211,240,253)",
          position: "sticky",
          top: 32,
        }}
      >
        {/* IP Cameras */}
        <Typography
          variant="subtitle2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          IP Camera
        </Typography>

        {allVmsCameras.ip_cams.length === 0 && (
          <Typography variant="caption" style={{ paddingLeft: 60 }}>
            No IP cam found!
          </Typography>
        )}

        <List dense style={{ width: 240 }}>
          {allVmsCameras.ip_cams.map((cam) => {
            const isSelected =
              selectedCam.findIndex(
                (c) => c.split("_")[0] === cam
              ) !== -1;

            return (
              <ListItem key={cam} style={{ borderBottom: "1px solid #ccc" }}>
                <ListItemIcon style={{ minWidth: 36 }}>
                  <Videocam color={isSelected ? "primary" : "action"} />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="subtitle1">
                      {allVmsCameras.ip_map[cam] || cam}
                    </Typography>
                  }
                />

                <Switch
                  size="small"
                  checked={isSelected}
                  onChange={() => handleToggle(cam, "ip")}
                />
              </ListItem>
            );
          })}
        </List>

        {/* USB Cameras */}
        <Typography
          variant="subtitle2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          USB Camera
        </Typography>

        <Typography variant="caption" style={{ paddingLeft: 60 }}>
          No USB cam found!
        </Typography>

        {/* Chat */}
        <Typography
          variant="subtitle2"
          style={{ backgroundColor: "aliceblue", paddingLeft: 8 }}
        >
          Other options
        </Typography>

        <Button
          color="primary"
          startIcon={<ChatRounded />}
          onClick={() => setShowChat(!showChat)}
          style={{ paddingInline: 65 }}
        >
          {showChat ? "Hide Chat" : "Show Chat"}
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <div style={{ backgroundColor: "aliceblue", paddingLeft: 16 }}>
          <Typography variant="subtitle2">Video Stream</Typography>
        </div>

        <CameraPlayers
          selectedCam={selectedCam}
          olNum={olNum}
          olId={olId}
          olLiNum={olLiNum}
          olLiId={olLiId}
          productId={productId}
          testId={testId}
          testName={testName}
          devId={devId}
          allVmsCameras={allVmsCameras}
          camUrls={camUrls}
          camAccess={camAccess}
          regNo={regNo}
        />

        <Divider style={{ marginBlock: 8 }} />
        {showChat && <Chat />}
      </div>
    </Box>
  );
}