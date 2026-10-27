import {
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
//
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { DEPARTMENT_ID, USER_DEPARTMENT, USER_ROLE_ID } from "Globals.js";

export default function NotifyDo({
  onClose,
mergedDetails,
  isINote,
  refresh,
}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const deptId = loggedInUser?.departmentId;
  const roleId = loggedInUser?.roleId;
  const empId = loggedInUser?.empId;
  const seniorityId = loggedInUser?.seniority;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const [selectedUser, setSelectedUser] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const departmentTypeIds = USER_DEPARTMENT?.QC
console.log(userList,"userList")
  useEffect(() => {
   
      let url = `employee/getAllActiveDoBydepTypeId/${departmentTypeIds}`;
         axiosInstance(url)
        .then(({ data }) => {
          console.log(data);
          setUserList(data);
        })
        .catch(console.log)
        .finally(() => {
          setLoadingUsers(false);
        });
    
  }, [departmentTypeIds]);

  function handleSubmit() {
    setLoading(true);

    const selecteduserIds = selectedUser.map((user) => user.id);

    // let url = `offerLetter/notifyFirmEmployee/${selectedRow?.id || selectedRow?.olId || selectedRow?.offerLetterId}/${empId}`;
    let req = selecteduserIds;

    // if (departmentId === DEPARTMENT_ID.QC && !isINote) {
     let url = `allot/mergeSubSlip/allotSubordinate`;
      req = {
        mergedOlId: mergedDetails?.mergedOlId,
        mergedOlNo: mergedDetails?.mergedOlNo,
        allotedBy: empId,
        allotedTo: selecteduserIds,
        isDeligation: false,
      };
    // }

    axiosInstanceTrans
      .post(url, req)
      .then(() => {
        onClose();
        toast.success("Notification sent Successfully");
        refresh();
      })
      .catch((e) => {
        console.log(e);
        // toast.error("Failed to notify, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleChange = (event, newValue) => {
    setSelectedUser(newValue);
    console.log("Selected Users:", newValue);
  };

  return (
    <Dialog open maxWidth="xs" fullWidth>
      <DialogTitle onClose={onClose}>Notify/Allot</DialogTitle>
      <DialogContent>
        <div>
          <Autocomplete
            id="combo-box-demo"
            multiple
            fullWidth
            options={(userList?.users) ||[]}
            value={selectedUser || []}
            onChange={(event, newValue) => handleChange(event, newValue)}
            getOptionLabel={(option) => option?.name}
            getOptionSelected={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                {...params}
                id="my-input"
                size="small"
                placeholder="Select Users"
                aria-describedby="my-helper-text"
              />
            )}
          />
          {loadingUsers && <LinearProgress />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          color="primary"
          size="small"
          variant="contained"
          style={{ textTransform: "capitalize" }}
        >
          {loading && <CircularProgress size={24} />} Send
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          size="small"
          variant="contained"
          style={{ textTransform: "capitalize" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
