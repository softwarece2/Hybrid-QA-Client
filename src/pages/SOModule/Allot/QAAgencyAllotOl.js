/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.js";
import moment from "moment";
import TableComponent from "components/table/index";
import { WING_ID } from "../../../Globals.js";
import { Grid, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { getAllActiveEmpsbyOrgId } from "pages/Services/URLs";

import ActionButton from "components/ActionButton";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction.js";
import { getOlAllotSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { USER_ROLE_ID } from "../../../Globals.js";
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

export default function QAAgencyAllotOl() {
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
     { title: "EP Code", field: "epcode", width: "auto" },
     { title: "Group", field: "itemCategory", width: "auto" },
     { title: "SO Number", field: "supplyOrderNo", width: "auto" },

    isArmy
      ? { title: "QACL Number", field: "offerLetterName", width: "auto" }
      : { title: "OL Number", field: "offerLetterName", width: "auto" },
          {
      title: "QACL Date",
      field: "orderDate",
      width: "auto",
      filtering: true,
    },
  
       

    {
      title: "Material Description",
      field: "materialDescription",
      width: "auto",
      sorting: true,
    },
    { title: "Supplier", field: "salesGroup", width: "auto" },

    { title: " Allot", field: "allotedToName1", width: "auto", filtering:false},
    { title: "Alloted Officer Name", field: "allotedToName", width: "auto",filtering:false },
 
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

  const fetchAllotOL = () => {
    setLoading(true);
    // let url = `allot/ol/getByEmpId/${loggedInUser?.orgId}/${loggedInUser?.empId}`;
    let url = `/allot/ol/getByEmpId/${loggedInUser?.orgId}/${loggedInUser?.empId}`;
    // if(loggedInUser?.roleId === USER_ROLE_ID.ROLE_DC){
    // }
    axiosInstanceTrans(url)
      .then(({ data }) => {
        console.log("dataa", data);
        setRecords(
          data.map((el, i) => ({
            ...el,
            orderNo: el?.offerLetterName,
            orderDate: moment(el?.offerLetterDate).format("DD-MM-YYYY"),
            allotedToName1: (
              <ActionButton
                size="small"
                color={el.isAlloteBtnVisible ? "primary" : "secondary"} // Ivnv Obs Changed Color for allot button ModifiedBy:Shruti Sanjay
                variant="contained"
                style={{width:"110px"}}
                startIcon={<SupervisorAccountIcon />}
                onClick={(e) => {
                  handleClickOpen(e);
                  setList(el?.empLists)
                  setOpen(true);
                  setOpenAllotDialogue(true);
                  setIdVal(el);
                  setSoDetails(el);
                  if (el?.isAlloteBtnVisible) {
                    setDeligation(false);
                  } else {
                    setDeligation(true);
                  }
                }}
                // disabled={!el?.isAllotedToEmp}
              >
                {el?.isAlloteBtnVisible ? "Allot" : "Re Allot"}
              </ActionButton>
            ),
             allotedToName: !el?.isAlloteBtnVisible ? mergeAllotedNameAndDate(el.allotedToName, el.date) : "",
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
