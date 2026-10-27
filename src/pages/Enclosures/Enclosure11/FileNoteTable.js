/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useState } from "react";
import "../../../App.css";

import { FormControl, Grid, makeStyles } from "@material-ui/core";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import MergeOLs from "./MergeOLs";
import InspFileNoteOL from "pages/InspectorModule/OLInspector/InspFileNoteOL";

const useStyles = makeStyles((theme) => ({

  toggleSelection: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },

  },
}));

export default function FileNoteTable() {
  const classes = useStyles();
  const [flag, setFlag] = useState(1);

  const handleChange = (val) => {
    setFlag(val);
  };
  return (
    <>
      {" "}
      <FormControl style={{ padding: "14px 20px 10px 10px" }}>
        <ToggleButtonGroup
          value={flag}
          exclusive
          onChange={(e, newvalue) => {
            const val = newvalue;
            handleChange(val);
            console.log("newValue", newvalue);
          }}
          size="small"
        >
          <ToggleButton
            classes={{
              // selected: classes.toggleSelection,
              root: classes.leftRoot,
            }}
            color="primary"
            value={1}
            className={classes.toggleSelection}
          >
            Merge OLs
          </ToggleButton>
          <ToggleButton
            className={classes.toggleSelection}
            classes={{
              // selected: classes.toggleSelection,
              root: classes.rightRoot,
            }}
            color="primary"
            value={0}
          >
            File Note
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {flag == 1 && (
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <MergeOLs />
        </Grid>
      )}
      {flag == 0 && (
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <InspFileNoteOL />
        </Grid>
      )}
    </>
  );
}
