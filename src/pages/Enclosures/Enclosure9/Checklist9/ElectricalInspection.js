/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";

//material-ui
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import "jspdf-autotable";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { WING_ID } from "../../../../Globals";
//components
import useTable, { StyledTableCell, StyledTableRow } from "../../../../components/UseTable";
import { restrict } from "restrict";

// redux
import Button from "components/Button";
import { getInspectionMain, saveInspectionMain, submitInspectionMain } from "Redux/Actions/Enclosure/Enclosure9Action";
import ElectricalInspectionView from "./ElectricalInspectionView";
import MultilineTextField from "components/MultilineTextField";

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});

const schema = yup.object().shape({
  inspElecMainDet: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
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
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  gridOl: {
    border: "1px solid grey",
    [theme.breakpoints.down("md")]: {
      borderBottom: "0px solid grey",
    },
  },
  gridProj: {
    border: "1px solid grey",
    borderLeft: "0px solid grey",
    [theme.breakpoints.down("md")]: {
      borderLeft: "1px solid grey",
    },
  },
  gridDate: {
    borderLeft: "1px solid grey",
    borderBottom: "1px solid grey",
    [theme.breakpoints.down("md")]: {
      borderRight: "1px solid grey",
      borderBottom: "0px solid grey",
    },
  },
  gridEmpty: {
    borderLeft: "1px solid grey",
    borderRight: "1px solid grey",
    borderBottom: "1px solid grey",
  },
  subHeader: {
    width: "30%",
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

const headCells = [
  { id: "slNo", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "inspElecMainDetDtos",
    label: "Applicable checks",
    align: "left",
    disableSorting: true,
  },
  { id: "remarks", label: "Remarks", align: "left", disableSorting: true },
];

const defaultArray = () => ({
  id: "",
  slNo: "",
  checklistId: "",
  remarks: "",
  reference: "",
});
export default function ElectricalInspection() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [responseData, setResponseData] = useState({});
  const [records, setRecords] = useState([]);
  const [idVal, setIdVal] = React.useState(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [buttonVisible, setButtonVisible] = React.useState(true);
  const [DispatchView, setDispatchView] = useState(false);

  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const { TblContainer, TblHead} = useTable(
    records,
    headCells,
    filterFn
  );

  const defaultValues = {
    inspElecMainDet: [defaultArray],
  };
  const {
    handleSubmit,
    control,
    setValue,

    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields} = useFieldArray({
    control,
    name: "inspElecMainDet",
  });

  const CloseSaveDialog = () => {
    setSaveDialog(false);
  };
  const CloseSave = () => {
    setOpenSaveDialog(false);
  };
  const OpenSaveDialog = () => {
    setSaveDialog(true);
  };



  const fetchData = () => {
    setLoadingTable(true);
    dispatch(getInspectionMain(olId))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspElecMainDetDtos);
        setResponseData(res);
        const isBtnVisible = res?.submittedDate === null && res?.editable ? true : false;
        setButtonVisible(isBtnVisible);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingTable(false));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks || "NA",
      reference: item.reference,
      split: item.split,
    }));
    // console.log(MappedData, records, "ad");
    setValue("inspElecMainDet", MappedData);
  }, [records, setValue]);

  const onFormSave = (data) => {
    setLoadingDraft(true);
    console.log("records val", data.inspElecMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspElecMainDetDtos: data.inspElecMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };
    dispatch(saveInspectionMain(value))
      .then((res) => {
        setRecords(res?.inspElecMainDetDtos);
        setIdVal(res?.id);
        setResponseData(res);
        CloseSaveDialog();
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };

  const onFormSubmit = (data) => {
    setLoading(true);
    console.log("records val", data.inspElecMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspElecMainDetDtos: data.inspElecMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };
    dispatch(submitInspectionMain(value)).then((res) => {
      setIdVal(res?.id);
      setRecords(res?.inspElecMainDetDtos);
      setResponseData(res);
      const isBtnVisible = res?.submittedDate === null && res?.editable ? true : false;
      setButtonVisible(isBtnVisible);
      setLoading(false);
      setOpenSaveDialog();
    });
  };

  return (
    <>
      {" "}
      {DispatchView && <ElectricalInspectionView onClose={() => setDispatchView(false)} />}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            Checklist for Electrical Inspection of Main System/Integrated System:IS/CKL/006
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center" style={{ margin: "auto", overflowX: "auto" }}>
          <TblContainer style={{ maxHeight: "600px" }}>
            {loadingTable && <LinearProgress />}
            <Table
              style={{
                position: "relative",
                border: "1px solid lightgrey",
                maxWidth: "1000px",
              }}
              size="small"
              aria-label="simple table"
              id="data-table-cleanliness-report"
            >
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell className={classes.subHeader}>
                    {isArmy ? "QACL" : "OL"} No. & Date
                  </StyledTableCell>
                  <StyledTableCell className={classes.remarks}>
                    : {responseData.offerLetterNo} {responseData.offerDate}{" "}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell className={classes.subHeader}>Date of Insp</StyledTableCell>
                  <StyledTableCell>: {responseData.inspectedDate} </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell className={classes.subHeader}>QAP ref No</StyledTableCell>
                  <StyledTableCell className={classes.remarks}>: -- </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TblContainer>{" "}
        </Grid>
      </Grid>
      <br />
      {roleId == 7 ? (
        <>
          <form onSubmit={handleSubmit(onFormSubmit)}>
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
                        {fields?.length !== 0 ? (
                          <TableBody>
                            {fields?.map((item, index) => (
                              <StyledTableRow className={classes.tableColor} key={index}>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`inspElecMainDet[${index}].slNo`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`inspElecMainDet[${index}].reference`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  {item.slNo !== null && (
                                    <Controller
                                      control={control}
                                      name={`inspElecMainDet[${index}].remarks`}
                                      render={({ field: { value, onChange } }) => (
                                        <MultilineTextField
                                          rows={item?.reference?.split("\n")?.length}
                                          maxRows={20}
                                          value={value}
                                          size="small"
                                          placeholder="Remarks"
                                          onChange={(e) => {
                                            onChange(e);
                                          }}
                                          onInput={restrict.general}
                                          inputProps={{
                                            readOnly: buttonVisible === true ? false : true,
                                            maxLength: 500,
                                          }}
                                          error={!!errors.inspElecMainDet?.[index]?.remarks}
                                          helperText={errors.inspElecMainDet?.[index]?.remarks?.message}
                                        />
                                      )}
                                    />
                                  )}
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
                        )}
                      </Table>
                    </TblContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </form>
          <br />
          {!loadingTable && (
            <Grid container spacing={0}>
              {buttonVisible ? (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={10} xl={10} align="right">
                    <Button type="submit" onClick={OpenSaveDialog} variant="contained" className={classes.draft}>
                      Save Draft
                    </Button>
                  </Grid>

                  <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="center">
                    <Button
                      type="submit"
                      onClick={() => {
                        setOpenSaveDialog(true);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
                  <Button
                    type="submit"
                    onClick={() => setDispatchView(true)}
                    variant="contained"
                    className={classes.btn}
                  >
                    Preview & Print
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit(onFormSubmit)}>
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
                        {fields?.length !== 0 ? (
                          <TableBody>
                            {fields?.map((item, index) => (
                              <StyledTableRow className={classes.tableColor} key={index}>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`inspElecMainDet[${index}].slNo`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`inspElecMainDet[${index}].reference`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                <StyledTableCell className={classes.remarks}>
                                  <Controller
                                    control={control}
                                    name={`inspElecMainDet[${index}].remarks`}
                                    render={({ field: { value, onChange } }) => <Typography>{value}</Typography>}
                                  />
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
                        )}
                      </Table>
                    </TblContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </form>
          {responseData.submittedDate != null ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
              <Button type="submit" onClick={() => setDispatchView(true)} variant="contained" className={classes.btn}>
                Preview & Print
              </Button>
            </Grid>
          ) : null}
        </>
      )}
      <Dialog open={saveDialog} onClose={CloseSaveDialog} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">Are you sure you want to save as draft?</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onFormSave)}
            color="primary"
            variant="contained"
            size="small"
            disabled={loadingDraft}
          >
            {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}{" "}
            &nbsp;Yes
          </Button>
          <Button onClick={CloseSaveDialog} color="secondary" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openSaveDialog} onClose={CloseSave} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">Are you sure you want to submit?</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            color="primary"
            variant="contained"
            size="small"
            disabled={loading}
          >
            {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />} &nbsp;Yes
          </Button>
          <Button onClick={CloseSave} color="secondary" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
