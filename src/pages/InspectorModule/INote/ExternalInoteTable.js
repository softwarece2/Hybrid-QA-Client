/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {ORG_TYPE, USER_ROLE_ID, WING_ID } from "../../../Globals.js";
//component
import TableComponent from "components/table/index";
//material-ui
import {
  DialogTitle,
  IconButton,
  makeStyles,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Dialog, DialogActions, DialogContent, Grid } from "@material-ui/core";
//pages
import InspectionCertificate from "pages/Enclosures/Enclosure12/InspectionCertificate";
//redux
import MButton from "@material-ui/core/Button";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import {
  getAllAllotedINotesForFirm,
  getAllAllotedINotesForInspOrg,
  getAllAllotedINotesForInspOrgv2,
  getAllInotesByFileNoteId,
  getAllINotesForFirm,
  getAllINotesListByInspOrgId,
} from "Redux/Actions/SupplyOrder/OLAction";
import { useDispatch } from "react-redux";
import { Info, MoreVert, Notifications } from "@material-ui/icons";
import INoteInternal from "pages/SOModule/OL/InoteInternal/Index";
import NotifyOrAllot from "pages/SOModule/InStageQC/SubmittedSO/NotifyOrAllot";
// import Qcc from "pages/SOModule/OL/QACL/qcc";


import INoteInternalNew from "pages/SOModule/OL/InoteInternal/inoteInternalNew.js";
import Qcc from "pages/cetificate/qcc.js";
import Qac from "pages/certificate/qac.js";

import ActionButton from "components/ActionButton.js";
import Button from "components/Button.js";
import { Controller, useForm } from "react-hook-form";
import { StyledTableRow } from "Utils/index.js";
import axiosInstance from "pages/Services/AxiosInstanceTransaction.js";

import { toast } from "react-toastify";
import MergedTable from "./MergedTable.js";
import InoteToggle from "./InoteToggle.js";
import { getAllSubSlipListByInspOrgId } from "pages/Services/URLs.js";

export const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#b3e5fc",
    color:"black",
    textAlign:"left",
    fontSize: "1rem",
    padding: 8,
    // fontStyle:bold,
  },
  body: {
    fontSize: "1rem",
    padding: 8,
    textAlign:"left",
  },
}))(TableCell);
//icons

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
     paddingBottom: "35px",
     paddingTop: "10px",
  },
  cardTitle: {
    fontSize: "0.875rem",
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

export default function ExternalInoteTable() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const salesGrpId = useSelector((store) => store.loggedInUser?.salesGrpId);
  const [openNotify, setOpenNotify] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOl, setSeletcedOl] = useState([]);
  const [open, setOpen] = useState(false);
  const [olNums, setOlNums] = useState("");
  const[openDialog,setOpenDialog]=useState(false)
  const[inoteDetails,setInoteDetails]=useState()
  const[merged,setMerged]=useState()
  const[mergeopen,setMergeOpen]=useState("")

  const {
    handleSubmit,
    reset,
    control,

    formState: { errors, isDirty },
  } = useForm({

    mode: "onChange",

  });

  
const count = selectedOl.length;


const [columns] = useState([
    { title: "T No", field: "olNo", width: "auto" },
    { title: "EP Code", field: "epcode", width: "auto" },
    { title: "T Date", field: "olDate", width: "auto" },
    { title: "SO Number", field: "soNumber", width: "auto" },
    { title: "SO Date", field: "soDate", width: "auto" },
    // {
    //   title: "Actions",
    //   width: "auto",
    //   render: (row) => (
    //     <div>
    //       <IconButton
    //         variant="contained"
    //         size="small"
    //         color={row.status === "Pending" ? "inherit" : "secondary"}
    //         onClick={() => {
    //           setOpenNotify(true);
    //           setSelectedRow(row);
    //         }}
          
    //       >
    //         <Notifications />
    //       </IconButton>
    //     </div>
    //   ),
    // },
    
     
   
  ]);
console.log(inoteDetails,"lotNo")
const LotNoGeneration = inoteDetails?.length > 0 ? inoteDetails[0]?.lotNo : "";
  const fetchAllotOL = () => {
    setLoading(true);
    if (salesGrpId) {
      dispatch(loggedInUser?.roleId === USER_ROLE_ID.ROLE_HOS || USER_ROLE_ID.ROLE_GIC ? getAllAllotedINotesForInspOrgv2(orgId, loggedInUser?.empId) : getAllINotesForFirm(orgId))
  
        .then((res) => {
          setRecords(
            res.map((el, i) => ({
              ...el,
              internalInoteNo: el?.internalInoteNo,
              projectName: el?.projectDescription,
              supplyOrderNo: el?.supplyOrderNo,
              salesGroupName: el?.salesGrpName,
              offerDate: el?.olDateStr,
              consigneeName: el?.consigneeName,
              inoteDate: el?.inoteDate,
              status: el?.inoteStatus,
              inoteStatus:
                el?.inoteStatus === "Issued" ? (
                  <MButton
                    style={{ color: "#1b5e20", backgroundColor: "#c8e6c9" }}
                    size="small"
                    classes={{
                      disabled: classes.disable,
                      root: classes.root,
                    }}
                  >
                    Issued
                  </MButton>
                ) : el?.inoteStatus === "Pending" ? (
                  <MButton
                    style={{
                      color: "#cb0000",
                      backgroundColor: "#ff7d654d",
                    }}
                    size="small"
                    classes={{
                      disabled: classes.disable,
                      root: classes.root,
                    }}
                  >
                    Pending
                  </MButton>
                ) : null,
            }))
          );
          // const isFormIv = res.inoteTypeId === 2 ? true : false;
          // setButtonVisible(isFormIv);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    } else {
      dispatch(getAllInotesByFileNoteId(orgId))
        .then((res) => {
          setRecords(
            res.map((el, i) => ({
              ...el,
              internalInoteNo: el?.internalInoteNo,
              grp: el?.grp,
              supplyOrderNo: el?.supplyOrderNo,
              salesGroupName: el?.salesGrpName,
              offerDate: el?.olDateStr,
              inoteDate: el?.inoteDate,
              inoteStatus:
                el?.inoteStatus === "Issued" ? (
                  <MButton
                    style={{ color: "#1b5e20", backgroundColor: "#c8e6c9" }}
                    size="small"
                    classes={{
                      disabled: classes.disable,
                      root: classes.root,
                    }}
                  >
                    Issued
                  </MButton>
                ) : el?.inoteStatus === "Pending" ? (
                  <MButton
                    style={{
                      color: "#cb0000",
                      backgroundColor: "#ff7d654d",
                    }}
                    size="small"
                    classes={{
                      disabled: classes.disable,
                      root: classes.root,
                    }}
                  >
                    Pending
                  </MButton>
                ) : null,
            }))
          );

          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAllotOL();
  }, []);

  const updatedActions = [
    {
      label: "I-Note",
      onClick: (rowData) => {
        if (salesGrpId) {
          dispatch(selectItem(<INoteInternalNew olId={rowData.offerLetterId} />));
        } else {
          dispatch(
            selectItem(
               <InspectionCertificate
                fnId={rowData.id}
                olId={rowData.offerLetterId}
                ol={rowData}
              />
            )
          );
        }
      },
    },
   loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY ? {
      label: "QAC",
      onClick: (rowData) => {
        dispatch(
          selectItem(<Qac row={rowData} olIds={rowData?.offerLetterId} />)
        );
      },
      // disabled: (row) => row.status === "Pending",
    }:
    {
      label: "QCC",
      onClick: (rowData) => {
        if (salesGrpId) {
          dispatch(selectItem(<Qcc olId={rowData.offerLetterId} />));
        } else {
          dispatch(
            selectItem(<Qcc row={rowData} olIds={rowData?.offerLetterId} />)
          );
        }
      },
      disabled: (row) => row.status === "Pending",
    },
  ];
const handleClick = (e) => {
   
    if (selectedOl.length > 0) { 
      const firstSupplyOrderNo = selectedOl[0]?.soNumber;  
      setOlNums(firstSupplyOrderNo);
      setOpen(true);
    } else {
      toast.info("Please select at least one supply order");
    }
    
  };

  // const combinedInoteNos1 = selectedOl.map(item => item.internalInoteNo).join(',');
  const soDate = selectedOl.map(item => item.soDate);
const combinedInoteIds = selectedOl.map(item => item.olId);

  async function getInoteDetails(){
    try {
      setOpenDialog(true)
      const { data } = await axiosInstance(`merge/getAllOlDetails/${combinedInoteIds}`);
  
      setInoteDetails(data)
      setOpen(false)
    } catch (error) {
      toast.error(error?.response?.data || "Something went wrong...")
    }
  }

  async function getInoteDetailsSingle(inoteId){
    setOpenDialog(true)
   const { data } = await axiosInstance(`internal/getAllINoteDetails/${inoteId}`);

    setInoteDetails(data)
    setOpen(false)
     }
 
  const [combinedInoteNos, setCombinedInoteNos] = useState(() => {
  return selectedOl?.map(item => item.internalInoteNo);  
  });
   useEffect(() => {
   setCombinedInoteNos(selectedOl?.map(item => item.olNo));
  }, [selectedOl]);  
 const handleChange = (event) => {
    setMergeOpen(event.target.value);
  };
const saveInoteDetails = async () => {
    try {
    const req = {
        mergeOlNo: LotNoGeneration,
        olIds: combinedInoteIds
      };
      await axiosInstance.post("merge/sslip/save", req);
     toast.success("Generated")
   
  setOpenDialog(false)
  dispatch(selectItem(<MergedTable />));
    } catch (err) {
      console.error(err);
    }

  };
  const handleClickClose = () => {
    setOpen(false);
  };

  async function getmergedDetails(){
    setOpenDialog(true)
    const response = await axiosInstance(`internal/getAllMergedOls`)
    setMerged(response)
     }
 

   

  return (
    <>
    {openNotify && (
        <NotifyOrAllot
          onClose={() => setOpenNotify(false)}
          selectedRow={selectedRow}
          isINote
          refresh={fetchAllotOL}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        options={{
          selection: true,
        }}
         onSelectionChange={(e, rows) => {
         setSeletcedOl(e);
       const allSameSupplyOrder = e.every((obj) => obj?.soNumber === e[0]?.soNumber);
if (!allSameSupplyOrder) {
      toast.error(`Plz select Challans which belong to the same supply order`);
    }
}}
        actions={[
          {
            tooltip: "Create Lot No",
            // icon:'Merge OL',
            icon: () => (
              <ActionButton
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleClick}
                disabled={selectedOl?.length < 1 || selectedOl?.some((val) => val?.soNumber !== selectedOl[0]?.soNumber)}
              >
               Create Lot No
              </ActionButton>
            ),
          },
        ]}

      />

      <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
         {/* IVNV Observation Added separate MESSAGE FOR SINGLE and MULTIPLE (MERGE)  SELECTION  for creating LOT NO. Modified by:Gopala Krishna Date:09-07-2026 */}
     <DialogContent>
    {selectedOl.length === 1 ? (
      // --- MESSAGE FOR SINGLE SELECTION ---
      <Typography variant="body1">
        Are you sure you want to generate a Lot Number for Submission Slip No:{" "}
        <b style={{ color: "#1976d2" }}>{selectedOl[0].olNo}</b>?
      </Typography>
    ) : (
      // --- MESSAGE FOR MULTIPLE SELECTION (MERGE) ---
      <Typography variant="body1">
        Are you sure you want to merge the following <b style={{ color: "#1976d2"  }}>{count} Submission Slip Numbers</b> of Supply Order No: <b>{olNums}</b>?
        <br />
        <div style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}>
          {selectedOl.map((item, index) => (
            <div key={index}>
              {index + 1}. <b>{item.olNo}</b>
            </div>
          ))}
        </div>
      </Typography>
    )}
  </DialogContent>
        <DialogActions>
          <Button onClick={getInoteDetails} style={{ color: "primary" }} variant="contained" color="primary">
            Yes
          </Button>
          <Button onClick={handleClickClose} variant="contained" color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>

     <Dialog open={openDialog} fullWidth maxWidth="lg"  >
        <DialogContent  style={{height:"5000px",marginTop:"10px"}}>
         <DialogTitle     classes={{ 
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                 fullWidth
                 >Lot Details</DialogTitle>
       <Grid container spacing={2}>
       <Grid item xs={2} sm={2} md={2} lg={2} xl={2} style={{marginTop:"10px"}}>
        <Typography style={{marginLeft:"25px",marginTop:"15px"}}><b>Lot Details:</b></Typography>
       </Grid>
         <Grid item xs={9} sm={9} md={9} lg={9} xl={9} style={{marginTop:"10px"}}>

<TextField 
               variant="outlined"
               value={LotNoGeneration}
               fullWidth
              //  onChange={handleChange}
        
              
         />
         </Grid>
<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
     <DialogTitle     
     classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                 fullWidth>
                  SO/PO Details
                </DialogTitle>
                </Grid>
<Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Typography style={{marginLeft:"24px"}}><b>SO Number:</b> {olNums} </Typography>
    
     </Grid>
     <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Typography><b>SO Date:</b>{soDate[0]} </Typography>
     
     </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
 <DialogTitle     
 classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                 fullWidth>Submission Slip Details</DialogTitle>
                            <TableContainer style={{ maxHeight: 150, overflow: "auto", border: "1px solid lightgrey" }}>
      <Table stickyHeader>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell>EP Code</StyledTableCell>            
            <StyledTableCell>Material Description</StyledTableCell>            
            <StyledTableCell>Submission Slip No</StyledTableCell>
            <StyledTableCell>Submission Slip Date</StyledTableCell>
            <StyledTableCell>Reg No</StyledTableCell> 
          </StyledTableRow>
        </TableHead>
        <TableBody>
{/*          
           {inoteDetails?.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{item.olNo}</StyledTableCell>
                <StyledTableCell>{item.supplyOrderDate}</StyledTableCell>
                <StyledTableCell>{item.regNos?.join()}</StyledTableCell>
              </StyledTableRow>
            ))
      } */}
      {inoteDetails?.map((item, index) => (
  <StyledTableRow key={index}>
    <StyledTableCell>{index + 1}</StyledTableCell>
    <StyledTableCell>{item.epCode}</StyledTableCell>
    <StyledTableCell>{item.nomenclature}</StyledTableCell>
    <StyledTableCell>{item.olNo}</StyledTableCell>
    <StyledTableCell>{item.olDate}</StyledTableCell>
    <StyledTableCell>
      {Array.isArray(item.regNos)
        ? item.regNos.join(',')
        : item.regNos || '' 
      }
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
                   {/* <TableContainer style={{ maxHeight: 150, overflow: "auto", border: "1px solid lightgrey" }}>
 <Table stickyHeader>
  <TableHead>

         <StyledTableRow>
                   <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>INote No</StyledTableCell>
                    <StyledTableCell>INote Date</StyledTableCell>
                    <StyledTableCell>Submission Slip No</StyledTableCell>
           
</StyledTableRow>
 </TableHead>
 <TableBody>
         
         {inoteDetails?.map((item, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{item.inoteno}</StyledTableCell>
              <StyledTableCell>{item.inoteDate}</StyledTableCell>
              <StyledTableCell>{item.submissionSlipNo}</StyledTableCell>
            </StyledTableRow>
          ))
    }
      </TableBody>
 </Table>
</TableContainer> */}
</DialogContent>
   < DialogActions>
          <Button onClick={saveInoteDetails} style={{ color: "primary" }} variant="contained" color="primary" disabled={loading}>
            Generate
          </Button>
          <Button onClick={() => setOpenDialog(false)}variant="contained" color="secondary">
            Close
          </Button>
      
        </DialogActions>
      </Dialog>
    </>
  );
}
const MoreActionButtons = ({ rowData, actions }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {actions.map((el) => (
          <MenuItem
            key={el.label}
            onClick={() => {
              el.onClick(rowData);
            }}
            disabled={el?.disabled ? el?.disabled(rowData) : false}
            divider
          >
            <Typography variant="body2">{el.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};
