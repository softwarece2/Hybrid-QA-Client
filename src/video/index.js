// import { Routes, Route } from "react-router-dom";
// import LobbyScreen from "./screens/Lobby";
// import RoomPage from "./screens/Room";
// import VideoCall from "./video";
// import Lobby from "./video/Lobby";
// import Meeting from "./video/Meeting";
// import MeetLobby from "./meet/MeetLobby";
// import MeetRoom from "./meet/MeetRoom";
// import IPCamera from "./ipcamera";
import { Paper, ThemeProvider, createTheme } from "@material-ui/core";
import IPCamera from "./ipcamera";
// import { SocketProvider } from "./context";

const theme = createTheme({
  // palette: {
  //   type: "dark",
  // },
  overrides: {
    MuiButton: {
      root: {
        fontSize: "small", // Use fontSize instead of size
        minWidth: 45,
      },
    },
  },
});

function VideoCam() {
  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh",  }}>
        {/* <SocketProvider> */}
          <IPCamera />
          {/* <Routes>
      <Route path="/" element={<MeetLobby />} />
      <Route path="/:roomId" element={<MeetRoom />} />
    </Routes> */}
        {/* </SocketProvider> */}
      </Paper>
    </ThemeProvider>
  );
}

export default VideoCam;
