/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";

//component
import TableComponent from "components/table/index";
import AxiosInstanceTransaction from "pages/Services/AxiosInstanceTransaction";
import { getInspectOLUrl } from "pages/Services/URLs";
import { USER_ROLE_ID, WING_ID } from "../../../Globals";

//material-ui
import { Button, IconButton, makeStyles, MenuItem, Popover, Typography } from "@material-ui/core";
import ScrutinyOL from "pages/Enclosures/Enclosure3/ScrutinyOL";
import ReturnOL from "pages/Enclosures/Enclosure4/ReturnOL";
import QINView from "pages/Enclosures/Enclosure8/QINView";
import QualityImprovementNote from "pages/Enclosures/Enclosure8/QualityImprovementNote";
import OLReview from "pages/SOModule/OL/OLReview";
import { useDispatch } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { INSPECT_OL_ID, INSPECT_OL_NUMBER } from "Redux/Types";

//icons
import QACLScrutiny from "pages/QACLScrutiny";

import ClearedLI from "./ClearedLI";
import QACLScrutinySpares from "pages/QACLScrutiny/scrutinySpares";
import { MoreVert, Visibility } from "@material-ui/icons";
import QaSpares from "pages/QASpares";
import ActionButton from "components/ActionButton";
import OLAllotTests from "pages/SOModule/OL/OLAllotTests";

import Edit from "pages/SOModule/OL/Edit";
import SampleSelection from "pages/QACLScrutiny/SampleSelection";

import FaiSamples from "pages/QACLScrutiny/OtherSample";
import ViewSample from "pages/QACLScrutiny/ViewSample";
import ViewOtherSample from "pages/QACLScrutiny/ViewOtherSample";
const useStyles = makeStyles((theme) => ({

  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
}));
export default function InspectOLTable({isSample,isSampleInsp}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDial, setOpenDial] = useState(false);
  const [obj, setObj] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [openOfferedQtyDialog, setOpenOfferedQtyDialog] = useState(false);
  const isqacl=false;
  const getInspectOL = () => {
    setLoading(true);

    AxiosInstanceTransaction.get(getInspectOLUrl + loggedInUser?.empId)
      .then(({ data }) => {
        // const consigneeIds = data.map((el) => el.consigneeId).filter(id => id);
        // if (consigneeIds.length > 0) {
        //   setConsigneeId(consigneeIds[0]);
        // }
        setRecords(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getInspectOL();
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
            <Edit soObj={rowData} getOlData={getInspectOL} qaSide isSample={isSample}isSampleInsp={isSampleInsp} isqacl={isqacl} />
          </div>
        );
      },
    },
  ];

  const getQIN = (rowData) => {
    setLoading(true);
    if (loggedInUser?.roleId === 7) {
      dispatch(selectItem(<QualityImprovementNote rowData={rowData} />));
    } else {
      dispatch(selectItem(<QINView rowData={rowData} />));
    }
  };

  const actions = [
    {
      label: "Edit",
      type: "General",
      onClick: (rowData) => {
        setOpenDial(true);
        setObj(rowData);
      },
      tooltip: "Edit OL Details",
    },
    {
      label: "Scrutiny",
      onClick: (rowData) => {
        dispatch(selectItem(<QACLScrutiny inObj={rowData} />));
        dispatch({
          type: INSPECT_OL_ID,
          payload: rowData?.id,
        });
        dispatch({
          type: INSPECT_OL_NUMBER,
          payload: rowData,
        });
      },
      tooltip: "Scrutiny",
      hidden: (rowData) => {
        return (
          rowData.soType !== "Main"
          //  ||
          // !(
          //   loggedInUser?.roleId === USER_ROLE_ID.ROLE_AE ||
          //   loggedInUser?.roleId === USER_ROLE_ID.ROLE_JE ||
          //   loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR
          // )
        );
      },
    },

    {
      label: "Scrutiny-S",
      type: "Spares",
      onClick: (rowData) => {
        dispatch(selectItem(<QACLScrutinySpares inObj={rowData} />));
      },
      hidden: (rowData) => {
        return (
          rowData.soType !== "Spares"
         
        );
      },
    },
   
    {
      label: "ReturnOL",
      type: "General",
      onClick: (rowData) => {
        dispatch(selectItem(<ReturnOL num={rowData?.id} from={1} />));
      },
      disabled: (rowData) => {
        return !rowData?.isReturned;
      },
    },
   
    {
      label: "Offered Qty",
      type: "General",
      onClick: (rowData) => {
        setOpenOfferedQtyDialog(true);
        setObj(rowData);
      },
    },

   
  ];
const Inspector = loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR
  const [columns] = useState([
    isArmy
      ? { title: "QACL Number", field: "name", width: "auto" }
      : { title: "OL Number", field: "name", width: "auto" },
         {
      title: "Offer Date",
      field: "offerDate",
      width: "auto",
      filtering: true,
    },
    { title: "Inspection Agency", field: "inspAuthority", width: "auto", sorting: true },
    { title: "Consignee", field: "consignee", width: "auto", sorting: true },
    
    { title: "Supplier", field: "salesGroupName", width: "auto", sorting: true },
    { title: "Material Description", field: "projectName", width: "auto" },
 

  ]);
  return (
    <>
      {openDial && (
        <OLReview
          openDial={openDial}
          setOpenDial={setOpenDial}
          obj={obj}
          getInspectOL={getInspectOL}
        />
      )}

      {openOfferedQtyDialog && (
        <ClearedLI
          soObj={obj}
          onClose={() => {
            setOpenOfferedQtyDialog(false);
            setObj(null);
          }}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        detailPanel={detailPanel}
        title=""
      />
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
            style={{
              display: el.hidden ? el.hidden(rowData) && "none" : "block",
            }}
          >
            <Typography variant="body2">{el.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

const ViewLI = ({ data }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDlg, setOpenDlg] = useState(false);
  const [rowData, setRowData] = useState({});
  const [columns] = useState([
    {
      title: "Line Item/ Indent Sl No.",
      field: "soLineItemNo",
      filtering: false,
    },
    { title: "Description", field: "description", filtering: false },
    { title: "Part No", field: "partNo", filtering: false },
    { title: "Ordered Qty", field: "orderQty", filtering: false },
    { title: "Offered Qty", field: "offeredQty", filtering: false },
    { title: "Unit Cost", field: "unitCostStr", filtering: false },
    { title: "Item Value", field: "itemValueStr", filtering: false },
    { title: "Is Imported", field: "imported", filtering: false },
    { title: "Issue Level", field: "issueLevel", filtering: false },
    { title: "Priority", field: "priority", filtering: false },

    // { title: "Status", field: "status", width: "auto", filtering: false },
  ]);

  const actions = [
    {
      icon: (el) => (
        <ActionButton
          size="small"
          color="primary"
          variant="contained"
          obs={"tmr"}
          startIcon={<Visibility />}
        >
          Tests
        </ActionButton>
      ),
      tooltip: "View Tests",
      onClick: (_, rowData) => {
        setOpenDlg(true);
        setRowData(rowData);
      },
    },
  ];

  const handleOpenLI = (params) => {};
  useEffect(() => {
    handleOpenLI(data);
  }, [data]);
  return (
    <>
      {openDlg && (
        <OLAllotTests
          open={openDlg}
          setOpen={setOpenDlg}
          rowData={rowData}
          olNumber={data?.olNumber}
          productId={data?.productId}
          olId={data?.id}
        />
      )}
      <TableComponent
        isLoading={loading}
        data={records}
        columns={columns}
        title=""
        actions={actions}
        // options={{ filtering: false, sorting: false }}
      />
    </>
  );
};
