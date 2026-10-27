import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import clsx from "clsx";
import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LogoLayout from "./LogoLayout";

import { Button, CircularProgress, Dialog, DialogActions, Grid, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import VideoTable from "pages/VideoInspection/Sbu/VideoTable";
//globals
import { USER_ROLE_ID } from "../../Globals";

//pages
import { AccountCircle } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserLogout } from "Redux/Actions/Logout/LogoutAction";
import SuperAdminTreeView from "./TreeView/SuperAdminTreeView";
// import SOTreeView from "../SOModule/SOTreeView"
import { TRANSACTION_URL } from "config.js";
import VideoStreamLayout from "pages/VideoInspection/VideoStreamLayout";
import Socket from "react-stomp";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { CLOSE_RI, OPEN_RI } from "Redux/Types";
import { PaperComponent } from "Utils/D3Tree";
import VideoInspection from "video/cv2";
import FagEndNotification from "./FagEndNotification";
import DOTreeView from "./TreeView/DOTreeView";
import EXTreeView from "./TreeView/EXTreeView";
import GICTreeView from "./TreeView/GICTreeView";
import HoSTreeView from "./TreeView/HoSTreeView";
import InspectorTreeView from "./TreeView/InspectorTreeView";
import PlannerTreeView from "./TreeView/PlannerTreeView";
import SbuTreeView from "./TreeView/SbuTreeView";
import UpdatePassword from "./UpdatePassword";
import JETreeView from "./TreeView/JETreeView";
import AETreeView from "./TreeView/AETreeView";
import DACTreeView from "./TreeView/DACTreeView";
import ACTreeView from "./TreeView/ACTreeView";
import DCTreeView from "./TreeView/DCTreeView";
import DOATreeview from "./TreeView/DOATreeView"
import Widget from "widget";
import { useNotification } from "context/notification";

const drawerWidth = 255;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    margin: theme.spacing(1),
  },
  input: {
    height: 35,
    width: "100",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginBottom: 6,
    marginRight: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
  hide: {
    display: "none",
    color: theme.palette.primary.contrastText,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.contrastText,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingInline: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    fontSize: "1rem",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function Layout() {
  // const [setAudio] = useAudio();
  const { reset} = useNotification();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [openMeet, setOpenMeet] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [dialogMsg, setDialogMsg] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const toggleRI = useSelector((state) => state.toggleRI);
  

  const navigate = useNavigate();
  const user = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);

  const selectedItem = useSelector((store) => store?.selectedTreeItem);
  const user_role = useSelector((store) => store?.loggedInUser?.roleId);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
const[openVideo, setOpenVideo]=useState(false);
  const departmentNameDisplay = user?.departmentName ? `-${ user?.departmentName}` : '';
  // const videoOlDetails = useSelector((state) => state?.unreadNotificationsReducer?.videoOlDetails);
  const [videoOlDetails, setVideoOlDetails] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };



  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  const { logout } = useUserLogout();

  const handleLogout = () => {
    setLoggingOut(true);
    const data = { userName: user?.username };
    logout(data)
      .then((res) => {
        // if (res === "success") {
          navigate("/home");
        // }
        // else {
        //   toast.error("Logout failed.");
        // }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoggingOut(false);
        setOpen(false);
      });
  };
  const handleClick = () => {
    setOpenVideo(true);
    // Navigate to the specified URL
    // window.open("https://xenvis.in/login", "_blank");
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.mobMenu}
    >
      <MenuItem onClick={handleMenuClose} style={{ color: "#228C22", fontSize: "0.875rem" }}>
        {user?.ename} ({user?.roleName}) {departmentNameDisplay}
      </MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
      <MenuItem
        onClick={() => {
          setSaveDialog(true);
        }}
        style={{ fontSize: "0.875rem" }}
      >
        Change Password
      </MenuItem>

      <MenuItem onClick={handleLogout} style={{ fontSize: "0.875rem", color: "red" }}>
        Logout&nbsp;
        {loggingOut && <CircularProgress color="secondary" size={14} />}
      </MenuItem>
    </Menu>
  );

  const handleOpenMeetingDialog = () => {
    dispatch(selectItem(<VideoStreamLayout meetingId={meetingId} />));
    setOpenMeeting(false);
  };

  const handleOpenMeetDialog = () => {
    dispatch({ type: OPEN_RI });
    setOpenMeet(false);
  };

  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
             {toggleRI.isOpen && (
               <Widget title={"Remote Inspection"} onClose={()=>{ dispatch({ type: CLOSE_RI}); }}>
            <VideoInspection olNumber={ toggleRI.olNumber || videoOlDetails?.olNumber} lineItemNo={ toggleRI.lineItemNo || videoOlDetails?.lineItemNo}  devId={455} testId={1060} productId={105}  testName={"changeMePlease"} />
      </Widget>
      )}
      
      <Dialog
        open={saveDialog}
        align="center"
        fullWidth 
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title24" {...props} />}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          onClick={handleMenuClose}
          onClose={() => setSaveDialog(false)}
          id="draggable-dialog-title24"
        >
          Change Password
        </DialogTitle>

        <DialogContent>
          <UpdatePassword onClose={() => setSaveDialog(false)} />
        </DialogContent>

        <DialogActions>
          {/* <Button
            color="Secondary"
            variant="contained"
            onClick={() => {
              setSaveDialog(false);
            }}
          >
            {" "}
            Close
          </Button> */}
        </DialogActions>
      </Dialog>

      <AppBar
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.title} noWrap>
            {/* Quality Management Inspection Software */} {user?.ename} {user?.orgName ? `(${user?.orgName})` : ""}
          </Typography>

          <div className={classes.root} />
          <div className={classes.sectionDesktop}>

            {user_role === USER_ROLE_ID.ROLE_QAO ||
            user_role === USER_ROLE_ID.ROLE_AQAO ||
            user_role === USER_ROLE_ID.ROLE_OIC_ADMIN ||
            user_role === USER_ROLE_ID.ROLE_INSPECTOR ? (
              <IconButton color="inherit">
                <FagEndNotification />
              </IconButton>
            ) : null}

            <Tooltip title={"Video Call"}>
              <IconButton edge="start" onClick={handleClick} color="inherit">
                <VideocamOutlinedIcon style={{ fontSize: "1.8rem" }} />
              </IconButton>
            </Tooltip>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle style={{ fontSize: "1.8rem" }} />
            </IconButton>
          </div>
          
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={10}>
            <LogoLayout />
          </Grid>
          <Grid item xs={2} onClick={handleDrawerClose}>
            <Typography>
              <IconButton style={{ color: "black" }} size="small">
                {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>

        <Divider />
        {user_role === USER_ROLE_ID.ROLE_SUPER_ADMIN ? (
          <SuperAdminTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_FIRM_ADMIN ? (
          <SbuTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_HOS ? (
          <HoSTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_GIC ? (
          <GICTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_EXAMINER ? (
          <EXTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_PLANNER ? (
          <PlannerTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_DO ? (
          <DOTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_DC ? (
          <DCTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_AC ? (
          <ACTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_DAC ? (
          <DACTreeView />
        ) : user_role === USER_ROLE_ID.ROLE_AE ? (
          <AETreeView />
        ) : user_role === USER_ROLE_ID.ROLE_JE ? (
          <JETreeView />
        ) : user_role === USER_ROLE_ID.ROLE_INSPECTOR ? (
          <InspectorTreeView /> ) 
        : user_role === USER_ROLE_ID.ROLE_DOA ?(
          <DOATreeview/>
        )
        
        : null}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <Typography>{selectedItem}</Typography>
      </main>
      {renderMenu}
      <Socket
        url={`${TRANSACTION_URL}olms-websocket`}
        topics={["/topic/cqae"]}
        onConnect={() => console.log("Updating Supply Order List - Connected")}
        onDisconnect={() => console.log("Updating Supply Order List- Disconnected")}
        onMessage={(msg) => {
          if (msg?.receivers.includes(empId)) {
            if (msg.messageType === "SO" || msg.messageType === "OL" ||  msg.messageType === "OL_QIN" || msg.messageType === "OL_ALLOTMENT" || 
              msg.messageType === "SO_ALLOTMENT" || msg.messageType === "QAR_ALLOTMENT" || msg.messageType === "QAR_ALLOTMENT_TYPE" || msg.messageType === "WARRANT_ALLOTMENT_TYPE"
             ) {
              toast.info(msg.message);
              reset()
            } else if (msg.messageType === "ri-link") {
              setMeetingId(msg?.meetingId);
              setDialogMsg(msg?.message);
              setOpenMeeting(true);
            } else if (msg.messageType === "webcam-link") {
              sessionStorage.setItem("meet_msg", JSON.stringify(msg));
              setVideoOlDetails({
                olNumber: msg?.olNumber,
                lineItemNo: msg?.lineItemNo,
              });
              setMeetingId(msg?.meetingId);
              setDialogMsg(msg?.message);
              setOpenMeet(true);
            }
          }
        }}
      />
      <Dialog open={openMeeting} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
        <DialogTitle onClose={() => setOpenMeeting(false)}>Meeting Invitation</DialogTitle>
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button onClick={handleOpenMeetingDialog} style={{ color: "primary" }} variant="contained" color="primary">
            Join Meeting
          </Button>
          <Button onClick={() => setOpenMeeting(false)} autoFocus variant="contained" color="secondary">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMeet} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
        <DialogTitle onClose={() => setOpenMeet(false)}>Meeting Invitation</DialogTitle>
        <DialogContent>{dialogMsg}</DialogContent>
        <DialogActions>
          <Button onClick={handleOpenMeetDialog} style={{ color: "primary" }} variant="contained" color="primary">
            Join Meeting
          </Button>
          <Button onClick={() => setOpenMeet(false)} autoFocus variant="contained" color="secondary">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
       {openVideo && <VideoTable open={openVideo} onClose={() => setOpenVideo(false)} />}
    </div>
  );
}
