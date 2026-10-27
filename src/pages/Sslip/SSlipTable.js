/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from "@material-ui/core/Tooltip";
//globals
import { DEPARTMENT_ID, USER_DEPARTMENT, USER_ROLE_ID, WING_ID } from "../../Globals";

//pages

//component
import TableComponent from "components/table/index";
import Button from "../../components/Button";
//material-ui
import { Checkbox, Dialog, FormControlLabel, Input, MenuItem, Popover, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import NotificationsIcon from "@material-ui/icons/Notifications";

//redux
import { NotifyCqaeAndJcqaoByOL } from "Redux/Actions/SupplyOrder/OLAction";

//icons
import { MoreVert, Notifications } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import OLViewScrutiny from "pages/SOModule/OL/OLViewScrutiny";
import { useGetCommonActionMenus } from "../../hook/useGetCommonActionMenus";
import Edit from "../SOModule/OL/Edit";
import OLDelete from "../SOModule/OL/OLDelete";
import OLEdit from "../SOModule/OL/OLEdit";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { DialogContent, DialogTitle, StatusChips } from "Utils";
import InStageSO from "../SOModule/InStageQC/InStageSO/InStageSO";
import NotifyOrAllot from "../SOModule/InStageQC/SubmittedSO/NotifyOrAllot";
import QcCheck from "../OL/QAR/QcCheck";
import { selectItem } from "Redux/Actions/SelectTreeItem";
// import Qcc from "./QACL/qcc";
import { getAllotSubordinate, saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { toast } from "react-toastify";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotifySubmissionslip from "../SOModule/SupplyOrderDetails/NotifySubmissionslip/NotifySubmissionslip";
import moment from "moment";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AllotSubordinateDialog from "../SOModule/Allot/AllotSubordinateDialog";
import AllotQa from "../SOModule/InStageQC/AllotQa/AllotQa";
import Active from "components/Active";
import InActive from "components/InActive";
import DeleteT from "./DeleteT";
import EditT from "./EditT";
import { getSubSlipDetails, getWarrantDataForTCreation } from "pages/Services/URLs";
import FilterStatusChips from "../../components/FilterStatusChips";
import ApprovalCycleSslip from "pages/ApprovalCycleOL/ApprovalCycleSslip";
import ApprovalRemarksForm from "pages/ApprovalCycleOL/ApprovalRemarksForm";

export default function SSlipTable({isSample,isSampleInsp}) {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;
  const salesGrpId = loggedInUser?.salesGrpId;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const orgId = loggedInUser?.orgId;
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [openView, setOpenView] = useState(false);
  const [records, setRecords] = useState([]);
  const [records1, setRecords1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [soObj, setSoObj] = useState({});
  const [openAllot, setOpenAllot] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataVal, setDataVal] = useState(false);
  const [openNotifyOrAllot, setOpenNotifyOrAllot] = useState(false);
  const [openAllotDialogue, setOpenAllotDialogue] = useState(false);
  const [idVal, setIdVal] = useState(null);
  const [soDetails, setSoDetails] = useState("")
  const [rowRoleId, setRowRoleId] = useState(null);
  const [openSubmissionSlip, setOpenSubmissionSlip] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [warrants, setWarrants] = useState({});
  const [subSlipDetails, setSubSlipDetails] = useState({});
  const handleClickOpen = () => {
    setOpen(true);
  };
  const isHosqc =  (loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS || loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC) && loggedInUser.departmentTypeId === USER_DEPARTMENT.QC;
  const isqc=(loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS || loggedInUser.roleId === USER_ROLE_ID.ROLE_GIC || loggedInUser.roleId === USER_ROLE_ID.ROLE_EXAMINER) && loggedInUser.departmentTypeId === USER_DEPARTMENT.QC;
  const isSpecialRole = (roleId === USER_ROLE_ID.ROLE_GIC || roleId === USER_ROLE_ID.ROLE_HOS) && departmentTypeId === DEPARTMENT_ID.ASSEMBLY;
  const isDOA = (roleId === USER_ROLE_ID.ROLE_DOA && departmentTypeId === DEPARTMENT_ID.ASSEMBLY);
  const subslip=true;
  const [openRemarksForm, setOpenRemarksForm] = useState(false);
   
  const [columns] = useState([
    { title: "Ep Code", field: "epCode", width: "auto" },

    isArmy ? { title: "Submission Slip No.", field: "olNumber", width: "auto" } : { title: "OL Number", field: "olNumber", width: "auto" },
    // {
    //   title: "Nomenclature",
    //   field: "nomenclature",
    //   width: "auto",
    // },
    { title: "Inspection Agency", field: "inspAuthority", width: "auto" },
    // isArmy ? { title: "Submission Slip No.", field: "olNumber", width: "auto" } : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "Submission Slip Date", field: "offerDate", width: "auto" },
    { title: "Supply Order", field: "soNumber", width: "auto" },
    { title: "Work Order No.", field: "workOrderNo", width: "auto" },
    { title: "Warrant No.", field: "warrant", width: "auto" },
    // { title: "Alloted To", field: "allotedToName", width: "auto" },
    { title: "S.Slip Status", field: "olStatus", render: (el) => <StatusChips status={el.olStatus} /> },
    ...(!isHosqc ? [] : [ 
      {
        title: "Allot",
        field: "allot",
        filtering: false,
        render: (rowData) => (
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<SupervisorAccountIcon />}
            onClick={(event) => {
              setSoObj(rowData);
              setOpenAllotDialogue(true);
            }}
          >
            Allot
          </ActionButton>
        ),
        width: "auto",
      },
    ]),
    (isqc && ({
      title:"Approval Cycle",
      field:"approvalcycle",
      filtering: false,
      render: (rowData) => (
        <ActionButton
          variant="contained"
          color="primary"
          style={{width:"130px"}}
          onClick={(event) => {
            setOpenRemarksForm(true);
            // setSubSlipDet(rowData);
            
            dispatch(selectItem(<ApprovalCycleSslip subslip={subslip} sslip={rowData} />))
          }}
        >
          Approval Cycle
        </ActionButton>
      ),
      width:"auto"
    }))
  // More columns...


    // {
    //   title: "Level of Inspection",
    //   field: "inspectionLevelStr",
    //   width: "auto",
    // },
    // { title: "Status", field: "olStatus", width: "auto",render: rowData =>

    //   rowData?.olStatus && <Button variant='text' style={{ background: getColor(rowData.olStatus), color: 'white', textTransform: 'unset',fontSize:'12px'}}>{rowData.olStatus}</Button>},
  ]);



  const statusConfigs = [
    { id: 'created', label: 'Created', color: '#ff9800', lightBg: '#fff3e0' },
    { id: 'in-progress', label: 'In progress', color: '#f44336', lightBg: '#ffebee' },
    { id: 'completed', label: 'Completed', color: '#4caf50', lightBg: '#e8f5e9' },
  ];

  const statusIdMap = {
    "created": "14",
    "in-progress": "5",
    "completed": "7"
  };

  const handleCheckboxChange = (statusKey) => {
    setFilterStatus((prev) => {
      let newFilters;
      
      if (prev.includes(statusKey)) {
        if (prev.length === 1) return prev; 
        newFilters = prev.filter((item) => item !== statusKey);
      } else {
        newFilters = [...prev, statusKey];
      }

      triggerApiFetch(newFilters, statusIdMap);
      return newFilters;
    });
  };
 

const triggerApiFetch = (activeKeys, statusMap) => {
  const selectedIds = activeKeys.map(key => statusMap[key]);
  if (selectedIds.length === 0) {
    getOlData();
  } else {
    getOlData(selectedIds.join(','));
  }
};
//   const getOlData = (statusId) => {
//     let url = "subSlip/getAllottedSubSlipsByStatusForFirm/" + orgId + "/" + empId;

//     if (roleId === USER_ROLE_ID.ROLE_GIC && departmentTypeId === DEPARTMENT_ID.ASSEMBLY || roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.ASSEMBLY) {
//  url = `subSlip/getSubSlipBySalesGrpId?salesGrpId=${salesGrpId}&statusIds=${statusId}`;
//     }
//     // if (
//     //   (roleId === USER_ROLE_ID.ROLE_GIC ||
//     //     roleId === USER_ROLE_ID.ROLE_EXAMINER) &&
//     //   departmentId === DEPARTMENT_ID.QC
//     // )
//     else {
//       url = "subSlip/getAllottedSubSlipsByStatusForFirm/" + orgId + "/" + empId;
//     }

//     // if (roleId === USER_ROLE_ID.ROLE_HOS && departmentId === DEPARTMENT_ID.QC) {
//     //   url =
//     //     "offerLetter/getNotifiedOfferLettersByStatusForFirm/" +
//     //     orgId +
//     //     "/" +
//     //     empId;
//     // }

//     setLoading(true);
//     axiosInstanceTrans(url)
//       .then(({ data }) => {
//         setRecords(data);
//         // fetchAllotSO()
//       })
//       .catch((e) => {
//         console.log(e);
//       })
//       .finally(() => setLoading(false));
//   };




// Update the function signature to accept an optional parameter
const getOlData = (selectedStatusId = null) => {
  let url = "";

  const isDOA = (roleId === USER_ROLE_ID.ROLE_DOA && departmentTypeId === DEPARTMENT_ID.ASSEMBLY);          // modified by Sanjay MP on 29.07.2026
  
  const isSpecialRole = (roleId === USER_ROLE_ID.ROLE_GIC || roleId === USER_ROLE_ID.ROLE_HOS) && 
                        departmentTypeId === DEPARTMENT_ID.ASSEMBLY;

                        
  const isQCSpecialRole = (roleId === USER_ROLE_ID.ROLE_EXAMINER ||roleId ===  USER_ROLE_ID.ROLE_HOS  || roleId === USER_ROLE_ID.ROLE_GIC) && 
                        departmentTypeId === DEPARTMENT_ID.QC;

  if (isSpecialRole || isQCSpecialRole) {
    if (selectedStatusId) {
      // This will now handle "14,3" or "7" etc.
      url = `subSlip/getSubSlipBySalesGrpIdEmpId?salesGrpId=${salesGrpId}&statusIds=${selectedStatusId}`;
    } else {
      url = `subSlip/getSubSlipBySalesGrpIdEmpId?salesGrpId=${salesGrpId}&statusIds=14,5`;
    }
  } else if (isDOA){
    if (selectedStatusId) {
      // This will now handle "14,5" or "7" etc.
      url = `subSlip/getSubSlipBySalesGrpIdForDOA?roleId=${roleId}&salesGrpId=${salesGrpId}&statusIds=${selectedStatusId}`; // modified by Sanjay MP on 29.07.2026
    } else {
      url = `subSlip/getSubSlipBySalesGrpIdForDOA?roleId=${roleId}&salesGrpId=${salesGrpId}&statusIds=14,5`;
    }
  }
   else {
    url = `subSlip/getAllottedSubSlipsByStatusForFirm/${orgId}/${empId}`;
  }
 
  setLoading(true);
  axiosInstanceTrans(url)
    .then(({ data }) => {
      setRecords(data);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => setLoading(false));
};
  useEffect(() => {
    getOlData();
    // fetchSO();
  }, []);

  console.log(records, "soObj")

  const detailPanel = [
    {
      tooltip: "View",
      render: (rowData) => {
        return (
          <div
            style={{
              border: "1px solid lightgrey",
              maxWidth: 1400,
              marginInline: "auto",
            }}
          >
            <Edit soObj={rowData} getOlData={getOlData} isSample={isSample} isSampleInsp={isSampleInsp}/>
          </div>
        );
      },
    },
  ];
  const isDO = roleId === USER_ROLE_ID.ROLE_DO;

  async function handleNoti(rowData) {
    if (isDO) {
      try {
        const data = {
          offerLetterId: rowData?.id,
          offerLetterName: rowData?.olNumber,
          allotedBy: loggedInUser?.empId,
          allotedTo: [loggedInUser?.reportingOfficerId],
          isDeligation: false,
        };
        await saveAllotOlSubordinate(data);
        toast.success("Successfully notified QA Agency");
        getOlData();
      } catch (error) {
        toast.error("Failed to notify, please try again");
      }
    } else {
      setDataVal(rowData);
      setOpenNotifyOrAllot(true);
    }
  }

  const actions = [
    (data) =>
      roleId === USER_ROLE_ID?.ROLE_FIRM_ADMIN
        ? {
          icon: (el) => (
            <Tooltip title="Notify OIC">
              <IconButton variant="contained" color="primary" title="Notify OIC" size="small" disabled={data?.isNotified || data?.isGcc}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          ),
          onClick: (_, el) => {
            if (!el?.isNotified) {
              dispatch(NotifyCqaeAndJcqaoByOL(el?.id, empId)).then((res) => getOlData());
              console.log("Notification dispatched");
            }
          },
          disabled: data?.isNotified || data?.isGcc,
        }
        : null,
    (data) =>
      roleId === USER_ROLE_ID?.ROLE_FIRM_ADMIN || roleId === USER_ROLE_ID?.ROLE_QA
        ? {
          icon: (el) => (
            <IconButton
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                if (el) {
                  setDataVal(el);
                  setOpenEdit(true);
                } else {
                  console.error("Selected record is null or undefined");
                }
              }}
            >
              <EditIcon />
            </IconButton>
          ),
          onClick: (event, el) => {
            if (el) {
              setDataVal(el);
              setOpenEdit(true);
            } else {
              console.error("Selected record is null or undefined");
            }
          },
        }
        : null,

    (data) =>
      (roleId === USER_ROLE_ID?.ROLE_HOS || roleId === USER_ROLE_ID?.ROLE_GIC) && departmentTypeId === DEPARTMENT_ID.ASSEMBLY
        ? {
      icon: () => (
        <ActionButton variant="contained" color="secondary">
          <FontAwesomeIcon icon={faBell} />
        </ActionButton>
      ),
      tooltip: "Notify",
      onClick: (event, rowData) => {
        setSoObj(rowData);

        setOpenAllot(true);
      },
      
    }:null,
    (rowData) =>
      (roleId === USER_ROLE_ID?.ROLE_HOS || roleId === USER_ROLE_ID?.ROLE_GIC) && departmentTypeId === DEPARTMENT_ID.ASSEMBLY
      ? {
      icon: () => (
        <ActionButton variant="contained" color="secondary" startIcon={<EditIcon />}>
          Edit
        </ActionButton>
      ),
      tooltip: "Edit",
      onClick: (event) => {
        // setSoObj(rowData);

        setOpenSubmissionSlip(true);
        setSelectedRow(rowData);
        handleClick(rowData);
        fetchsubSlipDetails(rowData);
        //   setOpenAllot(true);
      },
    }:null,
    (data) =>
      (roleId === USER_ROLE_ID?.ROLE_HOS || roleId === USER_ROLE_ID?.ROLE_GIC) && departmentTypeId === DEPARTMENT_ID.ASSEMBLY
        ? {
          icon: (el) => (
            <IconButton
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                setOpenDel(true);
                setDataVal(el);
              }}
            >
              <Delete />
            </IconButton>
          ),
          onClick: (event, el) => {
            setOpenDel(true);
            setDataVal(el);
          },
        }
        : null,

    // (data) => ({
    //   icon: (el) => (
    //     <IconButton variant="contained" color="primary" title="Notify/Allot" size="small" disabled={data?.isNotified}>
    //       <Notifications />
    //     </IconButton>
    //   ),
    //   onClick: (_, rowData) => {
    //     handleNoti(rowData);
    //   },
    //   disabled: data?.isNotified || data?.isGcc,
    //   hidden: loggedInUser?.roleId === USER_ROLE_ID.ROLE_EXAMINER || loggedInUser?.roleId === USER_ROLE_ID.ROLE_DO,
    // }),
  ];
 const handleClick = async (rowData) => {
    console.log("hgerh", rowData);
    try {
      setLoading(true);
      const { data } = await axiosInstanceTrans.get(
        `${getWarrantDataForTCreation}${rowData?.warrantId}`
      );
      console.log("data: ", data);
      setWarrants(data);
    } catch (error) {
      console.error("Error fetching updated line items:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchsubSlipDetails = async (rowData) => {
    console.log("hgerh", rowData);
    try {
      setLoading(true);
      const { data } = await axiosInstanceTrans.get(
        `${getSubSlipDetails}${rowData?.id}`
      );
      console.log("data: ", data);
      setSubSlipDetails(data);
    } catch (error) {
      console.error("Error fetching updated line items:", error);
    } finally {
      setLoading(false);
    }
  };
    const [filterStatus, setFilterStatus] = useState(["created", "in-progress"]);

  return (
    <>
    { openSubmissionSlip && (
        <EditT
        soObj={selectedRow}
       // selectedLI={selectedLI}
        warrants={warrants}
        sSlipDet={subSlipDetails}
        getOlData={getOlData}
        onClose={() => {
          setOpenSubmissionSlip(false);
        }}
      />
      )}
      {openNotifyOrAllot && (
        <NotifyOrAllot
          onClose={() => setOpenNotifyOrAllot(false)}
          selectedRow={dataVal || {}}
          refresh={() => {
            getOlData();
          }}
        />
      )}
      {openAllotDialogue && (
        <AllotQa
          onClose={() => setOpenAllotDialogue(false)}
        selectedRow={dataVal || {}}
           soObj={soObj}
       refresh={() => {
            getOlData();
          }}
        />
      )}  

      {openAllot && (
        <NotifySubmissionslip
          onClose={() => {
            setOpenAllot(false);
            setSoObj({});

          }}
          selectedRow={dataVal}
          soObj={soObj}
        // refresh={fetchSO}
        />
      )}
    

      {roleId === USER_ROLE_ID?.ROLE_FIRM_ADMIN || (roleId === USER_ROLE_ID?.ROLE_GIC && loggedInUser.departmentTypeId == "2") ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {/* <OLImport /> */}

            {/* <OLCreate /> */}
          </div>

          <div>
       
          </div>
        </div>
      ) : null}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title={<FilterStatusChips filterStatus={filterStatus} handleCheckboxChange = {handleCheckboxChange} configs={statusConfigs}/>}
        actions={isSpecialRole ? actions : undefined}
        detailPanel={detailPanel}
      />

      {openView && <OLViewScrutiny open={openView} setOpen={setOpenView} />}

      {openDel && <DeleteT open={openDel} onClose={() => setOpenDel(false)} dataVal={dataVal} fetchRecords={getOlData} />}
      {openEdit && <OLEdit open={openEdit} onClose={() => setOpenEdit(false)} dataVal={dataVal} fetchRecords={getOlData} />}
    </>
  );
}

export const MoreActionButtons = ({ rowData, actions }) => {
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
            style={{
              display: el.hidden ? el.hidden(rowData) && "none" : "block",
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
