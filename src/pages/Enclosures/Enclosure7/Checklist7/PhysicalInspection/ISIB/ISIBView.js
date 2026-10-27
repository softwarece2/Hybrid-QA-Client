/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { useSelector } from "react-redux";

//material-ui
import {
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
import { useDispatch } from "react-redux";
import { getISIBMain } from "Redux/Actions/Enclosure/EnclosureISIBAction";
import { WING_ID } from "../../../../../../Globals";
//components
import { yupResolver } from "@hookform/resolvers/yup";
import { indigo } from "@material-ui/core/colors";
import useTable, { StyledTableCell, StyledTableRow } from "components/UseTable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import ReactToPrint from "react-to-print";
import { DialogTitle } from "Utils";
import * as yup from "yup";
import Button from "../../../../../../components/Button";
import { headerValue } from "Globals.js";
// icons
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { PaperComponent } from "Utils/D3Tree";

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});

const schema = yup.object().shape({
  inspISIBMainDet: yup.array().of(arraySchema).required("Must have fields"),
});

const useStyles = makeStyles((theme) => ({
  printImage: {
    display: "none",
    "@media print": {
      display: "block",
      height: "100px",
    },
  },
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
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
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
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
    },
  },
  gridOl: {
    border: "1px solid grey",
    [theme.breakpoints.down("md")]: {
      borderBottom: "0px solid grey",
    },
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
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

export default function ISIBView({ onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [idVal, setIdVal] = React.useState(null);
  const [records, setRecords] = useState([]);

  const [responseData, setResponseData] = useState({});

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const {
    TblContainer,
    TblHead,
  } = useTable(records, headCells, filterFn);


  const defaultValues = {
    inspISIBMainDet: [defaultArray],
  };

  const {
  
    control,
 
    setValue,
 
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: "inspISIBMainDet",
  });
  //

  const [format, setFormat] = React.useState([]);

  const printExcel = () => {
    const wb = new Excel.Workbook();
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();
    const data = records?.map((d) => [d.slNo, d.reference, d.remarks]);
    const sheet = wb.addWorksheet("Physical Inspection of IS(IB)");
    const tableData = data.map((r, i) => [...r]);
    const wsData = [["S.No", "Applicable checks", "Remarks"], ...tableData];

    sheet.columns = [
      { width: 6 },
      { width: 100 },
      { width: 120 },
      ...Array(3).fill({ width: 30 }),
    ];

    sheet.addRows(wsData);
    const range = (start, end) =>
      Array.from({ length: end }, (_, i) => i + start);

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
      FileSaver.saveAs(
        blob,
        `Physical Inspection of IS(IB) ${now}, ${time}.xlsx`
      );
    });
  };

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks,
      reference: item.reference,
      split: item.split,
    }));
    // console.log(MappedData, records, "ad");
    setValue("inspISIBMainDet", MappedData);
  }, [records, setValue]);

  React.useEffect(() => {
    dispatch(getISIBMain(olId))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspPhyIbDetDtos);
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const componentRef = React.useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });

  return (
    <>
      <Dialog
        open={true}
        fullWidth
        maxWidth="lg"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title18" {...props} />
        )}
      >
        <DialogTitle
          onClose={onClose}
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title18"
        >
          Checklist for Physical Inspection:IS(IB)/CKL/003
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("phyinsp")} />
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Typography className={classes.heading}>
                  Checklist for Physical Inspection:IS(IB)/CKL/003
                </Typography>
              </Grid>
              <br />
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  align="center"
                  style={{ margin: "auto", overflowX: "auto" }}
                >
                  <TblContainer style={{ maxHeight: "600px" }}>
                    {loading && <LinearProgress />}
                    <Table
                      style={{
                        position: "relative",
                        // border: "1px solid lightgrey",
                        maxWidth: "1000px",
                      }}
                      size="small"
                      aria-label="simple table"
                      id="data-table-cleanliness-report"
                    >
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableCell
                            className={classes.subHeader}
                            style={{ border: "1px solid black" }}
                          >
                            {isArmy ? "QACL" : "OL"} No. & Date
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.remarks}
                            style={{ border: "1px solid black" }}
                          >
                            : {responseData.offerLetterNo}{" "}
                            {responseData.offerDate}
                          </StyledTableCell>
                        </StyledTableRow>

                        <StyledTableRow>
                          <StyledTableCell
                            className={classes.subHeader}
                            style={{ border: "1px solid black" }}
                          >
                            Date of Insp
                          </StyledTableCell>
                          <StyledTableCell
                            style={{ border: "1px solid black" }}
                          >
                            : {responseData.inspectedDate}{" "}
                          </StyledTableCell>
                        </StyledTableRow>

                        <StyledTableRow>
                          <StyledTableCell
                            className={classes.subHeader}
                            style={{ border: "1px solid black" }}
                          >
                            QAP ref No
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.remarks}
                            style={{ border: "1px solid black" }}
                          >
                            : --
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TblContainer>{" "}
                </Grid>
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

                        <TableBody>
                          {fields?.map((item, index) => (
                            <StyledTableRow
                              className={classes.tableColor}
                              key={index}
                            >
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  control={control}
                                  name={`inspISIBMainDet[${index}].slNo`}
                                  render={({ field: { value } }) => (
                                    <Typography>{value}</Typography>
                                  )}
                                />
                              </StyledTableCell>

                              {item?.split === false ? (
                                <StyledTableCell
                                  className={classes.tableCell}
                                  style={{
                                    fontWeight: item.slNo === null ? 500 : 400,
                                    textDecoration:
                                      item.slNo === null ? "underline" : null,
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
                                              i === 0 ? "underline" : null,
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
                                {item.slNo === "11" ? (
                                  <Controller
                                    control={control}
                                    name={`inspISIBMainDet[${index}].remarks`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <Typography>{value}</Typography>
                                      // <MultilineTextField
                                      //   rows={8}
                                      //   value={value}
                                      //   inputProps={{ readOnly: true }}
                                      //   placeholder="Remarks"
                                      //   onChange={(e) => {
                                      //     onChange(e);
                                      //   }}
                                      // />
                                    )}
                                  />
                                ) : item.slNo === "16" ? (
                                  <Controller
                                    control={control}
                                    name={`inspISIBMainDet[${index}].remarks`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <Typography>{value}</Typography>
                                      // <MultilineTextField
                                      //   rows={18}
                                      //   value={value}
                                      //   inputProps={{ readOnly: true }}
                                      //   placeholder="Remarks"
                                      //   onChange={(e) => {
                                      //     onChange(e);
                                      //   }}
                                      // />
                                    )}
                                  />
                                ) : item.slNo === null ? null : (
                                  <Controller
                                    control={control}
                                    name={`inspISIBMainDet[${index}].remarks`}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <Typography>{value}</Typography>
                                      // <TextField
                                      //   placeholder="Remarks"
                                      //   size="small"
                                      //   value={value}
                                      //   // inputProps={{ readOnly: true }}
                                      //   onChange={(e) => {
                                      //     onChange(e);
                                      //   }}
                                      // />
                                    )}
                                  />
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TblContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <p className={classes.printImage}></p>
          </div>
        </DialogContent>
        <DialogActions>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" className="printbtn">
                Print{" "}
              </Button>
            )}
            content={() => componentRef.current}
          />
          {/* <Button variant="contained" className={classes.print} onClick={handlePrint}>
            Print
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
