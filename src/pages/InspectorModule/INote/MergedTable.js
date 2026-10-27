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
import { DialogActions, StatusChips, StyledTableRow } from "Utils";
import { Notifications } from "@material-ui/icons";
import Qcc from "pages/cetificate/qcc";
import NotifyDo from "pages/SOModule/OL/NotifyDo/NotifyDo";
import { useReactToPrint } from "react-to-print";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { useDispatch } from "react-redux";
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
export default function MergedTable() {
  const classes = useStyles();
  const [mergedDetails, setMergedDetails] = useState();
  const [mergedInote, setMergedInote] = useState();
  const [rowData, setRowData] = useState({});
  const [openQcc, setOpenQcc] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [notifyDo,setNotifyDo] =useState(false)
 const dispatch = useDispatch();
  const getMergedInoteDetails = async () => {
    try {
      const { data } = await axiosInstance("merge/sslip/getAllMergedOls");
      setMergedDetails(data);
    } catch (err) {
      console.log(err);
    }
  };
  const getInoteDetails = async (id) => {
    try {
      const { data } = await axiosInstance(`/merge/sslip/getDetById/${id}`);
      setMergedInote(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMergedInoteDetails();
  }, []);
const componentRef = useRef()
  const handlePrint  = useReactToPrint({
    content:()=>componentRef.current,
  })
  const columns = [
        {
      title: "Grp",
      field: "grp",
      width: "auto",
      filtering: true,
    },
    {
      title: "EP Code",
      field: "epcode",
      width: "auto",
      filtering: true,
    },
    {
      title: "Lot No / OL No",
      field: "mergedOlNo",
      width: "auto",
      filtering: true,
    },

    {
      title: "Lot Date",
      field: "mergedDate",
      width: "auto",
      filtering: true,
    },
    {
      title: "SO Number",
      field: "soNumber",
      width: "auto",
      filtering: true,
    },
    {
      title: "SO Date",
      field: "soDate",
      width: "auto",
      filtering: true,
    },
  
    {
      title: "Lot Details",
      field: "",
      sorting: false,
      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => {
            getInoteDetails(rowData?.mergedOlId);
            setRowData(rowData);
            setOpenDialog(true);
          }}
        >
          Lot Details
        </ActionButton>
      ),
    },
{
  title: "Status",
  field: "status",
  width: "auto",
  filtering: true,
 render: (el) => <StatusChips status={el.status} />,
 
},
    {
      title: "QCC",
      field: "",
      sorting: false,
      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          alignContent="center"
          onClick={() => {
            setOpenQcc(true);
            setRowData(rowData);
             dispatch(selectItem(<Qcc mergedDetails={rowData} returnTo={"MergedTable"}  source="inoteTable" />)); 
          }}
        >
          Generate QCC
        </ActionButton>
      ),
    },
    // {
    //   title: "Action",
    //   width: "auto",
    //   render: (rowData) => (
    //     <div>
    //       <IconButton
    //         variant="contained"
    //         size="small"
    //         color={rowData.status === "Pending" ? "inherit" : "secondary"}
    //         onClick={() => {
    //           setNotifyDo(true);
    //           setRowData(rowData);
    //         }}
    //       >
    //         <Notifications />
    //       </IconButton>
    //     </div>
    //   ),
    // },
  ];
  const combinedInoteNos = rowData?.mergedOlNo;
  const soDate = rowData.soDate;
  const soNumber = rowData.soNumber;
  const lotDate = rowData.mergedDate;
 

  return (
    <>
    {notifyDo && <NotifyDo mergedDetails={rowData} onClose={()=>setNotifyDo(false)} />}
      {openQcc && <Qcc mergedDetails={rowData} returnTo={"MergedTable"}  source="inoteTable" />}
      {!openQcc && (
        <TableComponent
          columns={columns}
          data={mergedDetails || []}
          title=""
          options={{ filtering: false, search: true }}
          // alignContent="center"
          
        />
      )}

      <Dialog open={openDialog} fullWidth maxWidth="lg">
        <DialogContent style={{ height: "5000px", marginBottom: "10px" }}  >
          <DialogTitle
            classes={{
              root: classes.cardHeader,
              // title: classes.cardTitle,
            }}
            fullWidth
          >
            Lot Details
          </DialogTitle>
          <Grid container spacing={2} ref={componentRef}>
            {/* <Grid item xs={2} sm={2} md={2} lg={2} xl={2} >
              <Typography style={{ marginLeft: "25px" }}>
                <b>Lot/OLNo:{combinedInoteNos}</b>
              </Typography>
            </Grid>

           <Grid item xs={2} sm={2} md={2} lg={2} xl={2} >
              <Typography >
                <b>Lot Date:{combinedInoteNos}</b>
              </Typography>
            </Grid> */}
            {/* <Gxrid item xs={12} style={{ marginTop: "20px" }} /> */}

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} style={{ marginTop: 8 }}>
              <Typography style={{ marginLeft: "24px" }}>
                <b>Lot/OL No:</b> {combinedInoteNos}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} style={{ marginTop: 8 }}>
              <Typography>
                <b>Lot Date:</b> {lotDate}
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
                {soNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>SO Date:</b>
                {soDate}
              </Typography>
            </Grid>
          {/* IVNV Observation Added EP Code near So Details Modified by:Gopal Krishna Date:09-07-2026 */}
            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>EP Code:</b>
                {rowData.epcode}
              </Typography>
            </Grid> */}
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
                    {mergedInote?.map((item, index) => (
                      <StyledTableRow key={index + item.submissionSlipNo}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
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
                       <Button onClick={handlePrint} variant="contained" color="primary">
            Print
          </Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained" color="secondary">
            Close
          </Button>
    
        </DialogActions>
      </Dialog>
    </>
  );
}


