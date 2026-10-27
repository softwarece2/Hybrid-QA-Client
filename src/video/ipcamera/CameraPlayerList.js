import { Typography, Paper } from "@material-ui/core";
import CameraPlayer from "./CameraPlayer";

export default function CameraPlayerList({ selectedCam }) {
  let height = 480;
  let width = 640;
  let camLength = selectedCam?.length;
  // console.log(selectedCam);



  // if (camLength >= 2) {
  //   height = 400;
  //   width = 500;
  // }

  if (!camLength) {
    return (
      <Typography align="center" variant="h4" color="primary">
        No Camera Selected!
      </Typography>
    );
  }

  if (camLength === 1) {
    return (
      <Paper
        style={{
          maxHeight: "calc(100vh - 50px)",
          overflowY: "auto",
          padding: 8,
          paddingBottom:24
        }}
      >
        <CameraPlayer
          height={height}
          width={width}
          cam={selectedCam[0]}
        />
      </Paper>
    );
  }

  return (
    <Paper
      style={{ maxHeight: "calc(100vh - 50px)", overflowY: "auto", padding: 8 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 8,
          columnGap: 8,
           paddingBottom:16,
          gridAutoRows: height,
          placeItems: "center",
          placeContent: "center",
        }}
      >
        {selectedCam.map((cam) => (
          <CameraPlayer
            key={cam.id}
            height={height}
            width={width}
            cam={cam}
            moreVert
          />
        ))}
      </div>
    </Paper>
  );
}
