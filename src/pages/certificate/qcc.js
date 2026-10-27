import { Table, TableBody, TableHead, TextField, Typography } from "@material-ui/core";
import React from "react";
import { StyledTableCell, StyledTableRow } from "Utils";

export default function Qcc() {
  return (
    <div style={{ marginInline: "auto", maxWidth: 900 }}>
      <Typography align="center">OPTO ELECTRONICS FACTORY (A UNIT OF INDIA OPTEL Limited)</Typography>
      <Typography align="center">
        <b>
          <u>QUALITY CONFORMANCE CERTIFICATE</u>
        </b>
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Typography variant="caption">I Note No- I902500073, Dt.- 25/06/2025</Typography>
        <div>
          <Typography component={"p"} variant="caption">
            No.OLF/ASSY-1/CQAI/16B
          </Typography>
          <Typography component={"p"} variant="caption">
            Dt.- 25/06/2025
          </Typography>
        </div>
      </div>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>1.</StyledTableCell>
            <StyledTableCell>NOMENCLATURE</StyledTableCell>
            <StyledTableCell>UPGRADED COMMANDER THERMAL IMAGER (CTI) CUM DAY SIGHT FOR T90S/SK TANK (5855-72-052-9517 )</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>2.</StyledTableCell>
            <StyledTableCell>REG NO</StyledTableCell>
            <StyledTableCell>
              {["CTSKN-0048", "CTSKN-0019", "CTSKN-0088", "CTSKN-0072", "CTSKN-0083"].map((s) => (
                <div key={s}>{s},</div>
              ))}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>3.</StyledTableCell>
            <StyledTableCell>QTY TENDERED</StyledTableCell>
            <StyledTableCell>5</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>4.</StyledTableCell>
            <StyledTableCell>SWO No.</StyledTableCell>
            <StyledTableCell>907770000</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>5.</StyledTableCell>
            <StyledTableCell>WARRANT </StyledTableCell>
            <StyledTableCell>0007/0</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>6.</StyledTableCell>
            <StyledTableCell>SO/EXT. No. </StyledTableCell>
            <StyledTableCell>28244/OLF(IOL)/GS/CD-15A , Dt-28-09-2021, SO SL NO.-11</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>7.</StyledTableCell>
            <StyledTableCell>IFD/IND No. </StyledTableCell>
            <StyledTableCell>28244/INDENT CTI/T-90S/SK/QTY-236/GS/CD-15A</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>8.</StyledTableCell>
            <StyledTableCell>DRAWING No. </StyledTableCell>
            <StyledTableCell>ODC-OLF/CTI/T-90/001-01</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>9.</StyledTableCell>
            <StyledTableCell>DEVIATION CONCESSION</StyledTableCell>
            <StyledTableCell>NO</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell colSpan={3}>
              <TextField label="Remarks" variant="outlined" fullWidth multiline maxRows={3} minRows={3} size="small" margin="dense" placeholder="Enter Remarks" />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
      <Typography variant="body2">
        Certified that above store/assembly along with accessories has been manufactured from specified material and components are as per
        drawing/specification, except deviation/ concession under serial no 9 and meet quality standard to design / specification
        requirement. Necessary inspection report as listed are attached
      </Typography>
      <br />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Typography variant="body2">Date: 25/05/2026</Typography>
        </div>
        <div>
          <Typography variant="body2">SUNIL /Senior Manager</Typography>
          <br />
          <Typography variant="body2">
            <b>For Inspection</b>
          </Typography>
        </div>
        <div>
          <Typography variant="body2">SUNIL TRIVEDI /JWM-SG(T)</Typography>
          <br />
          <Typography variant="body2">
            <b>For Inspection</b>
          </Typography>
        </div>
      </div>
    </div>
  );
}
