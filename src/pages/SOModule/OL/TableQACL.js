/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from "@material-ui/core/Tooltip";
//globals
import { DEPARTMENT_ID, ORG_TYPE, USER_DEPARTMENT, USER_ROLE_ID, WING_ID } from "../../../Globals";

//pages

//component
import TableComponent from "components/table/index";
import Button from "../../../components/Button";
//material-ui
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { Dialog, MenuItem, Popover, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import NotificationsIcon from "@material-ui/icons/Notifications";

//redux
import { NotifyCqaeAndJcqaoByOL } from "Redux/Actions/SupplyOrder/OLAction";

//icons
import { MoreVert, Notifications } from "@material-ui/icons";
import Delete from "@material-ui/icons/Delete";
import OLViewScrutiny from "pages/SOModule/OL/OLViewScrutiny";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Edit from "./Edit";
import OLDelete from "./OLDelete";
import OLEdit from "./OLEdit";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { DialogContent, DialogTitle } from "Utils";
import InStageSO from "../InStageQC/InStageSO/InStageSO";
import NotifyOrAllot from "../InStageQC/SubmittedSO/NotifyOrAllot";
import QcCheck from "../../OL/QAR/QcCheck";
import { selectItem } from "Redux/Actions/SelectTreeItem";
// import Qcc from "./QACL/qcc";
import { saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { toast } from "react-toastify";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CqaiNotify from "pages/OL/CqaiNotify/CqaiNotify";

export default function TableQACL({IsOl}) {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;
  const salesGrpId = loggedInUser?.salesGrpId;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const isQA = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY
  const orgId = loggedInUser?.orgId;
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [openView, setOpenView] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDel, setOpenDel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataVal, setDataVal] = useState(false);
  const [openNotifyOrAllot, setOpenNotifyOrAllot] = useState(false);
   const [soObj, setSoObj] = useState();
const[CqaiNotifys,setCqaiNotify]=useState()
  const [columns] = useState([
    { title: "Epcode", field: "epCode", width: "auto" },
    isArmy ? { title: "Offer Letter No.", field: "olNumber", width: "auto" } : { title: "OL Number", field: "olNumber", width: "auto" },
     { title: "Offered Date", field: "offerDate", width: "auto" },
    {
      title: "Detailed Nomenclature",
      field: "nomenclature",
      width: "auto",
    },
   
    { title: "Supply Order", field: "soNumber", width: "auto" },
    { title: "Work Order No.", field: "workOrderNo", width: "auto" },

    (loggedInUser?.roleId !== USER_ROLE_ID?.ROLE_DOA &&   {
      title: "Notify",
      field: "allot",
      filtering:false,
      render: (rowData) => {
        return (
          <ActionButton
            variant="contained"
            color="secondary"
            alignItems="center"
 
            onClick={(event) => {
              setSoObj(rowData);
              setCqaiNotify(true);
            }}
          >
          <FontAwesomeIcon icon={faBell} />
          </ActionButton >
        );
      },
      width: "auto",
    }),
    // {
    //   title: "Level of Inspection",
    //   field: "inspectionLevelStr",
    //   width: "auto",
    // },
    // { title: "Status", field: "olStatus", width: "auto",render: rowData =>

    //   rowData?.olStatus && <Button variant='text' style={{ background: getColor(rowData.olStatus), color: 'white', textTransform: 'unset',fontSize:'12px'}}>{rowData.olStatus}</Button>},
  ]);

  // const fetchSO = () => {
  //   setLoading(true);
  //   dispatch(getAllSOBySalesGrp(empId))
  //     .then(() => {
  //       setLoading(false);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       setLoading(false);
  //     });
  // };

  const getOlData = () => {
    let url = "offerLetter/getOfferLettersByStatusForFirm/" + orgId + "/" + empId;

    if (!isQA) {
      url = "offerLetter/getOfferLettersBySalesGrpId?salesGrpId=" + salesGrpId;
    }
    // if (
    //   (roleId === USER_ROLE_ID.ROLE_GIC ||
    //     roleId === USER_ROLE_ID.ROLE_EXAMINER) &&
    //   departmentId === DEPARTMENT_ID.QC
    // )
    else {
      url = "offerLetter/getAllottedOfferLettersByStatusForFirm/" + orgId + "/" + empId;
    }

    // if (roleId === USER_ROLE_ID.ROLE_HOS && departmentId === DEPARTMENT_ID.QC) {
    //   url =
    //     "offerLetter/getNotifiedOfferLettersByStatusForFirm/" +
    //     orgId +
    //     "/" +
    //     empId;
    // }

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
            <Edit soObj={rowData} getOlData={getOlData} IsOl={IsOl} />
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
      (roleId === USER_ROLE_ID?.ROLE_HOS || roleId === USER_ROLE_ID?.ROLE_GIC) && departmentId === DEPARTMENT_ID.ASSEMBLY
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

    (data) => ({
      icon: (el) => (
        <IconButton variant="contained" color="primary" title="Notify/Allot" size="small" disabled={data?.isNotified}>
          <Notifications />
        </IconButton>
      ),
      onClick: (_, rowData) => {
        handleNoti(rowData);
      },
      disabled: data?.isNotified || data?.isGcc,
      hidden: loggedInUser?.roleId === USER_ROLE_ID.ROLE_EXAMINER || loggedInUser?.roleId === USER_ROLE_ID.ROLE_DO,
    }),

    // (data) =>
    //   (loggedInUser?.roleId === USER_ROLE_ID.ROLE_GIC ||
    //     loggedInUser?.roleId === USER_ROLE_ID.ROLE_HOS||loggedInUser?.roleId === USER_ROLE_ID.ROLE_EXAMINER) &&
    //   loggedInUser?.departmentId === USER_DEPARTMENT.ASSEMBLY
    //     ? null
    //     : {
    //         icon: (el) => (
    //           <MoreActionButtons actions={moreActions} rowData={data} />
    //         ),
    //       },
  ];

  return (
    <>
      {openNotifyOrAllot && (
        <NotifyOrAllot
          onClose={() => setOpenNotifyOrAllot(false)}
          selectedRow={dataVal || {}}
         dataVal={soObj}
          refresh={() => {
            getOlData();
          }}
        />
      )}
      {CqaiNotifys&&(
<CqaiNotify onClose={() => setCqaiNotify(false)}
          selectedRow={dataVal || {}}
         dataVal={soObj}
          refresh={() => {
            getOlData();
          }}/>
      )
        
      }
      {roleId === USER_ROLE_ID?.ROLE_FIRM_ADMIN || (roleId === USER_ROLE_ID?.ROLE_GIC && loggedInUser.departmentId == "2") ? (
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
            {/* <Button variant="contained" color="primary" size="small" onClick={handleDownload}>
              Download OL Excel
            </Button> */}
          </div>
        </div>
      ) : null}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title={""}
        // actions={actions}
        detailPanel={detailPanel}
      />

      {openView && <OLViewScrutiny open={openView} setOpen={setOpenView} />}

      {openDel && <OLDelete open={openDel} onClose={() => setOpenDel(false)} dataVal={dataVal} fetchRecords={getOlData} />}
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
