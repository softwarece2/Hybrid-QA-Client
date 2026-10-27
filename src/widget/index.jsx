import React, { useState } from "react";
import Draggable from "react-draggable";
import { MaximizeIcon, MinimizeIcon } from "./icons";
import { Close } from "@material-ui/icons";
import { Typography } from "@material-ui/core";

const Widget = ({ title="Remote Inspection", children, onClose }) => {
  const [minimized, setMinimized] = useState(false);

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <Draggable handle=".draggable-widget" bounds="html">
      <div
        style={{ maxHeight: 800,}}
        className={`widget-container ${minimized ? "minimized" : ""}`}
      >
        <div className="widget-header draggable-widget">
          <Typography variant="subtitle1">{title}</Typography>
          <div className="widget-controls">
            <button type="button" onClick={toggleMinimize}>
              {minimized ? <MaximizeIcon color="secondary" fontSize="small" /> : <MinimizeIcon color="secondary" fontSize="small" />}
            </button>
            <button type="button" onClick={onClose}>
              <Close color="secondary" fontSize="small" />
            </button>
          </div>
        </div>
         <div className="widget-content">{children}</div>
      </div>
    </Draggable>
  );
};

export default Widget;
