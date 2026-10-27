import {
  Box,
  //   Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  // TextField,
  Typography,
 
} from "@material-ui/core";
// import EditIcon from "@material-ui/icons/Edit";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import MenuIcon from "@material-ui/icons/Menu";

export default function InnerComponent({ meetingId }) {

  // const classes = useStyles();
  const meetlink = `https://hmis-videocall.web.app/?id=${meetingId}`;
  return (
    <Box
      style={{
        position: "relative",
        minHeight: 500,
        height: '100%',
        background: (theme) => theme.palette.grey[100],
        // padding: '10px 0px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      component={Paper}
      elevation={3}
    >
      {/* <div>
        <TextField label="Type Here" fullWidth />
      </div> */}
      
        <iframe
          title="videoModule"
          allow="camera; microphone"
          src={meetlink}
          style={{ width: "100%", height: "100%" }}
          frameBorder="0"
          scrolling="no"
        ></iframe>
        <List style={{ display: "flex", flexDirection: "row" }}>
          <ListItem button>
            {/* <ListItemButton
              sx={{
                display: 'block',
                textAlign: 'center',
                borderRadius: '8px !important',
                lineHeight: '10px',
                '.MuiListItemIcon-root': { marginRight: 0 },
              }}
              selected
            > */}
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Menu </Typography>}
            />
            {/* </ListItemButton> */}
          </ListItem>
          <ListItem button>
            {/* <ListItemButton
              sx={{
                display: 'block',
                textAlign: 'center',
                borderRadius: '8px !important',
                lineHeight: '10px',
                '.MuiListItemIcon-root': { marginRight: 0 },
              }}
            > */}
            <ListItemIcon>
              <ZoomInIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Zoom In</Typography>}
            />
            {/* </ListItemButton> */}
          </ListItem>
          <ListItem button>
            {/* <ListItemButton
              sx={{
                display: 'block',
                textAlign: 'center',
                borderRadius: '8px !important',
                lineHeight: '10px',
                '.MuiListItemIcon-root': { marginRight: 0 },
              }}
            > */}
            <ListItemIcon>
              <ZoomOutIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Zoom Out</Typography>}
            />
            {/* </ListItemButton> */}
          </ListItem>
          <ListItem button>
            {/* <ListItemButton
              sx={{
                display: 'block',
                textAlign: 'center',
                borderRadius: '8px !important',
                lineHeight: '10px',
                '.MuiListItemIcon-root': { marginRight: 0 },
              }}
            > */}
            <ListItemIcon>
              <AttachFileIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="caption">Attach File</Typography>}
            />
            {/* </ListItemButton> */}
          </ListItem>
        </List>
      
    </Box>
  );
}

