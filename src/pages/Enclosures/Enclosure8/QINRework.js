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
import { WING_ID } from "../../../Globals";
import MultilineTextField from "components/MultilineTextField";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import OLTable from "pages/Sslip/SSlipTable";
import { Controller, useForm } from "react-hook-form";
import { getQINdataByOL, updateQinObsNcForm } from "Redux/Actions/Inspect/InspectOLAction";
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
  
    label: "Category",
    field: "itemCategoryName",
    align: "left",
    disableSorting: true,
  },

  {
   
    label: "Observation",
    align: "left",
    disableSorting: true,
  },
  {
 
    label: "Rework / Action",
    align: "left",
    disableSorting: true,
  },
  {
  
    label: "Sub Part no",
    align: "left",
    field: "subPartNo",
    disableSorting: true,
  },
  {
 
    label: "Remarks / Item SL No",
    align: "left",
    disableSorting: true,
  },
  {

    label: "Observation Closed",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
 
});
const schema = yup.object().shape({

  array: yup
    .array()
    .of(arraySchema)
    .required("Must have fields")
    .typeError("required"),
});

export default function QINRework({ rowData }) {
  const classes = useStyles();
  console.log(rowData, "edrjeh");
  const dispatch = useDispatch();
  const [disable, setDisable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const user = useSelector((store) => store.loggedInUser);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const [savedData, setSavedData] = useState({});
  const [records, setRecords] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [isRemarks, setIsRemarks] = useState(false);
  const [open, setOpen] = useState(false);
  const [disableField, setDisableField] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting} = useTable(
    records,
    headCells,
    filterFn
  );


  const defaultArray = {
    partNo: "",
    description: "",
    subPartNo: "",
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
    handleSubmit,
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
          console.log("this is function", data.qinObsNcFormDets);
          setSavedData(data);
          setRecords(data.qinObsNcFormDets);
          setDisable(
            (data.isReworkSubmitted === true && user?.roleId === 9) ||
              (data.isReworkSubmitted !== true && user?.roleId == 7)
              ? true
              : false
          );
          setDisableField(data.isReworkSubmitted !== true && user?.roleId === 9 ? true : false);
          setIsRemarks(data?.isQinClosed === true ? true : false);
         
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
    //resetData();
    console.log("jahsdjh", rowData?.id);
  }, []);

  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item.id,
      olLineItemId: item.olLineItemId,
      reworkAction: item.reworkAction,
      subPartNo: item.subPartNo,
      closureStatus: item.closureStatus === true ? "true" : "false",
    }));

    setValue("array", MappedData);
    console.log("-----------", MappedData);
  }, [records, setValue]);

  const onFormSubmit = (data) => {
    console.log("records val", data.qinObsNcFormDets);
    const value = {
      id: savedData?.id,
      offerLetterId: savedData?.offerLetterId,
      modifiedBy: user?.roleId,

      qinObsNcFormDets: data.array?.map((item) => ({
        id: item.id,
        olLineItemId: item.olLineItemId,
        reworkAction: item.reworkAction,
        remarks: item.remarks,
        ubPartNo: item.subPartNo,
        closureStatus: item.closureStatus,
        // dis: item.reworkAction === ("" || null) ? false : true,
      })),
    };
    dispatch(updateQinObsNcForm(value)).then((res) => {
      setDisableSubmit(true);
      fetchLI(rowData?.id);
      console.log("records vadftrl", data.qinObsNcFormDets);
    });
  };

  console.log(getValues(), "getValues");
  return (
    <>
      <Grid container>
        <Grid item xs={12} align="left">
          {" "}
          <Button
            type="submit"
            onClick={() => {
              if (user_role === 9||user_role===10) {
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
                <StyledTableCell className={classes.tableCell}>
                  <b>File No</b>
                </StyledTableCell>
                <StyledTableCell className={classes.remarks} colSpan="2">
                  : {rowData?.fileNo}
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>
                  <b>P.O/Indent No. & Date</b>{" "}
                </StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData?.soNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData?.soDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>
                  <b>{isArmy ? "QACL" : "OL"} No and date</b>
                </StyledTableCell>
                <StyledTableCell className={classes.remarks}>: {rowData?.olNumber}</StyledTableCell>
                <StyledTableCell className={classes.remarks}>{rowData?.offerDate}</StyledTableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableCell className={classes.tableCell}>
                  <b>Project</b>
                </StyledTableCell>
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

                          {savedData?.isReworkSubmitted || user?.roleId === 7 ? (
                            //  <StyledTableCell className={classes.remarks}>

                            <StyledTableCell style={{ width: "20%" }}>{input?.reworkAction}</StyledTableCell>
                          ) : (
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`array[${index}].reworkAction`}
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                  <MultilineTextField
                                    placeholder="Rework Action"
                                    size="small"
                                    {...props}
                                    onChange={onChange}
                                    inputProps={{
                                      readOnly: disable,
                                    }}
                                    value={value}
                                  />
                                )}
                              />
                            </StyledTableCell>
                          )}
                          <StyledTableCell className={classes.remarks}>{input?.subPartNo}</StyledTableCell>
                          {user?.roleId !== 7 ||
                            isRemarks ||
                            (disableField && (
                              <StyledTableCell style={{ width: "20%" }}>{input?.remarks}</StyledTableCell>
                            ))}
                          {user?.roleId === 7 && savedData?.isReworkSubmitted && !savedData?.isQinClosed ? (
                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                name={`array[${index}].remarks`}
                                control={control}
                                render={({ field: { onChange, value, ...props } }) => (
                                  <MultilineTextField
                                    placeholder="Remarks"
                                    size="small"
                                    {...props}
                                    onChange={onChange}
                                    inputProps={{
                                      readOnly: isRemarks || disableField,
                                    }}
                                    value={value}
                                  />
                                )}
                              />
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell style={{ width: "20%" }}>{input?.remarks}</StyledTableCell>
                          )}
                          <StyledTableCell className={classes.remarks}>
                            <Controller
                              name={`array[${index}].closureStatus`}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    row
                                    size="small"
                                    //value={value === true ? "true" : "false"}
                                    value={value}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      onChange={onChange}
                                      control={<Radio size="small" />}
                                      disabled={
                                        user?.roleId === 9 || isRemarks || savedData?.isReworkSubmitted !== true
                                      }
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value="false"
                                      onChange={onChange}
                                      control={<Radio size="small" />}
                                      disabled={
                                        user?.roleId === 9 || isRemarks || savedData?.isReworkSubmitted !== true
                                      }
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

                    {/* {recordsAfterPagingAndSorting()?.length !== 0 ? (
                    <TableBody>
                      {recordsAfterPagingAndSorting()?.map((item, index) => (
                        <StyledTableRow className={classes.tableColor} key={index}>
                          <StyledTableCell className={classes.tableCell}>{item?.claimId}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>{item?.claimDate}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>{item?.claimStatus}</StyledTableCell>

                          <StyledTableCell className={classes.tableCellEmail}>
                            {item?.totalClaimedAmount}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCellEmail}>{item?.settleAmount}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.settleDate ? item?.settleDate : "--"}
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
                  )} */}
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
          {/* {user.roleId === 9 && ( */}
          <Button
            type="submit"
            onClick={handleSubmit(onFormSubmit)}
            variant="contained"
            color="secondary"
            disabled={disableSubmit || isRemarks || disable}
          >
            Submit
          </Button>
          {/* )} */}
          {/* {isRemarks && ( */}
          <Button
            type="submit"
            onClick={() => setOpen(true)}
            variant="contained"
            color="secondary"
            disabled={!isRemarks}
          >
            Preview
          </Button>
          {/* )} */}
        </div>
      )}
      {/* </Paper> */}
    </>
  );
}
