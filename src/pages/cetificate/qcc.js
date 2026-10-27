import { Button, CircularProgress, Container, makeStyles, Table, TableBody, TextField, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { StyledTableCell, StyledTableRow } from "Utils";
import { toast } from "react-toastify";
import LotDetails from "pages/InspectorModule/Lots/LotDetails";
import MergedTable from "pages/InspectorModule/INote/MergedTable";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
const useStyles = makeStyles( {
  b: {
    border: "1px solid lightgrey",
  },
} );
export default function Qcc( { olId, source, mergedDetails, onClose, row,instrList } ) {
  const c = useStyles();
  const printRef = useRef();
  const dispatch = useDispatch();
  const [ qccDetails, setQccDetails ] = useState( {} );
  const [ saving, setSaving ] = useState( false );
  const [ isApproving, setIsApproving ] = useState( false );

  const loggedInUser = useSelector( ( store ) => store.loggedInUser );
  const roleId = loggedInUser?.roleId;
  const empId = loggedInUser?.empId;
  // const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const isGicOrHOC_A =
    departmentTypeId === DEPARTMENT_ID.ASSEMBLY && ( roleId === USER_ROLE_ID.ROLE_HOS || roleId === USER_ROLE_ID.ROLE_GIC );
  const isDO_A = roleId === USER_ROLE_ID.ROLE_DOA;
  const isDO_QC = departmentTypeId === DEPARTMENT_ID.QC && roleId === USER_ROLE_ID.ROLE_DO;

  const mergedTestId = row?.mergeSslipId || mergedDetails?.mergedOlId;

  const handlePrint = useReactToPrint( {
    content: () => printRef.current,
  } );
  const { reset, control, handleSubmit } = useForm( {
    defaultValues: {
      inoteNo: "",
      deviationConcession: "",
      remarks: "",
    },
  } );

  const getData = useCallback( () => {
    axiosInstance( "qcc/" + mergedTestId )
      .then( ( { data } ) => {
        setQccDetails( data );
        reset( {
          inoteNo: data.inoteNo || "",
          deviationConcession: data.deviationConcession || "",
          remarks: data.remarks || "",
        } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } );
  }, [ mergedTestId, reset ] );

  useEffect( () => {
    getData();
  }, [ getData ] );

  const handleBack = () => {
    if ( source === "inoteTable" ) {
      dispatch( selectItem( <MergedTable /> ) );
    } else if ( source === "lotDetails" ) {
      dispatch( selectItem( <LotDetails /> ) );

    } 
    else if(source==="InstrumentList"){
      dispatch( selectItem( <DetailsINote /> ) );
    }
    else if(instrList){
      dispatch(selectItem(<CQAIDetailsINote />));
    }
    else {
      dispatch( selectItem( <INoteTable /> ) );
    }
  };

  async function onSave( data ) {
    const req = {
      ...qccDetails,
      mergedSubSlipId: mergedDetails?.mergedOlId,
      inoteNo: data.inoteNo,
      deviationConcession: data.deviationConcession,
      remarks: data.remarks,
      empId,
    };
    setSaving( true );
    try {
      await axiosInstance.post( "qcc/save", req );
      toast.success( "Saved successfully" );
      getData(); 
    } catch ( error ) {
      toast.error( "Failed to save QCC, please try again" );
      console.log( error );
    } finally {
      setSaving( false );
    }
  }

  async function onApprove() {
    try {
      setIsApproving( true );
      await axiosInstance.post( `qcc/${ qccDetails.id }/approve` );
      getData();
      toast.success( "QCC Approved" );
    } catch ( error ) {
      toast.error( "Failed to approve QCC, please try again" );
      console.log( error );
    } finally {
      setIsApproving( false );
    }
  }
 console.log( mergedDetails," console;" );
  return (
    <>
      <Container>
        <Button
          startIcon={ <ArrowBack /> }
          variant="contained"
          color="secondary"
          style={ { marginBottom: "12px" } }
          onClick={ handleBack }
          size="small"
        >
          Back
        </Button>
        <div ref={ printRef }>
          <Typography align="center">
            OPTO ELECTRONICS FACTORY (A Unit of India Optel Limited)
            <br />
            <b>
              <u>QUALITY CONFORMANCE CERTIFICATE</u>
            </b>
          </Typography>

          <div style={ { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } }>
            <Typography variant="subtitle2">
              {/* <b>
                { (qccDetails?.inoteNo && qccDetails.inoteNo.trim() !== "") || (qccDetails?.externalInoteNo && qccDetails.externalInoteNo.trim() !== "")
                ? "INote No -"
                : "Lot No / OL No -" || "NA" }
              </b>
              { qccDetails?.inoteNo && qccDetails.inoteNo.trim() !== ""
                ? qccDetails.inoteNo
                : mergedDetails?.mergedOlNo || "NA" } */}
           
            <b>
  {(qccDetails?.inoteNo?.trim() || qccDetails?.externalInoteNo?.trim())
    ? "INote No - "
    : "Lot No / OL No - "}
</b>

{
  qccDetails?.inoteNo?.trim()
    ? qccDetails.inoteNo
    : qccDetails?.externalInoteNo?.trim()
      ? qccDetails.externalInoteNo
      : mergedDetails?.mergedOlNo || "NA"
}

            {/* <Controller
                control={control}
                name="inoteNo"
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <TextField
                      onChange={onChange}
                      value={mergedDetails?.mergedOlNo}
                      variant="standard"
                      InputProps={{ style: { color: "navy" } }}
                      size="small"
                      error={!!error}
                      placeholder="I-Note No."
                      helperText={error?.message}
                    />
                  );
                }}
              /> */}
            {/* <br /> <b>Lot Dt / OL Dt -</b> {mergedDetails?.mergedDate}
            </Typography> */}
         {/* <br/> */}
              {/* <b>
                { qccDetails?.inoteDate && qccDetails.inoteDate.trim() !== ""
                ? "INote Date-"
                : "Lot Date / OL Date -" || "NA" }
              </b>
              { qccDetails?.inoteDate && qccDetails.inoteDate.trim() !== ""
                ? qccDetails.inoteDate
                : mergedDetails?.mergedDate || "NA" } */}
                {/* <br /> */}
<br></br>                

<b>
  {(qccDetails?.inoteDate?.trim() || qccDetails?.externalInoteDate?.trim())
    ? "INote Date - "
    : "Lot Date / OL Date - "}
</b>

{
  qccDetails?.inoteDate?.trim()
    ? qccDetails.inoteDate
    : qccDetails?.externalInoteDate?.trim()
      ? qccDetails.externalInoteDate
      : mergedDetails?.mergedDate || "NA"
}
          </Typography>

            <div>
              <Typography component={ "p" }>
                NO. OLF/{qccDetails.section}/CQAI/16B
                <br />
              </Typography>
              <Typography component={ "p" }>
               Date:{qccDetails.qcApprovedAt}
                <br />
              </Typography>
            </div>
          </div>
          <Table>
            <TableBody>
              {/* <TableHead> */ }
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>1.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>NOMENCLATURE</b>
                </StyledTableCell>
              <StyledTableCell className={c.b}>
  {qccDetails.nomenclature}, 
  {qccDetails.nsnPartNo ? qccDetails.nsnPartNo : qccDetails.catPartNo}, 
  {qccDetails.itemCategory}
</StyledTableCell>
              </StyledTableRow>
              {/* </TableHead> */ }

              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>2.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>REG. NO.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{qccDetails.registrationNo !== 3?qccDetails.regNo:"N/A" }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>3.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>QTY TENDERED</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{ qccDetails.qtyTendered }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>4.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>SWO NO.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{ qccDetails.swoNo }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>5.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>WARRANT </b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{ qccDetails.warrantNo }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>6.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>SO/EXT. NO.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  { qccDetails.soNo }, Dt- { qccDetails.soDate }
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>7.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>IFD/IND NO.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{ qccDetails.ifdNo }, Dt- { qccDetails.ifdDate } </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>8.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>DRAWING NO.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>{ qccDetails.drawingNo }</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow className={ c.b }>
                <StyledTableCell className={ c.b }>
                  <b>9.</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <b>DEVIATION CONCESSION</b>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <Controller
                    control={ control }
                    name="deviationConcession"
                    render={ ( { field: { onChange, value }, fieldState: { error } } ) => {
                      return (
                        <TextField
                          onChange={ onChange }
                          value={ value }
                          variant="standard"
                          fullWidth
                          inputProps={{ maxLength: 100}}
                          disabled={ saving || qccDetails.submittedAt }
                          InputProps={ { style: { color: "navy" } } }
                          placeholder="Enter Deviation Concession"
                          size="small"
                          error={ !!error }
                          helperText={ error?.message }
                        />
                      );
                    } }
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell colSpan={ 3 } className={ c.b }>
                  <Controller
                    control={ control }
                    name="remarks"
                    render={ ( { field: { onChange, value }, fieldState: { error } } ) => {
                      return (
                        <TextField
                          onChange={ onChange }
                          value={ value }
                          variant="standard"
                          fullWidth
                          multiline
                          InputProps={ { style: { color: "navy" } } }
                          maxRows={ 3 }
                          minRows={ 3 }
                          size="small"
                          disabled={ saving || qccDetails.submittedAt }
                          margin="dense"
                          placeholder="Enter Remarks"
                          error={ !!error }
                          helperText={ error?.message }
                        />
                      );
                    } }
                  />
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
          <Typography variant="body2" style={ { paddingBlock: 24 } }>
            Certified that above store/assembly along with accessories has been manufactured from specified material and components are as
            per drawing/specification, except deviation/concession under serial no 9 and meet quality standard to design / specification
            requirement. Necessary inspection report as listed are attached.
          </Typography>
          <Table>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell className={ c.b } colSpan={ 3 }>
                  <Typography variant="subtitle2">
                    Date:-&nbsp;
                    <b>{ qccDetails.qcApprovedAt }</b>
                  </Typography>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <Typography variant="subtitle2">
                    For Inspection 
                    <br/>
                    <b> { qccDetails.qcApprovedBy || qccDetails.prodAprovedAt }</b>
                    
                    <br />
                    (Quality Control Officer)
                    <br/>
                  For Chief General Manager
                   <br />
                    OLF,Raipur,Dehradun
                  </Typography>
                </StyledTableCell>
                <StyledTableCell className={ c.b }>
                  <Typography variant="subtitle2">
                    For Production:
                    <br/>
                    <b>{ qccDetails.prodApprovedBy}</b>
                     <br />
                   (Production Officer)
                       
                   {/* <br /> */}
                    <br/>
                  For Chief General Manager
                   <br />
                    OLF,Raipur,Dehradun
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>

          <div style={ { textAlign: "center", marginTop: 20 } }>
            <Typography variant="body2">
              Note - This document is online generated & digitally signed, physical signature is not required.
            </Typography>
          </div>
        </div>
      </Container>

      <div style={ { display: "flex", justifyContent: "center", gap: 8, marginTop: 12 } }>
        <Button
          disabled={ saving|| !!qccDetails.id || qccDetails.submittedAt || !isGicOrHOC_A }
          variant="contained"
          size="small"
          color="primary"
          onClick={ handleSubmit( onSave ) }
        >
          { saving && <CircularProgress size={ 16 } /> } Save QCC
        </Button>
        <Button variant="contained" size="small" color="secondary" onClick={ handlePrint }>
          Print
        </Button>
        { isDO_A && qccDetails.qccStatusId === 1 && (
          <Button disabled={ isApproving } variant="contained" size="small" color="primary" onClick={ onApprove }>
            { isApproving && <CircularProgress size={ 16 } /> } Approve
          </Button>
        ) }
        { isDO_QC && qccDetails.qccStatusId === 2 && (
          <Button disabled={ isApproving } variant="contained" size="small" color="primary" onClick={ onApprove }>
            { isApproving && <CircularProgress size={ 16 } /> } Approve
          </Button>
        ) }
      </div>
    </>
  );
}
