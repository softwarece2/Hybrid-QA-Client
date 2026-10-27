import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import tinyColor from "tinycolor2";
import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import IdleTimer from "react-idle-timer";
import { Button, Dialog } from "@material-ui/core";
import "./toast-container.css";
//

import { DialogTitle, DialogContent, DialogActions } from "Utils";
import { LOGGED_IN_USER } from "Redux/Types";
import Loader from "Loader";
import RouterElement from "Routes.js";
import { warning, success, info, btn, lightenRate, darkenRate, overrides, printButton } from "ThemeConst.js";
import { useUserLogout } from "Redux/Actions/Logout/LogoutAction";
import { NotificationProvider } from "context/notification";

function MainComponent() {
  const primaryColor = useSelector((store) => store.selectedTheme.primary);
  const secondaryColor = useSelector((store) => store.selectedTheme.secondary);
  const user = useSelector((store) => store.loggedInUser) ;
  const primary = "#" + primaryColor;
  const secondary = "#" + secondaryColor;

  const defaultTheme = {
    palette: {
      type: "light",
      primary: {
        main: primary,
        light: tinyColor(primary).lighten(lightenRate).toHexString(),
        dark: tinyColor(primary).darken(darkenRate).toHexString(),
      },
      secondary: {
        main: secondary,
        light: tinyColor(secondary).lighten(lightenRate).toHexString(),
        dark: tinyColor(secondary).darken(darkenRate).toHexString(),
      },
      warning: {
        main: warning,
        light: tinyColor(warning).lighten(lightenRate).toHexString(),
        dark: tinyColor(warning).darken(darkenRate).toHexString(),
      },
      success: {
        main: success,
        light: tinyColor(success).lighten(lightenRate).toHexString(),
        dark: tinyColor(success).darken(darkenRate).toHexString(),
      },
      info: {
        main: info,
        light: tinyColor(info).lighten(lightenRate).toHexString(),
        dark: tinyColor(info).darken(darkenRate).toHexString(),
      },
      btn: {
        main: btn,
        light: tinyColor(btn).lighten(lightenRate).toHexString(),
        dark: tinyColor(btn).darken(darkenRate).toHexString(),
        print: printButton,
      },
      text: {
        primary: "#4A4A4A",
        secondary: "#6E6E6E",
        hint: "#B9B9B9",
      },
      background: {
        default: "#FBFBFB",
        light: "white",
      },
    },
    customShadows: {
      widget: "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
      widgetDark: "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
      widgetWide: "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    },
  };

  const dispatch = useDispatch();
  const idleTimerRef = useRef(null);
  const navigate = useNavigate();
  const sessionTimeoutRef = useRef(null);
  const { pathname } = useLocation();

  const themes = createTheme({ ...defaultTheme, ...overrides });
  const [openSession, setOpenSession] = React.useState(false);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("User"))) {
      dispatch({
        type: LOGGED_IN_USER,
        payload: JSON.parse(localStorage.getItem("User")),
      });
    }
  }, [dispatch]);

  const onIdle = () => {
    if (user) {
      setOpenSession(true);
      sessionTimeoutRef.current = setTimeout(handleLogout, 300000);
    }
  };

  // const logOut = () => {
  //   AxiosInstance.post("/userMst/logout", { mobileNo: user.mobileNo })
  //     .then(() => {
  //       localStorage.clear();
  //       dispatch({ type: LOGGED_IN_USER, payload: null });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   setOpenSession(false);
  //   clearTimeout(sessionTimeoutRef.current);
  //   if (user.role === USER_TYPES.ROLE_SUPERADMIN || user.role === USER_TYPES.ROLE_NODALOFFICER) {
  //     navigate("/Admin");
  //   } else {
  //     navigate("/");
  //   }
  //   dispatch({ type: LOGGED_IN_USER, payload: null });
  // };
const {logout} =  useUserLogout();
  const handleLogout = () => {
    if (user) {
      const data = { userName: user?.username };
      logout(data)
        .then((res) => {
          if (res === "success") {
            navigate("/home");
            toast.success("Logged out successfully.");
            clearTimeout(sessionTimeoutRef.current);
            setOpenSession(false);
          }
          // else {
          //   toast.error("Logout failed.");
          // }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      toast.success("Logged out successfully.");
      navigate("/home");
    }
  };

  const stayActive = () => {
    setOpenSession(false);
    clearTimeout(sessionTimeoutRef.current);
  };

  return (
    <>
      <ToastContainer position="bottom-center" closeButton={false} />
      <ThemeProvider theme={themes}>
        {user && !(pathname === "/" || pathname === "/home") && <IdleTimer ref={idleTimerRef} timeout={1000 * 3600} onIdle={onIdle} />}
        {/* {toggleRI && (
          <Widget
            onClose={() => {
              dispatch({ type: TOGGLE_RI });
            }}
            title="Video Inspection"
          >
            {" "}
            <VideoInspection />
          </Widget>
        )} */}
        <Dialog open={openSession} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
          <DialogTitle onClose={() => setOpenSession(false)}>Confirm Navigation</DialogTitle>
          <DialogContent>Are you sure you want to leave this page?</DialogContent>
          <DialogActions>
            <Button onClick={handleLogout} style={{ color: "primary" }} variant="contained" color="primary">
              Leave this Page
            </Button>
            <Button onClick={stayActive} autoFocus variant="contained" color="secondary">
              Stay on this Page
            </Button>
          </DialogActions>
        </Dialog>
        {/* Routes */}
        <RouterElement />
        {/* Routes */}
      </ThemeProvider>
    </>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Router>
        <NotificationProvider>
        <MainComponent />
        </NotificationProvider>
      </Router>
    </React.Suspense>
  );
}
