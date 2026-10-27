/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import "date-fns";
import "jspdf-autotable";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//material-ui
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

//redux
import { useDispatch, useSelector } from "react-redux";

//components
import Button from "components/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import  { StyledTableCell } from "../../../components/UseTable";
import TextField from "../../../components/TextField";

//pages
import OLWL from "pages/InspectorModule/WorkLoadInsp/OLWL";


//icons
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllotOlOfficers from "pages/SOModule/Allot/AllotOlOfficers";
import {
  getOlWorkload,
  inspOlWorkloadSubmit,
  inspOlWorkloadsave,
  olWorkloadSave,
  olWorkloadSubmit,
} from "Redux/Actions/OLWorkloadAction/OLWorkloadAction";
import { USER_ROLE_ID } from "../../../Globals";
import { toast } from "react-toastify";
import { restrict } from "restrict";
import ViewOLWorkload from "pages/Enclosures/Enclosure16/ViewOLWorkload";
import moment from "moment";

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
}));


const defaultValues = {
  id: 0,
  offerLetterId: null,
  createdBy: null,
  wrkLdInprogDetDtos: null,
  wrkLdPostDetDtos: null,
  wrkLdDetDtos: null,
  totalActDays: 0,
  totalEstDays: 0,
};

export default function OLWorkLoadAssessment({ olId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openpreView, setopenpreView] = useState(false);
  const arraySchema = yup.object().shape({
    remarks: yup.string().nullable(),
  });

  const schema = yup.object().shape({
    wrkLdInprogDetDtos: yup.array().of(arraySchema),
    wrkLdPostDetDtos: yup.array().of(arraySchema),
  });

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

  const loggedInUser = useSelector((store) => store.loggedInUser);

  const [loading, setLoading] = React.useState(false);



  const resetData = (res) => {
    const totalEstDays = res?.totalEstDays;
    const totalActDays = res?.totalActDays;
    res.wrkLdInprogDetDtos = res?.wrkLdInprogDetDtos?.map((item) => ({
      ...item,
      planCompletion:
        item?.planCompletion &&
        moment(item?.planCompletion).format("YYYY-MM-DD"),
      actualCompletion:
        item?.actualCompletion &&
        moment(item?.actualCompletion).format("YYYY-MM-DD"),
    }));
    res.wrkLdPostDetDtos = res?.wrkLdPostDetDtos?.map((item) => ({
      ...item,
      planCompletion:
        item?.planCompletion &&
        moment(item?.planCompletion).format("YYYY-MM-DD"),
      actualCompletion:
        item?.actualCompletion &&
        moment(item?.actualCompletion).format("YYYY-MM-DD"),
    }));
    reset({ ...res, totalEstDays, totalActDays });
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getOlWorkload(olId))
      .then((res) => {
        console.log("dsdasdsd", res);
        resetData(res);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });
    console.log("inside sbu so import");
  }, []);

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

  const onFormSave = (data) => {
    const saveData = {
      id: data?.id ?? 0,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      totalEstDays: data?.totalEstDays,
      totalActDays: data?.totalActDays,
      wrkLdDetDtos: prepareWkldPayload([
        ...data?.wrkLdInprogDetDtos,
        ...data?.wrkLdPostDetDtos,
      ]),
    };
    console.log("records val", saveData);
    const saveFn = isInspector ? inspOlWorkloadsave : olWorkloadSave;
    saveFn(saveData)
      .then((res) => {
        resetData(res);
        toast.success("Data Successfully Saved.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const onFormSubmit = (data) => {
    const value = {
      id: data?.id ?? 0,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      totalEstDays: data?.totalEstDays,
      totalActDays: data?.totalActDays,
      wrkLdDetDtos: prepareWkldPayload([
        ...data?.wrkLdInprogDetDtos,
        ...data?.wrkLdPostDetDtos,
      ]),
    };
    console.log("records val", value);
    const submitFn = isInspector ? inspOlWorkloadSubmit : olWorkloadSubmit;
    submitFn(value)
      .then((res) => {
        resetData(res);
        toast.success("Data Successfully Submitted.");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const isInspector = loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR;
  const [sum, setSum] = useState(
    Array.from(
      { length: getValues(`wrkLdInprogDetDtos.estManDays`) },
      () => "0"
    )
  );

  const [sumAct, setSumAct] = useState(
    Array.from(
      { length: getValues(`wrkLdInprogDetDtos.actualManDays`) },
      () => "0"
    )
  );

  const [sumPost, setSumPost] = useState(
    Array.from({ length: getValues(`wrkLdPostDetDtos.estManDays`) }, () => "0")
  );

  const [sumPostAct, setSumPostAct] = useState(
    Array.from(
      { length: getValues(`wrkLdPostDetDtos.actualManDays`) },
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

  const handleInputChangePost = (index, value) => {
    const newValues = [...sumPost];
    newValues[index] = value;
    setSumPost(newValues);
  };

  const handleInputChangeInspPost = (index, value) => {
    const newValues = [...sumAct];
    newValues[index] = value;
    setSumPostAct(newValues);
  };

  const calculateValuesEst = () => {
    let sum = 0;
    const data = [
      ...(getValues(`wrkLdPostDetDtos`) || []),
      ...(getValues(`wrkLdInprogDetDtos`) || []),
    ];
    data?.forEach((el) => {
      if (el.estManDays) {
        sum += parseFloat(el.estManDays);
      }
    });
    setValue("totalEstDays", sum);
  };

  const calculateValuesAct = () => {
    let sumAct = 0;
    const data = [
      ...(getValues(`wrkLdPostDetDtos`) || []),
      ...(getValues(`wrkLdInprogDetDtos`) || []),
    ];
    console.log(data, "data");
    data?.forEach((el) => {
      if (el.actualManDays) {
        sumAct += parseFloat(el.actualManDays);
      }
    });
    setValue("totalActDays", sumAct);
  };

  useEffect(
    () => {
      calculateValuesEst();
      calculateValuesAct();
    },
    [getValues(`wrkLdPreDetDtos`)],
    [getValues(`wrkLdPostDetDtos`)]
  );

  return (
    <>
      {openpreView && (
        <ViewOLWorkload
          open={openpreView}
          setopen={setopenpreView}
          olId={olId}
        />
      )}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            className={classes.button}
            type="back"
            variant="outlined"
            onClick={() => {
              if (loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR) {
                dispatch(selectItem(<OLWL />));
              } else {
                dispatch(selectItem(<AllotOlOfficers />));
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
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Purchase Order issued by{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>
                        {getValues("orderIssuedBy") ?? "--"}
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
                      <Typography>{getValues("originalDd") ?? "--"}</Typography>
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
                      <Typography>{getValues("extendedDd") ?? "--"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total Lines Items{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("noOfItems") ?? "--"}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total QTY{" "}
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
                        {getValues("mainEqptItem") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      supplier
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>
                        {getValues("supplierName") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      QAP/QA&S document reference No.
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{getValues("qapRef") ?? "--"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
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
                                <TextField
                                  size="small"
                                  disabled={isInspector}
                                  onInput={restrict.dose}
                                  value={value}
                                  onChange={(e) => {
                                    handleInputChange(index, e.target.value);
                                    onChange(e.target.value);
                                    calculateValuesEst();
                                  }}
                                />
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
                                <TextField
                                  size="small"
                                  id="date"
                                  type="date"
                                  disabled={isInspector}
                                  value={value}
                                  onChange={onChange}
                                  defaultValue="DD/MM/YY"
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
                              name={`wrkLdInprogDetDtos[${index}].actualManDays`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  onInput={restrict.dose}
                                  disabled={!isInspector}
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
                              name={`wrkLdInprogDetDtos[${index}].actualCompletion`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  id="date"
                                  type="date"
                                  disabled={!isInspector}
                                  value={value}
                                  onChange={onChange}
                                  defaultValue="DD/MM/YY"
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
                              name={`wrkLdInprogDetDtos[${index}].remarks`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  disabled={!isInspector}
                                  value={value}
                                  onChange={onChange}
                                />
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
                              <TextField
                                size="small"
                                onInput={restrict.dose}
                                disabled={isInspector}
                                value={value}
                                onChange={(e) => {
                                  handleInputChangePost(index, e.target.value);
                                  onChange(e.target.value);
                                  calculateValuesEst();
                                }}
                              />
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
                              <TextField
                                size="small"
                                type="date"
                                disabled={isInspector}
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
                            name={`wrkLdPostDetDtos[${index}].actualManDays`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                onInput={restrict.dose}
                                disabled={!isInspector}
                                value={value}
                                onChange={(e) => {
                                  handleInputChangeInspPost(
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
                            name={`wrkLdPostDetDtos[${index}].actualCompletion`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                type="date"
                                disabled={!isInspector}
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
                            name={`wrkLdPostDetDtos[${index}].remarks`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                disabled={!isInspector}
                                value={value}
                                onChange={onChange}
                              />
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
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={8} align="right" />
        {((loggedInUser?.roleId !== USER_ROLE_ID?.ROLE_INSPECTOR &&
          !getValues("planSubmittedDate")) ||
          (loggedInUser?.roleId === USER_ROLE_ID?.ROLE_INSPECTOR &&
            !getValues("submittedDate") &&
            getValues("planSubmittedDate"))) && (
          <>
            <Grid item xs={2} align="right">
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
              onClick={() => setopenpreView(true)}
              variant="contained"
              color="primary"
              // disabled={loading || !isDirty}
            >
              Preview
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}
