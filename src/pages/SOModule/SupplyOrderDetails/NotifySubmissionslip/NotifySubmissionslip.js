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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NotifyCqaeAndJcqao } from "Redux/Actions/SupplyOrder/SOAction";
import { DialogContent, DialogTitle } from "Utils";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import * as yup from "yup";
import TableComponent from "components/table";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllNotifyToEmpByDeptId, getSubordinatesByEmpUrl, notifyAllotSubSlip } from "pages/Services/URLs";

const defaultValues = {
  qaRecievers: null,
  firmRecievers: null,
};

export default function NotifySubmissionslip({ onClose, soObj, refresh,selectedRow }) {
  const [userList, setUserList] = useState(null);

  const [subordinateLists, setSubordinateLists] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allotedData, setAllotedData] = useState([]);

  const loggedInUser = useSelector((state) => state?.loggedInUser);
   const [selectedUser, setSelectedUser] = useState([]);
     const empId = loggedInUser?.empId;
  const dispatch = useDispatch();

  const getCombinedUserList = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance("employee/getAllHoSByDeptId/" + 2);
      setUserList(data);
    } catch (error) {
      toast.error("Failed to get user list");
    } finally {
      setLoading(false);
    }
  };

  const isHosRole =
    loggedInUser.roleId === USER_ROLE_ID.ROLE_HOS &&
    loggedInUser.departmentTypeId === USER_DEPARTMENT.ASSEMBLY;

  const schema = yup.object().shape({
 
    firmRecievers: yup.array()
    .typeError("Required")
      .min(1, "Required")
      .required("Required"),
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues:{
      firmRecievers: []
    },
  });

  const onSubmit = (data) => {
    setSaving(true);

    const formData = new FormData();
    formData.append(
      "firmRecievers",
      data?.firmRecievers.map((el) => el.id).join(",")
    );
    formData.append("empId", loggedInUser?.empId);
    formData.append("soId", soObj.id);
    dispatch(NotifyCqaeAndJcqao(formData)).then(() => {
      refresh();             
      onClose();
    });
    setSaving(false);
   };

   const getSubordinatesByEmpId = () => {
axiosInstanceTrans
.get(notifyAllotSubSlip + soObj.id)
.then((res) => setSubordinateLists(res?.data?.emps || []))
.catch((err) => console.log("error in getSubordinatesByEmpId" + err));
};
console.log(subordinateLists,"subordinateListssubordinateLists")
useEffect(() => {
getSubordinatesByEmpId()
}, []);

const onFormSubmit = (data) => {
    setLoading(true);
 
    const selecteduserIds = data.firmRecievers.map((user) => user.id);
    // let url = `offerLetter/notifyFirmEmployee/${selectedRow?.id || selectedRow?.olId || selectedRow?.offerLetterId}/${empId}`;
    let req = selecteduserIds;

    // if (departmentId === DEPARTMENT_ID.QC && !isINote) {
     let url = `allot/subSlip/allotSubordinate`;
      req = {
        offerLetterId:soObj?.id,
        offerLetterName: selectedRow.offerLetterName,
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
  }
  const getCombinedUserLists = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstanceT(`allot/subSlip/${soObj?.id}`);
      setUserList(data?.emps);
      setAllotedData(data?.subSlipAllotmentDtos)
    } catch (error) {
      toast.error("Failed to get user list");
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    getCombinedUserLists();
  }, [isHosRole]);


  const columns =[ 
    {title : "Alloted By" , field:"allotedByName", width: "auto" },
    {title : "Alloted To" , field:"allotedToName", width: "auto" },
    { title: "Time & Date", field: "createdDate", width: "auto" },

  ]
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Notify QC Users (S.Slip No.: {soObj?.olNumber} )</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <Controller
            name="firmRecievers" 
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <Autocomplete
                  multiple
                  fullWidth
                  options={subordinateLists || []}
                  value={value || []}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  getOptionLabel={(option) => option?.name || ""}
                  getOptionSelected={(option, value) => option.id === value.id}
                  filterSelectedOptions
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select QC Users*"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              );
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={saving}
          onClick={handleSubmit(onFormSubmit)} 
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
      <Typography style={{textAlign : "center"}}><b>Submission-Slip alloment history</b></Typography>
      <div style={{margin: "10px"}}>
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
          </div>

    </Dialog>
  );
}
