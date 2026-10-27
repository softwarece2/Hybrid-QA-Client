import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import ActionButton from "components/ActionButton";
import TableComponent from "components/table";
import axiosInstance from "pages/Services/AxiosInstanceTransaction.js";
import { useEffect, useRef, useState } from "react";
import { DialogActions, StyledTableRow } from "Utils";
import { Notifications } from "@material-ui/icons";
import Qcc from "pages/cetificate/qcc";
import NotifyDo from "pages/SOModule/OL/NotifyDo/NotifyDo";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { useDispatch } from "react-redux";
import DetailsINote from "pages/InspectorModule/INote/DetailsINote";
import CQAIDetailsINote from "pages/InspectorModule/INote/CQAIDetailsINote";
export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#205375",
    color: "white",
    textAlign: "left",
    fontSize: "1rem",
    padding: 8,
    // fontStyle:bold,
  },
  body: {
    fontSize: "1rem",
    padding: 8,
    textAlign: "left",
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
    paddingBottom: "25px",
  },
  cardTitle: {
    fontSize: "0.87rem",
    paddingBottom: "40px",
  },
  DialogTitle: {
    backgroundColor: "#205375",
    color: "white",
    padding: "4px",
    zIndex: 1,
  },
  disable: {
    color: "grey !important",
  },
  root: {
    borderRadius: 4,
    height: 25,
    textTransform: "none",
    cursor: "default",
  },
  dialog: {
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(5),
  },
  dialogContent: {
    textAlign: "center",
  },
}));
export default function LotDetailsInstrument({ mergeSslipId, row, instrList }) {
  const classes = useStyles();
  const [mergedDetails, setMergedDetails] = useState();
  const [mergedInote, setMergedInote] = useState();
  const [rowData, setRowData] = useState({});
  const [openQcc, setOpenQcc] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifyDo, setNotifyDo] = useState(false)
  const dispatch = useDispatch();

  const getInoteDetails = async () => {
    try {
      const { data } = await axiosInstance(`/merge/sslip/getDetById/${mergeSslipId}`);
      setMergedInote(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getInoteDetails();
  }, []);
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const combinedInoteNos = row?.mergedOlNo;
  const soDate = row.soDate;
  const soNumber = rowData.soNumber;
  const mergedOlNo = mergedInote?.map((reg) => reg.mergedOlNo)
  console.log(mergedOlNo, "mergedOlNo");

  const handleBackClick = () => { instrList ? dispatch(selectItem(<CQAIDetailsINote />)) : dispatch(selectItem(<DetailsINote />)) };
  const groupedMergedInote = Object.values(
    (mergedInote || []).reduce((acc, item) => {
      if (!acc[item.mergedOlNo]) {
        acc[item.mergedOlNo] = {
          ...item,
          items: [],
        };
      }

      acc[item.mergedOlNo].items.push(item);
      return acc;
    }, {})
  )
  return (
    <>



      <div style={{ marginBottom: "10px" }}>
        <Typography
          variant="h6"
          style={{
            background: "#205375",
            color: "#fff",
            padding: "12px 16px",
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Lot Details
        </Typography>



        {groupedMergedInote.map((group, index) => (
          <Grid container spacing={2} ref={componentRef} key={group.mergedOlNo}>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} style={{ marginTop: "10px" }}>
              <Typography style={{ marginLeft: "25px", marginTop: "15px" }}>
                <b>Lot/OL No: {group.mergedOlNo}</b>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} style={{ marginTop: "10px" }}>
              <Typography style={{ marginTop: "15px" }}>
                <b>Lot Date: {group.mergedDate}</b>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <DialogTitle
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
              >
                SO/PO Details
              </DialogTitle>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography style={{ marginLeft: "24px" }}>
                <b>SO Number:</b> {group.soNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>SO Date:</b> {group.soDate}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <DialogTitle
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
              >
                Submission Slip Details
              </DialogTitle>

              <TableContainer style={{ maxHeight: 1500, border: "1px solid lightgrey" }}>
                <Table stickyHeader>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>EP Code</StyledTableCell>
                      <StyledTableCell>Project Description</StyledTableCell>
                      <StyledTableCell>Submission Slip No</StyledTableCell>
                      <StyledTableCell>Submission Slip Date</StyledTableCell>
                      <StyledTableCell>Reg No</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>

                  <TableBody>
                    {group.items.map((item, idx) => (
                      <StyledTableRow key={item.olId}>
                        <StyledTableCell>{idx + 1}</StyledTableCell>
                        <StyledTableCell>{item.epcode}</StyledTableCell>
                        <StyledTableCell>{item.nomenclature}</StyledTableCell>
                        <StyledTableCell>{item.submissionSlipNo}</StyledTableCell>
                        <StyledTableCell>{item.olDate}</StyledTableCell>
                        <StyledTableCell>{item.regNos?.join(", ")}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

          </Grid>
        ))}
        {/* <TableContainer style={{ maxHeight: 150,overflow: "auto", border: "1px solid lightgrey" }}> */}
        {/* <Table stickyHeader>
  <TableHead>

         <StyledTableRow>
                   <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>INote No</StyledTableCell>
                    <StyledTableCell>INote Date</StyledTableCell>
                    <StyledTableCell>Submission Slip No</StyledTableCell>
           
</StyledTableRow>
 </TableHead>
 <TableBody>
         
         {mergedInote?.map((item, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{item.inoteno}</StyledTableCell>
              <StyledTableCell>{item.inoteDate}</StyledTableCell>
              <StyledTableCell>{item.submissionSlipNo}</StyledTableCell>
            </StyledTableRow>
          ))
    }
      </TableBody>
 </Table> */}
        {/* </TableContainer> */}

        <DialogActions>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
          <Button onClick={handleBackClick} variant="contained" color="secondary">
            Back
          </Button>

        </DialogActions>
      </div>
    </>
  );
}


