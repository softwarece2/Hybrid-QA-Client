/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../../src/App.js";
//globals

//pages
//component
import TableComponent from "components/table/index";
import moment from "moment";
//material-ui
import { Grid, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

//icons

import ActionButton from "components/ActionButton";
import AllotSubordinateDialog from "pages/SOModule/Allot/AllotSubordinateDialog";
import { getAllotSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { USER_ROLE_ID } from "../../../../src/Globals.js";
import axiosInstance from "pages/Services/AxiosInstanceTransaction.js";
import { toast } from "react-toastify";
import { entries } from "@amcharts/amcharts4/.internal/core/utils/Object.js";
import { color } from "@amcharts/amcharts4/core.js";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },

});

export const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, id, ...other } = props;
  return (
    <MuiDialogTitle
      id={id}
      disableTypography
      className={classes.root}
      {...other}
    >
      <Typography align="left" color="primary" style={{ fontSize: "0.875rem" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          size="small"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function AllotOfficers() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idVal, setIdVal] = useState(null);
  const [soDetails, setSoDetails] = useState("");
  const [openAllotDialogue, setOpenAllotDialogue] = useState(false);
  const [list, setList] = useState([]);
  const [rowRoleId, setRowRoleId] = useState(null);
  const [isReAllot, setIsReAllot] = useState(false); 
  const loggedInUser = useSelector((store) => store.loggedInUser);

  const [columns] = useState([
      { title: "Ep Code", field: "epcode", width: "auto" },
     { title: "Grp", field: "itemCategory", width: "auto" },
    { title: "SO Number", field: "supplyOrderName", width: "auto" },
        {
      title: "SO Date",
      field: "supplyOrderDate",
      width: "auto",
      filtering: true,
    },
   
    // { title: "Ep Code", field: "", width: "auto" },

    { title: "Allot", field: "allot", filtering:false },
    { title: "Alloted Officer Name", field: "allotedToOfficers", width: "auto",filtering:false },
    // { title: "Work Load", field: "WorkLoad", width: "auto", filtering: false },
    // {
    //   title: "Actions",
    //   field: "actions",
    //   width: "auto",
    //   filtering: false,
    //   sorting: false,
    // },
  ]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  // const getSubordinatesByEmpId = (empId) => {
  //   axiosInstance
  //     .get(getSubordinatesByEmpIdUrl + `${loggedInUser?.empId}`)
  //     .then((res) => setSubordinateList(res?.data))
  //     .catch((err) => console.log("error in getSubordinatesByEmpId" + err));
  // };
  // const getAllSubByRole = (roleId) => {
  //   axiosInstance
  //     .get(getAllSubOfEmpByRoleIdUrl + `${loggedInUser?.empId}/${roleId}`)
  //     .then((res) => setList(res?.data))
  //     .catch((err) => console.log("error in getSubDcqaoBySubRole" + err));
  // };

  const mergeAllotedNameAndDate = (allotedToName, date) => {
    const allotedName  = allotedToName.split(',').map(name => name.trim());
    const dt = date.split(',').map(date => date.trim());
   const entries= allotedName.map((el, i)=> `${el}(${dt[i]})`).join(", ");
   let latestDateIndex = -1;
    let latestDate = new Date('01-01-1970'); 
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
 
  console.log("hfruirh", list);
  const fetchAllotSO = () => {
    setLoading(true);

    getAllotSubordinate(loggedInUser?.empId)
      .then((res) => {
        console.log("dataa", res);
        setRecords(
          res.map((el, i) => ({
            ...el,
            orderNo: el?.supplyOrderName,
            orderDate: moment(el?.supplyOrderDate).format("DD-MM-YYYY"),
            allot: (
              <ActionButton
              style={{width:"120px"}}
                size="small"
                color={el.isAlloteBtnVisible ? "primary" : "secondary"}
                variant="contained"
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  setIdVal(null);
                  setIsReAllot(!el.isAlloteBtnVisible);
                  handleClickOpen(e);
                  setRowRoleId(USER_ROLE_ID?.ROLE_CQAI_DC);
                  // getAllSubByRole(-1);
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  setIdVal(el);
                  console.log("open", open);
                  setSoDetails(el);
                }}
              >
                {el.isAlloteBtnVisible ? "Allot" : "Re-Allot"}
              </ActionButton>
            ),
            // allotedToOfficers: el.isAlloteBtnVisible ? "" : el.allotedToName,
            allotedToOfficers: el.isAlloteBtnVisible ? "" : mergeAllotedNameAndDate(el.allotedToName, el.date),
      
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
          so={idVal}
          fetchAllotSO={fetchAllotSO}
          isReAllot={isReAllot}
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
