/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../../App.css";

//component
import Active from "components/Active";
import InActive from "components/InActive";
import TableComponent from "components/table/index";

//material-ui
import { Grid, makeStyles } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
//redux
import { blue, deepPurple } from "@material-ui/core/colors";
import ActionButton from "components/ActionButton";
import ViewScrutiny from "pages/Enclosures/Enclosure1/Checklist1/ViewScrutiny";
import ViewFileClosing from "pages/Enclosures/Enclosure17/ViewFileClosing";
import { getSupplyOrderByOrgIdOptimized } from "Redux/Actions/SupplyOrder/SOAction";
import SbuViewSO from "../SbuSO/SbuViewSO";
import FagEndNoticeNew from "pages/fagEndNotice/fag-end-notice-new";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    alignContent: "right",
    justifyItems: "right",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  fcl: {
    color: deepPurple[600],
    borderColor: deepPurple[600],
    // backgroundColor: deepPurple[600],
    "&:hover": {
      color: deepPurple[600],
      borderColor: deepPurple[600],
      // backgroundColor: deepPurple[600],
    },
  },

  fcm: {
    color: blue[800],
    borderColor: blue[800],
    // backgroundColor: blue[700],
    "&:hover": {
      color: blue[800],
      borderColor: blue[800],
      // backgroundColor: blue[700],
    },
  },
}));

export default function ViewSO() {
  const classes = useStyles();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openViewFag, setOpenViewFag] = useState(false);
  const [soObj, setSoObj] = useState({});

  const [view, setView] = useState(false);
  const [fileClosing, setFileClosing] = useState(false);
  const [valueId, setValueId] = useState(null);
  const [fileId, setFileId] = useState(null);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);

  const [columns] = useState([
    { title: "SO Number ", field: "orderNo", width: "auto" },
    { title: "SBU", field: "salesGroupName", width: "auto" },
    // { title: "Project Name", field: "projectName", width: "auto" },
    { title: "Scrutiny", field: "scrutiny", width: "auto" },
    // { title: "FCL", field: "fcl", width: "auto" },
    // { title: "FCM", field: "fcm", width: "auto" },
    { title: "File Closing Form", field: "fileClosingForm", width: "auto" },
    {
      title: "Date and Time",
      field: "orderDate",
      width: "auto",
      sorting: true,
    },

    { title: "Status", field: "status", width: "auto", filtering: false },
  ]);

  const fetchSO = async () => {
    setLoading(true);

    // if (roleId === USER_ROLE_ID?.ROLE_SQAO) {
    getSupplyOrderByOrgIdOptimized(orgId)
      .then((res) => {
        mapData(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
    // }

    // else {
    //   getAllotedSupplyOrderDetails(empId).then((res) => {
    //     mapData(res);
    //     setLoading(false);
    //   }).catch((e) => {
    //     console.log(e);
    //     setLoading(false);
    //   });
    // }
  };
  const mapData = (res) => {
    setRecords(
      res.map((el, i) => ({
        ...el,
        orderNo: el?.orderNo,
        salesGroupName: el?.salesGroupName,
        projectName: el?.projectName,
        orderDate: el?.orderDate ? moment(el?.orderDate).format("DD-MM-yyyy") : "",
        status: el?.status === "Active" ? <Active /> : el?.status === "Inactive" ? <InActive /> : null,
        // fcl: (
        //   <ActionButton
        //     size="small"
        //     className={classes.fcl}
        //     variant="outlined"
        //     disabled={el?.isFclSubmitted ? false : true}
        //     onClick={() => {
        //       setDialog(true);
        //       setId(el?.id);
        //     }}
        //   >
        //     FCL
        //   </ActionButton>
        // ),
        scrutiny: (
          <ActionButton
            size="small"
            color="secondary"
            variant="outlined"
            // disabled={el?.isScrutinyTenderSubmitted ? false : true}
            onClick={() => {
              setView(true);
              setValueId(el);
            }}
          >
            Scrutiny
          </ActionButton>
        ),
        // fcm: (
        //   <ActionButton
        //     size="small"
        //     className={classes.fcm}
        //     variant="outlined"
        //     disabled={el?.isFcmSubmitted ? false : true}
        //     onClick={() => {
        //       setOpenDialog(true);
        //       setVal(el);
        //     }}
        //   >
        //     FCM
        //   </ActionButton>
        // ),
        fileClosingForm: (
          <ActionButton
            size="small"
            className={classes.fcm}
            // color="secondadry Outlined"
            variant="outlined"
            disabled={el?.isClosed ? false : true}
            onClick={() => {
              setFileClosing(true);
              setFileId(el);
            }}
          >
            File Closing Form
          </ActionButton>
        ),
      }))
    );
  };
  useEffect(() => {
    fetchSO();
  }, []);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setOpenView(true)}
                  >
                    View
                  </ActionButton>
                ),
                tooltip: "View SO Details",
                onClick: (event, rowData) => {
                  setSoObj(rowData);
                },
              },
              // {
              //   icon: () => (
              //     <ActionButton
              //       variant="contained"
              //       size="small"
              //       color="primary"
              //       obs={"form"}
              //       // startIcon={<VisibilityIcon />}
              //       onClick={() => setOpenViewFag(true)}
              //     >
              //       FAG END
              //     </ActionButton>
              //   ),
              //   tooltip: "View Fag End Details",
              //   onClick: (event, rowData) => {
              //     setSoObj(rowData);
              //     // dispatch(selectItem(<FagEndNoticeNew row={rowData} />));
              //   },
              // },
            ]}

            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
      {openView && <SbuViewSO open={openView} setOpen={setOpenView} soObj={soObj} />}
      {openViewFag && <FagEndNoticeNew open={openViewFag} setOpen={setOpenViewFag} soObj={soObj} />}

      {/* {dialog && <FclView open={dialog} setOpen={setDialog} soId={id} />}

      {openDialog && (
        <FCMView open={openDialog} setOpen={setOpenDialog} idVal={val} />
      )} */}
      {view && <ViewScrutiny open={view} setOpen={setView} soObj={valueId} inObj={valueId} />}
      {fileClosing && <ViewFileClosing open={fileClosing} setOpen={setFileClosing} soObj={fileId} />}
    </>
  );
}
