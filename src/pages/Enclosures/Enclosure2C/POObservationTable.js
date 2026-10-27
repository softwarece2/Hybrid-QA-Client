/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useRef, useState } from "react";

//material-ui
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { DialogContent, DialogTitle } from "Utils";
import * as yup from "yup";

//components
import TextField from "../../../components/TextField";
import { StyledTableCell } from "../../../components/UseTable";

//Reduxs
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "components/Button";

//pages
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ObservationForm from "pages/EnclosuresTable/ObservationForm";
import SOObservationTable from "pages/SOModule/SupplyOrderDetails/SOObservation/SOObservationTable";


import { PaperComponent } from "Utils/D3Tree";
import ViewSOScrutiny from "../Enclosure1/Checklist1/ViewSOScrutiny";
import { restrict } from "restrict";

import { getPoObservation, savePoRemarks, savePoSbu, submitPoSbu, submitRemarkPo } from "Redux/Actions/Enclosure/PoObservationAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";

const arraySchema1 = yup.object().shape({
  remedialAction: yup
    .string()
    .trim()
    .when("roleId", (roleId) => {
      if (roleId === 9) {
        return yup.string().trim().typeError("Required").required("Required");
        // .max(avlQty, "Total must be less than available")
      }
    }),
});

const arraySchema2 = yup.object().shape({
  remarks: yup
    .string()
    .typeError("required")
    .trim()
    .when("roleId", (roleId) => {
      if (roleId === 7 || roleId === 17) {
        return yup.string().trim().typeError("Required").required("Required");
        // .max(avlQty, "Total must be less than available")
      }
    }),
    isClosed: yup
    .string()
    .trim()
    .typeError("Required")
    // 1. Remove .required() from here so it doesn't apply to everyone
    .when("roleId", {
      is: (roleId) => roleId === 7, // Add role 18 here if they need it, or just 7
      then: (schema) => schema.required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
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
  icon: {
    color: "#ff3000",
    fontSize: "18px",
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
    fontWeight: 400,
    fontSize: "0.875rem",
  },
  text: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  tableCellText: {
    fontSize: "0.875rem",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
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
  buttonProgress: {
    color: "white",
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

const defaultArray = {
  id: 0,
  poObservationId: "",
  observation: "",
  remarks: "",
  remedialAction: "",
  roleId: "",
};

export default function POObservationTable({ rowData, hide }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  let componentRef = useRef();
  const poObservation = useSelector(
    (store) => store.poObservationReducer.getPo
  );
  const [records, setRecords] = useState(null);
  const id1 = rowData?.supplyOrderId;
  const [idVal, setIdVal] = React.useState(null);
  const [statusVal, setStatusVal] = React.useState(null);
  const [supplerIdVal, setSupplerIdVal] = React.useState(null);

  const schema = yup.object().shape({
    POObservation: yup
      .array()
      .of(
        roleId === 18
          ? arraySchema1
          : roleId === 7
          ? arraySchema2
          : null
      )
      .required("Must have fields")
      .typeError("required"),
  });

  const defaultValues = {
    POObservation: [defaultArray],
  };

  const {
    handleSubmit,

    setValue,
    getValues,
    control,
  
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { fields} = useFieldArray({
    control,
    name: "POObservation",
  });

  const getData = (id) => {
    setLoading(true);
    dispatch(getPoObservation(rowData?.id))
      .then((res) => {
        setIdVal(res?.id);
        setSupplerIdVal(res?.supplyOrderId);
        setRecords(res);
        setStatusVal(res?.statusId);
        const MappedData = res?.obsList?.map((item) => ({
          id: item?.id,
          poObservationId: item?.poObservationId,
          observation: item?.observation,
          remedialAction: item?.remedialAction ?? "",
          obsCategory: item?.obsCategory,
          remarks: item?.remarks ?? "",
          roleId: roleId,
          isClosed:
            item?.isClosed === null
              ? ""
              : item?.isClosed === true
              ? "true"
              : "false",
        }));
        setValue("POObservation", MappedData);
        console.log("res", res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getData();
  }, [rowData]);

  const onFormSubmit = (data) => {
    setLoad(true);
    if (roleId === 18) {
      const value = {
        id: idVal,
        supplyOrderId: supplerIdVal,
        obsList: data.POObservation?.map((item) => ({
          id: item.id,
          remedialAction: item.remedialAction,
        })),
      };

      dispatch(submitPoSbu(value))
        .then((res) => {
          setIdVal(res?.id);
          setSupplerIdVal(res?.supplyOrderId);
          setStatusVal(res?.statusId);
          getData();
        })
        .catch((error) => {
          console.log("error", error);
        })
 .finally(() => {
          setLoad(false);
        });
    } else if (roleId === 7 || roleId === 17) {
      const value = {
        id: idVal,
        supplyOrderId: supplerIdVal,
        obsList: data.POObservation?.map((item) => ({
          id: item.id,
          isClosed: item.isClosed,
          remarks: item.remarks,
        })),
      };

      dispatch(submitRemarkPo(value))
        .then((res) => {
          if (res !== "failure") {
            setIdVal(res?.id);
            setSupplerIdVal(res?.supplyOrderId);
            setStatusVal(res?.statusId);
            getData();
          }
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          setLoad(true);
        });
    }
  };

  console.log(getValues("POObservation"));

  const onFormSave = (data) => {
    if (roleId === 18) {
      const value = {
        id: idVal,
        supplyOrderId: supplerIdVal,
        obsList: getValues("POObservation")?.map((item) => ({
          id: item.id,
          remedialAction: item.remedialAction,
        })),
      };

      dispatch(savePoSbu(value))
        .then((res) => {
          setIdVal(res?.id);
          setSupplerIdVal(res?.supplyOrderId);
          setStatusVal(res?.statusId);
          getData();
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else if (roleId === 7 || roleId === 17) {
      const value = {
        id: idVal,
        supplyOrderId: supplerIdVal,
        obsList: getValues("POObservation")?.map((item) => ({
          id: item.id,
          isClosed: item.isClosed,
          remarks: item.remarks,
        })),
      };

      dispatch(savePoRemarks(value))
        .then((res) => {
          setIdVal(res?.id);
          setSupplerIdVal(res?.supplyOrderId);
          setStatusVal(res?.statusId);
          getData();
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  return (
    <>
      <Grid container align="right">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <ViewSOScrutiny id1={id1} />
        </Grid>
      </Grid>
      <Grid container>
        {!hide && (
          <Grid item xs={12} align="left">
            <Button
              type="submit"
              size="small"
              onClick={() =>
                dispatch(
                  selectItem(
                    roleId === 9 ? <SOObservationTable /> : <ObservationForm />
                  )
                )
              }
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
            >
              Back
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            PO OBSERVATION FORM
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
          <Typography className={classes.text}>
            <span style={{ fontWeight: "normal" }}>PO.No : </span>{" "}
            {rowData?.soOrderNo}
            <span style={{ fontWeight: "normal" }}> &amp; Date : </span>{" "}
            {rowData?.soDate}
          </Typography>
        </Grid>
        <br />
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            1. Refer to subject PO
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            2. On scrutiny of subject PO, the following discrepancies are
            observed as:-{" "}
          </Typography>
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
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Grid container>
                <TableContainer style={{ maxHeight: "600px" }}>
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
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">SI.No.</StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            {" "}
                            Discrepancies/observation
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            {" "}
                            Observation Category
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            Remedial action by OPA/Vendor(To be filled up by
                            OPA/Vendor)
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left" colSpan={1}>
                          <Typography className={classes.subHeading}>
                            Remarks
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            Observation Closed
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                  {!loading ?(
                    <TableBody>
                      {fields.length >= 0
                        ? fields.map((input, index) => (
                            <TableRow key={input.id}>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>
                                {" "}
                                <Controller
                                  control={control}
                                  name={`POObservation[${index}].observation`}
                                  render={({ field: { value } }) => (
                                    <Typography
                                      className={classes.tableCellText}
                                    >
                                      {input.observation}
                                    </Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                              <Controller
                                  control={control}
                                  name={`POObservation[${index}].obsCategory`}
                                  render={({ field: { value } }) => (
                                    <Typography
                                      className={classes.tableCellText}
                                    >
                                      {input.obsCategory}
                                    </Typography>
                                  )}
                                />
                               
                              </StyledTableCell>

                              <StyledTableCell>
                                <Controller
                                  control={control}
                                  name={`POObservation[${index}].remedialAction`}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      value={
                                        roleId === 18 ||
                                        (statusVal != 1 &&
                                          (roleId === 7 || roleId === 17))
                                          ? value
                                          : ""
                                      }
                                      onChange={onChange}
                                      placeholder="Remedial action by OPA/Vendor(To be filled up by OPA/Vendor)"
                                      inputProps={{
                                        readOnly:
                                          roleId === 18 && statusVal === 1
                                            ? false
                                            : true,
                                        maxLength: 500,
                                      }}
                                      onInput={restrict.general}
                                      error={
                                        !!errors.POObservation?.[index]
                                          ?.remedialAction
                                      }
                                      helperText={
                                        errors.POObservation?.[index]
                                          ?.remedialAction?.message
                                      }
                                      //disabled={roleId === 9 && statusVal === 1 ? false : true}
                                    />
                                  )}
                                />
                              </StyledTableCell>

                              {roleId === 9 ? (
                                <StyledTableCell>
                                  <Controller
                                    control={control}
                                    name={`POObservation[${index}].remarks`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={value}
                                        placeholder="Remarks"
                                        onChange={(e) => {
                                          onChange(e);
                                        }}
                                        inputProps={{ readOnly: true }}
                                        error={
                                          !!errors.POObservation?.[index]
                                            ?.remarks
                                        }
                                        helperText={
                                          errors.POObservation?.[index]?.remarks
                                            ?.message
                                        }
                                      />
                                    )}
                                  />
                                </StyledTableCell>
                              ) : (
                                <StyledTableCell
                                  className={classes.tableCellText}
                                >
                                  <Controller
                                    control={control}
                                    name={`POObservation[${index}].remarks`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <TextField
                                        size="small"
                                        fullWidth
                                        inputProps={{
                                          readOnly:
                                            statusVal === 2 ? false : true,
                                          maxLength: 500,
                                        }}
                                        onInput={restrict.general}
                                        //disabled={statusVal === 2 ? false : true}
                                        variant="outlined"
                                        value={value}
                                        placeholder="Remarks"
                                        onChange={(e) => {
                                          onChange(e);
                                        }}
                                        error={
                                          !!errors.POObservation?.[index]
                                            ?.remarks
                                        }
                                        helperText={
                                          errors.POObservation?.[index]?.remarks
                                            ?.message
                                        }
                                      />
                                    )}
                                  />
                                </StyledTableCell>
                              )}
                              {roleId === 9 ? (
                                <StyledTableCell
                                  className={classes.tableCellText}
                                >
                                  <Controller
                                    name={`POObservation[${index}].isClosed`}
                                    control={control}
                                    render={({
                                      field: { onChange, value },
                                    }) => (
                                      <FormControl component="fieldset">
                                        <RadioGroup
                                          row
                                          size="small"
                                          onChange={onChange}
                                          value={value}
                                        >
                                          <FormControlLabel
                                            value="true"
                                            control={<Radio size="small" />}
                                            label="Yes"
                                            disabled={
                                              (roleId === 7 || roleId === 17) &&
                                              statusVal === 2
                                                ? false
                                                : true
                                            }
                                          />
                                          <FormControlLabel
                                            value="false"
                                            control={<Radio size="small" />}
                                            label="No"
                                            disabled={
                                              (roleId === 7 || roleId === 17) &&
                                              statusVal === 2
                                                ? false
                                                : true
                                            }
                                          />
                                        </RadioGroup>{" "}
                                        <FormHelperText
                                          error={
                                            !!errors.POObservation?.[index]
                                              ?.isClosed
                                          }
                                        >
                                          {
                                            errors.POObservation?.[index]
                                              ?.isClosed?.message
                                          }
                                        </FormHelperText>
                                      </FormControl>
                                    )}
                                  />
                                </StyledTableCell>
                              ) : (
                                <StyledTableCell
                                  className={classes.tableCellText}
                                >
                                  <Controller
                                    name={`POObservation[${index}].isClosed`}
                                    control={control}
                                    render={({
                                      field: { onChange, value },
                                    }) => (
                                      <FormControl component="fieldset">
                                        <RadioGroup
                                          row
                                          size="small"
                                          onChange={onChange}
                                          value={value}
                                        >
                                          <FormControlLabel
                                            value="true"
                                            control={<Radio size="small" />}
                                            label="Yes"
                                            disabled={
                                              (roleId === 7 || roleId === 17) &&
                                              statusVal === 2
                                                ? false
                                                : true
                                            }
                                          />
                                          <FormControlLabel
                                            value="false"
                                            control={<Radio size="small" />}
                                            label="No"
                                            disabled={
                                              (roleId === 7 || roleId === 17) &&
                                              statusVal === 2
                                                ? false
                                                : true
                                            }
                                          />
                                        </RadioGroup>{" "}
                                        <FormHelperText
                                          error={
                                            !!errors.POObservation?.[index]
                                              ?.isClosed
                                          }
                                        >
                                          {
                                            errors.POObservation?.[index]
                                              ?.isClosed?.message
                                          }
                                        </FormHelperText>
                                      </FormControl>
                                    )}
                                  />
                                </StyledTableCell>
                              )}
                            </TableRow>
                          ))
                        : "No item in the list"}
                    </TableBody>
                    )
                    :null
                    }
                  </Table>
                </TableContainer>
                {/* <Grid item xs={12} xl={12} align="Right">
                <Button className={classes.button}>Submit</Button>
              </Grid> */}
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Paper>
      <br />
      <br />
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
        <Typography className={classes.subHeading}>
          Signature of the Section Officer
        </Typography>
        <Typography className={classes.subHeading}>
          {poObservation?.secOfficer}
        </Typography>
      </Grid>

      {/* {!hide && ( */}
      <div>
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <Grid
            item
            xs={7}
            sm={7}
            md={7}
            lg={poObservation?.statusVal !== "" ? 8 : 9}
            xl={poObservation?.statusVal !== "" ? 8 : 9}
            align="right"
          />

          {!loading && (
            <Grid item xs={3} sm={3} md={3} lg={2} xl={2} align="right">
              {(statusVal === 1 && roleId === 18) ||
              (statusVal === 2 && (roleId === 7 || roleId === 17)) ? (
                <Button
                  type="submit"
                  onClick={onFormSave}
                  variant="contained"
                  className={classes.draft}
                  disabled={loading || records?.submittedDate}
                >
                  Save Drafts
                </Button>
              ) : null}
            </Grid>
          )}

          {!loading && (
            <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="right">
              {(statusVal === 1 && roleId === 18) ||
              (statusVal === 2 && (roleId === 7 || roleId === 17)) ? (
                <Button
                  type="submit"
                  onClick={handleSubmit(onFormSubmit)}
                  variant="contained"
                  color="primary"
                  disabled={loading || records?.submittedDate}
                >
                  {load && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size="24px"
                    />
                  )}{" "}
                  Submit
                </Button>
              ) : null}
            </Grid>
          )}
          {(!loading || records?.submittedDate) && (
            <Grid item xs={1} align="right">
              <Button
                variant="contained"
                className={classes.btn}
                onClick={() => setOpen(true)}
              >
                Preview
              </Button>
            </Grid>
          )}

          <Dialog
            open={open}
            // onClose={onClose}
            maxWidth="lg"
            align="center"
            PaperComponent={(props) => (
              <PaperComponent id="draggable-dialog-title13" {...props} />
            )}
          >
            <DialogTitle
              style={{ fontSize: "0.875rem", cursor: "move" }}
              onClose={() => setOpen(false)}
              id="draggable-dialog-title13"
            >
              PO OBSERVATION FORM
            </DialogTitle>

            <DialogContent>
              <div id="print" ref={(el) => (componentRef = el)}>
                {/* <HeaderPdf /> */}
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="center"
                  >
                    <Typography className={classes.heading}>
                      PO OBSERVATION FORM
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
                    <Typography className={classes.text}>
                      <span style={{ fontWeight: "normal" }}>PO.No : </span>{" "}
                      {rowData?.soOrderNo}
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        &amp; Date :{" "}
                      </span>{" "}
                      {rowData?.soDate}
                    </Typography>
                  </Grid>
                  <br />
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
                    <Typography className={classes.subHeading}>
                      1. Refer to subject PO
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="left"
                  >
                    <Typography className={classes.subHeading}>
                      2. On scrutiny of subject PO, the following discrepancies
                      are observed as:-{" "}
                    </Typography>
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
                      <form onSubmit={handleSubmit(onFormSubmit)}>
                        <Grid container>
                          {/* <TableContainer style={{ maxHeight: "600px" }}> */}
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
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="left">
                                    <Typography className={classes.subHeading}>
                                      {" "}
                                      Sl.No
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    <Typography className={classes.subHeading}>
                                      {" "}
                                      Discrepancies/observation
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    <Typography className={classes.subHeading}>
                                      Remedial action by OPA/Vendor(To be filled
                                      up by OPA/Vendor)
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="left" colSpan={1}>
                                    <Typography className={classes.subHeading}>
                                      Remarks
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="left">
                                    <Typography className={classes.subHeading}>
                                      Observation Closed
                                    </Typography>
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {fields.length >= 0
                                  ? fields.map((input, index) => (
                                      <TableRow key={input.id}>
                                        <StyledTableCell>
                                          {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {" "}
                                          <Controller
                                            control={control}
                                            name={`POObservation[${index}].observation`}
                                            render={({ field: { value } }) => (
                                              <Typography
                                                className={
                                                  classes.tableCellText
                                                }
                                              >
                                                {input.observation}
                                              </Typography>
                                            )}
                                          />
                                        </StyledTableCell>

                                        <StyledTableCell>
                                          <Controller
                                            control={control}
                                            name={`POObservation[${index}].remedialAction`}
                                            render={({
                                              field: { value, onChange },
                                            }) => (
                                              // <TextField
                                              //   fullWidth
                                              //   size="small"
                                              //   variant="outlined"
                                              //   value={value}
                                              //   onChange={onChange}
                                              //   placeholder="Remedial action by OPA/Vendor(To be filled up by OPA/Vendor)"
                                              //   disabled={
                                              //     roleId === 9 &&
                                              //     statusVal === 1
                                              //       ? false
                                              //       : true
                                              //   }
                                              // />
                                              <Typography>{value}</Typography>
                                            )}
                                          />
                                        </StyledTableCell>

                                        {roleId === 9 ? (
                                          <StyledTableCell>
                                            <Controller
                                              control={control}
                                              name={`POObservation[${index}].remarks`}
                                              render={({
                                                field: { value, onChange },
                                              }) => (
                                                // <TextField
                                                //   disabled
                                                //   fullWidth
                                                //   variant="outlined"
                                                //   size="small"
                                                //   value={value}
                                                //   placeholder="Remarks"
                                                //   onChange={(e) => {
                                                //     onChange(e);
                                                //   }}
                                                // />
                                                <Typography>{value}</Typography>
                                              )}
                                            />
                                          </StyledTableCell>
                                        ) : (
                                          <StyledTableCell
                                            className={classes.tableCellText}
                                          >
                                            <Controller
                                              control={control}
                                              name={`POObservation[${index}].remarks`}
                                              render={({
                                                field: { value, onChange },
                                              }) => (
                                                // <TextField
                                                //   size="small"
                                                //   fullWidth
                                                //   disabled={
                                                //     statusVal === 2
                                                //       ? false
                                                //       : true
                                                //   }
                                                //   variant="outlined"
                                                //   value={value}
                                                //   placeholder="Remarks"
                                                //   onChange={(e) => {
                                                //     onChange(e);
                                                //   }}
                                                // />
                                                <Typography>{value}</Typography>
                                              )}
                                            />
                                          </StyledTableCell>
                                        )}

                                        <StyledTableCell
                                          className={classes.tableCellText}
                                        >
                                          <Controller
                                            name={`POObservation[${index}].isClosed`}
                                            control={control}
                                            render={({
                                              field: { onChange, value },
                                            }) => (
                                              <Typography>
                                                {value === null
                                                  ? ""
                                                  : value === "true"
                                                  ? "Yes"
                                                  : "No"}
                                              </Typography>
                                            )}
                                          />

                                          {/* <FormHelperText error={!!errors.qtTestApplicable}>
                          {errors.qtTestApplicable?.message}
                        </FormHelperText> */}
                                        </StyledTableCell>
                                      </TableRow>
                                    ))
                                  : "No item in the list"}
                              </TableBody>
                            </Table>
                          {/* </TableContainer> */}
                          {/* <Grid item xs={12} xl={12} align="Right">
                <Button className={classes.button}>Submit</Button>
              </Grid> */}
                        </Grid>
                      </form>
                    </Grid>
                  </Grid>
                </Paper>
                <br />
                <br />
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  align="right"
                >
                  <Typography className={classes.subHeading}>
                    Signature of the Section Officer
                  </Typography>
                  <Typography className={classes.subHeading}>
                    {poObservation?.secOfficer}
                  </Typography>
                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="center">
                <ReactToPrint
                  trigger={() => (
                    <Button variant="contained" className={classes.print}>
                      Print
                    </Button>
                  )}
                  content={() => componentRef}
                />
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
      </div>
      {/* )} */}
    </>
  );
}
