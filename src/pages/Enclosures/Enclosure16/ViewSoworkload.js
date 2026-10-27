/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
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
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import { headerValue } from "Globals.js";
import "jspdf-autotable";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import TextField from "../../../components/TextField";
//components
import DateFnsUtils from "@date-io/date-fns";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { StyledTableCell } from "../../../components/UseTable";

import Button from "components/Button";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { useReactToPrint } from "react-to-print";
import { getSOWorkload } from "Redux/Actions/SOWorkLoadAction/SoWorkLoadAction";
import { DialogContent, DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";



const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    
    .nullable(),
});
const schema = yup.object().shape({
  wrkLdSoMainDet: yup.array().of(arraySchema),

});

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
  tableCellBold: {
    border: "1px solid black",
    fontWeight: "bold",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
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
}));

const defaultArray = () => ({
  id: "",
  inspPhaseActId: "",
  actualManDays: "",
  actualCompletion: "",
  estManDays: 0,
  planCompletion: "",
  remarks: "",
});



export default function ViewSoworkload({ idVal, open, soId, setOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  // const [inspPhaseActivities, setInspPhaseAcitivities] = React.useState(null);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };



  const defaultValues = {
    wrkLdSoMainDet: [defaultArray],
  };



  const {
  
    reset,
    control,
    setValue,
    getValues,

  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: "wrkLdSoMainDet",
  });

  useEffect(() => {
    // getAllInspPhaseActivities()
    //   .then((res) => setInspPhaseAcitivities(res))
    //   .catch((err) => toast.error("Something went wrong"));
    dispatch(getSOWorkload(soId))
      .then((res) => {
        console.log("dsdasdsd", res);
        // idVal(res?.id);
        // setSupplerIdVal(res?.supplyOrderId);
        setRecords(res?.wrkLdDetDtos);
        reset(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
    console.log("inside sbu so import");
  }, []);

  React.useEffect(() => {
    console.log("dddattaa", records);
    const MappedData = records?.map((item) => ({
      id: item.id,
      inspPhaseActId: item.inspPhaseActId,
      actualManDays: item.actualManDays,
      actualCompletion: item.actualCompletion,
      remarks: item.remarks,
    }));
    setValue("wrkLdSoMainDet", MappedData);
  }, [records, setValue]);



  
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
          <PaperComponent id="draggable-dialog-title7" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title7"
        >
          WORKLOAD ASSESSMENT SHEET - IS/FRM/007{" "}
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
                              FILE NO: {getValues("fileNo") ?? "--"}
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
                      {/* {fields?.map((item, index) => ( */}
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

                        <>
                          <TableRow>
                            <StyledTableCell
                              className={classes.tableCell}
                              align="center"
                              colSpan={7}
                            >
                              <u>
                                {" "}
                                <b>PRE INSPECTION PHASE ACTIVITIES</b>{" "}
                              </u>
                            </StyledTableCell>
                          </TableRow>

                          {getValues("wrkLdPreDetDtos") &&
                            Array.isArray(getValues("wrkLdPreDetDtos")) &&
                            getValues("wrkLdPreDetDtos")?.map((item, index) => (
                              <TableRow>
                                <StyledTableCell
                                  className={
                                    item?.bold
                                      ? classes.tableCellBold
                                      : classes.tableCell
                                  }
                                >
                                  {item?.slNo}
                                </StyledTableCell>
                                <StyledTableCell
                                  className={
                                    item?.bold
                                      ? classes.tableCellBold
                                      : classes.tableCell
                                  }
                                >
                                  {item?.inspPhaseActivity}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdPreDetDtos[${index}].estManDays`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   disabled={isInspector}
                                      //   size="small"
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
                                    name={`wrkLdPreDetDtos[${index}].planCompletion`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <Controller
                                    name={`wrkLdPreDetDtos[${index}].actualManDays`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   disabled
                                      //   size="small"
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
                                    name={`wrkLdPreDetDtos[${index}].actualCompletion`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   disabled
                                      //   size="small"
                                      //   type="date"
                                      //   defaultValue="DD/MM/YYYY"
                                      //   className={classes.textField}
                                      //   value={value}
                                      //   onChange={onChange}
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
                                    name={`wrkLdPreDetDtos[${index}].remarks`}
                                    control={control}
                                    render={({
                                      field: { onChange, value, ...props },
                                    }) => (
                                      // <TextField
                                      //   disabled
                                      //   size="small"
                                      //   value={value}
                                      //   onChange={onChange}
                                      // />
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                              </TableRow>
                            ))}
                        </>

                        {fields.length >= 0
                          ? fields.map((input, index) => (
                              <TableRow key={index}>
                                <StyledTableCell className={classes.tableCell}>
                                  {index + 1}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <b>{input?.inspPhaseActivity}</b>
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <TextField size="small" />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      disableToolbar
                                      autoOk
                                      size="small"
                                      style={{ width: "100%", height: "90%" }}
                                      inputVariant="outlined"
                                      format="dd/MM/yyy"
                                      //   margin="normal"
                                      id="date-picker-outlined"
                                      value={selectedStartDate}
                                      onChange={(date) =>
                                        handleStartDateChange(date)
                                      }
                                      KeyboardButtonProps={{
                                        "#0B9CAB": "change date",
                                      }}
                                    />
                                  </MuiPickersUtilsProvider>
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <TextField size="small" disabled />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      disableToolbar
                                      autoOk
                                      disabled
                                      size="small"
                                      style={{ width: "100%", height: "90%" }}
                                      inputVariant="outlined"
                                      placeholder="Enter the Date"
                                      format="dd/MM/yyyy"
                                      //   margin="normal"
                                      id="date-picker-outlined"
                                      // value={selectedStartDate}
                                      onChange={(date) =>
                                        handleStartDateChange(date)
                                      }
                                      KeyboardButtonProps={{
                                        "#0B9CAB": "change date",
                                      }}
                                    />
                                  </MuiPickersUtilsProvider>
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  <TextField size="small" disabled />
                                </StyledTableCell>
                              </TableRow>
                            ))
                          : "No item in the list"}

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
                            {/* <TextField size="small" disabled /> */}
                            <Typography></Typography>
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            Total Actual Mandays{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {/* <TextField size="small" disabled /> */}
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
                            {/* <TextField size="small" disabled /> */}
                            <Typography></Typography>
                          </StyledTableCell>
                        </TableRow>
                      </TableBody>
                      {/* ))} */}
                    </Table>
                  </Grid>
                </Grid>
              </Grid>

              {/* ===================================================================================================================== */}
            </Paper>{" "}
          </div>
        </DialogContent>
        {/* </Grid> */}
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            // onClick={handleSubmit(handleSave)}
            type="submit"
            onClick={handlePrint}
          >
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
