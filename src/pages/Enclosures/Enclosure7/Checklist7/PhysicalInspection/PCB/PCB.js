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

import Excel from "exceljs";
import FileSaver from "file-saver";
import "jspdf-autotable";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { WING_ID } from "../../../../../../Globals";
//components
import useTable, { StyledTableCell, StyledTableRow } from "components/UseTable";
import { getPCBMain, savePcbFunc, submitPcbFunc } from "Redux/Actions/Enclosure/EnclosurepcbAction";
import { restrict } from "restrict";

//icons
import { yupResolver } from "@hookform/resolvers/yup";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Button from "components/Button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PCBView from "./PCBView";
import MultilineTextField from "components/MultilineTextField";

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});

const schema = yup.object().shape({
  pcbMainDet: yup
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
    paddingLeft: 20,
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

export default function PCB() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [openPCBView, setOpenPCBView] = useState(false);
  const [records, setRecords] = useState([]);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [format, setFormat] = React.useState([]);
  const [responseData, setResponseData] = useState({});

  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [idVal, setIdVal] = React.useState(null);

  const { TblContainer, TblHead } = useTable(
    records,
    headCells,
    filterFn
  );

  const defaultValues = {
    pcbMainDet: [defaultArray],
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
    name: "pcbMainDet",
  });

  const printExcel = () => {
    const wb = new Excel.Workbook();
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();

    const data = records?.map((d) => [d.slNo, d.reference, d.remarks]);

    const sheet = wb.addWorksheet("Physical Inspection of PCBs");

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

    wb.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `Physical Inspection of PCBs ${now}, ${time}.xlsx`);
    });
  };

  const fetchData = () => {
    setLoadingTable(true);
    dispatch(getPCBMain(olId))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspPcbDetDtos);
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
    setValue("pcbMainDet", MappedData);
  }, [records, setValue]);

  const onFormSave = (data) => {
    setLoadingDraft(true);
    console.log("records val", data.pcbMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspPcbDetDtos: data.pcbMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };

    dispatch(savePcbFunc(value))
      .then((res) => {
        setRecords(res?.inspPcbDetDtos);
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
    console.log("records val", data.pcbMainDet);
    const value = {
      id: idVal,
      offerLetterId: olId,
      createdBy: loggedInUser?.empId,
      modifiedBy: loggedInUser?.empId,
      inspectedBy: loggedInUser?.empId,
      signedBy: loggedInUser?.empId,
      inspPcbDetDtos: data.pcbMainDet?.map((item) => ({
        id: item.id,
        slNo: item.slNo,
        checklistId: item.checklistId,
        remarks: item.remarks,
      })),
    };

    dispatch(submitPcbFunc(value)).then((res) => {
      setIdVal(res?.id);
      setRecords(res?.inspPcbDetDtos);
      setResponseData(res);
      const isBtnVisible = res?.submittedDate === null && res?.editable ? true : false;
      setButtonVisible(isBtnVisible);
      // fetchData();
      setOpenSaveDialog();
      setLoading(false);
      CloseSave();
    });
  };

  const OpenSaveDialog = () => {
    setSaveDialog(true);
  };

  const CloseSaveDialog = () => {
    setSaveDialog(false);
  };

  const CloseSave = () => {
    setOpenSaveDialog(false);
  };

  return (
    <>
      {" "}
      {openPCBView && <PCBView onClose={() => setOpenPCBView(false)} />}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>PHYSICAL INSPECTION OF PCBs IS/CKL008</Typography>
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
                  <StyledTableCell className={classes.subHeader}>Project Description</StyledTableCell>
                  <StyledTableCell>: {responseData?.projectDesc} </StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell className={classes.subHeader}>Date of Insp</StyledTableCell>
                  <StyledTableCell className={classes.remarks}>: {responseData.inspectedDate} </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TblContainer>{" "}
        </Grid>
      </Grid>
      <br />
      {false && (
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
      )}
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
                                    name={`pcbMainDet[${index}].slNo`}
                                    render={({ field: { value } }) => <Typography>{value}</Typography>}
                                  />
                                </StyledTableCell>
                                {item?.split === false ? (
                                  <StyledTableCell className={classes.tableCell}>{item?.reference}</StyledTableCell>
                                ) : (
                                  <StyledTableCell className={classes.tableCell}>
                                    {/* {item?.reference?.split("\n").map((i) => i)} */}

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
                                      name={`pcbMainDet[${index}].remarks`}
                                      render={({ field: { value, onChange } }) => (
                                        <MultilineTextField
                                          rows={item?.reference?.split("\n")?.length}
                                          maxRows={20}
                                          value={value}
                                          placeholder="Remarks"
                                          inputProps={{
                                            readOnly: buttonVisible === true ? false : true,
                                            maxLength: 500,
                                          }}
                                          onInput={restrict.general}
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
            </Paper>{" "}
          </form>
          <br />
          {!loadingTable && (
            <Grid container spacing={0}>
              {buttonVisible ? (
                <>
                  <Grid item xs={3} sm={3} md={3} lg={10} xl={10} align="right">
                    <Button type="submit" onClick={OpenSaveDialog} variant="contained" className={classes.draft}>
                      Save Drafts
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
                    onClick={() => setOpenPCBView(true)}
                    variant="contained"
                    className={classes.btn}
                  >
                    Preview & Print
                  </Button>
                </Grid>
              )}
            </Grid>
          )}{" "}
        </>
      ) : (
        <>
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
                                  name={`pcbMainDet[${index}].slNo`}
                                  render={({ field: { value } }) => <Typography>{value}</Typography>}
                                />
                              </StyledTableCell>
                              {item?.split === false ? (
                                <StyledTableCell className={classes.tableCell}>{item?.reference}</StyledTableCell>
                              ) : (
                                <StyledTableCell className={classes.tableCell}>
                                  {/* {item?.reference?.split("\n").map((i) => i)} */}

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
                                <Controller
                                  control={control}
                                  name={`pcbMainDet[${index}].remarks`}
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
          </Paper>{" "}
          <br />
          {responseData.submittedDate != null ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
              <Button type="submit" onClick={() => setOpenPCBView(true)} variant="contained" className={classes.btn}>
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
            {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}
            &nbsp; Yes
          </Button>
          <Button onClick={CloseSave} color="secondary" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
