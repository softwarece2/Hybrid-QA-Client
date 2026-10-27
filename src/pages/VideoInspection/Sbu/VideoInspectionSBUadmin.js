import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CallEndRounded, VideoCallRounded } from "@material-ui/icons";
import { Box, Grid } from "@material-ui/core";
import Button from "components/Button";
import VideoStreamSBUadmin from "./VideoStreamSBUadmin";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      display: "flex",
      justifyContent: "center",
    },
  },
  fab: {
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
  },
  infoCard: {
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.dark,
    },
  },
  backbtn: {
    marginTop: "10px",
    marginLeft: "10px",
  },
}));

export default function VideoInspectionSBUadmin(props) {
  const classes = useStyles();
  const [openVideo, setOpenVideo] = useState(false);
  const onClickHandler = () => {
    setOpenVideo(true);
    window.scrollBy(0, 250);
  };

  return (
    <div className={classes.root}>
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Box
              style={{
                padding: 12,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {openVideo === false ? (
                <>
                  {" "}
                  <Button
                    onClick={onClickHandler}
                    startIcon={<VideoCallRounded />}
                    className={classes.btn}
                    variant="contained"
                  >
                    Join
                  </Button>{" "}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setOpenVideo(false)}
                    startIcon={<CallEndRounded />}
                    color="secondary"
                    variant="contained"
                  >
                    End Call
                  </Button>
                </>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={11}>
            {openVideo && <VideoStreamSBUadmin meetId="112" />}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
