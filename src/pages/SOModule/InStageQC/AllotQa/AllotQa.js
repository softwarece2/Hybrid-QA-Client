import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
//
import * as yup from "yup";

import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { DEPARTMENT_ID, USER_ROLE_ID } from "Globals.js";
import TableComponent from "components/table";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

const schema = yup.object().shape({
  selectedUsers: yup.array()
  .typeError("Required")
    .min(1, "Please select at least one user")
    .required("Select atleast one user"),
});

export default function AllotQa({
  onClose,
  selectedRow,
  isINote,
  refresh,
  records,
  soObj,
  dataVal
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
  const [allotedData, setAllotedData] = useState([]);

console.log(soObj,"soObj11")
  // useEffect(() => {
  //   if (deptId) {
  //     setLoadingUsers(true);
  //  let  url = `employee/getActiveSubOrdinateEmpByIdDeptId/${seniorityId}/${deptId}`;
  //      axiosInstance(url)
  //       .then(({ data }) => {
  //         console.log(data);
  //         setUserList(data);
  //       })
  //       .catch(console.log)
  //       .finally(() => {
  //         setLoadingUsers(false);
  //       });
  //   } else {
  //     toast.info(
  //       "We couldn't retrieve the employee list because your account doesn't have a department assigned."
  //     );
  //   }
  // }, [departmentId, deptId, empId, roleId, seniorityId, isINote]);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      selectedUsers: []
    }
  });



  const onSubmit = (data) => {
    setLoading(true);

    const selecteduserIds = data.selectedUsers.map((user) => user.id);

    // let url = `offerLetter/notifyFirmEmployee/${selectedRow?.id || selectedRow?.olId || selectedRow?.offerLetterId}/${empId}`;
    let req = selecteduserIds;

    // if (departmentId === DEPARTMENT_ID.QC && !isINote) {
     let url = `allot/subSlip/allotSubordinate`;
      req = {
        offerLetterId:soObj?.id,
        offerLetterName: soObj.olNumber,
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
console.log(records,"recordsrecords")


const getCombinedUserList = async () => {
  setLoading(true);
  try {
    const { data } = await axiosInstanceT(`allot/subSlip/${soObj?.id}`)
    setUserList(data?.emps);
    setAllotedData(data?.subSlipAllotmentDtos);
  } catch (error) {
    toast.error("Failed to get user list");
  } finally {
    setLoading(false);
  }
};
console.log(userList , "uer123");
useEffect(() => {
  getCombinedUserList();
}, []);



const columns = [
  { title: "Alloted By", field: "allotedByName", width: "auto" },
  { title: "Alloted To", field: "allotedToName", width: "auto" },
  { title: "Time&Date", field: "createdDate", width: "auto" },
];

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Allot (S.Slip No: {soObj?.olNumber})</DialogTitle>
      <DialogContent>
        <Grid>
          <Controller
            name="selectedUsers"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  fullWidth
                  options={userList}
                  value={value || []}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      placeholder="Select Users*"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              );
            }}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
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
      <Typography style={{textAlign:"center"}}>S.Slip allotment history:</Typography>
      <TableComponent
          isLoading={loading}
          data={allotedData}
          columns={columns}
          title=""
          options={{
            search: false,
            paging: false,
            filtering: false
          }}
        />
    </Dialog>
  );
}
