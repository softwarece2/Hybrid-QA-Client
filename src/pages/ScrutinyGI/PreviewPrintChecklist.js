/** @format */

import React, { useEffect } from "react";
//material-ui
import {
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
//components
import Button from "components/Button";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import "jspdf-autotable";
import { DialogContent, DialogTitle, DialogActions } from "Utils";
import { useReactToPrint } from "react-to-print";
import { PaperComponent } from "Utils/D3Tree";
import SQAE from "assets/Images/sqae_logo.png";
//icons


const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
    textDecoration: "underline",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  hide: {
    display: "none",
    color: theme.palette.primary.contrastText,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
  tableDesign: {
    fontSize: "12px",
    width: "100%",
    // border: "1px solid grey",
    borderCollapse: "collapse",
    "& thead tr td": {
      border: "1px solid grey",
      padding: "0px 2px",
      color: "#205375",
      backgroundColor: "#f6fbff",
      fontSize: "14px",
      fontWeight: "600",
      textAlign: "center",
    },
    "& tbody tr td": {
      border: "1px solid grey",
      padding: "0px 2px",
      fontSize: "13px",
      textAlign: "center",
    },
  },
}));

export default function PreviewPrintChecklist({
  inObj,
  data,
  title,
  subTitle,
  onClose,
  columns,
  enableSignature,
  additionalInfo
}) {
  const classes = useStyles();
  
  const [loading, setLoading] = React.useState(false);
  const [mappedData, setMappedData] = React.useState([]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (data && columns) {
      const mappedData = data?.map((item) => {
        const mappedItem = {};
        columns.forEach((cell) => {
          mappedItem[cell.id] = item[cell.id];
        });
        return mappedItem;
      });
      setMappedData(mappedData || []);
    }
  }, [data, columns]);
  return (
    <div className={classes.root}>
      <Dialog
        open
        maxWidth='lg'
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id='draggable-dialog-title15' {...props} />
        )}>
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id='draggable-dialog-title15'>
          <Typography className={classes.heading}>{title}</Typography>
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <table className={classes.tableDesign} style={{ marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td rowSpan={4}>  <img src={SQAE} alt='SQAE' style={{ margin: "auto" }} /></td>
                  <td rowSpan={2}>  <b>SENIOR QUALITY ASSURANCE ESTABLISHMENT <br />
                    (ELECTRONICS)<br />
                    BENGALURU</b></td>
                  <td align="left">SQAE(L)/BG/QMS</td>
                </tr>
                <tr>
                  <td align="left">  Issue No. : 08</td>
                </tr>
                <tr>
                  <td rowSpan={2}><b>QUALITY MANAGEMENT SYSTEM MANUAL<br />ISO : 2015</b></td>
                  <td align="left">Rev. No. : 00</td>
                </tr>
                <tr>
                  <td align="left">Date : 03 06 2025</td>
                </tr>
              </tbody>
            </table>


            <Typography className={classes.subHeading} align='center'>
              <b> {title}</b>
            </Typography>
            <Typography
              className={classes.subHeading}
              gutterBottom
              align='center'>
              <b>{subTitle}</b>
            </Typography>
            {additionalInfo && additionalInfo}
            <Paper >
              <TableContainer>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size='small'
                  aria-label='simple table'
                  id='data-table-cleanliness-report'>
                  <TableHead>
                    <StyledTableRow>
                      {columns.map((el) => (
                        <StyledTableCell key={el.id}>
                          {el.label}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {mappedData?.map((item, index) => (
                      <StyledTableRow key={index}>
                        {columns.map((cell) => (
                          <StyledTableCell
                            key={cell.id}
                            style={{
                              width: cell.id === "remarks" ? 250 : "unset",
                            }}>
                            {item[cell.id]}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            {enableSignature &&
              <Grid container style={{ marginTop: '80px' }}>
                <Grid xs={8}>
                  <Typography>Remark od QA team I/C<br />with signature & date</Typography>
                  <Typography>Date:</Typography>
                </Grid>
                <Grid xs={4}>
                  <Typography>Signature od QA Staff<br />Name & Desig.</Typography>
                  <Typography>Date:</Typography>
                </Grid>
                <Grid xs={12} style={{ marginTop: '40px' }}>
                  <Typography>Remark of QAO<br />with signature & date</Typography>
                </Grid>
              </Grid>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={onClose}
            type='submit'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
