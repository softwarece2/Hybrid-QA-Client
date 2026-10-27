/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useMemo, useState } from "react";
import "../../../App.css";

//material-ui
import { Grid } from "@material-ui/core";

//pages
import PreviewMain from "./PreviewMain";

//component
import ActionButton from "components/ActionButton";
import TableComponent from "components/table/index";

//redux
import { useSelector } from "react-redux";
import { getCategorySenderWiseNotify, getCategoryWiseNotify } from "Redux/Actions/Notifications/UnreadNotificationAction";
import { StatusChips } from "Utils";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useNotification } from "context/notification";

export default function SONotification(props) {
  const { id } = props;
  const { reset } = useNotification();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [soId, setSoId] = useState("");
  const [notificationId, setNotificationId] = useState("");

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const columns = useMemo(() => {
    if (id === 100) {
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
        { title: "Material Description", field: "materialDescription", width: "auto" },
          { title: "Inspection  Agency", field: "inspAgency", width: "auto" },
        { title: "SO/PO Number", field: "soNumber", width: "auto" },
        { title: "Sent to", field: "receiverName", width: "auto" }, // Changed here
        { title: "Read Status", field: "readStatusString", render: (el) => <StatusChips status={el.readStatusString} />, width: "auto" },
        // { title: "SBU", field: "sbuName", width: "auto", sorting: true  },
        { title: "Date and Time", field: "createdDateTime", width: "auto", sorting: true },
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
        // { title: "Work Order No.", field: "soNumber", width: "auto" },
        // { title: "Warrant No.", field: "soNumber", width: "auto" },
        // { title: "Wt Issue Dt.", field: "soNumber", width: "auto" },
        // { title: "Wt Qty", field: "soNumber", width: "auto" },
        // { title: "Wt Issued By", field: "soNumber", width: "auto" },
        // { title: "Consignee", field: "soNumber", width: "auto" },
        // { title: "Est No.", field: "soNumber", width: "auto" },
        // { title: "Rev No.", field: "soNumber", width: "auto" },
        { title: "SO/PO Number", field: "soNumber", width: "auto" },
        { title: "Received From", field: "senderName", width: "auto" },
         { title: "Date and Time", field: "createdDateTime", width: "auto", sorting: true },
        { title: "Read Status", field: "readStatusString", render: (el) => <StatusChips status={el.readStatusString} />, width: "auto" },
        // { title: "SBU", field: "sbuName", width: "auto", sorting: true  },
       

        // { title: "Status", field: "readStatus", width: "auto", filtering: false },
      ];
    }
  }, [id]);

  const fetchSoNotifications = () => {
    setLoading(true);
    getCategoryWiseNotify("SO", loggedInUser?.empId)
      .then((data) => {
        /*{Sorting by read status}*/
        let newData = [];
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
 

  const handleSOSenderNotification = () => {
    setLoading(true);
    getCategorySenderWiseNotify("SO", loggedInUser?.empId)
      .then((data) => {
        let newData = [];
        // let newData = [...data];
        // newData.sort((a, b) => {
        //   const aReadStatus = a.readStatusString === "Read";
        //   const bReadStatus = b.readStatusString === "Read";
        //   if (aReadStatus && !bReadStatus) {
        //     return 1;
        //   } else if (!aReadStatus && bReadStatus) {
        //     return -1;
        //   } else {
        //     return 0;
        //   }
        // });
        data.forEach((element) => {
          const updatedElement = { ...element };
  
          if (updatedElement.notificationName && updatedElement.notificationName.includes("received")) {
            updatedElement.notificationName = updatedElement.notificationName.replace(
              "received",
              "sent"
            );
          }
  
          if (!newData?.map((item) => item?.notificationName)?.includes(updatedElement?.notificationName)) {
            newData.push(updatedElement);
          }
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
    if (id === 3) {
      fetchSoNotifications();
       axiosInstance.post("notification/updateLatest", {categories: ["SO", "SO_ALLOTMENT"]})
      .then(() => {
        reset();
      })
      .catch(console.log);
    } else if (id === 100) {
      handleSOSenderNotification();
    } else {
      setRecords([]);
    }

   
  }, [id, loggedInUser?.empId]);

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
                    }}
                  >
                    View
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  setSoId(rowData?.categoryId);
                  setNotificationId(rowData?.id);
                },
              },
            ]}
          />
        </Grid>
      </Grid>
      {open ? (
        <PreviewMain
          setOpen={setOpen}
          open={open}
          soId={soId}
          recordsId={notificationId}
          fetchSoNotifications={fetchSoNotifications}
          handleSOSenderNotification={handleSOSenderNotification}
          props={props}
        />
      ) : null}
    </>
  );
}
