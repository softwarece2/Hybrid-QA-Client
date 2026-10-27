/* eslint-disable react-hooks/exhaustive-deps */

// import { Badge } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import MailIcon from "@material-ui/icons/Mail";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import ActionButton from "components/ActionButton";
import OLNotification from "pages/Notifications/OLNotification/OLNotification";
import SONotification from "pages/Notifications/SONotification/SONotification";
import { getAllUnreadNotificationsSender } from "pages/Services/URLs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import { getAllUnreadNotify, getAllUnreadNotifySender } from "Redux/Actions/Notifications/UnreadNotificationAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Notifications() {
  const handleRoute = (event) => {
    console.log("Navigating...");
    event.preventDefault();
    dispatch(selectItem(<SONotification />));
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notifications = useSelector((state) => state?.unreadNotificationsReducer?.unreadNotifications);
  const notificationsSender = useSelector((state) => state?.unreadNotificationsReducerSender?.unreadNotificationsReducerSender);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  //   useEffect(() => {
  //     axiosInstance
  //       .get(getAllUnreadNotifications)
  //       .then((res) => setNotifications(res?.data))
  //       .catch((error) => {
  //         console.log("notification fetch error", error.response?.data);
  //       });
  //   }, []);
  useEffect(() => {
    if (loggedInUser) {
      try {
        dispatch(getAllUnreadNotify(loggedInUser?.empId));
        dispatch(getAllUnreadNotifySender(loggedInUser?.empId));
      } catch (error) {
        console.error("Error fetching notifications for logged-in user:", error);
      }} else {
        try {
          dispatch(getAllUnreadNotifySender());
        } catch (error) {
          console.error("Error fetching sender notifications:", error);
        }
      }
  }, [loggedInUser]);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotification = (notificationCategory) => {
    if (notificationCategory === "SO") {
      dispatch(selectItem(<SONotification />));
    } else if (notificationCategory === "OL") {
      dispatch(selectItem(<OLNotification />));
    }
  };

  const handleNotificationsSender = (notificationCategory,) => {
    if (notificationCategory === "SOSender") {
      dispatch(selectItem(<SONotification />));
    } else if (notificationCategory === "OLSender") {
      dispatch(selectItem(<OLNotification />));
    }
  };

  return (
    <>
      {/* <Badge
        aria-controls="customized-menu"
        aria-haspopup="true"
        badgeContent={notifications?.length}
        max={99}
        color="secondary"
        onClick={handleClick}
      >
        <NotificationsIcon fontSize="medium" />
      </Badge> */}
      <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {/* {notifications &&
          notifications?.slice(Math.max(notifications.length - 10, 0)).map((item) => (
            <StyledMenuItem style={{ fontSize: "0.2rem" }}>
              <ListItemIcon>
                <MailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                // primary={`${item?.notificationName} on ${moment(item?.createdDateTime).format("DD-MM-YYYY")}`}
                primary={`${item?.notificationName} on ${item?.createdDateTime}`}
                onClick={() => handleNotification(item?.notificationCategory)}
              />
            </StyledMenuItem>
          ))} */}
          {notifications && notificationsSender && notifications.length > 0 && ( //  Parentheses are important!
  notificationsSender.slice(Math.max(notifications.length - 10, 0)).map((item) => (
    <StyledMenuItem style={{ fontSize: "0.2rem" }} key={item.id}> {/* Add a key! */}
      <ListItemIcon>
        <MailIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={`${item?.notificationName} on ${item?.createdDateTime}`}
        onClick={() => handleNotification(item?.notificationCategory) && handleNotificationsSender(item?.notificationCategory)}
      />
    </StyledMenuItem>
  ))
)}
        <ActionButton onClick={handleRoute}>
          <b>More</b>
        </ActionButton>
      </StyledMenu>
    </>
  );
}
