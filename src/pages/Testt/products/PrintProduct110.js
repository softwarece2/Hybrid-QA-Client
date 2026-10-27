
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Table,
  TableHead,
  TableBody,
  Grid,
} from '@material-ui/core';
import Button from "components/Button";
import { DialogActions, StyledTableCell, StyledTableRow } from 'Utils'; 

import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { useReactToPrint } from 'react-to-print';
import olfdn from "assets/Images/olf_dn_logo.png";
import { Typography } from 'antd';
const useStyles = makeStyles((theme) => ({
  tableBorder: {
    border: '1px solid black',
  },
  
}));

export default function PrintProduct110({ open, onClose,productId,testId,devId,ol,regNo, roundTest}) {
  const classes = useStyles();
  const [specData, setSpecData] = useState([]);
  const [responseData, setResponseData] = useState(null);

  const getSpecs = async () => {
    try {
      const { data } = await axiosInstanceAte.get(`spec/getSpecsByProdIdTestId/${productId}/${testId}`);
      setSpecData(data);
      
    } catch (error) {
      console.error("Error fetching specifications:", error);
      }
  };
     const getSavedObsVal = async () => {
     try {
      const { data } = await axiosInstanceIol.get(`/ate/getAteByDevIdProdIdTestId/${devId}/${productId}/${testId}/${roundTest.roundId}`);
      setResponseData(data)
      } catch (error) {
      console.log(error);
    }
  };
  
useEffect(() => {
getSpecs();
getSavedObsVal()
 }, []);
const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // if (!deviceData || !submittedData) return null; 

  return (
    
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">

      <DialogContent>
          
      <div ref={componentRef}>
        
             {specData.length > 0 && specData[0]?.testName && (
    <DialogTitle>{specData[0]?.testName}</DialogTitle>
    
)}

             
       
<div style={{ display: "flex", gap: 16, border: "1px solid lightgrey", padding: "8px 16px", marginBottom: 8, borderRadius: 4 }}>
        <Typography>
          Device No. : <b>{regNo.registerNo}</b>
        </Typography>
        <Typography>
          Line Item No. : <b>{ol.soLineItemNo}</b>
        </Typography>
   <Typography>
         Submitted By : <b>{responseData?.submittedBy}</b>
        </Typography>
          <Typography>
         Submitted Date : <b>{responseData?.submittedDate}</b>
        </Typography>

        </div>
<Table size="small" stickyHeader>
            <TableHead>
             <StyledTableRow>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>S.No.</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Parameter type</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Parameter description</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>TY clause no</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Min. value</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Max. value</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Unit</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Observation</StyledTableCell>
                           <StyledTableCell style={{ fontSize: 12, padding: 0 }}>status</StyledTableCell>
                         </StyledTableRow>
            </TableHead>
           <TableBody>
  {specData[0]?.specDtos?.map((item, specIndex) => (  
    <StyledTableRow key={specIndex}>
      <StyledTableCell>{specIndex + 1}</StyledTableCell>
      <StyledTableCell>{item.paramType}</StyledTableCell>
      <StyledTableCell>{item.specVal}</StyledTableCell>
      <StyledTableCell>{item.tyClauseNo}</StyledTableCell>
      <StyledTableCell>{item.min}</StyledTableCell>
      <StyledTableCell>{item.max}</StyledTableCell>
      <StyledTableCell>{item.uints}</StyledTableCell>
      <StyledTableCell >{responseData?.prodAteDtos[specIndex]?.obsValue || 'N/A'}</StyledTableCell>
<StyledTableCell style={{ color: responseData?.prodAteDtos[specIndex]?.status === "Pass" ? 'green' : 'red' }}>
  {responseData?.prodAteDtos[specIndex]?.status || 'N/A'}
</StyledTableCell>
</StyledTableRow>
 ))}
</TableBody>
          </Table>
          </div>
 
      </DialogContent>
      <DialogActions>
      <Button variant='contained' color='secondary' onClick={handlePrint}>
            Print
          </Button>
      <Button onClick={onClose} color="secondary" size="small" variant='contained'>
        Close
      </Button>
 
          </DialogActions>
    </Dialog>
   
  );
}
