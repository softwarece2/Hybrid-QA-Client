/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tooltip from "@material-ui/core/Tooltip";
//globals
import { DEPARTMENT_ID, USER_ROLE_ID, WING_ID } from "../../../Globals.js";

//pages

//component
import TableComponent from "components/table/index";
//material-ui
import { MenuItem, Popover, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from "@material-ui/icons/Notifications";
//redux
import { NotifyCqaeAndJcqaoByOL } from "Redux/Actions/SupplyOrder/OLAction";
//icons
import { MoreVert, Notifications } from "@material-ui/icons";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";

import { selectItem } from "Redux/Actions/SelectTreeItem";
// import Qcc from "./QACL/qcc";
import { saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { toast } from "react-toastify";
import QcCheck from "./QcCheck.js";
import NotifyOrAllot from "pages/SOModule/InStageQC/SubmittedSO/NotifyOrAllot.js";
import OLViewScrutiny from "pages/SOModule/OL/OLViewScrutiny";
import Edit from "../../SOModule/OL/Edit.js";
import SampleSelection from "pages/QACLScrutiny/SampleSelection.js";
export default function QACLTable() {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const empId = loggedInUser?.empId;
  const roleId = loggedInUser?.roleId;
  const salesGrpId = loggedInUser?.salesGrpId;
  const departmentId = loggedInUser?.departmentId;
  const orgId = loggedInUser?.orgId;
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [openView, setOpenView] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataVal, setDataVal] = useState(false);
  const [openNotifyOrAllot, setOpenNotifyOrAllot] = useState(false);

  const [columns] = useState([
    isArmy
      ? { title: "Submission Slip No.", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    {
      title: "Detailed Nomenclature",
      field: "projectName",
      width: "auto",
    },
    { title: "Offered Date", field: "offerDate", width: "auto" },
    { title: "Supply Order", field: "soNumber", width: "auto" },
    { title: "Work Order No.", field: "saleOrderNoStr", width: "auto" },
    // {
    //   title: "Level of Inspection",
    //   field: "inspectionLevelStr",
    //   width: "auto",
    // },
    // { title: "Status", field: "olStatus", width: "auto",render: rowData =>

    //   rowData?.olStatus && <Button variant='text' style={{ background: getColor(rowData.olStatus), color: 'white', textTransform: 'unset',fontSize:'12px'}}>{rowData.olStatus}</Button>},
  ]);

  const getOlData = () => {
    let url =
      "subSlip/getAllottedSubSlipsByStatusForFirm/" + orgId + "/" + empId;

    if (
      roleId === USER_ROLE_ID.ROLE_GIC &&
      departmentId === DEPARTMENT_ID.ASSEMBLY
    ) {
      url = "offerLetter/getOfferLettersBySalesGrpId?salesGrpId=" + salesGrpId;
    }
    if (
      (roleId === USER_ROLE_ID.ROLE_GIC ||
        roleId === USER_ROLE_ID.ROLE_EXAMINER) &&
      departmentId === DEPARTMENT_ID.QC
    ) {
      url =
        "subSlip/getAllottedSubSlipsByStatusForFirm/" +
        orgId +
        "/" +
        empId;
    }

    if (roleId === USER_ROLE_ID.ROLE_HOD && departmentId === DEPARTMENT_ID.QC) {
      url =
        "offerLetter/getNotifiedOfferLettersByStatusForFirm/" +
        orgId +
        "/" +
        empId;
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
            <Edit soObj={rowData} getOlData={getOlData} />
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
      } catch (error) {
        toast.error("Failed to notify, please try again");
      }
    } else {
      setDataVal(rowData);
      setOpenNotifyOrAllot(true);
    }
  }

  const updatedAction = [
    {
      label: "QCC  Check",
      onClick: (rowData) => {
        dispatch(selectItem(<QcCheck row={rowData} />));
      },
      tooltip: "QCC  Check",
    },
    {
      label: "I-Note",
      onClick: (rowData) => {
        dispatch(selectItem(<QcCheck row={rowData} />));
      },
      tooltip: "I-Note",
    },
    {
      label: "Sample Selection",
      onClick: (rowData) => {
        dispatch(selectItem(<SampleSelection rowData={rowData} />));
      },
      tooltip: "Sample Selection",
    },
  ];

  const actions = [
    {
      icon: (el) => (
        <Tooltip title="Notify OIC">
          <IconButton
            variant="contained"
            color="primary"
            title="Notify OIC"
            size="small"
            // disabled={data?.isNotified || data?.isGcc}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      ),
      onClick: (_, el) => {
        if (!el?.isNotified) {
          dispatch(NotifyCqaeAndJcqaoByOL(el?.id, empId)).then((res) =>
            getOlData()
          );
          console.log("Notification dispatched");
        }
      },
    },

    {
      icon: (el) => (
        <IconButton
          variant="contained"
          color="primary"
          title="Notify/Allot"
          size="small"
        >
          <Notifications />
        </IconButton>
      ),
      onClick: (_, rowData) => {
        handleNoti(rowData);
      },
    },

    (data) => ({
      icon: (el) => (
        <MoreActionButtons actions={updatedAction} rowData={data} />
      ),
    }),
  ];

  return (
    <>
      {openNotifyOrAllot && (
        <NotifyOrAllot
          onClose={() => setOpenNotifyOrAllot(false)}
          selectedRow={dataVal || {}}
          refresh={() => {}}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title={""}
        actions={actions}
        detailPanel={detailPanel}
      />

      {openView && <OLViewScrutiny open={openView} setOpen={setOpenView} />}
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
