import { useState, useEffect, useRef } from "react";
import ControlPanel from "./Controls";
import { Popper, IconButton, ClickAwayListener } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { VMS_IP } from "../../config";


const wsUri = "ws://" + VMS_IP + ":11055";
export const vmsBaseUrl = "http://" + VMS_IP + ":11011";

const speed = 5;
const tile = 1;

const CameraPlayer = (props) => {
  const canvasRef = useRef();
  const [socket, setSocket] = useState();
  const { cam, width, height, moreVert } = props;

  const resetCamera = () => {
    setTimeout(() => {
      socket.send(
        `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},0,0,${speed},#`
      );
    }, 300);
  };

  const onControlClick = (cam, action) => {
    console.log(cam, action);
    switch (action) {
      case "up":
        //(left-> 0,1)
        socket.send(
          `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},0,1,${speed},#`
        );
        resetCamera();
        break;
      case "down":
        // (bottom-> 0,-1)
        socket.send(
          `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},0,-1,${speed},#`
        );
        resetCamera();
        break;
      case "left":
        // (left-> -1,0)
        socket.send(
          `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},-1,0,${speed},#`
        );
        resetCamera();
        break;
      case "right":
        // (right-> 1,0)
        socket.send(
          `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},1,0,${speed},#`
        );
        resetCamera();
        break;
      // case "center":
      //   // (center -> 0,0)
      //   socket.send(
      //     `#,0,11,0,0,4009,0,0,0,0,${tile},${cam.cameraId},0,0,${speed},#`
      //   );
      //   break;
      case "rotateLeft":
        // Handle rotate left action
        break;
      case "rotateRight":
        // Handle rotate right action
        break;
      case "zoomIn":
        socket.send(
          `#,0,11,0,0,4010,0,0,0,0,${tile},${cam.cameraId},1,${speed},#`
        );
        resetCamera();
        break;
      case "zoomOut":
        socket.send(
          `#,0,11,0,0,4010,0,0,0,0,${tile},${cam.cameraId},-1,${speed},#`
        );
        resetCamera();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const wbSocket = new WebSocket(wsUri);
    wbSocket.binaryType = "arraybuffer";
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    wbSocket.onopen = function (evt) {
      onOpen(evt);
    };
    wbSocket.onclose = function (evt) {
      onClose(evt);
    };
    wbSocket.onmessage = function (evt) {
      onMessage(evt);
    };
    wbSocket.onerror = function (evt) {
      onError(evt);
    };

    const onMessage = (evt) => {
      const receivedData = evt.data;
      const array = new Uint8ClampedArray(receivedData);
      const image = new ImageData(array, width, height);
      ctx.putImageData(image, 0, 0);
    };

    function onOpen() {
      wbSocket.send(
        `#,0,11,0,0,4007,0,0,0,0,1,${cam.cameraId},${tile},${width},${height},1,#`
      );
    }
    function onClose() {
      wbSocket.close(4008, cam.cameraId);
    }
    function onError(evt) {
      console.log(evt, "error");
    }
    setSocket(wbSocket);
    return () => {
      wbSocket.close();
    };
  }, [height, width, cam.cameraId]);

  if (!cam) {
    return <p>No Camera Found!</p>;
  }

  const style = {
    display: "grid",
    position: "relative",
    gridTemplateColumns: "1fr 150px",
    rowGap: 8,
    columnGap: 8,
    gridAutoRows: height,
    placeItems: "center",
    placeContent: "center",
    // paddingBottom: 16,
  };

  return (
    <div style={!moreVert && style}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "4px solid darkGreen", borderRadius: 4 }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -24,
          backgroundColor: "antiquewhite",
          color: "red",
          fontSize: 13,
          fontWeight: 600,
          paddingInline: 16,
        }}
      >
        {cam.cameraName}
      </div>
      {moreVert ? (
        <ControlPopper
          onControlClick={onControlClick}
          cam={cam}
          socket={socket}
        />
      ) : (
        <ControlPanel
          onControlClick={onControlClick}
          cam={cam}
          socket={socket}
        />
      )}
    </div>
  );
};

export default CameraPlayer;

function ControlPopper({ onControlClick, cam, socket }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <IconButton
          style={{ background: "#eee" }}
          color="secondary"
          size="small"
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
          <ControlPanel
            onControlClick={onControlClick}
            cam={cam}
            socket={socket}
          />
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
