import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { StyledTableCell, StyledTableCellPrint } from "components/UseTable";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  paper: {
    padding: "12px 12px 12px 12px",
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    width: "100%",
  },
  tableCell: {
    border: "1px solid black",
  },
  heading: {
    textDecoration: "standard",
    fontWeight: 600,
  },
  stores: {
    textTransform: "uppercase",
    // textDecoration: "standard",
    fontWeight: 600,
  },
  headingLeft: {
    fontWeight: 500,
  },
  headingRight: {
    fontSize: "0.875rem",
  },
  textSize: {
    fontSize: "0.875rem",
  },
  textSizeBold: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  subHeading: {
    fontSize: "0.875rem",
    fontWeight: 400,
    wordBreak: "none",
  },
  subTitleHeading: {
    fontSize: "1.3rem",
    fontWeight: 400,
    wordBreak: "none",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  box: {
    border: "1px solid black",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  labelNote: {
    marginTop: "15px",
    marginBottom: "20px",
    fontSize: "12px",
    textAlign: "left",
    // marginLeft: "2%",
    color: "grey",
  },
  textArea: {
    fontSize: "0.875rem",
    fontWeight: 400,
    width: "250px",
  },
  textfield: {
    fontSize: "0.875rem",
    fontWeight: 400,
    maxWidth: "100px",
    height: "40px",
    wordBreak: "break-all",
  },
  tableCellTextArea: {
    border: "1px solid black",
    width: "150px",
  },
  strikethrough: {
    textDecoration: "line-through",
  },
  textBold: {
    fontWeight: "bold",
  },
}));

function INoteDetails() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const noteData = {
    soNoDr: "1710271514 & PO-27271014",
    noteNo: "DI06-08-2023-202",
    wo: "9467000",
    deliveryPeriod: "08/08/2023",
    qtySupplied: 75,
    targetQty: 226,
    qtyAcquired: 51,
    lNo: 8,
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        align="center"
        style={{ margin: "auto", overflowX: "auto" }}
      >
        <Grid container>
          {loading && <LinearProgress />}
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCellPrint
                  align="center"
                  colSpan={10}
                  className={classes.tableCell}
                >
                  <Typography className={classes.subTitleHeading}>
                    I-Note No.-- 1902500124 Date--.06-08-2025 Qty--8.000
                    WO--946700000
                  </Typography>
                </StyledTableCellPrint>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>SL</Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    SO No. & Date
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    Delivery Period
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    Qty On Order
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    Cumm. Qty Supp. Till Date On Ord.
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    Target of 2025-26 & Qty Accepted
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}style={{ fontWeight: 600 }}>
                    Lot No.
                  </Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.soNoDr}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.noteNo}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.deliveryPeriod}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.qtyAcquired}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.targetQty}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                    {noteData.wo}
                </StyledTableCell>
                <StyledTableCell align="center" className={classes.tableCell}>
                  <Typography className={classes.subHeading}>
                    {noteData.lNo}
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default INoteDetails;
