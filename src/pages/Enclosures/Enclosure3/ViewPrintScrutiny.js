/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
//material-ui
import {
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { headerValue } from "Globals.js";
//pages

//components
import Button from "components/Button";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

import "jspdf-autotable";
import HeaderPdf from "pages/Layout/HeaderPdf";

import { useReactToPrint } from "react-to-print";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";


//icons

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  hide: {
    display: "none",
    color: theme.palette.primary.contrastText,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "ASPECTS TO BE CHECKED",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimStatus",
    label: "OBSERVATION",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "REMARKS",
    align: "left",
    disableSorting: true,
  },
];

export default function ViewPrintScrutiny({ inObj, setOpen, open, data, obj }) {

  // console.log('data',inObj);
  const classes = useStyles();


  const [loading, setLoading] = React.useState(false);

  const [records, setRecords] = useState([]);



  const [filterFn, setFilterFn] = useState({ fn: (items) => items });


  const {
    TblContainer,
    TblHead,
 
  } = useTable(records, headCells, filterFn);



 
 
 

  

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        maxWidth="lg"
        align="center"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title15" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title15"
        >
          <Typography className={classes.heading}>
            Checklist for Scrutiny of Offering letter: IS(IB)/CKL/002
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("scrutinyOl")} />
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                align="center"
                style={{ margin: "auto", overflowX: "auto" }}
              >
                <TblContainer style={{ maxHeight: "600px" }}>
                  {loading && <LinearProgress />}
                  <Table
                    style={{
                      position: "relative",
                      maxWidth: "1000px",
                    }}
                    size="small"
                    aria-label="simple table"
                    id="data-table-cleanliness-report"
                  >
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell
                          className={classes.subHeader}
                          style={{ border: "1px solid black" }}
                        >
                          OL No. & Date
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.remarks}
                          style={{ border: "1px solid black" }}
                        >
                          : {inObj?.name} & {inObj?.offerDate}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell
                          className={classes.subHeader}
                          style={{ border: "1px solid black" }}
                        >
                          OL ID & Date
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.remarks}
                          style={{ border: "1px solid black" }}
                        >
                          : {inObj?.name} & {inObj?.offerDate}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell
                          className={classes.subHeader}
                          style={{ border: "1px solid black" }}
                        >
                          FILE NO
                        </StyledTableCell>
                        <StyledTableCell style={{ border: "1px solid black" }}>
                          : {inObj?.fileNo}
                        </StyledTableCell>
                      </StyledTableRow>

                      <StyledTableRow>
                        <StyledTableCell
                          className={classes.subHeader}
                          style={{ border: "1px solid black" }}
                        >
                          Criteria of OL (Physical/ Electrical/ Final)
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.remarks}
                          style={{ border: "1px solid black" }}
                        >
                          :
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TblContainer>
              </Grid>
            </Grid>
            <br />
            <Paper>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  align="center"
                  style={{ margin: "auto", overflowX: "auto" }}
                >
                  {" "}
                  <Grid container>
                    <TblContainer style={{ maxHeight: "600px" }}>
                      {loading && <LinearProgress />}
                      <Table
                        style={{
                          position: "relative",
                          border: "1px solid lightgrey",
                        }}
                        size="small"
                        aria-label="simple table"
                        id="data-table-cleanliness-report"
                      >
                        <TblHead />
                        <TableBody>
                          {data?.scrutinyOlMainDet?.map((item, index) => (
                            <>
                              <StyledTableRow>
                                <StyledTableCell className={classes.tableCell}>
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  {item.reference}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Typography>
                                    {item?.obsSts === "true" ? "Yes" : "No"}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {/* <TextField
                                    value={item?.remarks}
                                    size="small"
                                    placeholder="Remarks"
                                    disabled
                                    // error={
                                    //   !!errors.scrutinyOlMainDet?.[index]
                                    //     ?.remarks
                                    // }
                                    // helperText={
                                    //   errors.scrutinyOlMainDet?.[index]
                                    //     ?.remarks?.message
                                    // }
                                  /> */}
                                  <Typography> {item?.remarks}</Typography>
                                </StyledTableCell>
                              </StyledTableRow>
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </TblContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>{" "}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
