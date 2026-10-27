import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";

import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { useSelector } from "react-redux";
import UserListCameraRequest from "./UserListCameraRequest";
// import { OPEN_RI } from "Redux/Types";
import { getAllCameraRequests, saveCameraRequest } from "pages/Services/URLs";
import { toast } from "react-toastify";
import TableComponent from "components/table/index";

export default function CameraRequest({ olId, testId, testName, onClose, olLiId, devId, ol }) {
    const loggedInUser = useSelector((store) => store.loggedInUser);
    const [checkedUsers, setCheckedUsers] = useState([]);
    const [records, setRecords] = useState([]);

    const [columns] = useState([
        { title: "Test Name", field: "testName", width: "auto", filtering: true },
        { title: "Date and Time", field: "dateTime", width: "auto", sorting: true },
        { title: "Requested By", field: "requestedBy", width: "auto", filtering: true },
        // { title: "Requested To", field: "requestedTo", width: "auto", filtering: true },
        {
            title: "Requested To",
            field: "requestedTo",
            width: "auto",
            filtering: true,
            // Custom render logic
            render: (row) => row.notifiedUsers?.map( u => u?.notifiedUser)?.join(", ") || "N/A"
        },
        {
            title: "Reviewed By", field: "approvedBy", width: "auto", filtering: true
        },
        { title: "Status", field: "statusName", width: "auto", filtering: true },
    ]);

    const getData = async () => {
        try {
            const { data } = await axiosInstanceAte(getAllCameraRequests + "?testId=" + testId)
            // console.log("wwawa:", JSON.stringify(data));
            setRecords(data);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }
    let accessRequestDisablingFlag = false;

    const requestCamera = async () => {
        if (checkedUsers.length <= 0) {
            alert("Please select at least one user/inspector");
            return;
        }
        {/* Check for existing access pending approval (statusId 1) and pre-emptively stop the API call */ }
        const { data } = await axiosInstanceAte(getAllCameraRequests);
        const existingRecord = data.find(item =>
            item.testId === testId);
        if (existingRecord?.statusId === 1) {
            // alert(`Camera Access Request for ${testName} is pending approval.`)
            accessRequestDisablingFlag = true;
            toast.info(`Camera Access Request for ${testName} is pending approval.`)
            return;
        }
        try {
            console.log(
                "ol " + JSON.stringify(ol)
            );

            // await axiosInstance.post(saveCameraRequest, {
            //     olId: olId,
            //     testId: testId,
            //     testName: testName,
            //     requestedBy: loggedInUser.empId,
            //     statusId: 1,
            //     // dateTime: new Date().toLocaleString(),
            //     approvedBy: null
            //     // requestedTo: checkedUsers
            // });
            await axiosInstanceAte.post(saveCameraRequest, {
                olId: olId,
                olLiId: olLiId,
                testId: testId,
                devId:devId,
                requestedById: loggedInUser.empId,
                statusId: 1,
                // dateTime: new Date().toLocaleString(),
                // approvedBy: "",
                notifiedUserIds: checkedUsers
            });
            toast.success(`Camera access request for test ${testName} sent successfully.`)
            onClose();

        } catch (error) {
            console.log(error);
            toast.error(`Failed to send camera access request for test ${testName}.`)
            onClose();
            //TODO: check the rowData 

            // dispatch({ type: OPEN_RI, olNumber, lineItemNo: rowData?.soLineItemNo, devId: rowData.devId, testId: rowData.testId, productId: rowData.productId, testName: rowData.testName });
        }
    };

    useEffect(()=>{
        getData();
    }, [])
    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <UserListCameraRequest olId={olId} setChecked={setCheckedUsers} checked={checkedUsers} />

                <Button variant="contained" color="primary" onClick={requestCamera}>
                    Send Notification
                </Button>
            </div>
            <TableComponent
                data={records}
                columns={columns}
                title=""
            // options={{ filtering: false, sorting: false }}
            />
        </div>
    );
}
