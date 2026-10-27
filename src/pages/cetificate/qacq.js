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
import LotDetails from "pages/InspectorModule/Lots/LotDetails";
import INoteDetails from "pages/SOModule/LineItemsDetails/INoteDetails";
import MergedTable from "pages/InspectorModule/INote/MergedTable";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  border1: {
    border: "1px solid lightgrey",
  },
}));
export default function Qacq({ olIds,source, returnTo ,mergedDetails,row}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
   const roleName = loggedInUser?.roleName;
  const classes = useStyles();
  const printRef = useRef();
  const dispatch = useDispatch();
    const [iNoteDetails, setINoteDetails] = useState({});
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
  // useEffect(() => {
  //   axiosInstance("inote/getINoteByOlId/" + olIds)
  //     .then(({ data }) => {
  //       setQccDetails(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [olIds]);
  const MergedTest = row?.mergeSslipId || mergedDetails?.mergedOlId
    useEffect(() => {
      axiosInstance("internalInote/getINoteBySslipId/" + MergedTest)
        .then(({ data }) => {
          setINoteDetails(data);
          const iiNoteLineItems = data.inoteLineItems?.[0] || {};
  
          reset({
            accepted: iiNoteLineItems.accepted,
            rejected: iiNoteLineItems.rejected,
            rfr: iiNoteLineItems.rfr,
            remarks: iiNoteLineItems.remarks || "",
  
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }, [mergedDetails, reset]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const onChange1 = (date) => {
    setSelectedDate(date);
    setSelectedDate1(qccDetails.inoteDate);
  };
  const ishosqc=(roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC);
  
  const handleBack = () => {
    if ( source === "inoteTable" ) {
      dispatch( selectItem( <MergedTable   /> ) );
    } else if ( source === "lotDetails" ) {
      dispatch( selectItem( <LotDetails /> ) );
    }else {
      dispatch( selectItem( <DetailsINote /> ) );
    }
  };
  return (
    <>
    
      <Container>
            <Button
            variant="contained"
            size="small"
            color="secondary"
      
            onClick={handleBack}
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        <div ref={printRef}>
          <div style={{ marginInline: "auto", maxWidth: 1200 }}>
            <Typography align="center">
            OPTO ELECTRONICS FACTORY
            </Typography>
            <Typography align="center">
             RAIPUR, DEHRADUN - 248008
            </Typography>
             <Typography align="center">
            A unit of INDIA OPTEL LIMITED
            </Typography>
            <br />
            <Typography align="center">
              <b>
                QUALITY ASSURANCE CERTIFICATE
              </b>
            </Typography>

            <Table  style={{marginTop:"10PX"}}>
              <TableBody>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell
                    className={classes.border1}
                    style={{ textAlign: "left" }}
                  >
                    <b>Nomenclature of Store & Drg No</b>
                  </StyledTableCell>
               <StyledTableCell className={classes.border1}>
  <b>{iNoteDetails?.epCode}</b> -{""}
  
  {iNoteDetails?.inoteLineItems?.length > 0 &&
    iNoteDetails.inoteLineItems
      .map(item => `${iNoteDetails.nomenclature}${item.catPartNo}`)
      .join(",")
  }

  {","}
  <b>{iNoteDetails?.drawingNo}</b>
</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    IFD/IND. No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>IndentNo:</b>
                    {iNoteDetails.orderTypeNo} ,<b>Indent Date:</b>
                    {iNoteDetails.indentDateStr}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    SO/EXT No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>SO:</b>
                    {iNoteDetails?.supplyOrderNo},<b>Date:</b>
                    {/* {iNoteDetails?.supplyOrderDateFormatted} */}
                    {iNoteDetails?.supplyOrderDate ? moment(iNoteDetails?.supplyOrderDate).format("DD-MM-YYYY") : "--"}
                    
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty on Order
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                     <b>{iNoteDetails?.orderedQty}</b> Cummulative Qty Passed in this Order:{iNoteDetails?.inoteLineItems?.length > 0 &&
                          iNoteDetails.inoteLineItems.map((item, index) => (
                            <span key={index}>
                              <b>{item.cumulativePassed}</b>
                            </span>
                          ))}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell className={classes.border1}>
                    Delivery Period
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    {iNoteDetails?.indentDateStr}
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    I Note No with Dt
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <b>Note No:</b>
                    {iNoteDetails.inoteNo} ,<b>Date:</b>
                    {iNoteDetails.inoteDateFormatted}
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
                        {/* {iNoteDetails?.inoteLineItems?.length > 0 && */}
                          {/* iNoteDetails.inoteLineItems.map((item, index) => ( */}
                            {/* <span key={index}> */}
                              <b>{iNoteDetails?.acceptedQty}</b>
                            {/* </span> */}
                           {/* ))} */}
                      </div>
                      {/* <div>
                        {iNoteDetails?.inoteLineItems?.length > 0 &&
                          iNoteDetails.inoteLineItems
                            .map((item) => item.regNos)
                            .join(", ")}
                      </div> */}
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
                        {/* {iNoteDetails?.inoteLineItems?.length > 0 &&
                          iNoteDetails.inoteLineItems.map((item, index) => (
                            <span key={index}>
                              <b>{item.accepted}</b>
                            </span>
                          ))} */}
                          {iNoteDetails?.acceptedQty}
                      </div>
                      <div>
                        {iNoteDetails?.passedRegNos?.length > 0 &&
                          iNoteDetails.passedRegNos
                            .map((item) => item)
                            .join(", ")}
                      </div>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>{" "}
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}>
                    Qty Rejected
                  </StyledTableCell>
                  <StyledTableCell className={classes.border1}>
                    <div>-</div>
                    {/* <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                      >
                      <div>
                        {iNoteDetails?.failedRegNos?.length}
                      </div>
                      <div>
                      {iNoteDetails?.failedRegNos?.length  >0 &&
                      iNoteDetails.failedRegNos
                      .map((item) => item).join(",")}
                      </div>
                      </div> */}
                    {/* {iNoteDetails?.inoteLineItems?.length > 0 &&
                      iNoteDetails.inoteLineItems.map((item, index) => (
                        <div key={index}>{item.rejected}</div>
                      ))} */}
                    
                      
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
            <Typography variant="body2" style={{marginLeft:"30px",marginTop:"20px"}}>
              Certified that during Inspection, the following activities have been carried out:-
            </Typography>
            <br />
            <Typography variant="body2"style={{marginLeft:"30px",marginTop:"0px"}}>
              (i) Input material inspection carried out and found in order.<br/>
              (ii) 100% Inspection carried out by OLF<br/>
              (iii) Testing carried out on calibrated test setup/Machines/tools.<br/>
              (iv) Inspection at final stage carried out and found in conformity with technical specification/ATP.
            </Typography>
          
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                {/* IFD/IND. No with Dt */}
                <Typography variant="body2">
                  Ref. No.: {iNoteDetails?.inoteNo}
                  <br />
                  Dt.{iNoteDetails?.inoteDateFormatted}
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
              
                  <b> {iNoteDetails?.submittedByName}</b>
                    <br />
                    (Quality Control Officer)
                    <br/>
                  For Chief General Manager
                   <br />
                    OLF,Raipur,Dehradun
                  
                </Typography>
              </div>
            </div>
            <br />
            <Typography variant="body2">
              <u>
                <b>Distribution:-</b>
              </u>
              <br/>
              <b>{iNoteDetails?.consignee} </b>
             
                
              
            
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
