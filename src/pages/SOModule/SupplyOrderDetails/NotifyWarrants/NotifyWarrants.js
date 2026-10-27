import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Typography } from "antd";
import Button from "components/Button";
import TableComponent from "components/table";
import { USER_DEPARTMENT, USER_ROLE_ID } from "Globals.js";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { getSubordinatesByEmpUrl, getWarranNotify, warrantDetails } from "pages/Services/URLs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getWarranNotifys, NotifyCqaeAndJcqao } from "Redux/Actions/SupplyOrder/SOAction";
import { DialogContent, DialogTitle } from "Utils";
import * as yup from "yup";

const defaultValues = {
  qaRecievers: null,
  firmRecievers: null,
};

export default function NotifyWarrants({ onClose, soObj, refresh,data }) {
  const [userList, setUserList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allotedData, setAllotedData] = useState([]);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const dispatch = useDispatch();
  const isHosRole =
    loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;

    

  const schema = yup.object().shape({
    // qaRecievers: yup
    //   .string()
    //   .nullable()
    //   .notRequired()
    //   .when(() => {
    //     if (!isHosRole) {
    //       return yup
    //         .array()
    //         .nullable()
    //         .min(1, "Required")
    //         .required("Required")
    //         .typeError("Required");
    //     }
    //   }),
    firmRecievers: yup
      .array()
      .nullable()
      .min(1, "Required")
      .required("Required")
      .typeError("Required"),
  });
  const {
    handleSubmit,
    watch,
    control,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    setSaving(true);

    const payload = {
      allotedToIds : data?.firmRecievers.map((el) => el.id),
      allotedBy: loggedInUser?.empId,
      warrantId : soObj.id
    }
      //  const formData = new FormData();
    // formData.append(
    //   "qaRecievers",
    //   isHosRole ? "" : data?.qaRecievers.map((el) => el.id).join(",")
    // );
  //   formData.append(
  //     "allotedToIds",
  //     [data?.firmRecievers.map((el) => el.id).join(",")]
  //   );
  //   formData.append("allotedBy", loggedInUser?.empId);
  //  formData.append("warrantId", soObj.id);
    dispatch(getWarranNotifys(payload)).then(() => {
      refresh();
      onClose();
    });
 
    setSaving(false);
  };

  const getCombinedUserList = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstanceT(`allot/warrant/${soObj?.id}?deptTypeId=2`)
      setUserList(data?.emps);
      setAllotedData(data?.warrantAllotmentDtos);
    } catch (error) {
      toast.error("Failed to get user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCombinedUserList();
  }, [isHosRole]);

  const columns = [
    { title: "Notify By", field: "allotedByName", width: "auto" },
    { title: "Notify To", field: "allotedToName", width: "auto" },
    { title: "Time&Date", field: "createdAt", width: "auto" },
  ];

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}> <b>Notify/Allot</b> <br/>Warrant No: {soObj?.categoryName}, EpCode:{soObj?.partNo}</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* {!isHosRole && (
            <Controller
              name="qaRecievers"
              control={control}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                return (
                  <Autocomplete
                    multiple
                    fullWidth
                    options={userList?.qaUsers || []}
                    value={value || []}
                    filterSelectedOptions
                    loading={loading}
                    onChange={(event, newValue) => onChange(newValue)}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        {...params}
                        size="small"
                        label="Select Inspection Agency Users"
                        //   placeholder="Select Users"
                        aria-describedby="my-helper-text"
                        error={!!errors?.qaRecievers}
                        helperText={errors?.qaRecievers?.message}
                      />
                    )}
                  />
                );
              }}
            />
          )} */}

          {/* <Typography style={{fontWeight: "semi-bold"}}>Allot new user:</Typography> */}
          <Controller
            name="firmRecievers"
            control={control}
            render={({ field: { onChange, value }, formState: { errors } }) => {
              return (
                <Autocomplete
                  multiple
                  fullWidth
                  options={userList || []}
                  value={value || []}
                  onChange={(event, newValue) => onChange(newValue)}
                  getOptionLabel={(option) => option?.name || option?.ename}
                  getOptionSelected={(option, value) => option.id === value.id}
                  filterSelectedOptions
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      variant="outlined"
                      {...params}
                      id="my-input"
                      label="Select Firm Users*"
                      size="small"
                      //   placeholder="Select Users"
                      aria-describedby="my-helper-text"
                      error={!!errors.firmRecievers}
                      helperText={errors?.firmRecievers?.message}
                    />
                  )}
                />
              );
            }}
          />

          <TableComponent
            isLoading={loading}
            data={allotedData}
            columns={columns}
            title={`Warrant Notification history:`}
            options={{
              search : false,
              paging: false,
              filtering: false
            }}
          />

        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={saving}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          size="small"
          variant="contained"
          style={{ textTransform: "capitalize" }}
        >
          {saving && <CircularProgress size={24} />} Send
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
