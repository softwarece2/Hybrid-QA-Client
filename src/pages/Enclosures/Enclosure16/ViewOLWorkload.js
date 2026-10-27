/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import "date-fns";
import "jspdf-autotable";
import React, { useEffect} from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

//material-ui
import {
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { headerValue } from "Globals.js";

//redux
import { useDispatch} from "react-redux";

//components
import Button from "components/Button";
import { StyledTableCell } from "../../../components/UseTable";

//icons
import HeaderPdf from "pages/Layout/HeaderPdf";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import {
  getOlWorkload
} from "Redux/Actions/OLWorkloadAction/OLWorkloadAction";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";


const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  tableCell: {
    border: "1px solid black",
  },

  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
    border: "1px solid black",
    position: "relative",
  },
  datePicker: {
    width: 146,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  index: {
    width: 150,
    border: "1px solid black",
    fontWeight: 600,
    // borderTop: "2px solid black",
    // borderBottom: "1px solid black",
    // borderRight: "1px solid black",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
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
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

// const headCells = [
//   // { id: "index", label: "S.No.", align: "left" },
//   { id: "claimId", label: "SL.No", align: "left", disableSorting: true },
//   //   { id: "claimDate", label: "ASPECTS TO BE CHECKED", align: "left", disableSorting: true },
//   {
//     id: "claimStatus",
//     label: "DESCRIPTION",
//     align: "left",
//     disableSorting: true,
//   },
//   {
//     id: "totalClaimedAmount",
//     label: "REMARKS",
//     align: "left",
//     disableSorting: true,
//   },
//   { id: "totalClaimedAmount", label: "q", align: "left", disableSorting: true },
//   { id: "totalClaimedAmount", label: "w", align: "left", disableSorting: true },
//   { id: "totalClaimedAmount", label: "e", align: "left", disableSorting: true },
//   { id: "totalClaimedAmount", label: "r", align: "left", disableSorting: true },
// ];

const defaultValues = {
  id: 0,
  supplyOrderId: null,
  createdBy: null,
  wrkLdInprogDetDtos: null,
  wrkLdPostDetDtos: null,
  wrkLdDetDtos: null,
};

export default function ViewOLWorkload({ open, setopen, olId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const arraySchema = yup.object().shape({
    remarks: yup.string().nullable(),
  });

  const schema = yup.object().shape({
    wrkLdInprogDetDtos: yup.array().of(arraySchema),
    wrkLdPostDetDtos: yup.array().of(arraySchema),
  });

  const {
  
    reset,
    control,
   
    getValues,
 
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getOlWorkload(olId))
      .then((res) => {
        console.log("dsdasdsd", res);
        reset(res);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
    console.log("inside sbu so import");
  }, []);


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
          <PaperComponent id="draggable-dialog-title6" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title6"
        >
          WORKLOAD ASSESSMENT SHEET - IS/FRM/007
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("workload")} />
            <Paper container>
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
                  <Grid container>
                    {loading && <LinearProgress />}
                    <Table className={classes.table} size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            align="left"
                          >
                            <Typography className={classes.subHeading}>
                              {" "}
                              FILE NO:
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            align="center"
                            colSpan={6}
                          >
                            <Typography className={classes.subHeading}>
                              {" "}
                              WORKLOAD ASSESSMENT SHEET (WAS)
                            </Typography>
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Purchase Order issued by{" "}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography>
                              {getValues("orderIssuedBy") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            PO No. and Date
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography>{`${getValues(
                              "soOrderNo"
                            )} dated ${getValues("soDate")}`}</Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Original Delivery Date
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography>
                              {getValues("originalDd") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            PO Value
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography>{getValues("value")}</Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                            rowSpan={2}
                          >
                            Extended Delivery Date (Without LD/With LD)
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                            rowSpan={2}
                          >
                            <Typography>
                              {getValues("extendedDd") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Total Lines Items{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography>
                              {getValues("noOfItems") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Total QTY{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography>{getValues("totalQty")}</Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Main Eqpt / Item
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography>
                              {getValues("mainEqptItem") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            supplier
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography>
                              {getValues("supplierName") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            QAP/QA&S document reference No.
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography>
                              {getValues("qapRef") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            Any other details
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography>
                              {getValues("otherDetail") ?? "--"}
                            </Typography>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Sl.No.{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Activity{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Estimated Mandays{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Planned completion(DD/MM/YY){" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Actual Mandays{" "}
                          </StyledTableCell>

                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Actual completion (DD/MM/YY){" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Remarks / Reasons for deviation{" "}
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            align="center"
                            colSpan={7}
                          >
                            <u>
                              {" "}
                              <b>IN-PROCESS INSPECTION PHASE ACTIVITIES</b>{" "}
                            </u>
                          </StyledTableCell>
                        </TableRow>
                        {getValues("wrkLdInprogDetDtos") &&
                          Array.isArray(getValues("wrkLdInprogDetDtos")) &&
                          getValues("wrkLdInprogDetDtos")?.map((item, index) =>
                            item?.bold ? (
                              <TableRow>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <b>{item?.slNo}</b>{" "}
                                </StyledTableCell>
                                <StyledTableCell
                                  className={classes.tableCell}
                                  colSpan={7}
                                >
                                  <b>{item?.inspPhaseActivity}</b>
                                </StyledTableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  {item?.slNo}{" "}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  {item?.inspPhaseActivity}{" "}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdInprogDetDtos[${index}].estManDays`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   size="small"
                                      //   disabled
                                      //   onInput={restrict.dose}
                                      //   value={value}
                                      //   onChange={onChange}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdInprogDetDtos[${index}].planCompletion`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   size="small"
                                      //   id="date"
                                      //   type="date"
                                      //   disabled
                                      //   value={value}
                                      //   onChange={onChange}
                                      //   defaultValue="DD/MM/YY"
                                      //   className={classes.textField}
                                      //   InputLabelProps={{
                                      //     shrink: true,
                                      //   }}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdInprogDetDtos[${index}].actualManDays`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   size="small"
                                      //   onInput={restrict.dose}
                                      //   disabled
                                      //   value={value}
                                      //   onChange={onChange}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdInprogDetDtos[${index}].actualCompletion`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   size="small"
                                      //   id="date"
                                      //   type="date"
                                      //   disabled
                                      //   value={value}
                                      //   onChange={onChange}
                                      //   defaultValue="DD/MM/YY"
                                      //   className={classes.textField}
                                      //   InputLabelProps={{
                                      //     shrink: true,
                                      //   }}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdInprogDetDtos[${index}].remarks`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   size="small"
                                      //   disabled
                                      //   value={value}
                                      //   onChange={onChange}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                              </TableRow>
                            )
                          )}

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            align="center"
                            colSpan={7}
                          >
                            <u>
                              <b>POST INSPECTION PHASE ACTIVITIES</b>
                            </u>
                          </StyledTableCell>
                        </TableRow>
                        {getValues("wrkLdPostDetDtos") &&
                          Array.isArray(getValues("wrkLdPostDetDtos")) &&
                          getValues("wrkLdPostDetDtos")?.map((item, index) => (
                            <TableRow>
                              <StyledTableCell className={classes.tableCell}>
                                {" "}
                                <b>{item?.slNo}</b>{" "}
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                {" "}
                                <b>{item?.inspPhaseActivity}</b>{" "}
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`wrkLdPostDetDtos[${index}].estManDays`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    // <TextField
                                    //   size="small"
                                    //   onInput={restrict.dose}
                                    //   disabled
                                    //   value={value}
                                    //   onChange={onChange}
                                    // />
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`wrkLdPostDetDtos[${index}].planCompletion`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    // <TextField
                                    //   size="small"
                                    //   id="date"
                                    //   type="date"
                                    //   disabled
                                    //   value={value}
                                    //   onChange={onChange}
                                    //   defaultValue="DD/MM/YY"
                                    //   className={classes.textField}
                                    //   InputLabelProps={{
                                    //     shrink: true,
                                    //   }}
                                    // />
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`wrkLdPostDetDtos[${index}].actualManDays`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    // <TextField
                                    //   size="small"
                                    //   onInput={restrict.dose}
                                    //   disabled
                                    //   value={value}
                                    //   onChange={onChange}
                                    // />
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`wrkLdPostDetDtos[${index}].actualCompletion`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    // <TextField
                                    //   size="small"
                                    //   id="date"
                                    //   type="date"
                                    //   disabled
                                    //   value={value}
                                    //   onChange={onChange}
                                    //   defaultValue="DD/MM/YY"
                                    //   className={classes.textField}
                                    //   InputLabelProps={{
                                    //     shrink: true,
                                    //   }}
                                    // />
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`wrkLdPostDetDtos[${index}].remarks`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    // <TextField
                                    //   size="small"
                                    //   disabled
                                    //   value={value}
                                    //   onChange={onChange}
                                    // />
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>
                            </TableRow>
                          ))}

                        <TableRow>
                          <StyledTableCell
                            className={classes.tableCell}
                            align="center"
                            colSpan={7}
                          >
                            <u>
                              <b> SUMMARY </b>
                            </u>
                          </StyledTableCell>
                        </TableRow>

                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Total Estimated Mandays{" "}
                          </StyledTableCell>

                          <StyledTableCell className={classes.tableCell}>
                            <Typography></Typography>
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Total Actual Mandays{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Typography></Typography>
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            I-Note/I and TC/ Dispatch Clearance Reference and
                            Date{" "}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={2}
                          >
                            <Typography></Typography>
                          </StyledTableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    {/* {recordsAfterPagingAndSorting()?.length != 0 &&
              recordsAfterPagingAndSorting()?.length != undefined ? (
                <TblPagination />
              ) : (
                ""
              )} */}
                  </Grid>
                </Grid>
              </Grid>

              {/* ===================================================================================================================== */}
            </Paper>{" "}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            type="print"
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="print"
            onClick={() => setopen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
