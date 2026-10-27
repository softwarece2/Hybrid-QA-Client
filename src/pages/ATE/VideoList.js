import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: "1px solid lightgrey",
    maxWidth: 200,
    paddingLeft:8,
    backgroundColor: theme.palette.background.paper,
    height:500,
    overflow:'auto'
  },
  rootListItem:{
    paddingBlock:0
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "white",
  },
}));

export default function VideoList({ allVideo, setSelectedVideo, selectedVideo }) {
  const classes = useStyles();

  if (!Object.keys(allVideo).length) {
    return <Typography style={{ paddingRight: 16 }}>No Video List found </Typography>;
  }

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders" dense>
        {Object.entries(allVideo).map(([date, cameras]) => (
          <React.Fragment key={date}>
            <Typography variant="body2"color="secondary">{date}</Typography>
            {Object.entries(cameras).map(([ip, videos]) => (
              <React.Fragment key={ip}>
               <Typography variant="caption"color="primary">{ip}</Typography>
                <List  component="div" disablePadding>
                  {videos.map((video) => (
                    <ListItem
                    classes={{ selected: classes.selected,root:classes.rootListItem }}
                      key={video}
                      style={{ paddingLeft: 8 }}
                      button
                      selected={ip + "_" + video + "_" + date === selectedVideo}
                      onClick={() => setSelectedVideo(ip + "_" + video + "_" + date)}
                    >
                      <ListItemText primary={video} primaryTypographyProps={{variant:'body2'}} />
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            ))}
          <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}
