/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import {
  Box,
  List,
  Switch,
  ListItem,
  ListItemText,
  // Button,
  Typography,
  ListItemIcon,
  Dialog,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import axios from "axios";
import { Videocam } from "@material-ui/icons";
import CameraPlayerList from "./CameraPlayerList";
import axiosInstance from "pages/Services/AxiosInstance";
import { vmsBaseUrl } from "./CameraPlayer";
import { PaperComponent } from "Utils/D3Tree";

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

export default function IPCamera({ onClose, selectedRow }) {
  const [selectedCam, setSelectedCam] = useState([]);
  const [allVmsCameras, setAllVmsCameras] = useState([]);

  console.log(selectedRow, allVmsCameras);

  const handleToggle = (cam) => () => {
    const currentIndex = selectedCam.findIndex(
      (c) => cam.cameraId === c.cameraId
    );
    const newChecked = [...selectedCam];

    if (currentIndex === -1) {
      newChecked.push(cam);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedCam(newChecked);
  };

  async function init() {
    try {
      const { data: vmsDetails } = await axiosInstance(
        "cameraDetails/getVmsServerDetails"
      );

      if (vmsDetails) {
        const reqBody = new URLSearchParams({
          username: vmsDetails.userName,
          password: vmsDetails.password,
          grant_type: vmsDetails.grant_type,
        });

        const config = {
          method: "post",
          url: vmsBaseUrl + "/gateway/login",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: vmsDetails.Authorization,
          },
          data: reqBody,
        };

        const { data: loginDetails } = await axios(config);

        if (loginDetails) {
          sessionStorage.setItem(
            "vms_access_token",
            JSON.stringify(loginDetails.access_token)
          );
          return loginDetails.access_token;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllCams() {
    axiosInstance("cameraDetails/getListByOlId/" + selectedRow.id)
      .then(({ data }) => {
        setAllVmsCameras(data);
      })
      .catch(console.log);
  }

  useEffect(() => {
    getAllCams();
    init();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title55" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          onClose={onClose}
          id="draggable-dialog-title55"
        >
          Ip Camera
        </DialogTitle>
        <DialogContent>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 500,
            }}
          >
            <div style={{ alignSelf: "flex-start" }}>
              {/* <Button
                variant="outlined"
                color="secondary"
                style={{ display: "block" }}
                onClick={() => getAllCams()}
              >
                Refresh
              </Button> */}

              <List dense style={{ width: "300px" }}>
                {allVmsCameras.map((cam) => {
                  const isSelected =
                    selectedCam.findIndex(
                      (c) => c.cameraId === cam.cameraId
                    ) !== -1;
                  return (
                    <ListItem
                      key={cam.cameraId}
                      style={{
                        borderBottom: "1px solid #ccc",
                        paddingBlock: 0,
                      }}
                    >
                      <ListItemIcon style={{ minWidth: 36 }}>
                        <Videocam color={isSelected ? "primary" : "action"} />
                      </ListItemIcon>
                      <ListItemText
                        style={{ paddingBlock: 0 }}
                        primary={
                          <Typography variant="subtitle1" color="textPrimary">
                            {cam.cameraName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="inherit">
                            {cam?.location}
                          </Typography>
                        }
                      />
                      <Switch
                        size="small"
                        edge="end"
                        disabled={!cam.physicalIp}
                        onChange={handleToggle(cam)}
                        checked={isSelected}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </div>
            <div style={{flex:1}}>

            <CameraPlayerList selectedCam={selectedCam} />
            </div>

          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
