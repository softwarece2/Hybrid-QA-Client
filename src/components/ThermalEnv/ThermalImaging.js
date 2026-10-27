import React from "react";
import  { StyledTableCell } from "../../components/UseTable"
import { RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import {
  Table,
  TableBody,

  TableHead,
  TableRow,
  Typography,
  Grid,
  makeStyles,
  
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "100%",
    borderCollapse: "collapse",
  },
  StyledTableCell: {
    border: "1px solid black",
    padding: theme.spacing(1),
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
    textAlign: "center",
  },
  subHeading: {
    fontWeight: 500,
    textAlign: "center",
  },
  color:{
backgroundColor:"white",
color:"black"
  },
  redText: {
    color: "red",
  },
}));

const ThermalImaging = () => {
  const classes = useStyles();
return (
    <div className="p-6">
      <Typography variant="h5" className="text-center font-bold mb-2" align="center">
      <u>ENVIRONMENTAL TEST REPORT OF COMMANDER THERMAL IMAGING (TI) DAY CUM NIGHT SIGHT FOR T-72 TANKS AND VARIANTS</u>
      </Typography>
      <Typography variant="h6" className="text-center font-semibold mb-4" align="center">
      AS PER CQA (I) ATP No.: CQA (I)/ATP/21   (OE/OH/REP)/COD   (MK-II)
      </Typography>
      <Typography className="mb-4" align="center">I/Note No.: _________________________ Dt: _______________</Typography>
<Grid container>
        <Table className={classes.table} size="small">
          <TableHead>
          <TableRow>
      <StyledTableCell className={classes.StyledTableCell}>SL. NO.</StyledTableCell>
      <StyledTableCell className={classes.StyledTableCell}>TESTS</StyledTableCell>
      <StyledTableCell className={classes.StyledTableCell} style={{ width: '150px' }}>OBSERVATIONS</StyledTableCell>
 </TableRow>
          </TableHead>
          <TableBody>
            {/* Row 1 */}
{/* Visual Examination Section */}
            <TableRow>
  <StyledTableCell className={classes.StyledTableCell} rowSpan={2}>1.</StyledTableCell>
</TableRow>
{[
{
    text:
      "<strong>Vibration Test (In tank mounting axis):-</strong><br />" +
      "<strong>(i) For Sight.</strong><br />" +
      "Sinusoidal Acceleration : 4g<br />" +
      "Frequency:<br />" +
      "&nbsp;&nbsp;&nbsp;&nbsp;(1) 55 Hz for 10 Minutes.<br />" +
      "&nbsp;&nbsp;&nbsp;&nbsp;(2) 75 Hz for 10 Minutes.<br />" +
      "&nbsp;&nbsp;&nbsp;&nbsp;(3) 80 Hz for 10 Minutes.<br />" +
      "• Equipment shall be switched ON during the test.<br />" +
      "<hr style='width:110%; marginleft:10px 0;' /><br />" +   
      "<strong>Vibration Test (In tank mounting axis):-</strong><br />" +
      "<strong>(ii) For LCD Monitor:</strong><br />" +
      "• 5 to 8 Hz ± 6 MM constant displacement.<br />" +
      "• 8 to 50 Hz, Acceleration: 1.5g @ 1 Octave/Minute.<br />" +
      "• Duration: 30 Minutes.<br />" +
      "• LCD Monitor to be switched ON during the test.",
  }
  ].map((item, index) => (
  <TableRow key={index}>
    <StyledTableCell
      className={classes.StyledTableCell}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
        <StyledTableCell className={classes.StyledTableCell}>
  <RadioGroup row>
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
  <br/> <hr style={{ width: "106%", margin: "8px 0" }} />
  <RadioGroup row >
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
</StyledTableCell>
</TableRow>
))}
<TableRow>
  <StyledTableCell className={classes.StyledTableCell} rowSpan={2}>2.</StyledTableCell>
  {/* <StyledTableCell className={classes.StyledTableCell} colSpan={3}>
    <strong>Vibration Test (In tank mounting axis):-</strong>
  </StyledTableCell> */}
</TableRow>
{[
  {
    text:
    "<strong>High Temperature Test (For Sight & LCD Monitor):-</strong><br />" +
      "55° C ± 3°C for 03 hrs<br />" +
      "•(During last 30 Minutes, equipment to be switched ON and checked for functioning.)<br />" ,
      
  },
].map((item, index) => (
  <TableRow key={index}>
    <StyledTableCell
      className={classes.StyledTableCell}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
          <StyledTableCell className={classes.StyledTableCell}>
  <RadioGroup row>
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
</StyledTableCell>
 
  </TableRow>
))}

<TableRow>
  <StyledTableCell className={classes.StyledTableCell} rowSpan={2}>3.</StyledTableCell>
  {/* <StyledTableCell className={classes.StyledTableCell} colSpan={3}>
    <strong>Vibration Test (In tank mounting axis):-</strong>
  </StyledTableCell> */}
</TableRow>
{[
  {
    text:
    "<strong>Low Temperature Test (For Sight & LCD Monitor):-</strong><br />" +
      "-20° C ± 03°C for 03 hours. <br />" +
      "(During last 30 Minutes, equipment to be switched ON and checked for functioning after recovery time 2 to 4 hrs.)<br />" ,
      
  },
].map((item, index) => (
  <TableRow key={index}>
    <StyledTableCell
      className={classes.StyledTableCell}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
          <StyledTableCell className={classes.StyledTableCell}>
  <RadioGroup row>
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
</StyledTableCell>
  </TableRow>
))}
<TableRow>
  <StyledTableCell className={classes.StyledTableCell} rowSpan={2}>4.</StyledTableCell>
  {/* <StyledTableCell className={classes.StyledTableCell} colSpan={3}>
    <strong>Vibration Test (In tank mounting axis):-</strong>
  </StyledTableCell> */}
</TableRow>
{[
  {
    text:
    "<strong>Sealing Test (For Sight only):-</strong><br />" +
      "Sealing test at excess pressure of 0.2 atm. <br />" +
      "(Pressure should not drop more than 0.1 atm. in first 3 Minutes)<br />" ,
      
  },
].map((item, index) => (
  <TableRow key={index}>
    <StyledTableCell
      className={classes.StyledTableCell}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
       <StyledTableCell className={classes.StyledTableCell}>
  <RadioGroup row>
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
</StyledTableCell>
 </TableRow>
))}
          <TableRow>
  <StyledTableCell className={classes.StyledTableCell} rowSpan={2}>5.</StyledTableCell>
  {/* <StyledTableCell className={classes.StyledTableCell} colSpan={3}>
    <strong>Vibration Test (In tank mounting axis):-</strong>
  </StyledTableCell> */}
</TableRow>
{[
  {
    text:
    "<strong>Bump Test (In tank mounting axis):-</strong><br />" +
      "Peak Acceleration: 7g.<br />" +
      "Pulse Duration: 6 Milli Second.<br />"+ 
      "No of Bumps: 3600.<br /> "+
      "(Equipment in switched off condition.) ",
},
].map((item, index) => (
  <TableRow key={index}>
    <StyledTableCell
      className={classes.StyledTableCell}
      dangerouslySetInnerHTML={{ __html: item.text }}
    />
    <StyledTableCell className={classes.StyledTableCell}>
  <RadioGroup row>
    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
  </RadioGroup>
</StyledTableCell>
</TableRow>
))}
</TableBody>
        </Table>
      </Grid>
    </div>
  );
};
export default ThermalImaging;
