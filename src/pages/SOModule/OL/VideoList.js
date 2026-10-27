import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 200,
    height: 500,
    overflow: "auto",
  },
  rootListItem: {
    paddingBlock: 0,
    fontWeight:600
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "white",
  },

}));


export default function VideoList({allVideo,  setSelectedVideo, selectedVideo }) {
  const classes = useStyles();

  if (!Object.keys(allVideo).length) {
    return <Typography style={{ paddingRight: 16 }}>No video list found</Typography>;
  }

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders" dense style={{padding:0}}>
        {Object.entries(allVideo).map(([line_item_name, dates]) => (
          <div key={line_item_name} style={{border:'1px solid #fbc5c5',marginBottom:4,}}>
            <Typography variant="subtitle1"  style={{backgroundColor:"#ffeccd", textAlign:"center", color:"#583b0b"}}>
              {line_item_name}
            </Typography>
            {Object.entries(dates).map(([date, cameras]) => (
              <React.Fragment key={date}>
                <Typography variant="subtitle1" color="primary" style={{backgroundColor:"#ddf7ff",paddingLeft:8}}>
                  {date}
                </Typography>
                {Object.entries(cameras).map(([ip, videos]) => (
                  <React.Fragment key={ip}>
                    <Typography variant="subtitle2"  color="primary" style={{paddingLeft:8, fontWeight:600}}>
                      {ip}
                    </Typography>
                    <List component="div" disablePadding>
                      {videos.map((video) => (
                        <ListItem
                          classes={{ selected: classes.selected, root: classes.rootListItem }}
                          key={video}
                          style={{ paddingLeft: 12, borderBottom:'1px solid #99e7ff' }}
                          button
                          selected={line_item_name + "+" + ip + "+" + video + "+" + date === selectedVideo}
                          onClick={() => setSelectedVideo(line_item_name + "+" + ip + "+" + video + "+" + date)}
                        >
                          <ListItemText primary={video} primaryTypographyProps={{ variant: "body2" }} />
                        </ListItem>
                      ))}
                    </List>
                  </React.Fragment>
                ))}
                <Divider />
              </React.Fragment>
            ))}
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}
