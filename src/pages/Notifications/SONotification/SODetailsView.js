/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import "../../../App.css";

//material-ui
import { Grid, makeStyles, Typography } from "@material-ui/core";

//redux
import { useDispatch } from "react-redux";
import { getSupplyOrderById } from "Redux/Actions/SupplyOrder/SOAction";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: theme.palette.primary.main,
  },
  headingVal: {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: theme.palette.common.black,
  },
}));

export default function SODetailsView({ soId }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(getSupplyOrderById(soId));
  }, []);

  const selectedSo = useSelector((store) => store.soReducer.selectedSo);
  console.log("se", selectedSo);
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} align="left">
          <Typography className={classes.heading}>
            SO/PO Number : <span className={classes.headingVal}> {selectedSo?.orderNo}</span>
          </Typography>
        </Grid>
        <Grid item xs={3} align="left">
          <Typography className={classes.heading}>
            SO/PO Date : <span className={classes.headingVal}>{moment(selectedSo?.orderDate).format("DD-MM-yyy")}</span>
          </Typography>
        </Grid>
        <Grid item xs={3} align="left">
          <Typography className={classes.heading}>
            Receipt Date :{" "}
            <span className={classes.headingVal}>
              {selectedSo?.receiptDate === null ? "" : moment(selectedSo?.receiptDate).format("DD-MM-yyy")}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={3} align="left">
          <Typography className={classes.heading}>
            Material Description : <span className={classes.headingVal}>{selectedSo?.projectName}</span>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
