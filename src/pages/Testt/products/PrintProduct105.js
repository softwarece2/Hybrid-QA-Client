import React from "react";
import { Dialog, DialogContent, Table, TableHead, TableBody, Typography, Button } from "@material-ui/core";
import { DialogActions, DialogTitle, StyledTableCell, StyledTableRow } from "Utils";

import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { ORG_TYPE, USER_ROLE_ID } from "Globals.js";
export default function PrintProduct105({ open, onClose, responseData, ol, regNo, testName }) {
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>{testName}</DialogTitle>
      <DialogContent style={{ paddingTop: 0 }} dividers>
      
        <div ref={componentRef}>
          <Typography
            style={{ display: "flex", gap: 16, border: "1px solid lightgrey", padding: "8px 16px", marginBlock: 8, borderRadius: 4 }}
          >
            <p>
              Device No. : <b>{ regNo?.serialNo || ol?.serialNo}</b>
            </p>
            <p>
              Line Item No. : <b>{ol?.soLineItemNo || ol?.lineItemNo}</b>
            </p>
            <p>
              Submitted By : <b>{responseData?.submittedBy}</b>
            </p>
            <p>
              Submitted Date : <b>{responseData?.submittedDate}</b>
            </p>
          </Typography>

          <Typography variant="h6" color="secondary" className="no-display">Test Name: <b>{testName}</b> </Typography>

          <Table size="small" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>S.No.</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>Parameter type</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13, width:300 }}>Parameter description</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>TY clause no</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>Min. value</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>Max. value</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>Unit</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>Observation</StyledTableCell>
                <StyledTableCell style={{ paddingInline: 4,fontSize:13 }}>status</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {responseData.prodAteDtos?.map((item, specIndex) => (
                
                <StyledTableRow key={specIndex}>
                  <StyledTableCell>{specIndex + 1}</StyledTableCell>
                  <StyledTableCell>{item.paramType}</StyledTableCell>
                  <StyledTableCell>{item.specVal}</StyledTableCell>
                  <StyledTableCell>{item.tyClauseNo}</StyledTableCell>
                  <StyledTableCell>{item.min}</StyledTableCell>
                  <StyledTableCell>{item.max}</StyledTableCell>
                  <StyledTableCell>{item.unit}</StyledTableCell>
                  <StyledTableCell style={{ textTransform: "capitalize", textAlign:"center" }}>
                  <b>{item.obsValTx}</b>
                  </StyledTableCell>
                  <StyledTableCell style={{ color: item.status === "Pass" ? "green" : "red" }}>{item.status || "N/A"}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{ textTransform: "capitalize" }} variant="contained" color="primary" size="small" onClick={handlePrint}>
          Print
        </Button>
        <Button style={{ textTransform: "capitalize" }} onClick={onClose} color="secondary" size="small" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
