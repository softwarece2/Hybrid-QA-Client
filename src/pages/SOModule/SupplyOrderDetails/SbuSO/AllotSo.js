import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Button from "components/Button";
import { USER_DEPARTMENT, USER_ROLE_ID } from "Globals.js";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NotifyCqaeAndJcqao } from "Redux/Actions/SupplyOrder/SOAction";
import { DialogContent, DialogTitle } from "Utils";
import * as yup from "yup";
import SbuSoTable from "./SbuSoTable";
import TableComponent from "components/table";

const defaultValues = {
  qaRecievers: null,
  firmRecievers: null,
};

export default function AllotSo({ onClose, soObj, refresh }) {
  const [userList, setUserList] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [isnotify, setIsNotify] = useState(false);
  const [allotedData, setAllotedData] = useState([]);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const dispatch = useDispatch();

  const isHosRole =
    loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;

  // ✅ UPDATED SCHEMA (NO REQUIRED VALIDATION)
  const schema = yup.object().shape({
    qaRecievers: yup.array().nullable().notRequired(),
    firmRecievers: yup.array().nullable().notRequired(),
  });

  const { handleSubmit, watch, control } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const getCombinedUserList = async () => {
    setLoading(true);
    try {
      // const { data } = await axiosInstance("employee/getAllHoSByDeptId/" + 2);
      const { data } = await axiosInstanceT(`allot/so/${soObj?.id}?deptTypeId=2`);
      setUserList(data);
      setAllotedData(data?.soAllotmentDtos);
    } catch (error) {
      toast.error("Failed to get user list");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCombinedUserList();
  }, [isHosRole]);

  const onSubmit = (data) => {
    const hasQA =  (data?.qaUsers && data.qaUsers.length > 0);
 
    const hasQC = data?.qcUsers && data.qcUsers.length > 0;
  
    if (!hasQA && !hasQC) {
     
      toast.error("Please select atleast one user."); 
      return; 
    }
    setSaving(true);

    const formData = new FormData();

    formData.append(
      "qaRecievers",
      isHosRole
        ? ""
        : data?.qaUsers?.map((el) => el.id).join(",") || ""
    );

    formData.append(
      "firmRecievers",
      data?.qcUsers?.map((el) => el.id).join(",") || ""
    );

    formData.append("empId", loggedInUser?.empId);
    formData.append("soId", soObj.id);

    dispatch(NotifyCqaeAndJcqao(formData)).then(() => {
      refresh();
      onClose();
      setNotifySuccess(true);
      setIsNotify(true); // ✅ trigger table update if needed
    });

    setSaving(false);
  };
  const columns = [
    { title: "Organization Type", field: "orgType", width: "auto" },
    { title: "Notified By", field: "allotedByName", width: "auto" },
    { title: "Notified To", field: "allotedToName", width: "auto" },
    { title: "Date Time", field: "createdDate", width: "auto" },
  ];


  return (
    <>
      {isnotify && <SbuSoTable notifySuccess={notifySuccess} />}

      <Dialog open maxWidth="md" fullWidth>
        <DialogTitle onClose={onClose}>Notify/Allot SO (SO No.: {soObj?.orderNo})</DialogTitle>

        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {!isHosRole && (
              <Controller
                name="qaUsers"
                control={control}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    options={userList?.qaUsers || []}
                    value={value || []}
                    filterSelectedOptions
                    loading={loading}
                    onChange={(e, newValue) => onChange(newValue)}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(o, v) => o.id === v.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Select Inspection Agency Users"
                        error={!!errors.qaRecievers}
                        helperText={errors?.qaRecievers?.message}

                      />
                    )}
                  />
                )}
              />
            )}

            <Controller
              name="qcUsers"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  // options={
                  //   (isHosRole
                  //     ? subordinateLists
                  //     : userList?.qcUsers) || []
                  // }
                  options={userList?.qcUsers || []}
                  value={value || []}
                  onChange={(e, newValue) => onChange(newValue)}
                  getOptionLabel={(o) => o?.name || o?.ename}
                  getOptionSelected={(o, v) => o.id === v.id}
                  filterSelectedOptions
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      label="Select Firm Users*"
                    />
                  )}
                />
              )}
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
        {/* <Typography style={{textAlign : "center"}}> <b>SO/PO Notification history:</b></Typography> */}
        
        <div style={{margin: "10px"}}>
        <TableComponent
          isLoading={loading}
          data={allotedData}
          columns={columns}
          title="SO/PO Notification history:"
          options={{
            search: false,
            paging: false,
            filtering: false
          }}
          />
          </div>
      </Dialog>
    </>
  );
}