/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";

//material-ui
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Excel from "exceljs";
import FileSaver from "file-saver";
import { yupResolver } from "@hookform/resolvers/yup";
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
import "jspdf-autotable";
import moment from "moment";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { WING_ID } from "../../../../Globals";

//components
import { indigo } from "@material-ui/core/colors";
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import { getInspPdiSpares, saveInspPdiSpares, submitInspPdiSpares } from "Redux/Actions/Enclosure/Enclosure14Action";
import useTable, { StyledTableCell, StyledTableRow } from "../../../../components/UseTable";
import InspectionSparesImport from "./InspectionSparesImport";
import InspectionSparesView from "./InspectionSparesView";
import { restrict } from "restrict";

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});

const schema = yup.object().shape({
  sparesMainDet: yup
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
    fontSize: "0.875rem",
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
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
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
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
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "Applicable checks",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "Remarks",
    align: "left",
    disableSorting: true,
  },
];
const defaultArray = () => ({
  id: "",
  slNo: "",
  checklistId: "",
  remarks: "",
  reference: "",
});

export default function InspectionSpares() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [buttonVisible, setButtonVisible] = React.useState(true);
  const [DispatchView, setDispatchView] = useState(false);
  const [records, setRecords] = useState([]);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [idVal, setIdVal] = React.useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [responseData, setResponseData] = useState({});

  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const { TblContainer, TblHead } = useTable(
    records,
    headCells,
    filterFn
  );
  const defaultValues = {
    sparesMainDet: [defaultArray],
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
  const { fields } = useFieldArray({
    control,
    name: "sparesMainDet",
  });

  const [format] = React.useState([]);

  const printExcel = () => {
    const wb = new Excel.Workbook();
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();

    const data = records?.map((d) => [d.slNo, d.reference, d.remarks]);

    const sheet = wb.addWorksheet("Inspection PDI of Spares");

    const tableData = data.map((r, i) => [...r]);

    const wsData = [["S.No", "Applicable checks", "Remarks"], ...tableData];

    sheet.columns = [{ width: 6 }, { width: 100 }, { width: 120 }, ...Array(3).fill({ width: 30 })];

    sheet.addRows(wsData);

    const range = (start, end) => Array.from({ length: end }, (_, i) => i + start);

    range(1, 18).forEach(
      (c) =>
        (sheet.getColumn(c).alignment = {
          vertical: "middle",
          horizontal: "left",
        })
    );
    ["A1", "B1", "C1"].forEach((e) => (sheet.getCell(e).font = { bold: true }));

    // sheet.eachRow(function(row, rowNumber) {
    //   console.log("row no", rowNumber);
    //   row.eachCell((cell, colNumber) => {
    //     if (rowNumber > 0) {
    //       cell.border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         bottom: { style: "thin" },
    //         right: { style: "thin" },
    //       };
    //     }
    //   });
    // });

    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `Inspection PDI of Spares ${now}, ${time}.xlsx`);
    });
  };

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
    dispatch(getInspPdiSpares(olId))
      .then((res) => {
        console.log("res", res);
        setIdVal(res?.id);
        setRecords(res?.inspPdiSparesIbDetList);
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
    setValue("sparesMainDet", MappedData);
  }, [records, setValue]);

  const onFormSave = (data) => {
    setLoadingDraft(true);
    console.log("records val", data.sparesMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspPdiSparesIbDetList: data.sparesMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };

    dispatch(saveInspPdiSpares(value))
      .then((res) => {
        setRecords(res?.inspPdiSparesIbDetList);
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
    console.log("records val", data.sparesMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspPdiSparesIbDetList: data.sparesMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };

    dispatch(submitInspPdiSpares(value)).then((res) => {
      setIdVal(res?.id);
      setRecords(res?.inspPdiSparesIbDetList);
      setResponseData(res);
      const isBtnVisible = res?.submittedDate === null && res?.editable ? true : false;
      setButtonVisible(isBtnVisible);
      // fetchData();
      setOpenSaveDialog();
      setLoading(false);
      CloseSave();
    });
  };

  return (
    <>
      {" "}
      {DispatchView && <InspectionSparesView onClose={() => setDispatchView(false)} />}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>Checklist for Inspection/PDI of Spares: IS(IB)/CKL/004</Typography>
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
                  <StyledTableCell className={classes.subHeader}>{isArmy ? "QACL" : "OL"} No. & Date</StyledTableCell>
                  <StyledTableCell className={classes.remarks}>
                    : {responseData.offerLetterNo} {responseData.offerDate}{" "}
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
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={8} lg={10} xl={10} align="right">
          <Button
            variant="contained"
            color="primary"
            // size="small"
            // className={classes.buttonImport}
            endIcon={<CloudDownloadIcon />}
            onClick={() => format === printExcel()}
          >
            Download Excel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2} align="right">
          <Button
            variant="contained"
            color="primary"
            // size="small"
            // className={classes.buttonImport}
            endIcon={<CloudDownloadIcon />}
            onClick={(e) => {
              setOpen(true);
            }}
          >
            Import Excel
          </Button>
        </Grid>
      </Grid>
      <br />{" "}
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
                                    name={`sparesMainDet[${index}].slNo`}
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
                                              textDecoration: i === 0 ? "underline" : null,
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
                                      name={`sparesMainDet[${index}].remarks`}
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
                      // onClick={handleSubmit(onFormSave)}
                      variant="contained"
                      className={classes.draft}
                      // disabled={loading || !isDirty}
                    >
                      Save Drafts
                    </Button>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="center">
                    <Button
                      type="submit"
                      onClick={() => {
                        setOpenSaveDialog(true);
                      }}
                      // onClick={handleSubmit(onFormSubmit)}
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
                    // onClick={handleSubmit(onFormSubmit)}
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
                                    name={`sparesMainDet[${index}].slNo`}
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
                                              textDecoration: i === 0 ? "underline" : null,
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
                                  {item?.slNo === null ? null : item?.slNo !== null && item.split === false ? (
                                    <Controller
                                      control={control}
                                      name={`sparesMainDet[${index}].remarks`}
                                      render={({ field: { value, onChange } }) => <Typography>{value}</Typography>}
                                    />
                                  ) : (
                                    <Controller
                                      control={control}
                                      name={`sparesMainDet[${index}].remarks`}
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
              <Button
                type="submit"
                onClick={() => setDispatchView(true)}
                // onClick={handleSubmit(onFormSubmit)}
                variant="contained"
                className={classes.btn}
              >
                Preview & Print
              </Button>
            </Grid>
          ) : null}
        </>
      )}
      {open ? <InspectionSparesImport open={open} setOpen={setOpen} /> : null}
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
            {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}
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
