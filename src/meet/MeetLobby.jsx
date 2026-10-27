import { Button } from "@material-ui/core";
import { useState } from "react";

import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { useDispatch, useSelector } from "react-redux";
import UserList from "./UserList";
import { OPEN_RI } from "Redux/Types";

export default function MeetLobby({ rowData, selectedUploadRow, olNumber,onClose }) {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [checkedUsers, setCheckedUsers] = useState([]);

  const joinRoom = async () => {
    if (checkedUsers.length <= 0) {
      alert("Please select at least one user/inspector");
      return;
    }
try {
  await  axiosInstance.post(
    "remoteInspection/sendWebcamLink",
    checkedUsers.map((el) => +el),
    {
      params: {
        // meetingId: roomId,
        empName: loggedInUser.ename,
        olId: rowData.offerLetterId,
        olNumber: olNumber,
        lineItemNo: rowData?.soLineItemNo,
      },
    }
  );
  onClose();
  //TODO: check the rowData 
  
  dispatch({ type: OPEN_RI, olNumber, lineItemNo: rowData?.soLineItemNo, devId: rowData.devId, testId:rowData.testId, productId:rowData.productId,  testName:rowData.testName  });

} catch (error) {
  console.log(error);
    onClose();
  dispatch({ type: OPEN_RI, olNumber, lineItemNo: rowData?.soLineItemNo, devId: rowData.devId, testId:rowData.testId, productId:rowData.productId,  testName:rowData.testName  });
}
  };

  return (
    <div style={{ textAlign: "center" }}>
      <UserList olId={rowData?.offerLetterId} setChecked={setCheckedUsers} checked={checkedUsers} />

      <Button variant="contained" color="primary" onClick={joinRoom}>
        Send Notification
      </Button>
    </div>
  );
}
