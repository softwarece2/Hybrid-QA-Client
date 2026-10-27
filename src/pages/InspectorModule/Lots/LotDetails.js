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

import { useDispatch,useSelector } from "react-redux";
import { Notifications } from "@material-ui/icons";

import INoteInternalNew from "pages/SOModule/OL/InoteInternal/inoteInternalNew";
import Qcc from "pages/cetificate/qcc";
import CreateOl from "pages/OL/CreateOl/CreateOl";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import Qacq from "pages/cetificate/qacq";
import WarrantDetailsTable from "pages/SOModule/LineItemsDetails/WarrantDetailsTable";
import { WarrentCertificate } from "pages/SOModule/LineItemsDetails/WarrentCertificate";
import { USER_ROLE_ID } from "Globals.js";

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
export default function LotDetails() {
  const classes = useStyles();
  const [mergedDetails, setMergedDetails] = useState([]);
  const [rowData, setRowData] = useState({});
  const [mergedInote, setMergedInote] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [offerLetter, setOfferLetter] = useState(false);
    const [openqac, setOpenQac] = useState(false);
   const [qcc, setQcc] = useState(false);
  const [inote, setINote] = useState(false);
  const dispatch = useDispatch();
  const loggedInUser = useSelector( ( store ) => store.loggedInUser );
  const roleId = loggedInUser?.roleId;
  const isDO = roleId === USER_ROLE_ID.ROLE_DO;
  const getMergedInoteDetails = async () => {
    try {
      const { data } = await axiosInstance("merge/sslip/getAllMergedOls");
      setMergedDetails(data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(rowData, "rowData");
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
    setOpenDialog(true);
  };

  const columns = [
       {
      title: "Ep Code",
      field: "epcode",
      width: "auto",
      filtering: true,
    },
    {
      title: "Lot No",
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
      title: "Grp",
      field: "grp",
      width: "auto",
      filtering: true,
    },
    {
      title: "SONumber",
      field: "soNumber",
      width: "auto",
      filtering: true,
    },
    {
      title: "SODate",
      field: "soDate",
      width: "auto",
      filtering: true,
    },
        {
      title: "Inspection Authority",
      field: "inspectionAuthority",
      width: "auto",
      filtering: true,
    },
    {
      title: "Lot Details",
      field: "",

      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          onClick={() => 
            handleLotDetailsClick(rowData)
          }
        >
          LotDetails
        </ActionButton>
      ),
    },
      {
      title: "QCC",
      field: "",

      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          alignContent="center"
          onClick={() => {
          dispatch(selectItem(<Qcc mergedDetails={rowData} source="lotDetails" onClose={false} />)); 
          }}
        >
     QCC
        </ActionButton>
      ),
    },
    isDO?({
      title: "INote",
      field: "",
      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          alignContent="center"
          disabled={rowData?.organizationTypeId!==2}
          onClick={() => {
            // getInoteDetails(mergedDetails?.mergedOlId)
            setRowData(rowData);
            console.log(rowData, "mergedDetails11111");
            setINote(true);
            dispatch(selectItem(<INoteInternalNew mergedDetails={rowData} source="lotDetails" />))
          }}
        >
          INote
        </ActionButton>
      ),
    }):null,
    isDO?(  {
      title: "QAC",
      field: "",

      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          alignContent="center"
            disabled={rowData?.organizationTypeId===151}
          onClick={() => {
            // getInoteDetails(mergedDetails?.mergedOlId)
            setRowData(rowData);
            console.log(rowData, "mergedDetails11111");
            setOpenQac(true);
            dispatch(selectItem( <Qacq mergedDetails={rowData} source="lotDetails"    />)); 
          }}
        >
         QAC
        </ActionButton>
      ),
    }):null,
    isDO?({
      title: "Offer Letter",
      field: "",

      render: (rowData) => (
        <ActionButton
          variant="outlined"
          size="small"
          color="secondary"
          alignContent="center"
          disabled={rowData?.organizationTypeId!==151}
          onClick={() => {
            // getInoteDetails(mergedDetails?.mergedOlId)
            setRowData(rowData);
            console.log(rowData, "mergedDetails11111");
            setOfferLetter(true);
            dispatch(selectItem(<CreateOl mergedDetails={rowData}/>))
          }}
        >
          OfferLetter
        </ActionButton>
      ),
    }):null,
  
//  {
//       title: "Warrant",
//       field: "",

//       render: (rowData) => (
//         <ActionButton
//           variant="outlined"
//           size="small"
//           color="secondary"
//           alignContent="center"
//           disabled={rowData?.organizationTypeId!==151}
//           onClick={() => {
//             // getInoteDetails(mergedDetails?.mergedOlId)
//             setRowData(rowData);
//             console.log(rowData, "mergedDetails11111");
//             setOfferLetter(true);
//             dispatch(selectItem(<WarrentCertificate mergedDetails={rowData}/>))
//           }}
//         >
//           WarrantCertificate
//         </ActionButton>
//       ),
//     },
    // {
    //   title: "Action",
    //   width: "auto",
    //   render: (row) => (
    //     <div>
    //       <IconButton
    //         variant="contained"
    //         size="small"
    //         color={row.status === "Pending" ? "inherit" : "secondary"}
    //         // onClick={() => {
    //         //   setOpenNotify(true);
    //         //   setSelectedRow(row);
    //         // }}
    //       >
    //         <Notifications />
    //       </IconButton>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
    {qcc&&<Qcc mergedDetails={rowData} source="lotDetails"/>}
      {offerLetter && <CreateOl mergedDetails={rowData} />}
      {inote && <INoteInternalNew mergedDetails={rowData} source="lotDetails" />}
      {openqac&& <Qacq mergedDetails={rowData} source="lotDetails"    />}
      {!(offerLetter || inote || qcc || openqac) && (
        <TableComponent
          columns={columns}
          data={mergedDetails || []}
          title=""
          options={{ filtering: true, search: true }}
          // alignContent="center"
        />
      )}
      <Dialog open={openDialog} fullWidth maxWidth="lg" >
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
                {rowData.mergedOlNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Typography>
                <b>Lot Date:</b>
                {rowData.mergedDate}
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
              <TableContainer
                style={{ maxHeight: 1500, border: "1px solid lightgrey" }}
              >
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
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          {item.epcode}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.nomenclature}
                        </StyledTableCell>
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
      </Dialog>
    </>
  );
}
