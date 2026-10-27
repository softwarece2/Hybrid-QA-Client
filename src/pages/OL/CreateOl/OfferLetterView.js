import { Button, Container, Dialog, DialogActions, DialogContent, Grid, InputLabel, makeStyles, Table, TableBody, TableHead, TextField, Typography } from "@material-ui/core";

import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";

import { StyledTableCell, StyledTableRow } from "Utils";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";

import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
border1: {
 border: "1px solid lightgrey",
 },
}));

export default function OfferLetterView({olId, open,mergedDetails,recordsId,setOpen,soId}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
 const classes = useStyles();
  const [consignee, setConsignee] = useState([]);
  const[consigneeId,setConsigneeId]=useState()
  const [isOlGenerated, setIsOlGenerated] = useState(false);
  const printRef = useRef();
  const dispatch = useDispatch();
  const [qccDetails, setQccDetails] = useState({});
  const[olNo,setOlNo]=useState("")
    const[remarks,setRemarks]=useState("")
  const iNoteLineItems = qccDetails.inoteLineItems?.[0] || {};
  const now = new Date();
  const roleName = loggedInUser?.roleName;
  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  console.log(consignee,"consignee");
  console.log("mergedDetails",mergedDetails);
  const roleId = loggedInUser?.roleId;

  const departmentTypeId = loggedInUser?.departmentTypeId;


  console.log(formattedDate);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const { reset ,control} = useForm({
    defaultValues: {
      accepted: null,
      rejected: null,
      rfr: null,
      remarks: "",
    },
  });
  const MergedTest = mergedDetails?.mergeSslipId || mergedDetails?.mergedOlId
  useEffect(() => {
  axiosInstance("qcc/" + soId + "?isOl=true")
    .then(({ data }) => {
      setQccDetails(data);
      const iNoteLineItems = data.inoteLineItems?.[0] || {};
      setConsignee(data.consignees);
      setIsOlGenerated(data?.isOlGenerated);
      setRemarks(data?.remarks);
      reset({
        accepted: iNoteLineItems.accepted,
        rejected: iNoteLineItems.rejected,
        rfr: iNoteLineItems.rfr,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }, [olId, reset]);

  const ishosqc=(roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC);//Modified DepartmentId to departmentTypeId




 const handleClose = () => {
    setOpen(false);
  };
const handleChangeRemarks= (e)=>{
    setRemarks(e.target.value)
}



return (
    <>
<Dialog open={open} maxWidth='lg' fullWidth>


      <DialogContent>
    <div ref={printRef}>
    <div style={{ marginInline: "auto", maxWidth: 1200 }}>
      <Typography align="center" >OPTO ELECTRONICS FACTORY (Unit of India Optel Limited)</Typography>
      <Typography align="center">
        <b>
          <u>Offer Letter</u>
        </b>
      </Typography>
      
   
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
     
        <Grid xs={6} sm={6} lg={6} xl={6}>
             <Typography> Offer Letter No: {qccDetails?.olNo}</Typography>
             <Typography> Offer Letter Date: {qccDetails?.offerDate}</Typography>
             {isOlGenerated && (
                <Typography>Consignee: {qccDetails?.consignee}</Typography>
              )}
 
        </Grid>
             
        </div>
        {!isOlGenerated && (
<Grid xs={6} sm={6} lg={2} xl={6} style={{ marginBottom: "12px" }}>

            <Controller
                name="consigneeId"
                control={control}
                render={({ field: { onChange, value } }) => {
                    return (
                        <>
                            <InputLabel
                                classes={{
                                    asterisk: classes.asterisk,
                                    root: classes.root,
                                }}
                                style={{ fontSize: "0.875rem" }}
                                // required={true}
                            >
                                {/* Select Consignee */}
                            </InputLabel>
                             {/* <Autocomplete
      options={consignee}

      onChange={handleconsignee1}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.name}
      disabled={qccDetails?.submittedAt}
      disableCloseOnSelect
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          variant="outlined"
          {...params}
          label="Select Consignee"
          style={{ width: "111%", height: "90%" }}
          InputProps={{
            ...params.InputProps,
            classes: {
              input: classes.input,
              root: classes.textFieldRoot,
            },
          }}
          size="small"
        />
      )}
    /> */}
                        </>
                    );
                }}
            />

        </Grid>
)}
      <Table> 
         <TableBody >
        {/* <TableHead> */}
          <StyledTableRow  className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>1.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>NOMENCLATURE</b></StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.nomenclature},{qccDetails.nsnPartNo ? qccDetails.nsnPartNo : qccDetails.catPartNo},
                    {qccDetails.itemCategory}</StyledTableCell>
          </StyledTableRow>
        {/* </TableHead> */}
       
          <StyledTableRow  className={classes.border1}>
            <StyledTableCell  className={classes.border1}><b>2.</b></StyledTableCell>
            <StyledTableCell  className={classes.border1}><b>REG. NO.</b></StyledTableCell>
            <StyledTableCell  className={classes.border1}>
          {/* {qccDetails?.inoteLineItems?.length > 0 && qccDetails.inoteLineItems.map((item, index) => (
  <div key={index}>{item.regNos.join(', ')}
  
  
  
  </div>
))} */}
{qccDetails?.regNo}
</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>3.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>QTY TENDERED</b></StyledTableCell>
            <StyledTableCell className={classes.border1}>
{qccDetails?.qtyTendered}

</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>4.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>SWO NO.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.swoNo}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>5.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>WARRANT </b></StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.warrantNo}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>6.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>SO/EXT. NO.</b> </StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.soNo}, dt-{qccDetails?.soDate}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>7.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>IFD/IND NO.</b> </StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.ifdNo}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>8.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>DRAWING NO.</b> </StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.drawingNo}</StyledTableCell>
          </StyledTableRow>
           <StyledTableRow className={classes.border1}>
            <StyledTableCell className={classes.border1}><b>9.</b></StyledTableCell>
            <StyledTableCell className={classes.border1}><b>CONSIGNEE</b> </StyledTableCell>
            <StyledTableCell className={classes.border1}>{qccDetails?.drawingNo}</StyledTableCell>
          </StyledTableRow>
          
          <StyledTableRow>
            <StyledTableCell colSpan={3} className={classes.border1} >
              <TextField label="Remarks" variant="outlined" fullWidth multiline maxRows={3} minRows={3} size="small" margin="dense" placeholder="Enter Remarks" disabled={isOlGenerated} value={remarks}onChange={handleChangeRemarks}/>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>

   
          
</div>
<div style={{marginLeft:"1000px"}}> 
    <Typography variant="subtitle2">
                  
                    <br/>
                    <b> { qccDetails.qcApprovedBy || qccDetails.prodAprovedAt }</b>
                    
                    <br />
                    (Quality Control Officer)
                    <br/>
                  For Chief General Manager
                   <br />
                    OLF,Raipur,Dehradun
                  </Typography>
                  </div>
                  <div style={ { textAlign: "center", marginTop: 20 } }>
            <Typography variant="body2">
              Note - This OfferLetter is online generated & digitally signed, physical signature is not required.
            </Typography>
          </div>
<Button variant="contained" color="secondary" onClick={handlePrint}>
    Print
  </Button>
  <Button variant="contained" color="secondary" onClick={handleClose} style={{marginLeft:"10px"}}>
    Close
  </Button>
    </div>
   </DialogContent>
      </Dialog>
    



    </>
  );
}