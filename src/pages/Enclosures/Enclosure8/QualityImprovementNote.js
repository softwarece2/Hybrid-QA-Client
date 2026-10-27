/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as yup from "yup";
//material-ui

import {
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../components/TextField";

//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete } from "@material-ui/lab";

import MultilineTextField from "components/MultilineTextField";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getQINdataByOL, saveQinObsNcForm } from "Redux/Actions/Inspect/InspectOLAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { getLineItemsByOLId } from "Redux/Actions/SupplyOrder/OLAction";
import { StyledTableCell, StyledTableRow } from "../../../components/UseTable";
import Button from "components/Button";
import QINReworkView from "./QINReworkView";
import OLTable from "pages/Sslip/SSlipTable";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import ViewOfferLetters from "pages/SOModule/SupplyOrderDetails/View/ViewOfferLetters";

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
  buttonProgress: {
    color: "white",
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
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

  icon: {
    color: "#f44336",
  },
  textArea: {
    fontSize: "0.875rem",
    fontWeight: 400,
    maxWidth: "200px",
  },
  tableHeadCell: {
    background: "#def1ff",
    fontSize: "13px",
    fontWeight: 600,
    color: "#205375",
  },
  tableCell: {
    fontWeight: 600,
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "BEL Part No",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Category",
    field: "itemCategoryName",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Observation",
    align: "left",
    disableSorting: true,
  },

  {
    // id: "ClaimedAmount",
    label: "Rework/ Action",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Sub Part No",
    align: "left",
    disableSorting: true,
  },

  {
    // id: "ClaimedAmount",
    label: "Remarks/ Item Sl.No",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  observation: yup.string().required("Required").typeError("required"),
});
const schema = yup.object().shape({
  // observation: yup
  //   .string()
  //   .required("Required")
  //   .typeError("required"),
  array: yup.array().of(arraySchema).required("Must have fields").typeError("required"),
});
const defaultArray = {
  partNo: "",
  description: "",
  itemCategoryName: "",
  observation: "",
  id: "",
  subPartNo: "",
  closureStatus: "false",
  remarks: "",
  reworkAction: "",
};
const defaultValues = {
  array: [defaultArray],
};
const count = 1;
export default function QualityImprovementNote({ rowData }) {
  const classes = useStyles();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [records, setRecords] = useState([null]);
  const [savedData, setSavedData] = useState([null]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "array",
  });

  const fetchLI = (id) => {
    setLoading(true);
    if (id !== undefined) {
      getLineItemsByOLId(id)
        .then((data) => {
          setRecords(data);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }
    setRecords([]);
  };

  const getQINData = async (id) => {
    if (id !== undefined) {
      setLoading(true);
      try {
        const data = await dispatch(getQINdataByOL(id));
        setSavedData(data);
        if (data.isReworkSubmitted || data.qinObsNcFormDets.length > 0) {
          const mappedData = data?.qinObsNcFormDets?.map((item) => ({
            ...item,
            id: item.id,
            observation: item.observation,
            olLineItemId: item.olLineItemId,
            reworkAction: item.reworkAction,
            remarks: item.remarks,
            subPartNo: item.subPartNo,
            closureStatus: item.closureStatus === true ? "true" : "false",
          }));
          reset({
            array: mappedData,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    setRecords([]);
  };
  useEffect(() => {
    fetchLI(rowData?.id);
    getQINData(rowData?.id);
  }, []);

  const onFormSubmit = (data) => {
    setLoadingDraft(true);
    console.log("records val", data.qinObsNcFormDets);
    let value = {
      offerLetterId: rowData?.id,
      createdBy: loggedInUser?.empId,
    };
    if (loggedInUser.roleId === 7) {
      if (savedData.isReworkSubmitted) {
        value.qinObsNcFormDets = data.array?.map((item) => ({
          ...item,
          id: item.id,
          olLineItemId: item.olLineItemId,
          reworkAction: item.reworkAction,
          remarks: item.remarks,
          ubPartNo: item.subPartNo,
          closureStatus: item.closureStatus,
        }));
        value.id = savedData?.id;
        value.offerLetterId = savedData?.offerLetterId;
        value.modifiedBy = loggedInUser?.roleId;
      } else {
        value.qinObsNcFormDets = data.array?.map((item) => ({
          olLineItemId: item.partNo.id,
          observation: item.observation,
          subPartNo: item.subPartNo,
        }));
      }
    }
    if (loggedInUser.roleId === 9) {
      value.qinObsNcFormDets = data.array?.map((item) => ({
        ...item,
        id: item.id,
        olLineItemId: item.olLineItemId,
        reworkAction: item.reworkAction,
        remarks: "",
        ubPartNo: item.subPartNo,
        closureStatus: "",
      }));
      value.id = savedData?.id;
      value.offerLetterId = savedData?.offerLetterId;
      value.modifiedBy = loggedInUser?.roleId;
    }
    dispatch(saveQinObsNcForm(value)).then((res) => {
      // resetform();
      setDisableSubmit(true);
      setLoadingDraft(false);
      getQINData(rowData?.id);
      // dispatch(selectItem(<QINRework rowData={rowData} />));
    });
  };
  const isInspectorView =
    savedData.isQinClosed || loggedInUser?.roleId !== 7 || savedData?.isReworkSubmitted || savedData?.qinObsNcFormDets?.length > 0;

  const isSubmitBtnDisable = () => {
    if (!savedData && loggedInUser?.roleId === 9) {
      return true;
    }
    if (savedData.isQinClosed) {
      return true;
    }

    if (savedData?.qinObsNcFormDets?.length > 0) {
      if (!savedData.isReworkSubmitted && loggedInUser?.roleId === 7) {
        return true;
      }
      if (savedData.isReworkSubmitted && loggedInUser?.roleId === 7) {
        return false;
      }
      if (!savedData.isReworkSubmitted && loggedInUser?.roleId === 9) {
        return false;
      }
      if (savedData.isReworkSubmitted && loggedInUser?.roleId === 9) {
        return true;
      }
    }

    return false;
  };

  console.log(savedData?.qinObsNcFormDets?.length === 0)
  return (
    <>
      {open && <QINReworkView open={open} setOpen={setOpen} rowData={rowData} />}
      <Grid container>
        <Grid item xs={12} align="left">
          <Button
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
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>QUALITY IMPROVEMENT NOTE(QIN)/OBSERVATIONS/NON CONFORMANCE IS/FRM/003</Typography>
        </Grid>
      </Grid>
      <br />

      <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center" style={{ margin: "auto", overflowX: "auto" }}>
        <TableContainer style={{ maxHeight: "600px" }}>
          {loading && <LinearProgress />}
          <Table
            style={{ position: "relative", border: "1px solid lightgrey" }}
            size="small"
            aria-label="simple table"
            id="data-table-cleanliness-report"
          >
            <TableBody>
              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>FILE NO</StyledTableCell>
                <StyledTableCell className={classes.remarks} colSpan="2">
                  : {rowData.fileNo}
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>P.O/Indent No. & Date</StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData.soNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData.soDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>OL_No and date</StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData?.olNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData.offerDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>Project</StyledTableCell>
                <StyledTableCell className={classes.remarks} colSpan="2">
                  : {rowData.projectName}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <br />

      <Paper>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{ margin: "auto", overflowX: "auto" }}>
            <Grid container>
              <TableContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {headCells.map((el) => (
                        <TableCell className={classes.tableHeadCell}>{el.label}</TableCell>
                      ))}
                      {savedData?.isReworkSubmitted && <TableCell className={classes.tableHeadCell}>Observation Closed</TableCell>}
                      {!savedData?.qinObsNcFormDets?.length > 0 && <TableCell className={classes.tableHeadCell}></TableCell>}
                    </TableRow>
                  </TableHead>
                  {fields.length !== 0 ? (
                    <TableBody>
                      {fields?.map((input, index) => (
                        <StyledTableRow key={input.id}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>
                            {isInspectorView ? (
                              <>{input?.partNo}</>
                            ) : (
                              <Controller
                                name={`array[${index}].partNo`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <Autocomplete
                                    options={records}
                                    onChange={(e, v) => {
                                      e.preventDefault();
                                      onChange(v);
                                    }}
                                    value={value}
                                    getOptionLabel={(option) => option.partNo}
                                    style={{ width: 200 }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                  />
                                )}
                              />
                            )}
                          </StyledTableCell>
                          <StyledTableCell style={{ width: "120px" }}>
                            {watch(`array[${index}].partNo`)?.description || input?.description}
                          </StyledTableCell>
                          <StyledTableCell style={{ width: "120px" }}>
                            {watch(`array[${index}].partNo`)?.itemCategoryName || input?.category}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Controller
                              name={`array[${index}].observation`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <MultilineTextField
                                  placeholder="Observation"
                                  size="small"
                                  onChange={onChange}
                                  value={value}
                                  error={!!errors.array?.[index]?.observation}
                                  helperText={errors.array?.[index]?.observation?.message}
                                  minRows={2}
                                  maxRows={3}
                                  inputProps={{
                                    maxLength: 500,
                                    readOnly: isInspectorView,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Controller
                              name={`array[${index}].reworkAction`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <MultilineTextField
                                  placeholder="Rework Action"
                                  size="small"
                                  onChange={onChange}
                                  value={value}
                                  minRows={2}
                                  maxRows={3}
                                  inputProps={{
                                    maxLength: 500,
                                    readOnly: loggedInUser?.roleId === 7 || savedData.isReworkSubmitted,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>

                          <StyledTableCell>
                            <Controller
                              name={`array[${index}].subPartNo`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <MultilineTextField
                                  // className={classes.textArea}
                                  placeholder="sub part no"
                                  size="small"
                                  {...props}
                                  onChange={onChange}
                                  value={value}
                                  minRows={2}
                                  maxRows={3}
                                  inputProps={{
                                    maxLength: 100,
                                    readOnly: isInspectorView,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>

                          <StyledTableCell>
                            <Controller
                              name={`array[${index}].remarks`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <MultilineTextField
                                  placeholder="Remarks"
                                  size="small"
                                  {...props}
                                  onChange={onChange}
                                  disabled={!savedData?.isReworkSubmitted}
                                  value={value}
                                  minRows={2}
                                  maxRows={3}
                                  inputProps={{
                                    maxLength: 500,
                                    readOnly: loggedInUser?.roleId !== 7 || savedData?.isQinClosed,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>

                          {savedData?.isReworkSubmitted && (
                            <StyledTableCell>
                              <Controller
                                name={`array[${index}].closureStatus`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <FormControl
                                    component="fieldset"
                                    disabled={loggedInUser?.roleId !== 7 || !savedData?.isReworkSubmitted || savedData.isQinClosed}
                                  >
                                    <RadioGroup row size="small" value={value}>
                                      <FormControlLabel value="true" onChange={onChange} control={<Radio size="small" />} label="Yes" />
                                      <FormControlLabel value="false" onChange={onChange} control={<Radio size="small" />} label="No" />
                                    </RadioGroup>
                                  </FormControl>
                                )}
                              />
                            </StyledTableCell>
                          )}
                          {!savedData?.qinObsNcFormDets?.length > 0 && (
                            <StyledTableCell>
                              {index + 1 !== count ? null : (
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    append(defaultArray);
                                  }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              )}
                              {index === 0 ? null : (
                                <IconButton aria-label="delete" onClick={() => remove(index)} size="small">
                                  <DeleteIcon className={classes.icon} />
                                </IconButton>
                              )}
                            </StyledTableCell>
                          )}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={9}>No records to display</TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <div className={classes.space} align="center">
        {!loading && (
          <>
            <Button
              type="submit"
              onClick={handleSubmit(onFormSubmit)}
              variant="contained"
              color="secondary"
              disabled={isSubmitBtnDisable()}
            >
              {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} &nbsp; Submit
            </Button>
            <Button type="submit" onClick={() => setOpen(true)} variant="contained" color="secondary" disabled={!savedData?.isQinClosed}>
              Preview
            </Button>
          </>
        )}
      </div>
      {/* </Paper> */}
    </>
  );
}
