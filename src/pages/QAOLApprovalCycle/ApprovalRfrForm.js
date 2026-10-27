/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import {
    Chip,
    Dialog,
    DialogActions,
    FormControl,
    FormLabel,
    Grid,
    InputLabel,
    LinearProgress, Typography
} from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";
import Button from "components/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AutoCompleteNew from "components/AutoCompleteNew";
import { DEPARTMENT_ID, OL_STATUS, USER_ROLE_ID } from "Globals.js";

const useStyles = makeStyles({
  acceptColor: {
    "&.Mui-selected": {
      color: "#327642",
      backgroundColor: "#B1E9AF",
    },

    "&:hover": {
      backgroundColor: "#B1E9AF !important",
      color: "#327642",
    },
  },
  rejectColor: {
    "&.Mui-selected": {
      backgroundColor: "#E9AFAF",
      color: "#d32f2f",
    },
    "&:hover": {
      backgroundColor: "#E9AFAF !important",
      color: "#d32f2f",
    },
  },
  rfrcolor: {
    "&.Mui-selected": {
      backgroundColor: "#ffc981",
      color: "#814900",
    },
    "&:hover": {
      backgroundColor: "#ffc981 !important",
      color: "#814900",
    },
    paddingRight: "20px",
  },
});

const defaultValues = { remarks: "" };

export default function ApprovalRfrForm({ offerLetter, getAllTableData, onClose }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const seniorityId = loggedInUser?.seniority;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  
  const roleId = loggedInUser?.roleId;

  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const [nextEmployees, setNextEmployees] = useState([]);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { nextApprover: null, olStatus: null, remarks: "" },
  });

  const onFormSave = (data) => {
    if (data.remarks.trim()) {
      setSubmitting(true);
      const req = {
        offerLetterId: offerLetter.id,
        createdBy: loggedInUser.empId,
        remarks: data.remarks,
        nextApproverId: data.nextApprover?.id,
        olStatus: data.olStatus ?? null,
        isRfr: data.olStatus == OL_STATUS.RFR ? true : data.olStatus == OL_STATUS.APPROVE ? false : undefined,
      };

      const formData = new FormData();
      formData.append("olApprovalDtoStr", JSON.stringify(req));
      for (let i = 0; i < selectedFileToUpload.length; i++) {
        formData.append("uploads", selectedFileToUpload[i]);
      }

      axiosInstanceTrans
        .post("olApproval/updateInternalOlApproval", formData)
        .then(() => {
          toast.success("Updated successfully");
          reset(defaultValues);
          getAllTableData(offerLetter.id);
          onClose();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update!, try again");
        })
        .finally(() => setSubmitting(false));
    } else {
      toast.error("Fill the Remarks");
    }
  }

  const watchOlStatus = watch("olStatus");

  useEffect(() => {
    let url = `employee/getActiveParentEmpByIdDeptId/${seniorityId}/${departmentId}`;

    if (+watchOlStatus === OL_STATUS.RECTIFICATION && roleId !== USER_ROLE_ID.ROLE_EXAMINER) {
      url = `employee/getActiveSubOrdinateEmpByIdDeptId/${seniorityId}/${departmentId}`;
    } else if (+watchOlStatus ===  OL_STATUS.RFR) {
      url = `employee/getAllActiveHOD`;
    }

    axiosInstance(url)
      .then(({ data }) => {
        setNextEmployees(data);
      })
      .catch((err) => console.log(err));
  }, [departmentId, roleId, seniorityId, watchOlStatus]);

  const handleUploadImage = (e) => {
    const files = e.target.files;
    const newArr = [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    setSelectedFileToUpload((ps) => [...ps, ...newArr]);
  };
  const handleDeleteFile = (name) => {
    const filterFile = selectedFileToUpload.filter((el) => el.name !== name);
    setSelectedFileToUpload(filterFile);
  };

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle onClose={onClose} style={{ fontSize: "0.875" }}>
       Enter Remarks (RFR Cycle)
      </DialogTitle>
      <DialogContent>
        {submitting && <LinearProgress />}
        <form onSubmit={handleSubmit(onFormSave)}>
          <MuiTextField
            {...register("remarks", {
              maxLength: {
                message: "The text is too long.  Please enter up to 1000 characters.",
                value: 1000,
              },
              minLength: {
                value: 5,
                message: "Please enter at least 5 characters.",
              },
              required: {
                message: "Required",
                value: true,
              },
            })}
            labelText="Remarks"
            placeholder="Enter Remarks"
            multiline
            minRows={4}
            required
            maxRows={10}
            variant="outlined"
            fullWidth
            error={!!errors?.remarks}
            helperText={errors.remarks?.message}
          />

          <div style={{ margin: "12px 0px 0px 0px" }}>
            <Grid container spacing={2}>
              {roleId !== USER_ROLE_ID.ROLE_EXAMINER && (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="olStatus"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <FormControl>
                        <FormLabel style={{fontSize:14}}>Send for</FormLabel>
                        <ToggleButtonGroup  value={value} exclusive onChange={(e, v) => onChange(v)} size="small">
                          <ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.acceptColor}
                            value={OL_STATUS.APPROVE}
                          >
                            Approval
                          </ToggleButton>
                          <ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.rejectColor}
                           value={OL_STATUS.RECTIFICATION}
                          >
                            {departmentTypeId === DEPARTMENT_ID.QC ? "Testing" : "Rectification" }
                          </ToggleButton>
                          {roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC &&  (<ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.rfrcolor}
                            value={OL_STATUS.RFR}
                          >
                            RFR
                          </ToggleButton>)}
                        </ToggleButtonGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

                <Grid item xs={12} sm={8} md={6} lg={3} xl={3}>
                  <Controller
                    name="nextApprover"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <AutoCompleteNew
                        labelText="Select Next Approver"
                        data={nextEmployees}
                        getOptionLabel={(o) => o?.ename}
                        value={value}
                        onChange={(_, v) => onChange(v)}
                      />
                    )}
                  />
                </Grid>

              {roleId === USER_ROLE_ID.ROLE_EXAMINER && (
                <Grid item xs={12} sm={8} md={6} lg={3} xl={3}>
                  <InputLabel style={{ fontSize: "0.875rem" }}>Attachment</InputLabel>
                  <MuiTextField
                    size="small"
                    variant="outlined"
                    type="file"
                    inputProps={{
                      multiple: "multiple",
                    }}
                    onChange={handleUploadImage}
                  />
                </Grid>
              )}

              {roleId === USER_ROLE_ID.ROLE_EXAMINER && selectedFileToUpload.length > 0 && (
                <Grid item xs={12}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {selectedFileToUpload?.map((el, index) => (
                      <Chip
                        label={
                          <Typography
                            variant="body2"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={el?.name}
                          >
                            {el?.name}
                          </Typography>
                        }
                        size="small"
                        onDelete={() => {
                          handleDeleteFile(el?.name);
                        }}
                        key={index}
                      />
                    ))}
                  </div>
                </Grid>
              )}
            </Grid>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={handleSubmit(onFormSave)} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

