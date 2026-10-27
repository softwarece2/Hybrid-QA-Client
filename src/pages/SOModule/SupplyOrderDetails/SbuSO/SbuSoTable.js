/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../App.css";

//component
import TableComponent from "components/table/index";

//material-ui
import { Dialog, Grid, IconButton, makeStyles, MenuItem, Popover, Typography, Tooltip, DialogActions } from "@material-ui/core";
import ViewScrutiny from "pages/Enclosures/Enclosure1/Checklist1/ViewScrutiny";
import FclView from "pages/Enclosures/Enclosure2A/FclView";
import FCMView from "pages/Enclosures/Enclosure2B/FCMView";
import SbuSoForm from "./SbuSoForm";
import SbuSoImport from "./SbuSoImport";
import myFile from "../../../../assets/Files/Excels/SODetails.xlsx";
//icons

//colors
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green } from "@material-ui/core/colors";
import ActionButton from "components/ActionButton";
import Active from "components/Active";
import ConfirmDialog from "components/ConfirmDialog";
import InActive from "components/InActive";
import ViewFileClosing from "pages/Enclosures/Enclosure17/ViewFileClosing";
import { getAllSupplyOrdersBySalesGrpOptimized, getSoAttachments } from "Redux/Actions/SupplyOrder/SOAction";
import SbuViewSO from "./SbuViewSO";

//globals
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { soCreated, soHosa, ViewSoScrutiny, warrantDetails } from "pages/Services/URLs";
import { SELECTED_SO_ID, SELECTED_SO_NUMBER } from "Redux/Types";
import {COMMON_STATUS_SO_CONSTANTS, USER_DEPARTMENT, USER_ROLE_ID } from "../../../../Globals.js";
import SODetailsForm from "../CqaeSO/SODetailsForm";
import SbuCreateSo from "./SbuCreateSo";
import Button from "components/Button";
import { MoreVert } from "@material-ui/icons";
import AllotSo from "./AllotSo";
import OLViewLI from "./OLViewLI";
import ProjectDetailsTable from "pages/SOModule/ProjectDetails/ProjectDetailsTable";
import { DialogContent, DialogTitle, StatusChips } from "Utils";
import InStageSO from "pages/SOModule/InStageQC/InStageSO/InStageSO";
import SOTenderContract from "pages/ScrutinyGI/SOTenderContract";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddLineItems from "pages/SOModule/LineItemsDetails/RegNoMapper/AddLineItems";
import FilterStatusChips from "components/FilterStatusChips";
import { loggedInUser } from "Redux/Reducer/User";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  status: {
    color: "white",
    backgroundColor: green[800],
    "&:hover": {
      color: "white",
      backgroundColor: green[800],
    },
  },
  popoverRoot: {
    minWidth: "100px",
  },
}));

export default function SbuSoTable({notifySuccess}) {
  console.log("notifySuccess",notifySuccess)
  const classes = useStyles();
  const dispatch = useDispatch();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [fileClosing, setFileClosing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [val, setVal] = useState(null);
  const [id, setId] = useState(null);
  const [soObj, setSoObj] = useState({});
  const [formData, setFormData] = useState({});
  const [view, setView] = useState(false);
  const [viewScrutiny, setViewScrutiny] = useState(false);
  const [valueId, setValueId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openAllot, setOpenAllot] = useState(false);
  const [openSoWoMapper, setOpenSoWoMapper] = useState(false);
  const [openSubmissionSlip, setOpenSubmissionSlip] = useState(false);

  const user_role = useSelector((store) => store?.loggedInUser?.roleId);
  const salesGrpId = useSelector((store) => store?.loggedInUser?.salesGrpId);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const departmentId = useSelector((state) => state?.loggedInUser?.departmentId);
  const departmentTypeId = useSelector((state) => state?.loggedInUser?.departmentTypeId);

  const isPlanner = user_role === USER_ROLE_ID.ROLE_PLANNER;
  const isGicFromAssembly = user_role === USER_ROLE_ID.ROLE_GIC ;
  const isHosa = user_role===USER_ROLE_ID.ROLE_HOS

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
//  const statusConfigs = [

//   ...(isPlanner ? [{ id: 'Created', label: 'Created', color: '#ff9800', lightBg: '#fff3e0' }] : []),
//   ...(isHosa ? [{ id: 'Notified_to_HOSA', label: 'Received', color: '#ff9800', lightBg: '#fff3e0' }] : []),
//   ...(isPlanner ? [{ id: 'Notified_to_HOSA', label: 'Notified', color: '#4caf50', lightBg: '#e8f5e9' }] : []),
//   ...(isHosa ? [{ id: 'Notified_to_GICA', label: 'Notified', color: '#4caf50', lightBg: 'e8f5e9' }] : []),
// ];
const statusConfigs = [
  { id: 'Created', label: 'Created', color: '#ff9800', lightBg: '#fff3e0'},
  { id: 'Notified', label: 'Notified', color: '#4caf50', lightBg: '#e8f5e9'},
  
];
   const defaultStatus = [COMMON_STATUS_SO_CONSTANTS.CREATED, COMMON_STATUS_SO_CONSTANTS.Notified];
    const statusIdMap = {
      "Created": COMMON_STATUS_SO_CONSTANTS.CREATED,
      "Notified": COMMON_STATUS_SO_CONSTANTS.Notified,

     };
//  const Hosa = {ishos?"Notified_to_GICA":""}
     const [filterStatus, setFilterStatus] = useState(["Created", "Notified"]);
       const triggerApiFetch = (activeKeys, statusMap) => {
    const selectedIds = activeKeys.map(key => statusMap[key]);
    console.log(selectedIds, " selectedIds");
    
    if (selectedIds.length === 0) {
      fetchSO();
    } else {
      fetchSO(selectedIds.join(','));
    }
  };
      const handleCheckboxChange = (statusKey) => {
    setFilterStatus((prev) => {
      let newFilters;
      
      console.log("prev: ", prev);
      
      if (prev.includes(statusKey)) {
        if (prev.length === 1) return prev; 
        newFilters = prev.filter((item) => item !== statusKey);
      } else {
        newFilters = [...prev, statusKey];
      }
      console.log("newFilters: ", newFilters);

      triggerApiFetch(newFilters, statusIdMap);
      return newFilters;
    });
  };
  const actions = [
    {
      label: "Add/Edit",
      tooltip: "Add/Edit SO Details",
      onClick: (rowData) => {
        dispatch({
          type: SELECTED_SO_ID,
          payload: rowData?.id,
        });
        dispatch({
          type: SELECTED_SO_NUMBER,
          payload: rowData?.orderNo,
        });
        getSoBySoId(rowData?.id);
        setOpenForm(true);
        setSelectedRow(rowData);
      },
      hidden: () => {
        return !isPlanner;
      },
    },
    {
      label: "Upload Files",
      tooltip: "Add/Edit SO Details",
      onClick: (rowData) => {
        setOpen(true);
        getSoAttachmentsFn(rowData);
        // setSelectedRow(rowData);
        setSoObj(rowData);
      },
      hidden: () => {
        return !isPlanner;
      },
      tooltip: "Edit SO Details",
    },
    // {
    //   label: "View",
    //   onClick: (rowData) => {
    //     setOpenView(true);
    //     setSoObj(rowData);
    //   },
    //   tooltip: "View SO Details",
    // },
    {
      label: "View Scrutiny",
      onClick: (rowData) => {
        setViewScrutiny(true);
        setValueId(rowData?.id);
        setSoObj(rowData);
      },
      tooltip: "View SO Scrutiny Details",
    },
  ];

  const [columns] = useState([
    // {
    //   title: "EP Code",
    //  field: "partNo",
    // },
    // {
    //   title: "Order Master No.",
    //   field: "fileNo",
    // },
    {
      title: "SO/PO Number",
      field: "orderNo",
    },
     {
      title: "Inspection Agency",
      field: "inspectionAuthName",
    },
    // user_role === USER_ROLE_ID?.ROLE_GIC && departmentTypeId === USER_DEPARTMENT.ASSEMBLY
    // ? {
    //     title: "EP Code",
    //     field: "partNo",
    // }:undefined,
    
    {
      title: "SO/PO Date",
      field: "orderDate",
      render: (el) => (el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : "NA"),
    },

 
    {
      title: "Receipt Date",
      field: "receiptDate",
      render: (el) => (el?.receiptDate ? moment(el?.receiptDate).format("DD-MM-yyyy") : "NA"),
    },

    // {
    //   title: "Qty",
    //   // field: "orderNo",
    // },

    // departmentTypeId === USER_DEPARTMENT.PLANNING
    //   ? {
    //       title: "SO-WO mapping",
    //       field: "mapper",
    //       render: (rowData) => {
    //         return (
    //           <ActionButton
    //             size="small"
    //             color="secondary"
    //             variant="outlined"
    //             onClick={() => {
    //               setOpenSoWoMapper(true);
    //               setSelectedRow(rowData);
    //             }}
    //           >
    //             SO-WO Map
    //           </ActionButton>
    //         );
    //       },
    //     }
    //   : undefined,
    // {
    //   title: "Inspection Agency",
    //   field: "organizationName",
    // },
    // user_role === USER_ROLE_ID?.ROLE_PLANNER
    //   ? {
    //     title: "LineItems",
    //     field: "view",
    //     width: "auto",
    //     filtering:false,
    //     render: (row) => <AddLineItems soObj={row} fetchSO={fetchSO} />,
    //   }
    //   : undefined,

    // {
    //   title: "FileClosingForm",
    //   field: "fileClosingForm",
    //   render: (el) => {
    //     return (
    //       <ActionButton
    //         size="small"
    //         className={classes.fcm}
    //         variant="outlined"
    //         disabled={el.isClosed ? false : true}
    //         onClick={() => {
    //           setFileClosing(true);
    //           setFileId(el);
    //         }}
    //       >
    //         FileClosingForm
    //       </ActionButton>
    //     );
    //   },
    // },
{
  title: "SO Status",
  field: "soStatusNo",
  render: (el) => {
 
    let displayValue = el.soStatusNo;

    if (el.soStatusNo === "Notified_to_HOSA") {
   
      displayValue = isHosa ? "Received" : "Notified"; 
      
   
    } else if (el.soStatusNo === "Notified_to_GICA") {
      displayValue = "Notified";
    }

   
    return <StatusChips status={displayValue} />;
  },
},
    {
      title: "Is SO/PO Active",
      field: "status",
      render: (el) => (el?.status === "Active" ? <Active /> : el?.status === "Inactive" ? <InActive /> : ""),
    },
    user_role === USER_ROLE_ID?.ROLE_PLANNER
    ? {
      title: "LineItems",
      field: "view",
      width: "auto",
      filtering:false,
      render: (row) => <AddLineItems soObj={row} fetchSO={fetchSO} />,
    }
    : undefined,

    {
      title: "View",
      field: "view",
      width: "auto",
      filtering: false,
      render: (rowData) => {
        return (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => {
              setOpenView(true);
              setSoObj(rowData);
            }}
            title="View so/po Details"
            style={{width:"120px"}}
          >
            SO Details
          </ActionButton>
        );
      },
    },

  ]);

  const detailPanel = [
    {
      tooltip: "View",
      render: (rowData) => {
        return (
          <div
            style={{
              border: "1px solid #43A047",
              maxWidth: 1400,
              marginInline: "auto",
            }}
          >
            <OLViewLI data={rowData} />
          </div>
        );
      },
    },
  ];
    const roleId = loggedInUser?.roleId;
  // const fetchSO = () => {
  //    setLoading(true);
  //   if (isPlanner && departmentId === USER_DEPARTMENT.PLANNING) {
  //     getAllSupplyOrdersBySalesGrpOptimized(empId)
  //       .then((data) => {
  //         setRecords(data);
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //       });
  //   } else {
  //     axiosInstance(`supplyOrder/getAllotedSupplyOrdersBySalesGrp/${empId}/${salesGrpId}`)
  //       .then(({ data }) => {
  //         setRecords(data);
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //       });
  //   }
  // };
const fetchSO = (selectedStatusId = null) => {
  let url = "";


console.log(selectedStatusId,"selectedStatusId")
  // 1. Prepare the status parameter
  const statusParam = selectedStatusId 
    ? `?statusIds=${selectedStatusId}` 
    : `?statusIds=${defaultStatus}`;

url = isPlanner 
  ? `supplyOrder/getAllSupplyOrdersBySalesGrpOptimized/${empId}/${statusParam}`
  : `supplyOrder/getAllotedSupplyOrdersBySalesGrp/${empId}/${salesGrpId}/${statusParam}`;

  setLoading(true);
  axiosInstanceTran(url)
    .then(({ data }) => {
      setRecords(data);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => setLoading(false));
};

  useEffect(() => {
    fetchSO();
  }, []); 
  const getSoAttachmentsFn = (rowData) => {
    getSoAttachments(rowData?.id)
      .then((res) =>
        setSoObj({
          ...rowData,
          qapFiles: res?.qapFiles,
          drawings: res?.drawings,
          atpFiles: res?.atpFiles,
          attachments: res?.attachments,
          amendments: res?.amendments,
          poFiles: res?.poFiles,
        })
      )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSO();
  }, []);

  useEffect(() => {
    if (isSubmit) {
      fetchSO();
    }
  }, [isSubmit]);

  // const displayForm = () => {
  //   setOpenForm((current) => !current);
  //   setOpenForm(true);
  // };

  const getSoBySoId = (soId) => {
    axiosInstance
      .get(ViewSoScrutiny + soId)
      .then((res) => setFormData(res?.data))
      .catch((err) => console.log("so fetch error", err));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = myFile;
    link.download = "SO Excel.xlsx";
    link.click();
  };

  const handleViewScrutiny = (soId) => {
    setValueId(soId);
    setViewScrutiny(true);
  };

  return (
    <>
      {user_role === USER_ROLE_ID.ROLE_FIRM_ADMIN || user_role === USER_ROLE_ID.ROLE_PLANNER ? (
        <div style={{ display: "flex", gap: 8, marginBottom: 8, justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <SbuSoImport setIsSubmit={setIsSubmit} fetchSO={fetchSO} />

            <SbuCreateSo setIsSubmit={setIsSubmit} fetchSO={fetchSO} />
          </div>
          {/* <Button variant="contained" color="primary" size="small" onClick={handleDownload}>
            Download SO Template
          </Button> */}
        </div>
      ) : null}

      <Dialog fullWidth maxWidth={"lg"} open={openSubmissionSlip}>
        <DialogTitle onClose={() => setOpenSubmissionSlip(false)}>Create Submission Slip</DialogTitle>
        <DialogContent>
          <InStageSO soObj={selectedRow} />
        </DialogContent>
      </Dialog>

      {openSoWoMapper && <ProjectDetailsTable onClose={() => setOpenSoWoMapper(false)} selectedRow={selectedRow} />}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns.filter((c) => c)}
         title={<FilterStatusChips filterStatus={filterStatus} handleCheckboxChange = {handleCheckboxChange} configs={statusConfigs}/>}
        options={{
          filtering: true,
          rowStyle: (rowData) => ({
            backgroundColor: rowData.id === selectedRow.id ? "#e3f2fd" : "white",
          }),
        }}
        actions={[
          (rowData) => ({
            icon: () => (
              <ActionButton variant="contained" color="secondary">
                <FontAwesomeIcon icon={faBell} />
              </ActionButton>
            ),
            // hidden: user_role === USER_ROLE_ID.ROLE_QA,
            tooltip: "Notify",
            onClick: (event, rowData) => {
                setSoObj(rowData);
                setOpenAllot(true);
            },
            hidden: isGicFromAssembly,
          }),
          (data) => ({
            icon: (el) => <MoreActionButtons actions={actions} rowData={data} />,
          }),
        ]}
        detailPanel={!isPlanner && detailPanel}
      />
      {openForm && (
        <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
          {<SODetailsForm soObj={formData} open={openForm} setOpen={setOpenForm}  fetchSO={ fetchSO} getSoBySoId={getSoBySoId} />}
        </Grid>
      )}
      {openAllot && (
        <AllotSo
          onClose={() => {
            setOpenAllot(false);
            setSoObj({});
          }}
          soObj={soObj}
          refresh={fetchSO}
        />
      )}
      {open && <SbuSoForm setOpen={setOpen} soObj={soObj} fetchSO={fetchSO} getSoAttachmentsFn={getSoAttachmentsFn} />}
      {openView && <SbuViewSO open={openView} setOpen={setOpenView} soObj={soObj} />}
      {openDialog ? <FCMView open={openDialog} setOpen={setOpenDialog} idVal={val} /> : null}
      {dialog ? <FclView open={dialog} setOpen={setDialog} soId={id} /> : null}
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      {view && <ViewScrutiny open={view} setOpen={setView} soObj={soObj} />}
      {fileClosing && <ViewFileClosing open={fileClosing} setOpen={setFileClosing} soObj={fileId} />}
      {viewScrutiny && (
        <Dialog open={viewScrutiny} onClose={() => setViewScrutiny(false)} maxWidth="lg" fullWidth>
          <SOTenderContract inObj={soObj} onClose={() => setViewScrutiny(false)} />
          <DialogActions>
            <Button variant="contained" color="secondary" onClick={() => setViewScrutiny(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const MoreActionButtons = ({ rowData, actions }) => {
  const classes = useStyles();
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
        disableScrollLock
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.popoverRoot }}
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
            style={{
              display: el?.hidden && el?.hidden(rowData) ? "none" : "block",
              textAlign: "left",
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
