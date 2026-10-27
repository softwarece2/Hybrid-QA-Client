import { Button, Container, DialogActions, Grid, InputLabel, makeStyles, Table, TableBody, TableHead, TextField, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstance1 from "pages/Services/AxiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { StyledTableCell, StyledTableRow } from "Utils";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { Autocomplete } from "@material-ui/lab";
import { fetchconsigneeId } from "pages/Services/URLs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import LotDetails from "pages/InspectorModule/Lots/LotDetails";
import { toast } from "react-toastify";
import CQAEDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
border1: {
 border: "1px solid lightgrey",
 },
}));

//IVNV Observation for Handling Required Validation Modified by:Shruti Sanjay Date:08-07-2026
const schema = yup.object().shape({
  consigneeId: yup.object().nullable().required("Required"),
})

export default function CreateOl({ olId, returnTo, mergedDetails, instrList }) {
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
  //   const fetchConsignee = async () => {
  //   try {
  //     const {data} = await axiosInstance1.get(fetchconsigneeId);
  //     setConsignee(data);
  //     console.log(data,"dataaaaa");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(()=>{
  //   fetchConsignee()
  // },[])
  console.log(consignee,"consignee");
  console.log("mergedDetails",mergedDetails);
  const roleId = loggedInUser?.roleId;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
// const [selectedStartDate, setSelectedStartDate] = React.useState(moment (new Date()).format("dd-MM-YYYY"));
const [selectedStartDate, setSelectedStartDate] = React.useState(null);

  console.log(formattedDate);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const { reset, control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      consigneeId: null, //IVNV Observation for Handling Required Validation Modified by:Shruti Sanjay Date:08-07-2026
      accepted: null,
      rejected: null,
      rfr: null,
      remarks: "",
    },
  });
  const MergedTest = mergedDetails?.mergeSslipId || mergedDetails?.mergedOlId
  // useEffect(() => {
  // axiosInstance("qcc/" + MergedTest + "?isOl=true")
  //   .then(({ data }) => {
  //     setQccDetails(data);
  //     const iNoteLineItems = data.inoteLineItems?.[0] || {};
  //     setConsignee(data.consignees);
  //     setIsOlGenerated(data?.isOlGenerated);
  //     setRemarks(data?.remarks);
  //     reset({
  //       accepted: iNoteLineItems.accepted,
  //       rejected: iNoteLineItems.rejected,
  //       rfr: iNoteLineItems.rfr,
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }, [olId, reset]);

  function fetchData(){
    axiosInstance("qcc/" + MergedTest + "?isOl=true")
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
  }
  useEffect(() => {
    fetchData();
  }, [olId, reset]);

  const ishosqc=(roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC);//Modified DepartmentId to departmentTypeId

  // const handleBack = () => {
  //   if (returnTo === "lotDetails") {
  //     dispatch(selectItem(<LotDetails />));
  //   } else if (returnTo === "table") {
  //     dispatch(selectItem(<INoteTable />));
  //   } 
  //   else{
  //       dispatch(selectItem(<LotDetails />));
  //   }
  // };

  const handleBack = () => {
    instrList?  dispatch(selectItem(<CQAIDetailsINote />)) : dispatch(selectItem(<LotDetails />));
  };

const handleChange = (e)=>{
  setOlNo(e.target.value)
}
const handleChangeRemarks= (e)=>{
    setRemarks(e.target.value)
}

const seleStartDate = async(date)=>{
   setSelectedStartDate(date);
   
}
    const handleconsignee1 = (event, newValue) => {
        setConsigneeId(newValue?.id); 
    };
const saveInoteDetails = async (formData) => {
  
   const consigneeNameString = 

     qccDetails.consignees.map((item) => item.name).join(", ")
     
    try {
      const req = {
       olNumber:qccDetails?.olNo,
       offerDate:qccDetails?.offerDate,
       remarks:remarks,
       lotId:mergedDetails?.mergedOlId,
       warrantId:mergedDetails?.warrantId||0,
       consigneeId: formData.consigneeId?.id //IVNV Observation for Handling Required Validation Modified by:Shruti Sanjay Date:08-07-2026
      };
      await axiosInstance.post("offerLetter/save", req);
      setIsOlGenerated(true); 
          toast.success("Offer Letter Generated Successfully") // IVNV Observation Updated Toast Message Modified by:Gopal Krishna Date:09-07-2026
    } catch (err) { 
      console.error(err);
    }

  };
return (
    <>
     {/* <Button
        startIcon={<ArrowBack />}
        variant="contained"
        color="secondary"
        style={{ marginBottom: "12px" }}
        onClick={handleBack}  
      >
        Back
      </Button> */}
      <style>
        {`
          @media print {
            @page { margin: 20px; }
          }
        `}
      </style>
      <Container>
      <Button
          variant="contained"
          size="small"
          color="secondary"
          // onClick={() => {
          //   isdo ? (dispatch(selectItem(<INoteTable />))) : (dispatch(selectItem(<DetailsINote />)));
          // }}
          onClick={handleBack}
          startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
        >
          Back
        </Button>
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
                  render={({ field: { onChange, value } ,fieldState:{error}}) => {
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
                        <Autocomplete
                          options={consignee}

                          // onChange={handleconsignee1}
                          value={value || null}
                          onChange={(event,newValue)=>{
                            onChange(newValue);
                          }}
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
                              error={!!error}
                              helperText={error?.message}
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
                        />
                      </>
                    );
                  }}
                />

              </Grid>
            )}
            <Table>
              <TableBody >
                {/* <TableHead> */}
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}><b>1.</b></StyledTableCell>
                  <StyledTableCell className={classes.border1}><b>NOMENCLATURE</b></StyledTableCell>
                  <StyledTableCell className={classes.border1}>{qccDetails?.nomenclature},{qccDetails.nsnPartNo ? qccDetails.nsnPartNo : qccDetails.catPartNo},
                    {qccDetails.itemCategory}</StyledTableCell>
                </StyledTableRow>
                {/* </TableHead> */}

                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}><b>2.</b></StyledTableCell>
                  <StyledTableCell className={classes.border1}><b>REG. NO.</b></StyledTableCell>
                  <StyledTableCell className={classes.border1}>
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
                  <StyledTableCell className={classes.border1}>{qccDetails?.ifdNo}, dt-{qccDetails.ifdDate}</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow className={classes.border1}>
                  <StyledTableCell className={classes.border1}><b>8.</b></StyledTableCell>
                  <StyledTableCell className={classes.border1}><b>DRAWING NO.</b> </StyledTableCell>
                  <StyledTableCell className={classes.border1}>{qccDetails?.drawingNo}</StyledTableCell>
                </StyledTableRow>

                <StyledTableRow>
                  <StyledTableCell colSpan={3} className={classes.border1} >
                    <TextField label="Remarks" variant="outlined" fullWidth multiline maxRows={3} minRows={3} size="small" margin="dense" placeholder="Enter Remarks" disabled={isOlGenerated} value={remarks} onChange={handleChangeRemarks} />
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>

   
          
</div>
<div style={{display:"flex", justifyContent:"flex-end", width:"100%",marginTop:"30px"}}> 
    <Typography variant="subtitle2">
                  
                    <br/>
              {/* <b> {qccDetails.qcApprovedBy || qccDetails.prodAprovedAt}</b> */}
              <b> {isOlGenerated ? (qccDetails.qcApprovedBy || qccDetails.prodAprovedAt) : ""} </b>
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

    </div>

      </Container>

      <DialogActions>
        {!isOlGenerated && <Button style={{ textTransform: "capitalize" }} variant="contained" color="secondary" size="small" onClick={handleSubmit(saveInoteDetails)} > 
          Generate
        </Button>}
      <Button style={{ textTransform: "capitalize",marginRight:"800px"}} color="primary" size="small" variant="contained"  onClick={handlePrint}>
         Print
        </Button>
      </DialogActions>


    </>
  );
}