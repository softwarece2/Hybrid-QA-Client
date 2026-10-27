/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import "../../../App.css";

//component
import TableComponent from "components/table/index";

//material-ui
import { Grid } from "@material-ui/core";
import { getCategorySenderWiseNotify, getCategoryWiseNotify } from "Redux/Actions/Notifications/UnreadNotificationAction";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useNotification } from "context/notification";
import ActionButton from "components/ActionButton";
import CreateOl from "pages/OL/CreateOl/CreateOl";
import OfferLetterView from "pages/OL/CreateOl/OfferLetterView";
import { USER_ROLE } from "Redux/Types";
import { USER_ROLE_ID } from "../../../Globals";
export default function OLNotification(props) {
  const {id} = props;
    const { reset} = useNotification();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [soId, setSoId] = useState("");
  const [notificationId, setNotificationId] = useState("");
  
  const columns = useMemo(() => {
    if (id === 300) {
      return [
        { title: "Notifications", field: "notificationName", width: "auto" },
        { title: "EP Code", field: "epcode", width: "auto" },
        { title: "Inspection Agency", field: "inspAgency", width: "auto" },
        { title: "SO/PO Number", field: "soNumber", width: "auto" },
        // { title: "Sender", field: "sbuName", width: "auto", sorting: true },
        { title: "Sent to", field: "receiverName", width: "auto" }, 
        {
          title: "Date and Time",
          field: "createdDateTime",
          width: "auto",
          filtering: true,
        },
      ];
    } else {
      return [
        { title: "Notifications", field: "notificationName", width: "auto" },
        { title: "EP Code", field: "epcode", width: "auto" },
        { title: "Inspection Agency", field: "inspAgency", width: "auto" },
        { title: "SO/PO Number", field: "soNumber", width: "auto" },
        // { title: "Sender", field: "sbuName", width: "auto", sorting: true },
        { title: "Received From", field: "senderName", width: "auto" },
        {
          title: "Date and Time",
          field: "createdDateTime",
          width: "auto",
          filtering: true,
        },
      ]
    };
  }, 
    [id]);

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const fetchOlNotifications = () => {
    setLoading(true);
    getCategoryWiseNotify("OL", loggedInUser?.empId)
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
const isDC = loggedInUser.roleId === USER_ROLE_ID.ROLE_DC ;
  // useEffect(() => {
  //   fetchOlNotifications();
  //   console.log("inside sbu so import");
  // }, [loggedInUser]);

  const handleOLSenderNotification = () => {
    setLoading(true);
    getCategorySenderWiseNotify("OL", loggedInUser?.empId)
      .then((data) => {
        let newData = [];
        
        data.forEach((element) => {
          const updatedElement = { ...element };
  
          if (updatedElement.notificationName && updatedElement.notificationName.includes("received for approval")) {
            updatedElement.notificationName = updatedElement.notificationName.replace(
              "received for approval",
              "sent for approval"
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
    if (id === 4) {
      fetchOlNotifications();
       axiosInstance.post("notification/updateLatest",{categories: ["OL", "OL_ALLOTMENT"]})
      .then(() => {
        reset();
      })
      .catch(console.log);
    } else if (id === 300) {
      handleOLSenderNotification();
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
          actions={[
  ...(isDC 
    ? [{
        icon: () => (
          <ActionButton
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            ViewOL
          </ActionButton>
        ),
        onClick: (event, rowData) => {
          setSoId(rowData?.mergeSubSlipId);
          setNotificationId(rowData?.id);
        },
      }] 
    : [])
]}
            
            // options={{ filtering: false, sorting: false }}
          />
        </Grid>
      </Grid>
      {open ? (
        <OfferLetterView
          setOpen={setOpen}
          open={open}
          soId={soId}
          recordsId={notificationId}
          // fetchSoNotifications={fetchSoNotifications}
          // handleSOSenderNotification={handleSOSenderNotification}
        />
      ) : null}
    </>
  );
}
