/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import "../../App.css";
//globals

//pages
//component
import TableComponent from "components/table/index";

//material-ui
import { Grid, Typography } from "@material-ui/core";

import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import {  withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { getAllSubOfEmpByRoleIdUrl } from "pages/Services/URLs";
import { useDispatch } from "react-redux";


//icons
import EditIcon from "@material-ui/icons/Edit";
import ActionButton from "components/ActionButton";
import { USER_ROLE_ID } from "../../Globals";
import axiosInstance from "pages/Services/AxiosInstance";
import AllotSubordinateDialog from "pages/SOModule/Allot/AllotSubordinateDialog";
import { getAllotjc } from "Redux/Actions/Allotjc/AllotjcAction";


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});
export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, id, ...other } = props;
  return (
    <MuiDialogTitle id={id} disableTypography className={classes.root} {...other}>
      <Typography align="left" color="primary" style={{ fontSize: "0.875rem" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton size="small" className={classes.closeButton} onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});


export default function AllotDcSO() {

  const dispatch = useDispatch();

 
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
 
  const [idVal, setIdVal] = useState(null);
  const [soDetails, setSoDetails] = useState("");

  const [openAllotDialogue, setOpenAllotDialogue] = useState(false);
  const [List, setList] = useState([]);
  const [rowRoleId, setRowRoleId] = useState(null);

  const loggedInUser = useSelector((store) => store.loggedInUser);

  const [columns] = useState([
    { title: "SO Number", field: "orderNo", width: "auto" },
    {
      title: "Date and Time",
      field: "orderDate",
      width: "auto",
      filtering: true,
    },

    { title: "Acqao Officer Name", field: "acqaoName", width: "auto" },
    { title: "Inspector Name", field: "inspectorName", width: "auto" },
    {
      title: "Actions",
      field: "actions",
      width: "auto",
      filtering: false,
      sorting: false,
    },
  ]);
  const handleClickOpen = () => {
    setOpen(true);
  };


  const getAllSubByRole = (roleId) => {
    axiosInstance
      .get(getAllSubOfEmpByRoleIdUrl + `${loggedInUser?.empId}/${roleId}`)
      .then((res) => setList(res?.data))
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  };

  const fetchAllotSO = () => {
    setLoading(true);
    dispatch(getAllotjc(loggedInUser?.roleId, loggedInUser?.empId))
      .then((res) => {
        console.log("dataa", res);
        setRecords(
          res.map((el, i) => ({
            ...el,
            orderNo: el?.orderNo,
            orderDate: el?.orderDate,          
            acqaoName: el?.secOfficerName ? (
              el?.secOfficerName
            ) : (
              <ActionButton
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setIdVal(el);
                  setRowRoleId(USER_ROLE_ID?.ROLE_AQAO);
                  getAllSubByRole(USER_ROLE_ID?.ROLE_AQAO);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  console.log("open", open);
                  setSoDetails(el);
                }}
              >
                Allot
              </ActionButton>
            ),
            inspectorName: el?.inspectorName ? (
              el?.inspectorName
            ) : (
              <ActionButton
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setIdVal(el);
                  setRowRoleId(USER_ROLE_ID?.ROLE_INSPECTOR);
                  getAllSubByRole(USER_ROLE_ID?.ROLE_INSPECTOR);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  console.log("open", open);
                  setSoDetails(el);
                }}
              >
                Allot
              </ActionButton>
            ),
           
            actions: (
              <ActionButton
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<EditIcon />}
              // onClick={() => setOpen(true)}
              >
                Edit
              </ActionButton>
            ),
           
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllotSO();
  }, []);


  return (
    <>
      {openAllotDialogue && (
        <AllotSubordinateDialog
          open={open}
          setOpen={setOpen}
          roleId={rowRoleId}
          so={idVal}
          subList={List}
          fetchAllotSO={fetchAllotSO}
        />
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
          // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
    </>
  );
}
