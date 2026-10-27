/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
//material-ui

import { yupResolver } from "@hookform/resolvers/yup";
import {
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
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import TextField from "../../../components/TextField";

//components
import DateFnsUtils from "@date-io/date-fns";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { StyledTableCell } from "../../../components/UseTable";

import Button from "components/Button";
import SOWL from "pages/InspectorModule/WorkLoadInsp/SOWL";
import AllotOfficers from "pages/SOModule/Allot/AllotOfficers";
import {
  getSOWorkload,
  InspSOWorkloadsave,
  InspSOWorkloadsubmit,
  SOWorkloadsave,
  SOWorkloadsubmit,
} from "Redux/Actions/SOWorkLoadAction/SoWorkLoadAction";
import { restrict } from "restrict";
import { toast } from "react-toastify";
import { USER_ROLE_ID } from "../../../Globals";
import ViewSoworkload from "pages/Enclosures/Enclosure16/ViewSoworkload";
import moment from "moment";
//icons

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});
const schema = yup.object().shape({
  wrkLdSoMainDet: yup.array().of(arraySchema),
  // .required("Must have fields"),
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
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
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

const defaultValues = {
  wrkLdSoMainDet: [defaultArray],
  totalActDays: 0,
  totalEstDays: 0,
};


export default function SOWorkLoadAssessment({ soId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [idVal, setIdVal] = React.useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

  // const [inspPhaseActivities, setInspPhaseAcitivities] = React.useState(null);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const loggedInUser = useSelector((store) => store.loggedInUser);

  const isInspector = loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR;

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,

  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields} = useFieldArray({
    control,
    name: "wrkLdSoMainDet",
  });

  const resetData = (res) => {
    const totalEstDays = res?.totalEstDays;
    const totalActDays = res?.totalActDays;
    res.wrkLdPreDetDtos = res?.wrkLdPreDetDtos?.map((item) => ({
      ...item,
      planCompletion:
        item?.planCompletion &&
        moment(item?.planCompletion, "DD-MM-YYYY").format("YYYY-MM-DD"),
      actualCompletion:
        item?.actualCompletion &&
        moment(item?.actualCompletion, "DD-MM-YYYY").format("YYYY-MM-DD"),
    }));
    // setSum(res.wrkLdPreDetDtos.estManDays);

    reset({ ...res, totalEstDays, totalActDays });
  };

  useEffect(() => {
    // getAllInspPhaseActivities()
    //   .then((res) => setInspPhaseAcitivities(res))
    //   .catch((err) => toast.error("Something went wrong"));
    dispatch(getSOWorkload(soId))
      .then((res) => {
        console.log("dsdasdsd", res);
        setIdVal(res?.id);
        setRecords(res?.wrkLdDetDtos);
        resetData(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
    console.log("inside sbu so import");
  }, []);

  React.useEffect(() => {
    console.log("dddattaa", records);
    // const totalEstDays=res?.totalEstDays;
    // const totalActDays =res?.totalActDays;
    const MappedData = records?.map((item) => ({
      id: item.id ?? 0,
      inspPhaseActId: item.inspPhaseActId,
      actualManDays: item.actualManDays,
      actualCompletion: item.actualCompletion,
      remarks: item.remarks,
    }));
    setValue("wrkLdSoMainDet", MappedData);
  }, [records, setValue]);

  const prepareWkldPayload = (wrkLdPreDetDtos) => {
    return wrkLdPreDetDtos?.map((item) => ({
      id: item?.id ?? 0,
      inspPhaseActId: item?.inspPhaseActId,
      actualManDays: item?.actualManDays,
      actualCompletion: item?.actualCompletion,
      estManDays: item?.estManDays,
      planCompletion: item?.planCompletion,
      remarks: item?.remarks,
    }));
  };

  const onFormSubmit = (data) => {
    console.log("records val", data.wrkLdSoMainDet);
    const value = {
      id: data?.id,
      supplyOrderId: soId,
      createdBy: loggedInUser?.empId,
      totalEstDays: data?.totalEstDays,
      totalActDays: data?.totalActDays,
      wrkLdDetDtos: prepareWkldPayload(data?.wrkLdPreDetDtos),
    };
    console.log("records submit", value);
    const submitFn = isInspector ? InspSOWorkloadsubmit : SOWorkloadsubmit;
    submitFn(value)
      .then((res) => {
        setIdVal(res?.id);
        resetData(res);
        toast.success("Data Successfully Submitted.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const onFormSave = (data) => {
    console.log("records val", data);
    const saveData = {
      id: data?.id,
      supplyOrderId: soId,
      createdBy: loggedInUser?.empId,
      totalEstDays: data?.totalEstDays,
      totalActDays: data?.totalActDays,
      wrkLdDetDtos: prepareWkldPayload(data?.wrkLdPreDetDtos),
    };
    console.log("records save", saveData);
    const saveFn = isInspector ? InspSOWorkloadsave : SOWorkloadsave;
    saveFn(saveData)
      .then((res) => {
        setIdVal(res?.id);
        resetData(res);
        toast.success("Data Successfully Saved.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const [sum, setSum] = useState(
    Array.from({ length: getValues(`wrkLdPreDetDtos.estManDays`) }, () => "0")
  );

  const [sumAct, setSumAct] = useState(
    Array.from(
      { length: getValues(`wrkLdPreDetDtos.actualManDays`) },
      () => "0"
    )
  );

  const handleInputChange = (index, value) => {
    const newValues = [...sum];
    newValues[index] = value;
    setSum(newValues);
  };

  const handleInputChangeInsp = (index, value) => {
    const newValues = [...sumAct];
    newValues[index] = value;
    setSumAct(newValues);
  };

  const calculateValues = () => {
    let sum = 0;
    const data = getValues(`wrkLdPreDetDtos`);
    data?.forEach((el) => {
      if (el.estManDays) {
        sum += parseFloat(el.estManDays);
      }
    });
    setValue("totalEstDays", sum);
  };

  const calculateValuesAct = () => {
    let sumAct = 0;
    const data = getValues(`wrkLdPreDetDtos`);
    data?.forEach((el) => {
      if (el.actualManDays) {
        sumAct += parseFloat(el.actualManDays);
      }
    });
    setValue("totalActDays", sumAct);
  };
  useEffect(() => {
    calculateValues();
    calculateValuesAct();
  }, [getValues(`wrkLdPreDetDtos`)]);
  return (
    <>
      {openPreview && (
        <ViewSoworkload
          open={openPreview}
          setOpen={setOpenPreview}
          soId={soId}
          data={getValues()}
        />
      )}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            className={classes.button}
            type="back"
            variant="outlined"
            onClick={() => {
              if (user_role === 7) {
                dispatch(selectItem(<SOWL />));
              } else {
                dispatch(selectItem(<AllotOfficers />));
              }
            }}
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>{" "}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            WORKLOAD ASSESSMENT SHEET - IS/FRM/007
          </Typography>
        </Grid>
      </Grid>
      <br />
      {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center"> */}
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
                    <StyledTableCell className={classes.tableCell} align="left">
                      <Typography className={classes.subHeading}>
                        {" "}
                        FILE NO: {getValues("fileNo") ?? "NA"}
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
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Purchase Order issued by{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>
                        {getValues("orderIssuedBy") ?? "NA"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      PO No. and Date
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{`${getValues("soOrderNo")} dated ${getValues(
                        "soDate"
                      )}`}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Original Delivery Date
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{getValues("originalDd") ?? "NA"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
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
                      <Typography>{getValues("extendedDd") ?? "NA"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total Lines Items{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("noOfItems") ?? "NA"}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total qty{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("totalQty")}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Main Eqpt / Item
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>
                        {getValues("mainEqptItem") ?? "NA"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Supplier
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>
                        {getValues("supplierName") ?? "NA"}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      QAP/QA&S document reference No.
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{getValues("qapRef") ?? "NA"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Any other details
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>
                        {getValues("otherDetail") ?? "NA"}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <b>Sl.No. </b>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <b> Activity</b>{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <b>Estimated Mandays</b>{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <b>Planned completion(DD/MM/YY)</b>{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <b>Actual Mandays </b>
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      <b> Actual completion (DD/MM/YY) </b>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <b>Remarks / Reasons for deviation </b>
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
                                <TextField
                                  {...props}
                                  disabled={isInspector || index == 0}
                                  size="small"
                                  onInput={restrict.dose}
                                  value={value}
                                  onChange={(e) => {
                                    handleInputChange(index, e.target.value);
                                    onChange(e.target.value);
                                    calculateValues();
                                  }}
                                  //disabled={index === disabledIndex}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdPreDetDtos[${index}].planCompletion`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  disabled={isInspector}
                                  size="small"
                                  type="date"
                                  value={value}
                                  onChange={onChange}
                                  defaultValue="DD/MM/YYYY"
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdPreDetDtos[${index}].actualManDays`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  {...props}
                                  disabled={!isInspector || index == 0}
                                  size="small"
                                  onInput={restrict.dose}
                                  value={value}
                                  onChange={(e) => {
                                    handleInputChangeInsp(
                                      index,
                                      e.target.value
                                    );
                                    onChange(e.target.value);
                                    calculateValuesAct();
                                  }}
                                />
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
                                <TextField
                                  disabled={!isInspector}
                                  size="small"
                                  type="date"
                                  defaultValue="DD/MM/YYYY"
                                  className={classes.textField}
                                  value={value}
                                  onChange={onChange}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
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
                                <TextField
                                  disabled={!isInspector}
                                  size="small"
                                  value={value}
                                  onChange={onChange}
                                />
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
                                onChange={(date) => handleStartDateChange(date)}
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
                                onChange={(date) => handleStartDateChange(date)}
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
                      <Controller
                        name="totalEstDays"
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            size="small"
                            value={value}
                            readOnly
                            onInput={restrict.number}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Total Actual Mandays{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <Controller
                        name="totalActDays"
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            size="small"
                            value={value}
                            readOnly
                            onInput={restrict.number}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      I-Note/I and TC/ Dispatch Clearance Reference and Date{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <TextField
                        size="small"
                        onInput={restrict.general}
                        inputProps={{ maxLength: 100 }}
                      />
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
                {/* ))} */}
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </Paper>{" "}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={9} align="right" />
        {((loggedInUser?.roleId !== USER_ROLE_ID?.ROLE_INSPECTOR &&
          !getValues("planSubmittedDate")) ||
          (loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR &&
            !getValues("submittedDate") &&
            getValues("planSubmittedDate"))) && (
          <>
            <Grid item xs={1} align="right">
              <Button
                type="submit"
                onClick={handleSubmit(onFormSave)}
                variant="contained"
                className={classes.draft}
                // disabled={loading || !isDirty}
              >
                Save draft
              </Button>
            </Grid>

            <Grid item xs={1} align="right">
              <Button
                type="submit"
                onClick={handleSubmit(onFormSubmit)}
                variant="contained"
                color="primary"
                // disabled={loading || !isDirty}
              >
                Submit
              </Button>
            </Grid>
          </>
        )}

        {((loggedInUser?.roleId !== USER_ROLE_ID?.ROLE_INSPECTOR &&
          getValues("planSubmittedDate")) ||
          (loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR &&
            getValues("submittedDate"))) && (
          <Grid item xs={1} align="right">
            <Button
              type="submit"
              onClick={() => setOpenPreview(true)}
              variant="contained"
              className={classes.btn}
            >
              Preview
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}
