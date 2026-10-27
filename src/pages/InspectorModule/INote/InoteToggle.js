import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React, { useState } from "react";
// import MergeTable from "./ExternalInoteTable";
// import INoteTable from "./INoteTable";
import { Grid, makeStyles } from "@material-ui/core";
import MergedTable from "./MergedTable";
import ExternalInoteTable from "./ExternalInoteTable";
const useStyles = makeStyles((theme) => ({
  toggleSelection: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },
  },
}));
export default function InoteToggle() {
  const classes = useStyles();
  const [flag, setFlag] = useState(0);

  const handleChange = (event, value) => {
    if (value !== null) {
      setFlag(value);
    }
  };

  return (
    <>
      <ToggleButtonGroup value={flag} exclusive onChange={handleChange} size="small">
        <ToggleButton
          classes={{
            root: classes.leftRoot,
          }}
          color="primary"
          value={0}
          className={classes.toggleSelection}
        >
          T Nos.
        </ToggleButton>
        <ToggleButton
          className={classes.toggleSelection}
          classes={{
            root: classes.rightRoot,
          }}
          color="primary"
          value={1}
        >
          Lot Dtl.
        </ToggleButton>
      </ToggleButtonGroup>
       {flag === 0 && (
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <ExternalInoteTable />
        </Grid>
      )}
      {flag === 1 && (
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          <MergedTable />
        </Grid>
      )}
     
    </>
  );
}
