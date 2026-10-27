/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState, useRef, useMemo } from "react";
import "../../../App.css";
import moment from "moment/moment";
import { useForm } from "react-hook-form";

//material-ui
import { Button, Dialog, DialogActions, Grid, Typography } from "@material-ui/core";

//pages
// import PreviewMain from "./PreviewMain";

//component
import ActionButton from "components/ActionButton";
import TableComponent from "components/table/index";

//redux
import { useSelector } from "react-redux";
import { getCategorySenderWiseNotify, getCategoryWiseNotify, updateByRead } from "Redux/Actions/Notifications/UnreadNotificationAction";
import { StatusChips } from "Utils";
import { DialogContent, DialogTitle } from "Utils";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { getWarrantByWarrantId } from "pages/Services/URLs";
import { useMatch } from "react-router-dom";
import PreviewMain from "../SONotification/PreviewMain";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useNotification } from "context/notification";
import { useDispatch } from "react-redux";
export default function WarrantNotification(props) {
  const { id } = props;
  const { reset: notificationReset } = useNotification();
  const componentRef = React.useRef();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [soId, setSoId] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [warrantDialog, setWarrantDialog] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [warrantData, setWarrantData] = useState({});
const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const methods = useForm({
    mode: "onChange",
  });
  const { reset } = methods;

  const columns = useMemo(() => {
    if (id === 200) {
      return [
        {
          title: "Notification",
          field: "notificationName",
          width: "auto",
          render: (
            rowData // Render function to apply style
          ) => <span style={{ fontWeight: rowData.readStatusString === "Unread" ? "bold" : "normal" }}>{rowData.notificationName}</span>,
        },
        { title: "EP Code", field: "epcode", width: "auto" },
          { title: "Inspection  Agency", field: "inspAgency", width: "auto" },
        { title: "Sent to", field: "receiverName", width: "auto" },
        { title: "Read Status", field: "readStatusString", render: (el) => <StatusChips status={el.readStatusString} />, width: "auto" },
        // { title: "SBU", field: "sbuName", width: "auto", sorting: true  },
        { title: "Date and Time", field: "createdDateTime", width: "auto", sorting: true },

        // { title: "Status", field: "readStatus", width: "auto", filtering: false },
      ];
    } else {
      return [
        {
          title: "Notification",
          field: "notificationName",
          width: "auto",
          render: (
            rowData // Render function to apply style
          ) => <span style={{ fontWeight: rowData.readStatusString === "Unread" ? "bold" : "normal" }}>{rowData.notificationName}</span>,
        },
        { title: "EP Code", field: "epcode", width: "auto" },
          { title: "Inspection  Agency", field: "inspAgency", width: "auto" },
        { title: "Received From", field: "senderName", width: "auto" },
        { title: "Read Status", field: "readStatusString", render: (el) => <StatusChips status={el.readStatusString} />, width: "auto" },
        // { title: "SBU", field: "sbuName", width: "auto", sorting: true  },
        { title: "Date and Time", field: "createdDateTime", width: "auto", sorting: true },

        // { title: "Status", field: "readStatus", width: "auto", filtering: false },
      ];
    }
  }, [id]);

  const fetchSoNotifications = () => {
    setLoading(true);
    getCategoryWiseNotify("WARRANT_ALLOTMENT_TYPE", loggedInUser?.empId)
      .then((data) => {
        /*{Sorting by read status}*/

        //   let newData = [...data];
        //   newData.sort((a,b) => {
        //     const aReadStatus = a.readStatusString === "Read";
        //     const bReadStatus = b.readStatusString === "Read";
        //   if (aReadStatus && !bReadStatus) {
        //     return 1;
        //   } else if (!aReadStatus && bReadStatus) {
        //     return -1;
        //   } else {
        //     return 0;
        //   }
        // });
        let newData = [];
        data.forEach((element) => {
          if (!newData?.map((item) => item?.notificationName)?.includes(element?.notificationName)) newData.push(element);
        });
        setRecords(data);
        setLoading(false);
      })

      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   fetchSoNotifications();
  //   console.log("inside sbu so import");
  // }, [loggedInUser]);

  const handleWarrentSenderNotification = () => {
    setLoading(true);
    getCategorySenderWiseNotify("WARRANT_ALLOTMENT_TYPE", loggedInUser?.empId)
      .then((data) => {
        let newData = [];
        data.forEach((element) => {
          if (!newData?.map((item) => item?.notificationName)?.includes(element?.notificationName)) newData.push(element);
        });
        setRecords(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id === 5) {
      fetchSoNotifications();
      axiosInstance
        .post("notification/updateLatest",{categories: ["WARRANT_ALLOTMENT_TYPE"]})
        .then(() => {
          notificationReset();
        })
        .catch(console.log);
    } else if (id === 200) {
      handleWarrentSenderNotification();
    } else {
      setRecords([]);
    }
  }, [id, loggedInUser?.empId]);

  useEffect(() => {
    if (warrantDialog) {
      setLoading(true);
      try {
        setLoading(true);
        const response = axiosInstanceTrans.get(getWarrantByWarrantId + rowData?.categoryId);
        response.then((res) => {
          const data = res.data;
          reset(data);
          setWarrantData(data);
          setLoading(false);
        });
      } catch (error) {
        toast.error("Failed to get Data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  }, [warrantDialog]);

  const handleClose = () => {
    setWarrantDialog(false);
    if (id === 200) {
      handleWarrentSenderNotification();
    }
    else{
      fetchSoNotifications();
    }
    
  };
const readByData = ()=> {
    dispatch(updateByRead(rowData?.id, loggedInUser?.empId))
      .then((response) => {
        if (response) {
          console.log("Notification marked as read");
        } else {
          console.error("Failed to mark notification as read");
        }
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  }
  useEffect(() => {
  readByData(rowData?.id);
}, [rowData, loggedInUser?.empId]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} align="center">
          <TableComponent
            isLoading={loading}
            data={records}
            columns={columns}
            title=""
            // options={{ filtering: false, sorting: false }}
            actions={[
              {
                icon: () => (
                  <ActionButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setOpen(true);
                      setWarrantDialog(true);
                    }}
                  >
                    View
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  setSoId(rowData?.categoryId);
                  setNotificationId(rowData?.id);
                  setRowData(rowData);
                },
              },
            ]}
          />
        </Grid>
      </Grid>

      {/* Warrant Details */}

      <Dialog
        open={warrantDialog}
        onClose={() => {
          setWarrantDialog(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Warrant Details</DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <form>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    <b>WO No. : </b> {warrantData?.[0]?.saleOrder}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>WT Issue Date : </b>{" "}
                    {warrantData?.[0]?.wtIssueDate ? moment(warrantData?.[0]?.wtIssueDate).format("DD-MM-YYYY") : "-"}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>Rev No. : </b> {warrantData?.[0]?.revNo}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>EP Code : </b> {warrantData?.[0]?.partNo}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>Drg No. : </b>
                    {warrantData?.[0]?.drawingNo}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>WT Qty. : </b>
                    {warrantData?.[0]?.qty}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    <b>WT No. : </b> {warrantData?.[0]?.categoryName}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>EST No. : </b> {warrantData?.[0]?.estNo}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>EST Date : </b>
                    {warrantData?.[0]?.estDate ? moment(warrantData?.[0]?.estDate).format("DD-MM-YYYY") : "-"}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>Material Description. :</b> {warrantData?.[0]?.materialDescription}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>Ord No. : </b>
                    {warrantData?.[0]?.orderMasterNo}
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button size="small" color="primary" variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
