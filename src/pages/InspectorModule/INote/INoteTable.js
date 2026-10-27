/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {ORG_TYPE, WING_ID } from "../../../Globals.js";
//component
import TableComponent from "components/table/index";
//material-ui
import {
IconButton,
  makeStyles,
  MenuItem,
  Popover,Typography,
} from "@material-ui/core";
//pages
import InspectionCertificate from "pages/Enclosures/Enclosure12/InspectionCertificate";
//redux
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { useDispatch } from "react-redux";
import {MoreVert,} from "@material-ui/icons";
import NotifyOrAllot from "pages/SOModule/InStageQC/SubmittedSO/NotifyOrAllot";
// import Qcc from "pages/SOModule/OL/QACL/qcc";
import INoteInternalNew from "pages/SOModule/OL/InoteInternal/inoteInternalNew.js";
import Qcc from "pages/cetificate/qcc.js";
import Qac from "pages/certificate/qac.js";
import axiosInstance from "pages/Services/AxiosInstanceTransaction.js";
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
}));

export default function INoteTable() {
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

  const [columns] = useState([
    // isArmy
    //   ? { title: "QACL Number", field: "olNumber", width: "auto" }
    //   : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "INote No", field: "internalInoteNo", width: "auto" },
{ title: "INote Date", field: "internalInoteDate", width: "auto" },
{ title: "Lot No", field: "mergeSslipNo", width: "auto" },
{ title: "Lot Date", field: "internalInoteDate", width: "auto" },
{ title: "Warranty No", field: "warrantyNo", width: "auto" },
{ title: "WorkOrder No", field: "workOrderNo", width: "auto" },
{ title: "Accepted Qty", field: "acceptedQty", width: "auto" },
{ title: "Rejected Qty", field: "rejectedQty", width: "auto" },

    // {
    //   title: "Consignee",
    //   field: "consigneeName",
    //   width: "auto",
    //   render: (row) => {
    //     return (
    //       <div>
    //         {row.consigneeName}&nbsp;&nbsp;&nbsp;{" "}
    //         <Tooltip title={row.consigneeAddr}>
    //           <Info
    //             style={{ marginBottom: -4 }}
    //             fontSize="small"
    //             color="disabled"
    //           />
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
    // { title: "INote Date", field: "inoteDate", width: "auto" },
    // { title: "INote Status", field: "inoteStatus", width: "auto",
  // render: (row) => {
  //   const status = row.inoteStatus || null; 
  //   return (
  //     <div>
  //       {status === "Issued" ? (
  //         <MButton
  //          style={{ color: "#1b5e20", backgroundColor: "#c8e6c9" }}
  //          size="small"
  //          classes={{
  //            disabled: classes.disable,
  //            root: classes.root,
  //          }}
  //        >
  //          Issued
  //        </MButton>
  //       ) : status === "Pending" ? (
  //         <MButton
  //           style={{
  //             color: "#cb0000",
  //             backgroundColor: "#ff7d654d",
  //           }}
  //           size="small"
  //           classes={{
  //             disabled: classes.disable,
  //             root: classes.root,
  //           }}
  //         >
  //           Pending
  //         </MButton>
  //       ) : (
  //         <span>Not Available</span> 
  //       )}
  //     </div>
  //   );
//   // },
// },
  ]);

  // const fetchAllotOL = () => {
  //   setLoading(true);
  //   if (salesGrpId) {
  //     dispatch(loggedInUser?.roleId === USER_ROLE_ID.ROLE_DO ? getAllAllotedINotesForFirm(orgId, loggedInUser?.empId) : getAllINotesForFirm(orgId))
  //       .then((res) => {
        
  //          const formattedRecords= res.map((el, i) => ({
  //             ...el,
  //             olNumber: el?.olNumber,
  //             projectName: el?.projectDescription,
  //             supplyOrderNo: el?.supplyOrderNo,
  //             salesGroupName: el?.salesGrpName,
  //             offerDate: el?.olDateStr,
  //             consigneeName: el?.consigneeName,
  //             inoteDate: el?.inoteDate,
  //             status: el?.inoteStatus,
  //             inoteStatus:
  //               el?.inoteStatus || "Not available",
  //           }));
  //           setRecords(formattedRecords);
  //           setLoading(false);
  //          } )
         
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //       });
  //   } else {
  //     dispatch(getAllInotesByFileNoteId(orgId))
  //       .then((res) => {
          
  //         const formattedRecords = res.map((el, i) => ({
  //             ...el,
  //             olNumber: el?.olNumber,
  //             projectName: el?.projectDescription,
  //             supplyOrderNo: el?.supplyOrderNo,
  //             salesGroupName: el?.salesGrpName,
  //             offerDate: el?.olDateStr,
  //             inoteDate: el?.inoteDate,
  //             inoteStatus: el?.inoteStatus || "Not Available",
  //           }));
  //           setRecords(formattedRecords);
  //           setLoading(false);
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   fetchAllotOL();
  // }, []);

    const handleQccClick = (rowData) => {
      dispatch(selectItem(<Qcc olId={rowData.offerLetterId} returnTo="table" />));
  };

  const handleQacClick = (rowData)=>{
    dispatch(
      selectItem(<Qac row={rowData} olIds={rowData?.offerLetterId} returnTo="table" />)
    );
  }

  const handleInoteClick =(rowData)=>{
    if (salesGrpId) {
      dispatch(selectItem(<INoteInternalNew olId={rowData.offerLetterId} returnTo="table"  />));
    } else {
      dispatch(
        selectItem(
           <InspectionCertificate
            fnId={rowData.id}
            olId={rowData.offerLetterId}
            ol={rowData}
            returnTo="table" 
          />
        )
      );
    }
  }

  const getInoteDetails = async ()=>{
    const {data} = await axiosInstance.get("internalInote/getAll")
    setRecords(data)
  }
  useEffect(()=>{
getInoteDetails()
  },[])                                                                                         
  console.log(records,"testtt")

  const updatedActions = [
    {
      label: "I-Note",
      // onClick: (rowData) => {
      //   if (salesGrpId) {
      //     dispatch(selectItem(<INoteInternalNew olId={rowData.offerLetterId} />));
      //   } else {
      //     dispatch(
      //       selectItem(
      //          <InspectionCertificate
      //           fnId={rowData.id}
      //           olId={rowData.offerLetterId}
      //           ol={rowData}
      //         />
      //       )
      //     );
      //   }
      // },
      onClick: (row) => {
        handleInoteClick(row);
    },
    },
   loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY ? {
      label: "QAC",
      // onClick: (rowData) => {
      //   dispatch(
      //     selectItem(<Qac row={rowData} olIds={rowData?.offerLetterId} />)
      //   );
      // },
      onClick: (row) => {
        handleQacClick(row);
    },
      // disabled: (row) => row.status === "Pending",
    }:
    {
      label: "QCC",
      // onClick: (rowData) => {
      //   if (salesGrpId) {
      //     dispatch(selectItem(<Qcc olId={rowData.offerLetterId} />));
      //   } else {
      //     dispatch(
      //       selectItem(<Qcc row={rowData} olIds={rowData?.offerLetterId} />)
      //     );
      //   }
      // },
      onClick: (rowData) => {
        dispatch(selectItem(<Qcc olId={rowData.offerLetterId} mergedDetails={rowData} source="inoteTable" />)); //Pass source
      },
      disabled: (row) => row.status === "Pending",
    },
  ];

  // const actions = [
  //   (row) => ({
  //     icon: () => (
  //       <IconButton
  //         variant="contained"
  //         size="small"
  //         color={row.status === "Pending" ? "inherit" : "secondary"}
  //       >
  //         <Notifications />
  //       </IconButton>
  //     ),
  //     onClick: (_, row) => {
  //       setOpenNotify(true);
  //       setSelectedRow(row);
  //     },
  //     disabled: row.status === "Pending",
  //   }),

  //   (data) => ({
  //     icon: (el) => (
  //       <MoreActionButtons actions={updatedActions} rowData={data} />
  //     ),
  //   }),
  // ];

  return (
    <>
      {openNotify && (
        <NotifyOrAllot
          onClose={() => setOpenNotify(false)}
          selectedRow={selectedRow}
          isINote
          // refresh={fetchAllotOL}
        />
      )}

      <TableComponent
        isLoading={loading}
        data={records}
        // actions={actions}
        columns={columns}
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
          >
            <Typography variant="body2">{el.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};
