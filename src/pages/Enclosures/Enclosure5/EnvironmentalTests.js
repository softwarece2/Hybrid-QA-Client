import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { StyledTableCell } from "../../../components/UseTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "80%",
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
  table: {
    minWidth: 650,
  },
  tableCell: {
    border: "1px solid black",
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  headingNote: {
    fontWeight: 600,
  },
  textSize: {
    fontSize: "0.875rem",
  },
}));

function createData(slNo, testItems, qty, testItemsSlNo) {
  return { slNo, testItems, qty, testItemsSlNo };
}
const rows = [createData("1", "112188952192/ CENTRALIZED UPS", "01", "001")];

export default function ContactLetter() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>REQUEST FOR CONDUCTING ENVIRONMENTAL TESTS</Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>Date</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: 29.11.2022/12111/151/D&E/CS/NS1</Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>Documnent No.</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: 1000173257 </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>Notification No.</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: 4000269851 </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>1. Originating (Div./Dept./Sec.)</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: D&E-CS/NS(S&CS) </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>
            2. Project INDENT NO-3350000008 Dt:21.09.2016 Delivery Date: 28.08.2020
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: GBE SDN P17 A</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>3. Descroption of items(S)</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>:GIVEN BELOW. </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>4. Manufacturer</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: M/S. BEL.</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>5. Part No.</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: GIVEN BELOW.</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>6. Test Method (Tick Applicable Requirements)</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>
            : AS PER QAP SPECIFICATION GIVEN BELOW 1121 890 007 89 DQA(N)/QAP/EL/20/358 DATED 20 JAN 2020
          </Typography>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControlLabel
              value="JSS 55555"
              size="small"
              control={<Checkbox color="primary" />}
              label="JSS 55555"
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControlLabel
              value="MIL-STD810G"
              control={<Checkbox color="primary" />}
              label="MIL-STD810G"
              labelPlacement="start"
            />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControlLabel
              value="JSS 50101"
              control={<Checkbox color="primary" />}
              label="JSS 50101"
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <FormControlLabel
              value="OTHERS"
              control={<Checkbox color="primary" />}
              label="OTHERS"
              labelPlacement="start"
            />
          </Grid>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>7. Purchase Order No. (If Applicable)</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>
            8. Production Order No./WBS Element No./Cost Centre No./ Sale Order No.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: S/O-3110112937 / WBS - NSCO-21RD-03-ENW</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>9.(a) Applicable Specification</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>
            : TROPICAL EXPOSURE, TEST NO.27 For details Specification. Refer Annexure
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>
            &nbsp;&nbsp;&nbsp;(b) Purpose of Test (Applicable Requirements)
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: ET.</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell className={classes.tableCell} align="center">
                    Sl.NO{" "}
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    Test Items
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    Qty
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="center">
                    Test Items Sl.No.
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row}>
                    <StyledTableCell className={classes.tableCell} scope="row" align="center">
                      {row.slNo}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} align="center">
                      {row.testItems}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} align="center">
                      {row.qty}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} align="center">
                      {row.testItemsSlNo}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>
            &nbsp;&nbsp;&nbsp;(c) Tests required & special instruction, if any
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: GRAPH REQUIRED.</Typography>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Typography className={classes.textSize}>10. Contact Person Name & Designation</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: ARVIND KUMAR VERMA </Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="center">
          <Typography className={classes.subHeading}>Phone Number</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.subHeading}>: 22184/86</Typography>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          To
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography className={classes.headingNote}>Head of Environmental Test Department</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography className={classes.textSize}>
            <b>NOTE 1 : </b> THE ORIGINATOR WILL SEND THE ORIGINAL AND DUPLICATE TO ENVIRONMENTAL TEST DEPARTMENT. THE
            TESTING DEPT.NOTES DOWN THE CONTROL NO./DATE ON THE ORIGINAL AND DUPLICATE TEST REQUEST.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography className={classes.textSize}>
            <b>NOTE 2 : </b>
            AFTER COMPLETION OF TEST, A COPY OF TEST REQUEST STAMPED WITH TEST COMPLETED AS PER REQUEST AND TEST GRAPS
            (WHEREVER APPLICABLE) WILL BE GIVEN TO THE CUSTOMER AS TEST REPORT.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography className={classes.textSize}>
            <b>NOTE 3 : </b>FOR ADDITIONAL INFORMATION USE THE SPACE BELOW.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
