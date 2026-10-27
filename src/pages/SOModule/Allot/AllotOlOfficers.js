/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../../src/App.js";
import moment from "moment";
import TableComponent from "components/table/index";
import { WING_ID } from "../../../Globals";
import { Grid, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { getAllActiveEmpsbyOrgId } from "pages/Services/URLs";

import ActionButton from "components/ActionButton";
import axiosInstance from "pages/Services/AxiosInstance";
import { getOlAllotSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { USER_ROLE_ID } from "../../../../src/Globals.js";
import AllotOLSubordinateDialog from "./AllotOLSubordinateDialog.js";

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

export default function AllotOlOfficers() {




  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idVal, setIdVal] = useState(null);
  const [soDetails, setSoDetails] = useState("");
  const [openAllotDialogue, setOpenAllotDialogue] = useState(false);
  const [List, setList] = useState([]);
  const [rowRoleId, setRowRoleId] = useState(null);
  const [deligation, setDeligation] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [columns] = useState([
    isArmy
      ? { title: "QACL Number", field: "offerLetterName", width: "auto" }
      : { title: "OL Number", field: "offerLetterName", width: "auto" },
          {
      title: "QACL Date",
      field: "orderDate",
      width: "auto",
      filtering: true,
    },
    { title: "SO Number", field: "supplyOrderNo", width: "auto" },

{
      title: "Material Description",
      field: "projectName",
      width: "auto",
      sorting: true,
    },
    { title: "Eqpt group", field: "salesGroup", width: "auto" },

    { title: " Allot", field: "allotedToName", width: "auto",filtering:false },
    { title: "Alloted Officer Name", field: "allotedToName1", width: "auto",filtering:false },
    // { title: "Alloted Officer Name", field: "allotedToName1", width: "auto" },

  ]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const mergeAllotedNameAndDate = (allotedToName, date) => {
    const allotedName  = allotedToName.split(',').map(name => name.trim());
    const dt = date.split(',').map(date => date.trim());
    const entries= allotedName.map((el, i)=> `${el}(${dt[i]})`).join(", ");
    let latestDateIndex = -1;
    let latestDate = new Date('1970-01-01'); 

    for (let i = 0; i < dt.length; i++) {
        const currentDate = moment(dt[i], "DD-MM-YYYY HH:mm:ss A").toDate();  

        if (currentDate > latestDate) {
            latestDate = currentDate;
            latestDateIndex = i;
        }
    }

    const latestOfficer = allotedName[latestDateIndex];
    const latestDateString = dt[latestDateIndex];
console.log(latestOfficer);
    return (
      <div>
          {entries.split(',').map((entry, index) => (
            <>
              <span key={index}  style={{ color: index === latestDateIndex ? 'blue' : 'black' }}>
                  {entry.trim()}
              </span>
              {index < entries.split(',').length - 1 ? ", " : " "}
            </>
          ))}
      </div>
  ); 
  };

  const getAllSubByRole = (orgId) => {
    axiosInstance
      .get(getAllActiveEmpsbyOrgId + `${loggedInUser?.empId}/${orgId}`)
      .then((res) => setList(res?.data))
      .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  };
console.log(loggedInUser?.empId,"test empid")
  const fetchAllotOL = () => {
    setLoading(true);
    getOlAllotSubordinate(`${loggedInUser?.orgId}`, `${loggedInUser?.empId}`)
      .then((res) => {
        console.log("dataa", res);
        setRecords(
          res.map((el, i) => ({
            ...el,
            orderNo: el?.offerLetterName,
            orderDate: moment(el?.offerLetterDate).format("DD-MM-YYYY"),
            allotedToName: el?.isAlloteBtnVisible ? (
              <ActionButton
              style={{width:"110px"}}
                size="small"
                color="primary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  setIdVal(null)
                  handleClickOpen(e);
                  setRowRoleId(USER_ROLE_ID?.ROLE_CQAI_DC);
                  getAllSubByRole(loggedInUser?.orgId);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  setIdVal(el);
                  console.log("open", e, "uipi", el);
                  setSoDetails(el);
                  setDeligation(false);
                }}
              >
                Allot
              </ActionButton>
            ) : (
              <ActionButton
              style={{width:"110px"}}
                size="small"
                color="secondary"
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  setIdVal(null)
                  handleClickOpen(e);
                  setRowRoleId(USER_ROLE_ID?.ROLE_CQAI_DC);
                  getAllSubByRole(loggedInUser?.orgId);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  setIdVal(el);
                  console.log("open", e, "uipi", el);
                  setSoDetails(el);
                  setDeligation(true);
                }}
                disabled={!el?.isAllotedToEmp}
              >
                Re Allot
              </ActionButton>
            ),
            allotedToName1: !el?.isAlloteBtnVisible ? mergeAllotedNameAndDate(el.allotedToName, el.date) : "",
            // acqaoName: el?.secOfficerName ? (
            //   el?.secOfficerName
            // ) : (
            //   <ActionButton
            //     size='small'
            //     color='primary'
            //     variant='contained'
            //     startIcon={<SupervisorAccountIcon />}
            //     onClick={(e) => {
            //       handleClickOpen(e);
            //       setIdVal(el);
            //       setRowRoleId(USER_ROLE_ID?.ROLE_AQAO);
            //       getAllSubByRole(USER_ROLE_ID?.ROLE_AQAO);
            //       setOpen(true);
            //       setOpenAllotDialogue(true);
            //       console.log("open", open);
            //       setSoDetails(el);
            //     }}
            //   >
            //     Allot
            //   </ActionButton>
            // ),
            // inspectorName: el?.inspectorName ? (
            //   el?.inspectorName
            // ) : (
            //   <ActionButton
            //     size='small'
            //     color='primary'
            //     variant='contained'
            //     startIcon={<SupervisorAccountIcon />}
            //     onClick={(e) => {
            //       handleClickOpen(e);
            //       setIdVal(el);
            //       setRowRoleId(USER_ROLE_ID?.ROLE_INSPECTOR);
            //       getAllSubByRole(USER_ROLE_ID?.ROLE_INSPECTOR);
            //       setOpen(true);
            //       setOpenAllotDialogue(true);
            //       console.log("open", open);
            //       setSoDetails(el);
            //     }}
            //   >
            //     Allot
            //   </ActionButton>
            // ),
            // status: (
            //   <Button size="small" className={classes.status}>
            //     Allocate
            //   </Button>
            // ),
            // actions: (
            //   <ActionButton
            //     variant="contained"
            //     size="small"
            //     color="secondary"
            //     startIcon={<EditIcon />}
            //     // onClick={() => setOpen(true)}
            //   >
            //     Edit
            //   </ActionButton>
            // ),
            // WorkLoad: (
            //   <ActionButton
            //     variant="outlined"
            //     size="small"
            //     color="secondary"
            //     onClick={() => dispatch(selectItem(<OLWorkLoadAssessment olId={el?.offerLetterId} />))}
            //     obs={"obs"}
            //   // onClick={() => setOpen(true)}
            //   >
            //     Work Load
            //   </ActionButton>
            // ),
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
    fetchAllotOL();
  }, []);

 
 

  return (
    <>
      {openAllotDialogue && (
        <AllotOLSubordinateDialog
           onClose={() => {
            setOpenAllotDialogue(false);
          }}
          // setOpen={setOpen}
          roleId={rowRoleId}
          ol={idVal}
          subList={List}
          fetchAllotOL={fetchAllotOL}
          setRecords={setRecords}
          deligation={deligation}
      
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
