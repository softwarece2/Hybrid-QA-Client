/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
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

import { WING_ID } from "../../../../Globals";
import Button from "components/Button";
import "jspdf-autotable";

import { useDispatch, useSelector } from "react-redux";

//components
import { yupResolver } from "@hookform/resolvers/yup";
import { indigo } from "@material-ui/core/colors";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { getInspCables } from "Redux/Actions/Enclosure/Enclosure10Action";
import { DialogTitle } from "Utils";
import * as yup from "yup";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../../components/UseTable";
import { PaperComponent } from "Utils/D3Tree";
import { headerValue } from "Globals.js";

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
    fontWeight: 500,
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
  inspcablemain: yup.array().of(arraySchema).required("Must have fields"),
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

export default function CablesInspectionView({ onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [idVal, setIdVal] = React.useState(null);
  const [responseData, setResponseData] = useState({});
  const olId = useSelector((store) => store.inspectOLReducer.inspectOlId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const {
    TblContainer,
    TblHead,
  } = useTable(records, headCells, filterFn);

  const defaultValues = {
    inspcablemain: [defaultArray],
  };

  const {

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

  React.useEffect(() => {
    dispatch(getInspCables(olId))
      .then((res) => {
        console.log("res", res);
        setIdVal(res?.id);
        setRecords(res?.inspCablesDetDtos);
        setResponseData(res);
        // res?.inspCablesDetDtos.map((d,i)=>(
        //   i.split===true
        // ))
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
      split: item.split,
    }));
    setValue("inspcablemain", MappedData);
    console.log("-----------", MappedData);
  }, [records, setValue]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      {" "}
      <Dialog
        open={true}
        fullWidth
        maxWidth="lg"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title67" {...props} />
        )}
      >
        <DialogTitle
          onClose={onClose}
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title67"
        >
          Checklist for Inspection of Cables: IS/CKL/005
        </DialogTitle>
        <DialogContent dividers style={{ padding: 12, position: "relative" }}>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("cables")} />
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                <Typography className={classes.heading}>
                  Checklist for Inspection of Cables: IS/CKL/005
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
                          <StyledTableCell className={classes.subHeader}>
                            Date of Insp
                          </StyledTableCell>
                          <StyledTableCell className={classes.remarks}>
                            : {responseData?.inspectedDate}
                          </StyledTableCell>
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

                        {fields?.length !== 0 ? (
                          <TableBody>
                            {fields?.map((item, index) => (
                              <StyledTableRow
                                className={classes.tableColor}
                                key={index}
                              >
                                <StyledTableCell className={classes.tableCell}>
                                  {" "}
                                  <Controller
                                    control={control}
                                    name={`inspcablemain[${index}].slNo`}
                                    render={({ field: { value } }) => (
                                      <Typography>{value}</Typography>
                                    )}
                                  />
                                </StyledTableCell>
                                {item?.split === false ? (
                                  <StyledTableCell
                                    className={classes.tableCell}
                                    style={{
                                      fontWeight:
                                        item?.slNo === null ? 500 : 400,
                                    }}
                                  >
                                    {item?.reference}
                                  </StyledTableCell>
                                ) : (
                                  <StyledTableCell
                                    className={classes.tableCell}
                                  >
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

                                {/* <StyledTableCell className={classes.tableCell}>
                              <Controller
                                control={control}
                                name={`pdiMainDet[${index}].remarks`}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    rows={18}
                                    value={value}
                                    placeholder='Remarks'
                                    onChange={(e) => {
                                      onChange(e);
                                    }}
                                  />
                                )}
                              />
                            </StyledTableCell> */}
                                <StyledTableCell className={classes.tableCell}>
                                  {item?.slNo === null ? null : item?.slNo !==
                                      null && item.split === false ? (
                                    <Controller
                                      control={control}
                                      name={`inspcablemain[${index}].remarks`}
                                      render={({
                                        field: { value, onChange },
                                      }) => (
                                        <Typography>{value}</Typography>
                                       
                                      )}
                                    />
                                  ) : (
                                    <Controller
                                      control={control}
                                      name={`inspcablemain[${index}].remarks`}
                                      render={({
                                        field: { value, onChange },
                                      }) => (
                                        <Typography>{value}</Typography>                                       
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
            <p className={classes.printImage}></p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.print}
            onClick={handlePrint}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
