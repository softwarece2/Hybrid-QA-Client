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
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import MultilineTextField from "components/MultilineTextField";
import "jspdf-autotable";
import { useDispatch } from "react-redux";
import Button from "components/Button";
import {
  getInspCables,
  saveInspCableMain,
 
  submitInspCableMain,

} from "Redux/Actions/Enclosure/Enclosure10Action";
import useTable, { StyledTableCell, StyledTableRow } from "../../../../components/UseTable";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CablesInspectionView from "./CablesInspectionView";
import { useSelector } from "react-redux";
import { PaperComponent } from "Utils/D3Tree";
import { restrict } from "restrict";
import { WING_ID } from "../../../../Globals";

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

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});
const schema = yup.object().shape({
  inspcablemain: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});

const headCells = [
  { id: "slNo", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "reference",
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
export default function CablesInspection() {
  const classes = useStyles();
  const dispatch = useDispatch();


  const [loadingTable, setLoadingTable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [openSaveDialog, setOpenSaveDialog] = React.useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [buttonVisible, setButtonVisible] = React.useState(true);
  const [DispatchView, setDispatchView] = useState(false);
  const [records, setRecords] = useState([]);
  const [responseData, setResponseData] = useState({});

  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [idVal, setIdVal] = React.useState(null);
  const CloseSave = () => {
    setOpenSaveDialog(false);
  };
  const CloseSaveDialog = () => {
    setSaveDialog(false);
  };
  const OpenSaveDialog = () => {
    setSaveDialog(true);
  };
  const { TblContainer, TblHead} = useTable(
    records,
    headCells,
    filterFn
  );
  
  const defaultValues = {
    inspcablemain: [defaultArray],
  };



  const {
    handleSubmit,

    control,
    setValue,

  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields} = useFieldArray({
    control,
    name: "inspcablemain",
  });

  const fetchData = () => {
    setLoadingTable(true);
    dispatch(getInspCables(olId))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspCablesDetDtos);
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
    console.log("log", responseData);
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
    setValue("inspcablemain", MappedData);
    console.log("-----------", MappedData);
  }, [records, setValue]);

  const onFormSave = (data) => {
    setLoadingDraft(true);
    console.log("records val", data.inspcablemain);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspCablesDetDtos: data.inspcablemain?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };
    dispatch(saveInspCableMain(value))
      .then((res) => {
        setRecords(res?.inspCablesDetDtos);
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
    console.log("records val", data.inspcablemain);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspCablesDetDtos: data.inspcablemain?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };
    dispatch(submitInspCableMain(value)).then((res) => {
      setIdVal(res?.id);
      setRecords(res?.inspCablesDetDtos);
      setResponseData(res);
      const isBtnVisible = res?.submittedDate === null && res?.editable ? true : false;
      setButtonVisible(isBtnVisible);
      setOpenSaveDialog();
      setLoading(false);
      CloseSave();
    });
  };

  return (
    <>
      {" "}
      {DispatchView && <CablesInspectionView onClose={() => setDispatchView(false)} />}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>Checklist for Inspection of Cables: IS/CKL/005</Typography>
        </Grid>
      </Grid>
      <br />
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} align="center" style={{ margin: "auto", overflowX: "auto" }}>
          {loadingTable && <LinearProgress />}
          <TblContainer style={{ maxHeight: "600px" }}>
            {loading && <LinearProgress />}
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
                  <StyledTableCell className={classes.subHeader}>{isArmy ? "QACL" : "OL"} No. & Date</StyledTableCell>
                  <StyledTableCell className={classes.remarks}>
                    : {responseData.offerLetterNo} {responseData.offerDate}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell className={classes.subHeader}>Date of Insp</StyledTableCell>
                  <StyledTableCell>: {responseData.inspectedDate} </StyledTableCell>
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
                                    name={`inspcablemain[${index}].slNo`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                {item?.split === false ? (
                                  <StyledTableCell
                                    style={{
                                      fontWeight: item?.slNo === null ? 500 : 400,
                                    }}
                                  >
                                    {item?.reference}
                                  </StyledTableCell>
                                ) : (
                                  <StyledTableCell className={classes.tableCell}>
                                    <>
                                      {item?.reference
                                        ?.split("\n")
                                        .filter((el) => el)
                                        .map((ele, i) => (
                                          <Typography
                                            style={{
                                              fontWeight: i === 0 ? 500 : 400,
                                              textDecoration:
                                                i === 0 ||
                                                (index === 4 && i === 5) ||
                                                (index === 6 && (i === 1 || i === 4))
                                                  ? "underline"
                                                  : null,
                                            }}
                                            key={ele}
                                          >
                                            {ele}
                                          </Typography>
                                        ))}
                                    </>
                                  </StyledTableCell>
                                )}

                                <StyledTableCell className={classes.tableCell}>
                                  {item.slNo !== null && (
                                    <Controller
                                      control={control}
                                      name={`inspcablemain[${index}].remarks`}
                                      render={({ field: { value, onChange } }) => (
                                        <MultilineTextField
                                          rows={item?.reference?.split("\n")?.length}
                                          maxRows={20}
                                          value={value}
                                          placeholder="Remarks"
                                          onInput={restrict.general}
                                          inputProps={{
                                            readOnly: buttonVisible === true ? false : true,
                                            maxLength: 500,
                                          }}
                                          onChange={(e) => {
                                            onChange(e);
                                          }}
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
                    <Button
                      type="submit"
                      onClick={OpenSaveDialog}
                      variant="contained"
                      className={classes.draft}
                      // disabled={loading || !isDirty}
                    >
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
                      // disabled={loading || !isDirty}
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
          {" "}
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
                                    name={`inspcablemain[${index}].slNo`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                {item?.split === false ? (
                                  <StyledTableCell
                                    style={{
                                      fontWeight: item?.slNo === null ? 500 : 400,
                                    }}
                                  >
                                    {item?.reference}
                                  </StyledTableCell>
                                ) : (
                                  <StyledTableCell className={classes.tableCell}>
                                    <>
                                      {item?.reference
                                        ?.split("\n")
                                        .filter((el) => el)
                                        .map((ele, i) => (
                                          <Typography
                                            style={{
                                              fontWeight: i === 0 ? 500 : 400,
                                              textDecoration:
                                                i === 0 ||
                                                (index === 4 && i === 5) ||
                                                (index === 6 && (i === 1 || i === 4))
                                                  ? "underline"
                                                  : null,
                                            }}
                                            key={ele}
                                          >
                                            {ele}
                                          </Typography>
                                        ))}
                                    </>
                                  </StyledTableCell>
                                )}

                                <StyledTableCell className={classes.tableCell}>
                                  {item.submittedDate && item.slNo !== null && (
                                    <Controller
                                      control={control}
                                      name={`inspcablemain[${index}].remarks`}
                                      render={({ field: { value, onChange } }) => <Typography>{value}</Typography>}
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
          {responseData.submittedDate != null ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
              <Button type="submit" onClick={() => setDispatchView(true)} variant="contained" className={classes.btn}>
                Preview & Print
              </Button>
            </Grid>
          ) : null}
        </>
      )}
      <Dialog
        open={saveDialog}
        onClose={CloseSaveDialog}
        maxWidth="lg"
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title123" {...props} />}
      >
        <DialogContent>
          <Typography variant="h6">Are you sure you want to submit?</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onFormSave)}
            color="primary"
            variant="contained"
            size="small"
            disabled={loadingDraft}
          >
            {loadingDraft && (
              <CircularProgress size={24} className={classes.buttonProgress} color="primary" disabled={loadingDraft} />
            )}{" "}
            &nbsp; Yes
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
