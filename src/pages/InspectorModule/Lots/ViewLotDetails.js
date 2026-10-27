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
import { useEffect, useState } from "react";

import { DialogActions, StyledTableRow } from "Utils";

import { useDispatch } from "react-redux";
import { Notifications } from "@material-ui/icons";

import INoteInternalNew from "pages/SOModule/OL/InoteInternal/inoteInternalNew";
import Qcc from "pages/cetificate/qcc";
import CreateOl from "pages/OL/CreateOl/CreateOl";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import Qacq from "pages/cetificate/qacq";
import WarrantDetailsTable from "pages/SOModule/LineItemsDetails/WarrantDetailsTable";
import { WarrentCertificate } from "pages/SOModule/LineItemsDetails/WarrentCertificate";

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
export default function LotDetails({row,setOpenDialog}) {
  const classes = useStyles();
  const [mergedDetails, setMergedDetails] = useState([]);
  const [rowData, setRowData] = useState({});
  const [mergedInote, setMergedInote] = useState();
//   const [openDialog, setOpenDialog] = useState(false);
  const [offerLetter, setOfferLetter] = useState(false);
    const [openqac, setOpenQac] = useState(false);
   const [qcc, setQcc] = useState(false);
  const [inote, setINote] = useState(false);
  const dispatch = useDispatch();
  const getMergedInoteDetails = async () => {
    try {
      const { data } = await axiosInstance("merge/sslip/getAllMergedOls");
      setMergedDetails(data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(row, "rowDatass");
  const getInoteDetails = async (id) => {
    try {
      const { data } = await axiosInstance(`/merge/sslip/getDetById/${id}`);
      setMergedInote(data);
      console.log("INote Details:", data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMergedInoteDetails();
  }, []);

  const handleLotDetailsClick = (rowData) => { 
    getInoteDetails(rowData?.mergedOlId);
    setRowData(rowData);
    console.log(rowData, "row data");
    // setOpenDialog(true);
  };


 

  return (
    <>
   
      {/* <Dialog open={openDialog} fullWidth maxWidth="lg" > */}
        <DialogContent style={{ height: "5000px", marginBottom: "10px" }}>
          {/* <DialogTitle
            classes={{
              root: classes.cardHeader,
              // title: classes.cardTitle,
            }}
            fullWidth
          >
            Lot Details
          </DialogTitle>
          <Grid container spacing={2}>
            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              lg={2}
              xl={2}
              style={{ marginTop: "10px" }}
            >
              <Typography style={{ marginLeft: "25px", marginTop: "15px" }}>
                <b>Lot No:</b>
              </Typography>
            </Grid>
            <Grid
              item
              xs={9}
              sm={9}
              md={9}
              lg={9}
              xl={9}
              style={{ marginTop: "10px" }}
            >
              <TextField
                variant="outlined"
                value={rowData.mergedOlNo}
                fullWidth
                //  onChange={handleChange}
              />
            </Grid> */}
          <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <DialogTitle
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                fullWidth
              >
                Lot Details
              </DialogTitle>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography style={{ marginLeft: "24px" }}>
                <b>Lot Number:</b>
                {row.mergeSslipNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>Lot Date:</b>
                {row.offerLetterDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <DialogTitle
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                fullWidth
              >
                SO/PO Details
              </DialogTitle>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography style={{ marginLeft: "24px" }}>
                <b>SO Number:</b>
                {rowData.soNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>SO Date:</b>
                {rowData.soDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>EP Code:</b>
                {rowData.epcode}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <DialogTitle
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                fullWidth
              >
                Submission Slip Details
              </DialogTitle>
              <TableContainer
                style={{ maxHeight: 1500, border: "1px solid lightgrey" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>S.No.</StyledTableCell>
                      <StyledTableCell>Submission Slip No</StyledTableCell>
                      <StyledTableCell>Submission Slip Date</StyledTableCell>
                      <StyledTableCell>Reg No</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {mergedInote?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {item.submissionSlipNo}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.olDate}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.regNos?.join(", ")}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                   <DialogTitle classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                 fullWidth
                 > 
                  INote Details
                  </DialogTitle>
                   </Grid> */}
          </Grid>
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      {/* </Dialog> */}
    </>
  );
}
