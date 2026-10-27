import { Typography, Slider, Dialog } from "@material-ui/core";
import { CV2_IP } from "config";
import {
  Add,
  ArrowBack,
  ArrowDownward,
  ArrowForward,
  ArrowUpward,
  Remove,
} from "@material-ui/icons";
import AxiosInstanceVideo from "pages/Services/AxiosInstanceVideo";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import { loggedInUser } from "Redux/Reducer/User";

function getBackendCameraIP(cam, camUrls) {
  const [site_address] = cam.split("_");
  return camUrls[site_address] || "";
}

function getCamDetails(cam, type) {
  const [site_address, cam_type] = cam.split("_");
  if (type === "cam_Type") return cam_type;
  if (type === "site_address") return site_address;
}

const height = 480;
const width = 640;

export default function CameraPlayerList({
  selectedCam,
  olNum,
  olId,
  olLiNum,
  olLiId,
  allVmsCameras,
  camUrls,
  camAccess,
  devId,
  testId,
  regNo
}) {
  console.log(olNum, "olNum---");
  const user =
    useSelector((store) => store.loggedInUser) ||
    JSON.parse(localStorage.getItem("User"));

  const [ptzStep, setPtzStep] = useState(1);

  const handleControlClick = useCallback(async (direction, cam) => {
    const site_address = getCamDetails(cam, "site_address");
    const camera_url = camUrls[site_address];

    if (!camera_url) return;

    const step = ptzStep / 10;

    let x = 0,
      y = 0,
      z = 0;

    if (direction === "up") y = step;
    if (direction === "down") y = -step;
    if (direction === "left") x = -step;
    if (direction === "right") x = step;
    if (direction === "zoom-in") z = step * 10;
    if (direction === "zoom-out") z = -step * 10;

    try {
      let endpoint = "/ptz/relative/";
      if (direction === "zoom-in" || direction === "zoom-out") {
        endpoint = "/ptz/continuous/";
      }
      if (direction === "stop") {
        endpoint = "/ptz/stop/";
      }

      await fetch(`${CV2_IP}${endpoint}${camera_url}`, {
        headers: { x, y, z },
      });
    } catch (err) {
      console.error("PTZ error", err);
    }
  }, [ptzStep, camUrls, CV2_IP]);

  if (!selectedCam?.length) {
    return (
      <Typography align="center" variant="h4" color="primary">
        No Camera Selected!
      </Typography>
    );
  }

  return (
    <>
      {/* PTZ SPEED */}
      <div style={{ width: 300, margin: "10px auto" }}>
        <Typography variant="subtitle2">PTZ Speed</Typography>
        <Slider
          value={ptzStep}
          min={0.1}
          max={10}
          step={0.1}
          valueLabelDisplay="auto"
          onChangeCommitted={(e, val) => setPtzStep(val)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {selectedCam.map((cam, i) =>
          getCamDetails(cam, "cam_Type") !== "ip" ? (
            <USBCam
              key={i}
              cam={cam}
              allVmsCameras={allVmsCameras}
            />
          ) : (
            <IPCam
              key={i}
              cam={cam}
              camUrls={camUrls}
              handleControl={handleControlClick}
              user={user}
              olNum={olNum}
              olId={olId}
              olLiNum={olLiNum}
              olLiId={olLiId}
              allVmsCameras={allVmsCameras}
              devId={devId}
              testId={testId}
              regNo={regNo}
            />
          )
        )}
      </div>
    </>
  );
}

/* ================= IP CAMERA ================= */

function IPCam({ cam, handleControl, user, olNum, olId, olLiNum, olLiId, allVmsCameras, camUrls, devId, testId, regNo }) {
  const [showStream, setShowStream] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // --- NEW STATE FOR TIMER ---
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [countDown, setCountdown] = useState(0);
  // Ref specifically for the Zoom interval to allow continuous movement
  const zoomIntervalRef = useRef(null);
  const camRef = useRef(cam);

  const camUrl = getBackendCameraIP(cam, camUrls);
  const site_address = getCamDetails(cam, "site_address");

  const handleRecording = async () => {
    const camera_url = camUrl;

    // 1. Check if orgId is 2. 
    // Using optional chaining (user?.orgId) prevents errors if user is null/undefined
    const isOl = user?.orgId !== 2;

    // Pre-calculate the identifier to avoid repeating the complex template literal
    const identifier = `${olNum.olNumber || olNum.name}_${olNum.soLineItemNo || olLiNum}`;
    const pathString = `${identifier}/${devId || regNo?.id}/${testId}`;
    let payload = {};
    if (isOl) {
      payload = {
        line_item_name: identifier,
        client_address: `/${devId}/${testId}`,
        site_address: ``,
        isOl: isOl, // This will be true if user.orgId is 2
        olNum: olNum.olNumber || olNum.name,
        olId: olNum.id || olId,
        olLiNum: olLiNum,
        olLiId: olLiId,
        //sSlipId: olNum.id,
        //sSlipLiId: regNo?.subSlipLineItemId,
        //sSlipDevId: regNo?.id,
        devId: devId,
        testId: testId,
        createdById: user?.empId,
        path: pathString,
      };
    } else {
      payload = {
        line_item_name: identifier,
        client_address: `/${devId}/${testId}`,
        site_address: ``,
        isOl: isOl, // This will be true if user.orgId is 2
        olNum: olNum.olNumber || olNum.name,
        //olId: olNum.id || olId,
        //olLiNum: olLiNum,
        //olLiId: olLiId,
        sSlipId: olNum.id,
        sSlipLiId: regNo?.subSlipLineItemId,
        sSlipDevId: regNo?.id,
        devId: devId,
        testId: testId,
        createdById: user?.empId,
        path: pathString,
      };
    }
    console.log("Recording path: " + pathString);
    console.log("PAYLOAD FOR RECORDING", payload);

    setIsLoading(true);
    try {
      if (!isRecording) {
        // Start Recording
        await AxiosInstanceVideo.post(`/record/${camera_url}`, payload, {
          headers: {
            Path: pathString,
            "Content-Type": "application/json",
          },
        });
        try {
          await axiosInstanceAte.post('/video/records/save', payload);
        } catch (error) {
          console.error("Video recording details failed to save in database, ", error);
        }
      } else {
        // Stop Recording
        await AxiosInstanceVideo.get(`/stop_record/${camera_url}`);
      }
      setIsRecording((prev) => !prev);
    } catch (err) {
      console.error("Recording Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  //FUNCTION TO SIMULATE RECORDING
  const mockHandleRecording = async () => {
    setIsLoading(true);

    try {
      if (!isRecording) {
        console.log("Starting 10s Simulation...");
        // 1. Wait 10 seconds to simulate 'connecting to camera/initializing'
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 2. Mock the API calls
        console.log("API Calls Simulated Successfully");

        // 3. Start the actual recording state
        setIsRecording(true);
      } else {
        // Simulate stopping
        console.log("Stopping Recording...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsRecording(false);
      }
    } catch (err) {
      console.error("Mock Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    camRef.current = cam;
  }, [cam]);

  // Trigger stream immediately without a countdown interval
  // useEffect(() => {
  //   if (camUrl) {
  //     setShowStream(true);
  //   }
  // }, [camUrl]);

  //STREAM LOAD TIMER LOGIC : Trigger stream with 10 sec countdown
  useEffect(() => {
    console.log(` Recording path sent: ${olNum.olNumber || olNum.name}_${olNum.soLineItemNo || olLiNum}/${devId}/${testId}`);

    if (!camUrl) return;

    setCountdown(10);
    setShowStream(false);

    // intervalRef.current = setInterval(() => {
    //   setCountdown((prev) => {
    //     if (prev <= 1) {
    //       clearInterval(intervalRef.current);
    //       setShowStream(true);
    //       return 0;
    //     }
    //     return prev - 1;
    //   });
    // }, 1000);

    setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowStream(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // return () => clearInterval(intervalRef.current);
  }, [camUrl]);

  // --- RECORDING TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (isRecording) {
      // Start counting when recording starts
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      // Reset when recording stops
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Helper to format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ONE-OFF MOVEMENT (No interval)
  const handleSingleMove = (e, direction, cam) => {
    if (e) e.preventDefault();
    handleControl(direction, cam);
  };

  // CONTINUOUS ZOOM (Uses interval)
  const startZoom = (direction, cam) => {
    // Clear any existing zoom interval to prevent stacking
    if (zoomIntervalRef.current) clearInterval(zoomIntervalRef.current);

    // Start sending the command every 100ms (adjust speed here)
    zoomIntervalRef.current = setInterval(() => {
      handleControl(direction, cam);
    }, 200);
  };

  const stopZoom = () => {
    if (zoomIntervalRef.current === null) { return; }
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
    //CALL SENT TO STOP MOVEMENT ONCE INTERVAL CLEARS
    handleControl("stop", cam);
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => stopZoom();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: "aliceblue",
        overflow: "visible",
      }}
    >
      {!showStream ? (
        <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600 }}>
          Stream starts in {countDown} seconds.
        </div>
      ) : (
        <img
          src={CV2_IP + "/stream/" + camUrl}
          alt="video-feed"
          width={width}
          height={height}
          style={{ display: "block" }}
        />
      )}
      <button
        type="button"
        onClick={handleRecording}
        disabled={isLoading}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "6px 10px",
          backgroundColor: isRecording ? "red" : "green",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {isLoading ? "Processing..." : isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {/* --- RENDER TIMER HERE --- */}
      {isRecording && (
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent dark background
          color: "white", // Red text to match "Stop Recording" color scheme
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "monospace", // Monospace keeps numbers from jumping
          border: "1px solid green"
        }}>
          REC {formatTime(elapsedSeconds)}
        </div>
      )}

      <label className="ptz-label" style={{ height: "50px", alignContent: "center", padding: "5px" }}>
        {allVmsCameras?.ip_map[site_address] || site_address}
      </label>

      {/* DIRECTIONAL ARROWS: One-off movements using onMouseDown or onClick */}
      <button
        type="button"
        style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)" }}
        onMouseDown={(e) => handleSingleMove(e, "up", cam)}
      >
        <ArrowUpward />
      </button>

      <button
        type="button"
        style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
        onMouseDown={(e) => handleSingleMove(e, "left", cam)}
      >
        <ArrowBack />
      </button>

      <button
        type="button"
        style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)" }}
        onMouseDown={(e) => handleSingleMove(e, "down", cam)}
      >
        <ArrowDownward />
      </button>

      <button
        type="button"
        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
        onMouseDown={(e) => handleSingleMove(e, "right", cam)}
      >
        <ArrowForward />
      </button>

      {/* ZOOM CONTROLS: Continuous movement using intervals */}
      <button
        type="button"
        onMouseDown={() => startZoom("zoom-in", cam)}
        onMouseUp={stopZoom}
        onMouseLeave={stopZoom} // Important: stop if user drags mouse away
        className="ptz-btn ptz-Zoom-in"
      >
        <Add fontSize="small" />
      </button>

      <button
        type="button"
        onMouseDown={() => startZoom("zoom-out", cam)}
        onMouseUp={stopZoom}
        onMouseLeave={stopZoom} // Important: stop if user drags mouse away
        className="ptz-btn ptz-Zoom-out"
      >
        <Remove fontSize="small" />
      </button>
    </div>
  );
}

/* ================= USB CAMERA ================= */

function USBCam({ cam, allVmsCameras }) {
  const site_address = getCamDetails(cam, "site_address");

  return (
    <iframe
      src={`${CV2_IP}/stream/${site_address}`}
      width={width}
      height={height}
      title="usb-feed"
    />
  );
}



// import { Dialog, Typography } from "@material-ui/core";
// import { CV2_IP } from "config";
// import { Add, ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, Remove, } from "@material-ui/icons";
// import AxiosInstanceVideo from "pages/Services/AxiosInstanceVideo";
// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import imagePlaceholder from "assets/Images/bel_logo_bg.png"
// //
// function getCamIp(cam, client_address) {
//   const [site_address, cam_type] = cam.split("_");
//   return `${CV2_IP}/get?cam_type=${cam_type}&site_address=${site_address}&client_address=${client_address}`;
// }

// function getCamDetails(cam, type) {
//   const [site_address, cam_type] = cam.split("_");
//   if (type === "cam_Type") {
//     return cam_type;
//   } else if (type === "site_address") {
//     return site_address;
//   }
// }

// // const height = 480;
// // const width = 640;
// export default function CameraPlayerList({ selectedCam, olNumber, lineItemNo, allVmsCameras }) {
//   const user = useSelector((store) => store.loggedInUser) || JSON.parse(localStorage.getItem("User"));

//   const handleControlClick = (direction, cam) => {
//     const site_address = getCamDetails(cam, "site_address");

//     let panStep = 0;
//     let tiltStep = 0;
//     let zoomStep = 0;

//     switch (direction) {
//       case "up":
//         tiltStep = 0.1;
//         break;
//       case "down":
//         tiltStep = -0.1;
//         break;
//       case "left":
//         panStep = -0.1;
//         break;
//       case "right":
//         panStep = 0.1;
//         break;
//       case "zoom-in":
//         zoomStep = 0.1;
//         break;
//       case "zoom-out":
//         zoomStep = -0.1;
//         break;
//       default:
//         break;
//     }

//     const payload = {
//       client_address: user?.username,
//       site_address: site_address,
//       pan_step: panStep,
//       tilt_step: tiltStep,
//       zoom_step: zoomStep,
//     };

//     AxiosInstanceVideo.post("/ptz", payload).catch((error) => {
//       console.error("PTZ_Error: ", error);
//     });
//   };

//   if (!selectedCam?.length) {
//     return (
//       <Typography align="center" variant="h4" color="primary" style={{ minHeight: 200, paddingTop: 100 }}>
//         No Camera Selected!
//       </Typography>
//     );
//   }

//   // if (camLength === 1) {
//   //   const cam = selectedCam[0];
//   //   return getCamDetails(cam, "cam_Type") !== "ip" ? (
//   //     <USBCam cam={cam} user={user} />
//   //   ) : (
//   //     <IPCam cam={cam} handleControl={handleControlClick} user={user} />
//   //   );
//   // }

//   return (
//     <div
//       style={{
//         display: "grid",
//         gap: 8,
//         gridTemplateColumns: "repeat(2, 1fr)",
//         // paddingBottom: 16,
//         // gridAutoRows: height,
//         placeItems: "center",
//         // placeContent: "center",
//       }}
//     >
//       {selectedCam.map((cam, i) =>
//         getCamDetails(cam, "cam_Type") !== "ip" ? (
//           <USBCam cam={cam} user={user} key={i} olNumber={olNumber} lineItemNo={lineItemNo} allVmsCameras={allVmsCameras} />
//         ) : (
//           <IPCam
//             cam={cam}
//             handleControl={handleControlClick}
//             key={i}
//             user={user}
//             olNumber={olNumber}
//             lineItemNo={lineItemNo}
//             allVmsCameras={allVmsCameras}
//           />
//         )
//       )}
//     </div>
//   );
// }

// //IP Camera Feed
// function IPCam({ cam, handleControl, user, olNumber, lineItemNo, allVmsCameras }) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [loading, setIsLoading] = useState(false);
//   const [isFullscreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     return () => setIsRecording(false);
//   }, []);

//   function handleRecording(cam) {
//     const site_address = getCamDetails(cam, "site_address");

//     const payload = {
//       line_item_name: olNumber + "_" + lineItemNo,
//       client_address: user?.username,
//       site_address: site_address,
//       command: isRecording ? "stop" : "start",
//     };
//     setIsLoading(true);
//     AxiosInstanceVideo.post("/save_data", payload)
//       .then(() => {
//         setIsRecording((ps) => !ps);
//       })
//       .catch((error) => {
//         console.error("PTZ_Error: ", error);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }

//   const site_address = getCamDetails(cam, "site_address");
//   const mjpegUrl = getCamIp(cam, user?.username);

//   const content = (
//     <div className="ptz-container">
//       <img src={mjpegUrl || imagePlaceholder} alt="" className={isFullscreen ? "ptz-image full-screen" : "ptz-image"} />
//       <div className={isRecording ? "recoding" : ""} />

//       <label className="ptz-label">{allVmsCameras?.ip_map[site_address] || site_address}</label>
//       <div className="ptz-controls">
//         <button title="Move Upward" onClick={() => handleControl("up", cam)} className="ptz-btn ptz-up">
//           <ArrowUpward titleAccess="Move Upward" fontSize="small" />
//         </button>
//         <button title="Move Backward" onClick={() => handleControl("left", cam)} className="ptz-btn ptz-left">
//           <ArrowBack titleAccess="Move Backward" fontSize="small" />
//         </button>
//         <button title="Move Downward" onClick={() => handleControl("down", cam)} className="ptz-btn ptz-down">
//           <ArrowDownward titleAccess="Move Downward" fontSize="small" />
//         </button>
//         <button title="Move Forward" onClick={() => handleControl("right", cam)} className="ptz-btn ptz-right">
//           <ArrowForward titleAccess="Move Forward" fontSize="small" />
//         </button>
//         <div style={{ position: "absolute", bottom: "10%", display: "flex", justifyContent: "center", width: "100%" }}>
//           <button title="Zoom In" onClick={() => handleControl("zoom-in", cam)} className="ptz-btn-z">
//             <Add titleAccess="Zoom In" fontSize="small" />
//           </button>
//           <button title="Zoom Out" onClick={() => handleControl("zoom-out", cam)} className="ptz-btn-z">
//             <Remove titleAccess="Zoom Out" fontSize="small" />
//           </button>
//         </div>
//         <button
//           title="Click to start recording (Save)"
//           disabled={loading}
//           onClick={() => handleRecording(cam)}
//           className="ptz-btn ptz-record"
//         >
//           {isRecording ? "Stop" : "Start"} Recording
//         </button>
//         <button title="Click to view in fullscreen" onClick={() => setIsFullScreen(!isFullscreen)} className="ptz-btn ptz-fullscreen">
//           {!isFullscreen ? "Full Screen" : "Exit Full Screen"}
//         </button>
//         <div hidden={!isRecording} className="ptz-pulse"></div>
//       </div>
//     </div>
//   );

//   if (isFullscreen) {
//     return (
//       <Dialog open fullScreen onClose={() => setIsFullScreen(false)}>
//         {content}
//       </Dialog>
//     );
//   }

//   return content;
// }

// //USB Camera Feed
// function USBCam({ cam, user, olNumber, lineItemNo, allVmsCameras }) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [loading, setIsLoading] = useState(false);
//   const [isFullscreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     return () => setIsRecording(false);
//   }, []);

//   function handleRecording(cam) {
//     const site_address = getCamDetails(cam, "site_address");

//     const payload = {
//       line_item_name: olNumber + "_" + lineItemNo,
//       client_address: user?.username,
//       site_address: site_address,
//       command: isRecording ? "stop" : "start",
//     };
//     setIsLoading(true);

//     AxiosInstanceVideo.post("/save_data", payload)
//       .then(() => {
//         setIsRecording((ps) => !ps);
//       })
//       .catch((error) => {
//         console.error("PTZ_Error: ", error);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }

//   const site_address = getCamDetails(cam, "site_address");
//   const mjpegUrl = getCamIp(cam, user?.username);
//   const content = (
//     <div className="ptz-container">
//       <img src={mjpegUrl || imagePlaceholder} alt="" className={isFullscreen ? "ptz-image full-screen" : "ptz-image"} />

//       <div className={isRecording ? "recording" : ""} />

//       <label className="ptz-label">{allVmsCameras?.usb_map[site_address] || site_address}</label>
//       <button disabled={loading} onClick={() => handleRecording(cam)} className="ptz-btn ptz-record">
//         <div hidden={!isRecording} className="ptz-pulse"></div>{" "}
//         <div style={{ display: "inline-block" }}>{isRecording ? "Stop" : "Start"} Recording</div>
//       </button>
//        <button title="Click to view in fullscreen" onClick={() => setIsFullScreen(!isFullscreen)} className="ptz-btn ptz-fullscreen">
//           {!isFullscreen ? "Full Screen" : "Exit Full Screen"}
//         </button>
//     </div>
//   );

//   if (isFullscreen) {
//     return (
//       <Dialog open fullScreen onClose={() => setIsFullScreen(false)}>
//         {content}
//       </Dialog>
//     );
//   }

//   return content;
// }
