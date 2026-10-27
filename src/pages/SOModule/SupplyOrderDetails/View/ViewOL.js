/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../App.css";

//component
import TableComponent from "components/table/index";
import { WING_ID } from "../../../../Globals";
//material-ui
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from "@material-ui/core";
import ActionButton from "components/ActionButton";
import Button from "components/Button";
import { useForm, useWatch } from "react-hook-form";
import { getOlDetails } from "Redux/Actions/SupplyOrder/OLAction";

import { USER_ROLE_ID } from "../../../../Globals";

//icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import Edit from "pages/SOModule/OL/Edit";
import OLReview from "pages/SOModule/OL/OLReview";
import { toast } from "react-toastify";
import { saveAllotOlSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { PaperComponent } from "Utils/D3Tree";
import { MoreActionButtons } from "pages/Sslip/SSlipTable";
import { useGetCommonActionMenus } from "hook/useGetCommonActionMenus";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import SampleSelection from "pages/QACLScrutiny/SampleSelection";

const getColor = (value) => {
  if (value === "Pending") {
    return "#ff4040";
  } else if (value === "Cleared") {
    return "green";
  } else if (value === "Completed") {
    return "#5757d0";
  } else if (value === "Returned") {
    return "grey";
  } else if (value === "Approved") {
    return "#ca8cc9";
  } else if (value === "In Progress") {
    return "#d0882a";
  } else if (value === "Rejected") {
    return "rgb(30, 5, 5)";
  }
  return "yellow";
};
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
export default function ViewOL() {
  const dispatch = useDispatch();

  const { control, setValue } = useForm({
    mode: "onChange",
  });
  const classes = useStyles();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const empId = useSelector((store) => store.loggedInUser?.empId);
  const roleId = useSelector((state) => state?.loggedInUser?.roleId);
  const supplyOrderIdWatcher = useWatch({ control, name: "supplyOrderId" });
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;
  const [supplyOrderId, setSupplyOrderId] = useState("");
  const [obj, setObj] = useState({});
  const [saleOrderId, setSaleOrderId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openDial, setOpenDial] = useState(false);

  const [data, setData] = useState({});
  const moreActions = useGetCommonActionMenus();
  const [columns] = useState([
    { title: "QACL Number", field: "olNumber", width: "auto" },
    isArmy
      ? { title: "S.Slip Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "Offered Date", field: "olDateStr", width: "auto" },
    roleId === USER_ROLE_ID?.ROLE_OIC_ADMIN && {
      title: "Received Date",
      field: "receivedDate",
      width: "auto",
    },
    { title: "SO Number", field: "supplyOrderNo", width: "auto" },
    // { title: "Work Order No.", field: "saleOrderNoStr", width: "auto" },
    // { title: "SBU Name", field: "salesGroupName", width: "auto" },
    // { title: "Project Name", field: "projectName", width: "auto" },
    {
      title: "Status",
      field: "fileNoteStatus",
      width: "auto",
      render: (rowData) =>
        rowData?.fileNoteStatus && (
          <Button
            variant="text"
            style={{
              background: getColor(rowData.fileNoteStatus),
              color: "white",
              textTransform: "unset",
              fontSize: "12px",
            }}
          >
            {rowData.fileNoteStatus}
          </Button>
        ),
    },
    {
      title: " Samples",
      field: "",
      width: "auto",
      filtering: true,
      sorting: false,
      render: (rowData) => (
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          onClick={() => { 
            dispatch(selectItem(<SampleSelection rowData={rowData} />));
          }}
    
        >
          Samples
        </Button>
      ),
        
      tooltip: "Samples",
    
    },
    // {
    //   title: "Action",
    //   field: "",
    //   width: "auto",
    //   filtering: true,
    //   sorting: false,
    //   render: (rowData) => <MoreActionButtons rowData={rowData} actions={actions} />
    // },
  ]);

  const [dialogCol] = useState([
    isArmy
      ? { title: "QACL Number", field: "olNumber", width: "auto" }
      : { title: "OL Number", field: "olNumber", width: "auto" },
    { title: "Offered Date", field: "offerDate", width: "auto" },
  ]);

  useEffect(() => {
    if (!supplyOrderIdWatcher) {
      setSaleOrderId(null);
      setValue("saleOrderId", null);
      dispatch({ type: "SALE_ORDER", payload: [] });
    }
  }, [supplyOrderIdWatcher]);

  useEffect(() => {
    // fetchOLCount();
    // setValue("pending", true);
    getOlData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const getOlData = () => {
    setLoading(true);
    axiosInstance(`inote/getAllottedINotes/${orgId}/${empId}`).then(
      ({ data }) => {
        setValue("supplyOrderId", null);
        setValue("saleOrderId", null);
        setSupplyOrderId(null);
        setSaleOrderId(null);
        setRecords(data);
        setLoading(false);
      }
    );
  };

  const handleAllotJC = (obj) => {
    const data = {
      offerLetterId: obj?.id,
      offerLetterName: obj?.olNumber,
      allotedBy: loggedInUser?.empId,
      allotedTo: [loggedInUser?.reportingOfficerId],
      isDeligation: false,
    };
    saveAllotOlSubordinate(data)
      .then((res) => {
        toast.success("Notified QAO");
        getOlData();
      })
      .catch((err) => toast.error(err));
  };
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

  const actions = [
    roleId === USER_ROLE_ID?.ROLE_OIC_ADMIN
      ? {
          icon: () => (
            <ActionButton
              variant="contained"
              color="secondary"
              startIcon={<NotificationsIcon />}
              onClick={() => handleAllotJC(data)}
              disabled={data?.isNotified}
            >
              {/* JE */}
              QAO
            </ActionButton>
          ),
          tooltip: "Notify QAO",
          // onClick: (event, rowData) => {
          //   setSoObj(rowData);
          // },
        }
      : null,
    (data) => ({
      icon: (el) => <MoreActionButtons actions={moreActions} rowData={data} />,
    }),
  ];
  return (
    <>
      {openDial && (
        <OLReview
          openDial={openDial}
          setOpenDial={setOpenDial}
          obj={obj}
          supplyOrderId={supplyOrderId}
          // fetchOL={fetchOL}
        />
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            actions={actions}
            detailPanel={detailPanel}
            // options={{ filtering: false, sorting: false }}
          />

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
            PaperComponent={(props) => (
              <PaperComponent id="draggable-dialog-title404" {...props} />
            )}
          >
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title404"
            >
              Scrutiny {isArmy ? "QACL" : "OL"} Details
            </DialogTitle>
            <DialogContent>
              <Grid item xs={12} align="center">
                <TableComponent
                  isLoading={loading}
                  data={records}
                  columns={dialogCol}
                  title=""
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </>
  );
}
