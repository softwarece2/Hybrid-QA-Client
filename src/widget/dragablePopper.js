import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import IconButton from "@material-ui/core/IconButton";
import MinimizeIcon from "@material-ui/icons/Minimize";
import CloseIcon from "@material-ui/icons/Close";
import { MaximizeIcon } from "./icons";

const useStyles = makeStyles((theme) => ({
  draggablePaper: {
    cursor: "grab",
    position: "absolute", // Important for Draggable
    zIndex: 9000, // Ensure it's on top
    minWidth: 1300,
  },
  minimizedPaper: {
    cursor: "grab",
    position: "absolute",
    zIndex: 9000,
    minWidth: 1300,
  },
  title: {
    margin: 0,
    fontSize: 14,
    marginLeft: theme.spacing(1),
  },
}));

function DraggableCompose({ initialPosition, children, onClose }) {
  const classes = useStyles();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState(initialPosition); // Track position for Draggable
  const [expanded, setExpanded] = useState(true);

  const handleDrag = (event, ui) => {
    setPosition({ x: ui.x, y: ui.y });
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setExpanded(!expanded);
  };

  return (
    <Draggable axis="both" position={position} onDrag={handleDrag} handle=".draggable-title" defaultClassName="draggable-title">
      <Paper className={isMinimized ? classes.minimizedPaper : classes.draggablePaper}>
        <div
          className="draggable-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px dotted lightgrey",
            background: "#519acc",
            color: "white",
          }}
        >
          <span className={classes.title}>
            <b>Video Inspection</b>
          </span>
          <div>
            <IconButton style={{ color: "inherit" }} size="small" onClick={handleMinimize} title="Maximize/Minimize">
              {expanded ? <MinimizeIcon fontSize="small" /> : <MaximizeIcon fontSize="small" />}
            </IconButton>
            <IconButton onClick={onClose} style={{ color: "inherit" }} size="small" title="Close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        <div style={{ padding: 16, display: !expanded ? "none" : "initial" }}>{children}</div>
      </Paper>
    </Draggable>
  );
}

export default DraggableCompose;