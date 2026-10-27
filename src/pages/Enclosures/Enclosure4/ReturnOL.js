/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";

//material-ui
import { Dialog, DialogActions, Grid, Paper, Table, TableBody, Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { DialogContent, DialogTitle } from "Utils";

//components
import Button from "components/Button";
import useTable, { StyledTableCell, StyledTableRow } from "../../../components/UseTable";
import { WING_ID } from "../../../Globals";

//pages
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import ReturnOLPdf from "./ReturnOLPdf";

//icons
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getReturnOLById } from "Redux/Actions/ReturnOL/ReturnOlAction";
import { PaperComponent } from "Utils/D3Tree";
import OLTable from "pages/Sslip/SSlipTable";
import ViewOfferLetters from "pages/SOModule/SupplyOrderDetails/View/ViewOfferLetters";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "98%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "98%",
    },
    [theme.breakpoints.down("md")]: {
      width: "98%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "98%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "98%",
    },
  },
  text: {
    fontSize: "0.875rem",
  },
  size: {
    width: 15,
    height: 15,
  },
  tableCell: {
    minWidth: 30,
  },
  info: {
    width: 300,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  remarks: {
    width: 1500,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: " ", align: "left", disableSorting: true },
  { id: "claimDate", label: " ", align: "left", disableSorting: true },
];

export default function ReturnOL({ num, from }) {
  const classes = useStyles();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const dispatch = useDispatch();
  let componentRef = useRef();
  const [value, setValue] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);

  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  useEffect(() => {
    dispatch(getReturnOLById(num)).then((data) => {
      console.log(data?.detDtos, "data");
      setValue(data);
      setRecords(data);
    });
  }, []);

  const { TblContainer, TblPagination, recordsAfterPagingAndSorting, getSlNo } = useTable(headCells, filterFn);

  return (
    <>
      <Grid container>
        <Grid item xs={12} align="left">
          {" "}
          <Button
            type="submit"
            onClick={() => {
              if (user_role === 2 || user_role === 4 || user_role === 6) {
                dispatch(selectItem(<ViewOL />));
              } else if (user_role === 9) {
                dispatch(selectItem(<OLTable />));
              } else if (user_role === 3) {
                dispatch(selectItem(<ViewOfferLetters />));
              } else {
                dispatch(selectItem(<InspectOLTable />));
              }
            }}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>{" "}
      </Grid>{" "}
      <br />
      <div>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
              <Typography className={classes.text}>Ref:</Typography>
              <Typography className={classes.text}>Officer-in-Charge, </Typography>
              <Typography className={classes.text}>[Quality Assurance Department] </Typography>
              <Typography className={classes.text}>Bharat Electronics, </Typography>
              <Typography className={classes.text}>Jalahalli Post,</Typography>
              <Typography className={classes.text}> Bangalore - 560013 </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="right">
              <Typography className={classes.text} align="right">
                Date :{value.createdDate ? moment(value.createdDate).format("DD-MM-yyyy") : " NA"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography className={classes.heading}>RETURN OF OFFERING LETTER</Typography>
            </Grid>
          </Grid>
          <br />

          <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center" style={{ margin: "auto", overflowX: "auto" }}>
            <TblContainer style={{ maxHeight: "600px" }}>
              {loading && <LinearProgress />}
              <Table
                style={{ position: "relative", border: "1px solid lightgrey" }}
                size="small"
                aria-label="simple table"
                id="data-table-cleanliness-report"
              >
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell className={classes.info}>
                      {isArmy ? "QACL" : "OL"} Number
                    </StyledTableCell>
                    <StyledTableCell className={classes.remarks}>
                      : {value.offerLetterNo}
                      {/* <TextField
                      placeholder="119661A"
                      size="small"
                     
                    /> */}
                    </StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell className={classes.info}>Offer Date</StyledTableCell>
                    <StyledTableCell className={classes.remarks}>
                      : {moment(value.offerDate).format("DD-MM-YYYY,h:mm:ss a")}
                      {/* <TextField placeholder="Offer Date" 
                    size="small" 
                    value={value.offerDate}
                    
                    /> */}
                    </StyledTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledTableCell className={classes.info}>Description</StyledTableCell>
                    <StyledTableCell className={classes.remarks}>
                      : {value.projectName}
                      {/* <TextField
                      placeholder="LRSAM MAIN EQUIPMENT"
                      size="small"
                      // value={value.observation}
                    /> */}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
              {recordsAfterPagingAndSorting()?.length !== 0 && recordsAfterPagingAndSorting()?.length !== undefined ? (
                <TblPagination />
              ) : (
                ""
              )}
            </TblContainer>
          </Grid>

          <Typography className={classes.text}> Sir,</Typography>
          <Typography className={classes.text}>
            The above mentioned Offering Letter is hereby returned Unactioned for following reasons :
          </Typography>

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
            {/* <TblContainer
                  style={{
                    maxHeight: "600x",
                    display: "flex",
                    justifyContent: "center",
                  }}
                > */}
            {loading && <LinearProgress />}
            <Table
              style={{
                border: "1px solid lightgrey",
              }}
              size="small"
              aria-label="simple table"
              id="data-table-cleanliness-report"
            >
              {records?.length !== 0 ? (
                <TableBody>
                  {records?.detDtos?.map((input, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell className={classes.tableCell}>{index + 1}</StyledTableCell>
                      <StyledTableCell className={classes.remarks}> {input?.observation}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              ) : (
                ""
              )}
              {/* {recordsAfterPagingAndSorting()?.length !== 0 ? (
                    <TableBody>
                      {recordsAfterPagingAndSorting()?.map((item, index) => (
                        <StyledTableRow className={classes.tableColor} key={index}>
                          <StyledTableCell className={classes.tableCell}>{item?.claimId}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>{item?.claimDate}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>{item?.claimStatus}</StyledTableCell>

                          <StyledTableCell className={classes.tableCellEmail}>
                            {item?.totalClaimedAmount}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCellEmail}>{item?.settleAmount}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.settleDate ? item?.settleDate : "--"}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <StyledTableRow>
                        <StyledTableCell colSpan={8} align="center">
                          No records found
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableBody>
                  )} */}
            </Table>
            {recordsAfterPagingAndSorting()?.length !== 0 && recordsAfterPagingAndSorting()?.length !== undefined ? (
              <TblPagination />
            ) : (
              ""
            )}
            {/* </TblContainer> */}
          </Grid>
        </Paper>
      </div>
      <br />
      <Grid container spacing={0}>
        <Grid item xs={10} align="right" />
        <Grid item xs={1} align="">
          <Button variant="contained" className={classes.btn} onClick={() => setOpen(true)}>
            Preview
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        // onClose={() => setOpen(false)}
        //onClick={handleClose}
        // onClose={onClose}
        maxWidth="lg"
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title16" {...props} />}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          onClose={() => setOpen(false)}
          id="draggable-dialog-title16"
        >
          RETURN OF OFFERING LETTER
        </DialogTitle>
        <DialogContent>
          <div id="previewPrint" ref={(el) => (componentRef = el)}>
            <ReturnOLPdf />
            {/* <Paper className={classes.paper}> */}
            <Grid container>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                <Typography className={classes.text}>Ref:</Typography>
                <Typography className={classes.text}>Officer-in-Charge, </Typography>
                <Typography className={classes.text}>[Quality Assurance Department] </Typography>
                <Typography className={classes.text}>Bharat Electronics, </Typography>
                <Typography className={classes.text}>Jalahalli Post,</Typography>
                <Typography className={classes.text}> Bangalore - 560013 </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="right">
                <Typography className={classes.text} align="right">
                  Date :{value.createdDate ? moment(value.createdDate).format("DD-MM-yyyy") : " NA"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Typography className={classes.heading}>RETURN OF OFFERING LETTER</Typography>
              </Grid>
            </Grid>
            <br />

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              align="center"
              style={{ margin: "auto", overflowX: "auto" }}
            >
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
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell className={classes.info}>
                        {isArmy ? "QACL" : "OL"} Number
                      </StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        : {value.offerLetterNo}
                        {/* <TextField
                      placeholder="119661A"
                      size="small"
                     
                    /> */}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.info}>Offer Date</StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        : {moment(value.offerDate).format("DD-MM-YYYY,h:mm:ss a")}
                        {/* <TextField placeholder="Offer Date" 
                    size="small" 
                    value={value.offerDate}
                    
                    /> */}
                      </StyledTableCell>
                    </StyledTableRow>

                    <StyledTableRow>
                      <StyledTableCell className={classes.tableCell}>Description</StyledTableCell>
                      <StyledTableCell className={classes.remarks}>
                        : {value.projectName}
                        {/* <TextField
                      placeholder="LRSAM MAIN EQUIPMENT"
                      size="small"
                      // value={value.observation}
                    /> */}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
                {recordsAfterPagingAndSorting()?.length !== 0 &&
                  recordsAfterPagingAndSorting()?.length !== undefined ? (
                  <TblPagination />
                ) : (
                  ""
                )}
              </TblContainer>
            </Grid>

            <Typography className={classes.text}> Sir,</Typography>
            <Typography className={classes.text}>
              The above mentioned Offering Letter is hereby returned Unactioned for following reasons :
            </Typography>

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
                {records?.length !== 0 ? (
                  <TableBody>
                    {records?.detDtos?.map((input, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell className={classes.tableCell}>{index + 1}</StyledTableCell>
                        <StyledTableCell className={classes.remarks}> {input?.observation}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                ) : (
                  ""
                )}
              </Table>
              {recordsAfterPagingAndSorting()?.length !== 0 && recordsAfterPagingAndSorting()?.length !== undefined ? (
                <TblPagination />
              ) : (
                ""
              )}
              {/* </TblContainer> */}
            </Grid>
            {/* </Paper> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} align="center" alignItems="center">
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" color="primary">
                  Print
                </Button>
              )}
              content={() => componentRef}
            />
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
