import DateFnsUtils from "@date-io/date-fns";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  makeStyles,
  Table,
  TableBody,

  TextField,
  Typography,
} from "@material-ui/core";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";


import INoteTable from "pages/InspectorModule/INote/INoteTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { StyledTableCell, StyledTableRow } from "Utils";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import ExternalInoteGeneration from "pages/InspectorModule/INote/ExternalInoteGeneration";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
const useStyles = makeStyles((theme) => ({
  border1: {
    border: "1px solid lightgrey",
  },
}));
export default function Qac({ olIds, returnTo,instrList }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const printRef = useRef();
  const dispatch = useDispatch();
  const [qccDetails, setQccDetails] = useState({});

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const roleId = loggedInUser?.roleId;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  
  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });
  const { reset, control } = useForm({
    defaultValues: {
      accepted: null,
      rejected: null,
      rfr: null,
      remarks: "",
    },
  });
  useEffect(() => {
    axiosInstance("inote/getINoteByOlIdV2/" + olIds)
      .then(({ data }) => {
        setQccDetails(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [olIds]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const onChange1 = (date) => {
    setSelectedDate(date);
    setSelectedDate1(qccDetails.inoteDate);
  };
  const ishosqc=(roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC);
  
  const handleBack = () => {
    if (returnTo === "details") {
      dispatch(selectItem(<DetailsINote />));
    } else if (returnTo === "table") {
      dispatch(selectItem(<ExternalInoteGeneration />));
    } else if(instrList){
      dispatch(selectItem(<CQAIDetailsINote />))
    }
    else{
        dispatch(selectItem(<DetailsINote />));
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        // onClick={() => {
        //   ishosqc?  (dispatch(selectItem(<DetailsINote />))):(dispatch(selectItem(<INoteTable />)));
        // }}
        onClick={handleBack}  
        startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
      >
        Back
      </Button>
      <Container className={classes.border1}>
        <div ref={printRef}>
          <div style={{ marginInline: "auto", maxWidth: 1200 }}>
            <Typography align="center">
              CONTROLLERATE OF QUALITY ASSURANCE
            </Typography>
            <Typography align="center">
              (INSTRUMENTS) RAIPUR, DEHRADUN-248008
            </Typography>
            <br />
            <Typography align="center">
              <b>
                <u>QUALITY ASSURANCE CERTIFICATE</u>
              </b>
            </Typography>

            <Table>
              <TableBody>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell
                    className={classes.border1}
                    style={{ textAlign: "left" }}
                  >
                    <b>Nomenclature of Store & Drg No</b>
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>
                       {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems.map((item, index) => (
                            
                              <b>{item.nomenclature},{item.nsnPartNo ? item.nsnPartNo : item.catPartNo},{item.itemCategory}</b>
                          
                          ))}
                      </b>
                   
                    <br/>
               <b>{qccDetails?.drawingNo}</b>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    IFD/IND. No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>IndentNo : </b>
                    {qccDetails.orderTypeNo} ,<b>Indent Date:</b>
                    {qccDetails.orderTypeDate}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    SO / EXT No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>SO:</b>
                    {qccDetails?.supplyOrderNo},<b>Date:</b>
                    {qccDetails?.supplyOrderDateFormatted}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty on Order
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                  {/* {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems.map((item, index) => (
                            
                              <b>{item.tendered}</b>
                          
                          ))}  */}
                           <b>{qccDetails?.orderedQty} </b>
                           Cummulative Qty Passed in this Order: {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems.map((item, index) => (
                            
                              <b>{item.tendered}</b>
                          
                          ))}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell className={classes.border1}>
                    Delivery Period
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    {qccDetails?.deliveryDate}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    I Note No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>Note No:</b>
                    {qccDetails.inoteNo} ,<b>Date:</b>
                    {qccDetails.inoteDateFormatted}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty Tendered on I Note
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems.map((item, index) => (
                            <span key={index}>
                              <b>{item.tendered}</b>
                            </span>
                          ))}
                      </div>
                      <div>
                        {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems
                            .map((item) => item.regNos)
                            .join(", ")}
                      </div>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty Accepted
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {qccDetails?.inoteLineItems?.map((item, index) => (
                          <div key={index}>
                            {item.accepted}
                             {item.regs?.length ? " - " : ""}
                            {item.regs?.map((reg) => reg.serialNo).join(", ")}
                          </div>
                        ))}
                      </div>
                      {/* <div>
                        {qccDetails?.inoteLineItems?.length > 0 &&
                          qccDetails.inoteLineItems
                            .map((item) => item.regs)
                            .join(", ")}
                      </div> */}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>{" "}
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty Rejected
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    {qccDetails?.inoteLineItems?.map((item, index) => (
                      <div key={index}>
                        {item.rejected}
                         {item.failedRegs?.length ? " - " : ""}
                        {item.failedRegs?.map((reg) => reg.serialNo).join(", ")}
                        <br></br>
                        {item.failedParamDesc}
                      </div>
                    ))}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
            <Typography variant="body2">
              Certified that during QA, Sampling inspection at FAI has been
              carried out and found / not found in conformity with ATP.
            </Typography>
            <br />
            <Typography variant="body2">
              <b>Summary:</b>
            </Typography>
            <Typography variant="body2">
              <div style={{ marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "right" }}>
                  <span>Quantity Accepted in Month</span>
                  <Controller
                    name="inoteDate"
                    control={control}
                    render={({
                      field: { onChange: onChangeDate, value: inoteDateValue },
                    }) => {
                      return (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            size="small"
                            inputVariant="standard"
                            views={["month", "year"]}
                            format="MMM-yyyy"
                            id="date-picker-outlined"
                            onChange={onChangeDate}
                            value={inoteDateValue}
                            InputProps={{
                              style: { color: "blue" },
                              type: "",
                            }}
                            style={{
                              "& .MuiInputBase-root": {
                                padding: "2px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderWidth: "1px",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                              },
                              width: "130px",
                              textAlign: "center",
                              marginLeft: "65px",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      );
                    }}
                  />
                  <span>
                    {" "}
                    Accepted:{" "}
                    {qccDetails?.inoteLineItems?.length > 0 &&
                      qccDetails.inoteLineItems.map((item, index) => (
                        <span key={index}>
                          <Controller
                            name="accepted1"
                            control={control}
                            defaultValue={item.accepted}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <TextField
                                  size="small"
                                  type="number"
                                  value={value ?? 0}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;

                                    if (
                                      /^\d*$/.test(inputValue) ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }}
                                  InputProps={{
                                    style: { color: "blue" },
                                    type: "",
                                  }}
                                  style={{
                                    "& .MuiInputBase-root": {
                                      padding: "2px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderWidth: "1px",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "0.75rem",
                                    },
                                    width: "50px",
                                    alignItems: "center",
                                  }}
                                  variant="standard"
                                />
                              );
                            }}
                          />
                        </span>
                      ))}
                  </span>
                  <span>
                    {" "}
                    Rejected:{" "}
                    {qccDetails?.inoteLineItems?.length > 0 &&
                      qccDetails.inoteLineItems.map((item, index) => (
                        <span key={index}>
                          <Controller
                            name="rejected1"
                            control={control}
                            defaultValue={item.rejected}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <TextField
                                  size="small"
                                  type="number"
                                  value={value ?? 0}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;

                                    if (
                                      /^\d*$/.test(inputValue) ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }}
                                  InputProps={{
                                    style: { color: "blue" },
                                    type: "",
                                  }}
                                   style={{
                                    "& .MuiInputBase-root": {
                                      padding: "2px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderWidth: "1px",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "0.75rem",
                                    },
                                    width: "50px",
                                  }}
                                  variant="standard"
                                />
                              );
                            }}
                          />
                        </span>
                      ))}
                  </span>
                </div>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>Total Quantity Offered since month</span>
                  <Controller
                    name="inoteDt"
                    control={control}
                    render={({
                      field: { onChange: onChangeDate, value: inoteDateValue },
                    }) => {
                      return (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            size="small"
                            inputVariant="standard"
                            views={["month", "year"]}
                            format="MMM-yyyy"
                            id="date-picker-outlined"
                            onChange={onChangeDate}
                            value={inoteDateValue}
                            InputProps={{
                              style: { color: "blue" },
                              type: "",
                            }}
                            style={{
                              "& .MuiInputBase-root": {
                                padding: "2px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderWidth: "1px",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "0.75rem",
                              },
                              width: "130px",
                              marginLeft: "20px",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      );
                    }}
                  />
                  <span>
                    {" "}
                    Accepted:{" "}
                    {qccDetails?.inoteLineItems?.length > 0 &&
                      qccDetails.inoteLineItems.map((item, index) => (
                        <span key={index}>
                          <Controller
                            name="accepted2"
                            control={control}
                            defaultValue={item.accepted}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <TextField
                                  type="number"
                                  value={value ?? 0}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (
                                      /^\d*$/.test(inputValue) ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }}
                                  InputProps={{
                                    style: { color: "blue" },
                                    type: "",
                                  }}
                                  style={{
                                    "& .MuiInputBase-root": {
                                      padding: "2px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderWidth: "1px",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "0.75rem",
                                    },
                                    width: "50px",
                                  }}
                                  variant="standard"
                                />
                              );
                            }}
                          />
                        </span>
                      ))}
                  </span>
                  <span>
                    {" "}
                    Rejected:{" "}
                    {qccDetails?.inoteLineItems?.length > 0 &&
                      qccDetails.inoteLineItems.map((item, index) => (
                        <span key={index}>
                          <Controller
                            name="reject2"
                            control={control}
                            defaultValue={item.rejected}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <TextField
                                  size="small"
                                  type="number"
                                  value={value ?? 0}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;

                                    if (
                                      /^\d*$/.test(inputValue) ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }}
                                  InputProps={{
                                    style: { color: "blue" },
                                    type: "",
                                  }}
                                  style={{
                                    "& .MuiInputBase-root": {
                                      padding: "2px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderWidth: "1px",
                                      },
                                    },
                                    "& .MuiInputLabel-root": {
                                      fontSize: "0.75rem",
                                    },
                                    width: "50px",
                                  }}
                                  variant="standard"
                                />
                              );
                            }}
                          />
                        </span>
                      ))}
                  </span>
                </div>
              </div>
            </Typography>
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography variant="body2">
                  Ref. No. - 370005 / {qccDetails.orderTypeNo}
                  <br />
                  Dt.{qccDetails?.inoteDateFormatted}
                  <br />
                  <b style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                  <br />
                  <br />
                    Note - This document is online generated & digitally signed,
                    physical signature is not required.
                  </b>
                </Typography>
              </div>
              <div style={{ textAlign: "left", whiteSpace: "nowrap" }}>
                <Typography variant="body2">
                  <b>
                    ({qccDetails?.submittedByName})
                    <br />
                  Deputy Controller
                    <br />
                    for CONTROLLER 
                  </b>
                </Typography>
              </div>
            </div>
            <br />
            <Typography variant="body2">
              <u>
                <b>Distribution:-</b>
              </u>
              <ul style={{ listStyleType: "none" }}>
                <li>1. OLF,Dehradun</li>
                <li>2. AO C/o OLF,Dehradun</li>
                <li>3. {qccDetails?.consignee}</li>
                <li>4. CQA(I) AHSP Tank/INF Division</li>
                <li>5. CQA(I) P&C Division</li>
              </ul>
            </Typography>
          </div>
        </div>
      </Container>
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
    </>
  );
}
