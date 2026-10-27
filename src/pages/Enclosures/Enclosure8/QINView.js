/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as yup from "yup";
//material-ui

import {
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";

//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";

import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import OLTable from "pages/Sslip/SSlipTable";
import { Controller, useForm } from "react-hook-form";
import { getQINdataByOL} from "Redux/Actions/Inspect/InspectOLAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import useTable, { StyledTableCell, StyledTableRow } from "../../../components/UseTable";
import QINReworkView from "./QINReworkView";
import Button from "components/Button";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
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

  paper1: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "50%",
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
  subHeading: {
    fontWeight: 500,
  },
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "BEL Part no",
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
    label: "Rework / Action",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Sub Part no",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Remarks / Item SL No",
    align: "left",
    disableSorting: true,
  },
  {
    // id: "ClaimedAmount",
    label: "Observation Closed",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  //   observation: yup
  //     .string()
  //     .required("Required")
  //     .typeError("required"),
});
const schema = yup.object().shape({
  // observation: yup
  //   .string()
  //   .required("Required")
  //   .typeError("required"),
  array: yup
    .array()
    .of(arraySchema)
    .required("Must have fields")
    .typeError("required"),
});

export default function QINView({ rowData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const [savedData, setSavedData] = useState({});
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting} = useTable(
    records,
    headCells,
    filterFn
  );

  const defaultArray = {
    partNo: "",
    description: "",
    itemCategoryName: "",
    closureStatus: "",
    reworkAction: "",
    observation: "",
    qinObsNcFormDets: [],
    id: "",
  };

  const defaultValues = {
    array: [defaultArray],
  };
  const {
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
 

  const fetchLI = (id) => {
 
    if (id !== undefined) {
      setLoading(true);
      dispatch(getQINdataByOL(id))
        .then((data) => {
          setSavedData(data);
          setRecords(data.qinObsNcFormDets);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }

    setRecords([]);
  };

  useEffect(() => {
    fetchLI(rowData?.id);
   
 
  }, []);

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      olLineItemId: item.olLineItemId,
      reworkAction: item.reworkAction,
      closureStatus: item.closureStatus === true ? "true" : "false",
    }));

    setValue("array", MappedData);
    console.log("-----------", MappedData);
  }, [records, setValue]);

  console.log(getValues(), "getValues");
  return (
    <>
      <Grid container>
        <Grid item xs={12} align="left">
          {" "}
          <Button
            type="submit"
            onClick={() => {
              if (user_role === 9) {
                dispatch(selectItem(<OLTable />));
              } else if (user_role === 3 || user_role === 4 || user_role === 6 || user_role === 2 || user_role === 5) {
                dispatch(selectItem(<ViewOL />));
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
      {open && <QINReworkView open={open} setOpen={setOpen} rowData={rowData} />}
      {/* <Paper className={classes.paper}> */}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            QUALITY IMPROVEMENT NOTE(QIN)/OBSERVATIONS/NON CONFORMANCE IS/FRM/003
          </Typography>
        </Grid>
      </Grid>
      <br />

      <Grid item xs={12} sm={12} md={6} lg={4} xl={4} align="center" style={{ margin: "auto", overflowX: "auto" }}>
        <TblContainer style={{ maxHeight: "600px" }}>
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
                  : {rowData?.fileNo}
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>P.O/Indent No. & Date </StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData?.soNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData?.soDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>OL_No and date</StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData?.olNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData?.offerDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>Project</StyledTableCell>
                <StyledTableCell className={classes.remarks} colSpan="2">
                  : {rowData?.projectName}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
          {/* {recordsAfterPagingAndSorting()?.length != 0 && recordsAfterPagingAndSorting()?.length != undefined ? <TblPagination /> : ""} */}
        </TblContainer>
      </Grid>
      <br />
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
            {" "}
            {records?.length !== 0 ? (
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
                      {savedData?.qinObsNcFormDets?.map((input, index) => (
                        // {(input?.remarks !== null || input?.remarks !== "") && setIsRemarks(true)}
                        <StyledTableRow>
                          {loading && <LinearProgress />}

                          <StyledTableCell className={classes.tableCell}>{index + 1}</StyledTableCell>
                          <StyledTableCell className={classes.remarks}>{input?.partNo}</StyledTableCell>
                          <StyledTableCell style={{ width: "10%" }} className={classes.remarks}>
                            {input?.description}
                          </StyledTableCell>

                          <StyledTableCell className={classes.remarks}>{input?.category}</StyledTableCell>

                          <StyledTableCell style={{ width: "20%" }} className={classes.remarks}>
                            {input?.observation}
                          </StyledTableCell>

                          <StyledTableCell style={{ width: "20%" }}>{input?.reworkAction}</StyledTableCell>

                          <StyledTableCell className={classes.remarks}></StyledTableCell>

                          <StyledTableCell style={{ width: "20%" }}>{input?.remarks}</StyledTableCell>

                          <StyledTableCell className={classes.remarks}>
                            <Controller
                              name={`array[${index}].closureStatus`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <FormControl component="fieldset">
                                  <RadioGroup row size="small" value={value}>
                                    <FormControlLabel
                                      value="true"
                                      onChange={onChange}
                                      control={<Radio size="small" />}
                                      disabled
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value="false"
                                      onChange={onChange}
                                      control={<Radio size="small" />}
                                      disabled
                                      label="No"
                                    />
                                  </RadioGroup>
                                </FormControl>
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {recordsAfterPagingAndSorting()?.length != 0 &&
                  recordsAfterPagingAndSorting()?.length != undefined ? (
                    <TblPagination />
                  ) : (
                    ""
                  )}
                </TblContainer>
              </Grid>
            ) : (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className={classes.text}> No Records To Display</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
      {!loading && (
        <div className={classes.space} align="center">
          <Button type="submit" onClick={() => setOpen(true)} variant="contained" color="secondary">
            Preview
          </Button>
          {/* )} */}
        </div>
      )}
      {/* </Paper> */}
    </>
  );
}
