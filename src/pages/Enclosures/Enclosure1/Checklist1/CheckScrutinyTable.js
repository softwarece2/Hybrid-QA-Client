/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState} from "react";
//material-ui

import {
  CircularProgress,
  Dialog,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  Typography,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import "jspdf-autotable";
import { Controller, useFieldArray, useForm } from "react-hook-form"; 
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { DialogContent, DialogTitle, DialogActions } from "Utils";

//components
import Button from "components/Button";
import TextField from "../../../../components/TextField";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../../components/UseTable";

//redux
import InspectSOTable from "pages/InspectorModule/SOInspector/InspectSOTable";


import ViewSOScrutiny from "./ViewSOScrutiny";
import HeaderPdf from "pages/Layout/HeaderPdf";
import SbuSoTable from "pages/SOModule/SupplyOrderDetails/SbuSO/SbuSoTable";
import { PaperComponent } from "Utils/D3Tree";
import { getScrutinySo, saveScrutinySo, submitScrutinySo } from "Redux/Actions/Enclosure/CheckScrutinyAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";

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
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  remarks: {
    width: 600,
    [theme.breakpoints.down("lg")]: {
      width: 400,
    },
  },
  tableCellRadio: {
    width: 200,
    [theme.breakpoints.down("lg")]: {
      width: 100,
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
  draft: {
    fontSize: "0.875rem",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));

const arraySchema = yup.object().shape({
  obsSts: yup.string().required("Required").typeError("Required"),
  // .nullable(),
  remarks: yup
    .string()
    .trim()

    // .typeError("required")
    .when("obsSts", (obsSts) => {
      if (obsSts === "no") {
        return (
          yup
            .string()
            .trim()
            .required("Required")
            // .max(avlQty, "Total must be less than available")
            .typeError("Required")
        );
      }
    }),
});

const schema = yup.object().shape({
  scrutinySoMainDet: yup.array().of(arraySchema).required("Must have fields"),
});

const defaultArray = () => ({
  id: "",
  slNo: "",
  checklistId: "",
  obsSts: "yes",
  remarks: "",
});

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "SL.No", align: "left", disableSorting: true },
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

export default function CheckScrutinyTable({ soObj, sbuAdmin }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.loggedInUser);
  // const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [idVal, setIdVal] = React.useState(null);
  const [records, setRecords] = useState([]);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const id1 = soObj?.id;

  const componentRef = React.useRef();

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [saveDialog, setSaveDialog] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const {
    TblContainer,
    TblHead,
  
  } = useTable(records, headCells, filterFn);
  const CloseDialog = () => {
    setSaveDialog(false);
  };

  const defaultValues = {
    scrutinySoMainDet: [defaultArray],
  };
  const {
    handleSubmit,
    trigger,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: "scrutinySoMainDet",
  });
  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks,
      reference: item.reference,
      split: item.split,
      obsSts:
        item.obsSts === "no" ? "no" : item.obsSts === "yes" ? "yes" : "yes",
      obsType: item.obsType,
    }));
    // console.log(MappedData, records, "ad");
    setValue("scrutinySoMainDet", MappedData);
  }, [records, setValue]);

  const onFormSave = () => {
    setLoadingDraft(true);
    console.log("records val", getValues());
    const value = {
      id: idVal,
      createdBy: user.empId,
      modifiedBy: user.empId,
      inspectedBy: 1,
      signedBy: 1,
      supplyOrderId: soObj?.id,
      scrutinySoDetDtos: getValues().scrutinySoMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
        obsSts:
          item.obsSts === "yes" ? "yes" : item.obsSts === "no" ? "no" : "",
        obsType: item.obsType,
      })),
    };
    dispatch(saveScrutinySo(value))
      .then((res) => {
        setIdVal(res?.id);
        console.log(res, "response");
        setRecords(res?.scrutinySoDetDtos);
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };

  const onSubmit = (data) => {
    setLoading(true);
    const value = {
      id: idVal,
      createdBy: user.empId,
      modifiedBy: user.empId,
      inspectedBy: 1,
      signedBy: 1,
      supplyOrderId: soObj?.id,
      scrutinySoDetDtos: data.scrutinySoMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
        obsSts:
          item.obsSts === "yes" ? "yes" : item.obsSts === "no" ? "no" : "",
        obsType: item.obsType,
      })),
    };
    dispatch(submitScrutinySo(value))
      .then((res) => {
        setIdVal(res?.id);
        setSaveDialog(false);
        setRecords(res?.scrutinySoDetDtos);
        // setId1(soObj?.id);
        setResponseData(res);
        setLoading(false);
        // CloseSave();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  React.useEffect(() => {
    // if (status) {
    setLoading(true);
    dispatch(getScrutinySo(soObj?.id))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.scrutinySoDetDtos);
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));
    // }
  }, []);


  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Grid container>
     { !sbuAdmin && <Grid item xs={12} align="left">
          <Button
            type="submit"
            onClick={() =>
              user?.roleId === 9
                ? dispatch(selectItem(<SbuSoTable />))
                : dispatch(selectItem(<InspectSOTable />))
            }
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}>
            Back
          </Button>
        </Grid>}
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          align="center"
          style={{ padding: "6px" }}>
          <Typography className={classes.heading}>
            Checklist for Scrutiny of supply order :{""}IS/CKL/001
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <Typography className={classes.subHeading}>
            SO Number: <span style={{ fontWeight: 500 }}>{soObj?.orderNo}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <Typography className={classes.subHeading}>
            File No: <span style={{ fontWeight: 500 }}>{soObj?.fileNo}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <Typography className={classes.subHeading}>
            Dated:{" "}
            <span style={{ fontWeight: 500 }}>{soObj?.orderDateStr}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <ViewSOScrutiny id1={id1} />
        </Grid>
      </Grid>
      <br />{" "}
      <form onSubmit={handleSubmit(onSubmit)}>
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
              style={{ margin: "auto", overflowX: "auto" }}>
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
                    id="data-table-cleanliness-report">
                    <TblHead />
                    {fields?.map((item, index) => (
                      <StyledTableRow
                        className={classes.tableColor}
                        key={index}>
                        <StyledTableCell style={{ width: 20 }}>
                          {" "}
                          <Controller
                            control={control}
                            name={`scrutinySoMainDet[${index}].slNo`}
                            render={({ field: { value } }) => (
                              <Typography>{value}</Typography>
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell style={{ width: 500 }}>
                          {" "}
                          <Controller
                            control={control}
                            name={`scrutinySoMainDet[${index}].reference`}
                            render={({ field: { value } }) => (
                              <Typography>{value}</Typography>
                            )}
                          />
                        </StyledTableCell>

                        {item.obsType !== null && item.obsType === "yes_no" ? (
                          <StyledTableCell className={classes.tableCellRadio}>
                            <Controller
                              name={`scrutinySoMainDet[${index}].obsSts`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <FormControl component="fieldset">
                                  <RadioGroup row size="small" value={value}>
                                    <FormControlLabel
                                      value="yes"
                                      onChange={onChange}
                                      disabled={responseData?.submittedDatetime}
                                      control={<Radio size="small" />}
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value="no"
                                      onChange={onChange}
                                      disabled={responseData?.submittedDatetime}
                                      control={<Radio size="small" />}
                                      label="No"
                                    />
                                  </RadioGroup>{" "}
                                  <FormHelperText
                                    error={
                                      !!errors.scrutinySoMainDet?.[index]
                                        ?.obsSts
                                    }>
                                    {
                                      errors.scrutinySoMainDet?.[index]?.obsSts
                                        ?.message
                                    }
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />

                            {/* <FormHelperText error={!!errors.qtTestApplicable}>
                          {errors.qtTestApplicable?.message}
                        </FormHelperText> */}
                          </StyledTableCell>
                        ) : item.obsType !== null &&
                          item.obsType === "sat_nonsat" ? (
                          <StyledTableCell className={classes.tableCellRadio}>
                            <Controller
                              name={`scrutinySoMainDet[${index}].obsSts`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <FormControl component="fieldset">
                                  <RadioGroup row size="small" value={value}>
                                    <FormControlLabel
                                      value="yes"
                                      onChange={onChange}
                                      disabled={responseData?.submittedDatetime}
                                      control={<Radio size="small" />}
                                      label="Satisfactory"
                                    />
                                    <FormControlLabel
                                      value="no"
                                      onChange={onChange}
                                      disabled={responseData?.submittedDatetime}
                                      control={<Radio size="small" />}
                                      label="Unsatisfactory"
                                    />
                                  </RadioGroup>
                                  <FormHelperText
                                    error={
                                      !!errors.scrutinySoMainDet?.[index]
                                        ?.obsSts
                                    }>
                                    {
                                      errors.scrutinySoMainDet?.[index]?.obsSts
                                        ?.message
                                    }
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell
                            className={
                              classes.tableCellRadio
                            }></StyledTableCell>
                        )}
                        <StyledTableCell className={classes.remarks}>
                          <Controller
                            control={control}
                            name={`scrutinySoMainDet[${index}].remarks`}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                value={value}
                                size="small"
                                placeholder="Remarks"
                                inputProps={{
                                  readOnly: responseData?.submittedDatetime,
                                }}
                                error={
                                  !!errors.scrutinySoMainDet?.[index]?.remarks
                                }
                                helperText={
                                  errors.scrutinySoMainDet?.[index]?.remarks
                                    ?.message
                                }
                              />
                            )}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </Table>{" "}
                </TblContainer>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
      {/* </div> */}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={9} align="right" />

        {!loading && (
          <Grid item xs={2} align="right">
            {!responseData?.submittedDatetime && (
              <Button
                type="submit"
                onClick={() => {
                  trigger().then((res) => {
                    console.log("triggerValidation", res);
                    if (res) {
                      onFormSave();
                      setLoadingDraft(true);
                    }
                  });
                }}
                variant="contained"
                className={classes.draft}
                disabled={loadingDraft}
                obs={"obs"}>
                {" "}
                {loadingDraft && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                    color="primary"
                  />
                )}
                Save draft
              </Button>
            )}
          </Grid>
        )}

        {!loading && (
          <Grid item xs={1} align="left">
            {!responseData?.submittedDatetime && (
              <Button
                type="submit"
                onClick={() => {
                  trigger().then((res) => {
                    console.log("triggerValidation", res);
                    if (res) setSaveDialog(true);
                  });
                }}
                variant="contained"
                color="primary"
                // disabled={loading || !isDirty}
              >
                Submit
              </Button>
            )}
          </Grid>
        )}

        {!loading && (
          <Grid item xs={12} align="right">
            {responseData?.submittedDatetime && (
              <Button
                variant="contained"
                className={classes.btn}
                onClick={() => setOpen(true)}>
                Preview
              </Button>
            )}
          </Grid>
        )}

        <Dialog
          open={open}
          // onClose={onClose}
          maxWidth="lg"
          align="center"
          PaperComponent={(props) => (
            <PaperComponent id="draggable-dialog-title234" {...props} />
          )}>
          <DialogTitle
            style={{ fontSize: "0.875rem", cursor: "move" }}
            onClose={() => setOpen(false)}
            id="draggable-dialog-title234">
            Checklist for Scrutiny of supply order: IS/CKL/001
          </DialogTitle>

          <DialogContent>
            <div ref={componentRef}>
              <HeaderPdf />
              <Grid container spacing={0}>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Typography className={classes.subHeading}>
                    SO No: {soObj?.orderNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Typography className={classes.subHeading}>
                    File No: {soObj?.fileNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Typography className={classes.subHeading}>
                    Dated: {soObj?.orderDateStr}
                  </Typography>
                </Grid>
              </Grid>

              <Paper>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    align="center">
                    <Grid container>
                      <TblContainer style={{ maxHeight: "500px" }}>
                        {loading && <LinearProgress />}
                        <Table
                          style={{
                            position: "relative",
                            border: "1px solid lightgrey",
                          }}
                          size="small"
                          aria-label="simple table"
                          id="data-table-cleanliness-report">
                          <TblHead />
                          {getValues("scrutinySoMainDet")?.map(
                            (item, index) => (
                              <StyledTableRow
                                className={classes.tableColor}
                                key={index}>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`scrutinySoMainDet[${index}].slNo`}
                                    render={({ field: { value } }) => (
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`scrutinySoMainDet[${index}].reference`}
                                    render={({ field: { value } }) => (
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>

                                {item.obsType !== null &&
                                item.obsType === "yes_no" ? (
                                  <StyledTableCell
                                    className={classes.tableCellRadio}>
                                    <Typography>
                                      {item?.obsSts === "yes" ? "Yes" : "No"}
                                    </Typography>
                                  </StyledTableCell>
                                ) : item.obsType !== null &&
                                  item.obsType === "sat_nonsat" ? (
                                  <StyledTableCell
                                    className={classes.tableCellRadio}>
                                    <Typography>
                                      {item?.obsSts === "yes"
                                        ? "Satisfactory"
                                        : "Unsatisfactory"}
                                    </Typography>
                                  </StyledTableCell>
                                ) : (
                                  <StyledTableCell
                                    className={
                                      classes.tableCellRadio
                                    }></StyledTableCell>
                                )}
                                <StyledTableCell className={classes.remarks}>
                                  <Typography>{item?.remarks}</Typography>
                                </StyledTableCell>
                              </StyledTableRow>
                            )
                          )}
                        </Table>{" "}
                      </TblContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handlePrint}
              text="Print"
              variant="contained"
              color="primary">
              Print
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Dialog open={openSaveDialog} onClose={() => setOpen(false)} maxWidth="lg">
          <DialogContent>
            <Typography variant="h6">Are you sure you want to save as draft?</Typography>
          </DialogContent>
          <DialogActions classes={{ root: classes.center }}>
            <Button onClick={onFormSave} color="primary" variant="contained" size="small" disabled={loadingDraft}>
              {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />} &nbsp; Yes
            </Button>
            <Button onClick={handleCloseDialog} color="secondary" variant="contained" size="small">
              No
            </Button>
          </DialogActions>
        </Dialog> */}

        <Dialog open={saveDialog} onClose={() => setOpen(false)} maxWidth="lg">
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to submit?
            </Typography>
          </DialogContent>
          <DialogActions classes={{ root: classes.center }}>
            <Button
              onClick={handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              size="small"
              disabled={loading}>
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}{" "}
              &nbsp; Yes
            </Button>
            <Button
              onClick={CloseDialog}
              color="secondary"
              variant="contained"
              size="small">
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
