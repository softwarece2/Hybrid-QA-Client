/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import "jspdf-autotable";
import ReactToPrint from "react-to-print";
import * as yup from "yup";

//material-ui
import { Dialog, DialogActions, DialogContent, Grid, Paper, Table, TableBody, Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { indigo } from "@material-ui/core/colors";
import { WING_ID } from "../../../../Globals";
//components
import Button from "components/Button";
import useTable, { StyledTableCell, StyledTableRow } from "../../../../components/UseTable";
import { DialogTitle } from "Utils";

// redux
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { getInspectionMain } from "Redux/Actions/Enclosure/Enclosure9Action";
import { PaperComponent } from "Utils/D3Tree";
import { headerValue } from "Globals.js";

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
  printImage: {
    display: "none",
    "@media print": {
      display: "block",
      height: "100px"
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
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  tableCell: {
    border: "1px solid black",
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
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
    },
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
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

export default function ElectricalInspectionView({ onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [idVal, setIdVal] = React.useState(null);
  const [responseData, setResponseData] = useState({});

  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const { TblContainer, TblHead } = useTable(
    records,
    headCells,
    filterFn
  );

  const defaultValues = {
    inspElecMainDet: [defaultArray],
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
    name: "inspElecMainDet",
  });

  React.useEffect(() => {
    dispatch(getInspectionMain(olId))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspElecMainDetDtos);
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks,
      reference: item.reference,
    }));
    // console.log(MappedData, records, "ad");
    setValue("inspElecMainDet", MappedData);
  }, [records, setValue]);

  const componentRef = React.useRef();

  return (
    <>
      <Dialog
        open={true}
        fullWidth
        maxWidth="lg"
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title22" {...props} />}
      >
        <DialogTitle onClose={onClose} style={{ fontSize: "0.875rem", cursor: "move" }} id="draggable-dialog-title22">
          Checklist for Electrical Inspection of Main System/Integrated System:IS/CKL/006
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("elecInsp")} />
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Typography className={classes.heading}>
                  Checklist for Electrical Inspection of Main System/Integrated System:IS/CKL/006
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
                            : {responseData.offerLetterNo} &nbsp;&nbsp;&nbsp;
                            {responseData.offerDate}{" "}
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell className={classes.subHeader}>Date of Insp</StyledTableCell>
                          <StyledTableCell className={classes.remarks}>: {responseData?.inspectedDate}</StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell className={classes.subHeader}>QAP ref No</StyledTableCell>
                          <StyledTableCell className={classes.remarks}>: </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TblContainer>{" "}
                </Grid>
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
                          {/* {fields.map((item, index) => (
                        <>
                          <li key={item.id}>
                         
                            <Controller
                              render={({ field }) => <input {...field} />}
                              name={`user.${index}.lastName`}
                              control={control}
                            />
                          </li>
                          <li key={item.id}>
                          
                            <Controller
                              render={({ field }) => <input {...field} />}
                              name={`user.${index}.reference`}
                              control={control}
                            />
                          </li>
                        </>
                      ))} */}

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
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  control={control}
                                  name={`inspElecMainDet[${index}].remarks`}
                                  render={({ field: { value, onChange } }) => (
                                    <Typography>{value}</Typography>
                                    // <TextField
                                    //   onChange={(e) => {
                                    //     onChange(e);
                                    //   }}
                                    //   value={value}
                                    //   size="small"
                                    //   disabled
                                    //   placeholder="Remarks"
                                    //   error={!!errors.inspElecMainDet?.[index]?.remarks}
                                    //   helperText={errors.inspElecMainDet?.[index]?.remarks?.message}
                                    // />
                                  )}
                                />
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
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
