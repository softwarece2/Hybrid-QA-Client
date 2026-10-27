/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";
import TableComponent from "components/table/index";
import { Grid, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import {  withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { getAllSubOfEmpByRoleIdUrl } from "pages/Services/URLs";
import ActionButton from "components/ActionButton";
import { USER_ROLE_ID } from "../../Globals";
import axiosInstance from "pages/Services/AxiosInstance";
import AllotSubordinateDialog from "pages/SOModule/Allot/AllotSubordinateDialog";
import { getAllotSubordinate} from "Redux/Actions/Allotjc/AllotjcAction";

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

export default function AllotJcSO() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idVal, setIdVal] = useState(null);
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
 
    { title: "Alloted Officer Name", field: "allotedToName", width: "auto" },

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
    getAllotSubordinate(loggedInUser?.empId)
      .then((res) => {
        console.log("dataa", res);
        setRecords(
          res.map((el, i) => ({
            ...el,
            orderNo: el?.supplyOrderName,
            orderDate: el?.supplyOrderDate,
            allotedToName: el?.isAlloteBtnVisible ? (
              <ActionButton
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setIdVal(el);
                  setRowRoleId(USER_ROLE_ID?.ROLE_CQAI_DC);
                  getAllSubByRole(-1);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  console.log("open", open);
                
                }}
              >
                Allot
              </ActionButton>
            ) : (
              el?.allotedToName
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
          />
        </Grid>
      </Grid>
    </>
  );
}
