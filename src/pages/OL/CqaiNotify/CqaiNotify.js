import {
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
  TextField,
  Typography,
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
import TableComponent from "components/table";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";

//IVNV Observation Added Required Validation Modified by:Shruti Sanjay Date:08-07-2026
const schema = yup.object().shape({
  selectedUsers: yup
    .array()
    .min(1, "Please select at least one user")
    .required("Required"),
});


export default function CqaiNotify({
  onClose,
  selectedRow,
  isINote,
  refresh,
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
  const [allotedData, setAllotedData]= useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedUsers: [],
    },
  });
  
  const isHosRole =
  loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS &&
  loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;

console.log(dataVal,"soObj")
  // useEffect(() => {
  //   if (deptId) {
  //     setLoadingUsers(true);
  //     let url = `employee/getActiveParentEmpByIdDeptId/${seniorityId}/${deptId}`;
  //     if (
  //       roleId === USER_ROLE_ID.ROLE_HOS &&
  //       departmentTypeId === DEPARTMENT_ID.ASSEMBLY &&
  //       !isINote
  //     ) {
  //       url = "employee/getAllActiveHOD";
  //     }
  //     if (
  //       (roleId === USER_ROLE_ID.ROLE_EXAMINER ||  
  //         roleId === USER_ROLE_ID.ROLE_GIC ||
  //         roleId === USER_ROLE_ID.ROLE_HOS) &&
  //         departmentTypeId === DEPARTMENT_ID.QC &&
  //       !isINote
  //     ) {
  //       url = `employee/getActiveSubOrdinateEmpByIdDeptId/${seniorityId}/${deptId}`;
  //     }
  //      if ( roleId === USER_ROLE_ID.ROLE_DO) {
  //       url = `employee/getDcAcDac`;
  //     }

  //     axiosInstance(url)
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

  // function handleSubmit() {
    const onSubmit = (formData) => {
    setLoading(true);

    const selecteduserIds = formData.selectedUsers.map((user) => user.id);

    // let url = `offerLetter/notifyFirmEmployee/${selectedRow?.id || selectedRow?.olId || selectedRow?.offerLetterId}/${empId}`;
    let req = selecteduserIds;

    // if (departmentId === DEPARTMENT_ID.QC && !isINote) {
     let url = `allot/ol/allotSubordinate`;
      req = {
        offerLetterId:dataVal?.id,
        offerLetterName: dataVal.olNumber,
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
        toast.error("Failed to notify, please try again");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const handleChange = (event, newValue) => {
    setSelectedUser(newValue);
    console.log("Selected Users:", newValue);
  };

  const getCombinedUserList = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstanceT(`allot/ol/${dataVal?.id}?deptTypeId=2`)
      setUserList(data?.emps);
      setAllotedData(data?.olAllotmentDtos);
    } catch (error) {
      toast.error("Failed to get user list");
    } finally {
      setLoading(false);
    }
  };
console.log(userList , "uer123");
  useEffect(() => {
    getCombinedUserList();
  }, [isHosRole]);


  const columns = [
    {title:"Alloted By", field:"allotedByName", width: "auto"},
    {title:"Alloted To", field:"allotedToName", width: "auto"},
    {title:"Time&Date", field:"createdDate", width: "auto"},
  ]

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Notify/Allot  <b>(EP Code: {dataVal?.epCode}, OL No. : {dataVal?.olNumber})</b></DialogTitle>
      <DialogContent>
        <div>
        <Controller
              name="selectedUsers"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
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
                      error={!!errors.selectedUsers}
                      helperText={errors.selectedUsers?.message}
                    />
                  )}
                />
              )}
            />
          {loadingUsers && <LinearProgress />}
        </div>
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
      <Typography style={{textAlign:"center"}}><b>OL Allotment History</b></Typography>
      <TableComponent
      isLoading={loading}
      data={allotedData}
        columns={columns}
        title =""
        options={{
          search : false,
          paging: false,
          filtering: false
        }}
      />
    </Dialog>
  );
}
