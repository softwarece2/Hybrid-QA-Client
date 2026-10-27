/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector,useDispatch } from "react-redux";
import { Box, Chip, Dialog, DialogActions, FormControl, FormLabel, Grid, InputLabel, LinearProgress, Typography } from "@material-ui/core";
import { DialogContent, DialogTitle } from "Utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";
import Button from "components/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AutoCompleteNew from "components/AutoCompleteNew";
import { OL_STATUS, USER_ROLE_ID } from "Globals.js";
import { getAllActiveEmpsbyOrgId } from "pages/Services/URLs";
import { getAlInspectOL } from "Redux/Actions/SupplyOrder/SOAction";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { restrict } from "restrict";

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
  returnColor: {
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

const schema = yup.object().shape({
  // nextApprover:  yup.object().nullable().required("Select Approver Required"), 
  remarks: yup.string().required("Remarks is required").typeError("Remarks is required"),
  
  })

export default function ApprovalRemarksForm({ offerLetter, getAllTableData, onClose }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const seniorityId = loggedInUser?.seniority;
  const departmentId = loggedInUser?.departmentId;
  const roleId = loggedInUser?.roleId;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const [nextEmployees, setNextEmployees] = useState([]);
  const [nextEmployeesLoading, setNextEmployeesLoading] = useState(false);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [records, setRecords] = useState([]);
  console.log("offerletter",offerLetter);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { nextApprover: null, olStatus: null, remarks: "" },
    resolver: yupResolver(schema),
  });
  const [dataToSubmit, setDataToSubmit] = useState(null);
  const fileInputRef = useRef(null);
  const onFormSave = (data) => {
    if (data.remarks.trim()) {
      if (roleId !== USER_ROLE_ID.ROLE_INSPECTOR && data.olStatus === null) {
        toast.error("Please select a status");
        return;
      }
      if (
        (roleId !== USER_ROLE_ID.ROLE_DC && data.nextApprover === null) ||
        (roleId === USER_ROLE_ID.ROLE_DC && watchOlStatus !== OL_STATUS.ACCEPTED && data.nextApprover === null)
      ) {
        toast.error("Please select a Next Approver");
        return;
      }
      setSubmitting(true);
      const req = {
        internalInoteId: offerLetter.id,
        createdBy: loggedInUser.empId,
        remarks: data.remarks,
        nextApproverId: data.nextApprover?.id || 0,
        olStatus: data.olStatus ?? null,
      };

      const formData = new FormData();
      formData.append("olApprovalDtoStr", JSON.stringify(req));
      for (let i = 0; i < selectedFileToUpload.length; i++) {
        formData.append("uploads", selectedFileToUpload[i]);
      }

      axiosInstanceTrans
        .post("olApproval/updateOlApprovalNew", formData)
        .then(() => {
          toast.success("submitted successfully");
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
  };

  const watchOlStatus = watch("olStatus");

  useEffect(() => {
    const getAllSubByRole = () => {
      setNextEmployeesLoading(true);
      setValue("nextApprover", null);
      setNextEmployees([]);
      let url = getAllActiveEmpsbyOrgId + loggedInUser?.empId + "/" + loggedInUser.orgId;
      if (watchOlStatus === OL_STATUS.RETURN_QACL) {
        url = "/employee/getAllDOs";
      }
      axiosInstance(url)
        .then(({ data }) => setNextEmployees(data))
        .catch((err) => console.log(err))
        .finally(() => setNextEmployeesLoading(false));
    };
    getAllSubByRole();
  }, [departmentId, roleId, seniorityId, watchOlStatus]);
  // async function getAllTestsData() {
  //     try {
  //       const { data } = await axiosInstanceTrans("subSlipApproval/" + id + "/" + loggedInUser?.empId);
  //       setRecords(data);
  //     } catch (error) {
  //       toast.error("failed to get Records");
  //     }
   
  // }
  const getOlLineitems = (id) => {
    dispatch(getAlInspectOL(id)).then((res) => {
      const data = res?.map((item) => ({
        ...item,
        imported: item?.imported ? "Yes" : "No",
        // status: item?.status === "Active" ? <Active /> : item?.status === "Inactive" ? <InActive /> : null,
      }));
      setRecords(data);
    });
  };
  useEffect(() => {
    getOlLineitems(offerLetter?.id);
  }, [offerLetter]);

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
    if (filterFile.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };
  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);

  };

  const handleMainSubmit = (data) => {
    console.log("Form Data:", data); 
 
    if (roleId === USER_ROLE_ID.ROLE_DC && data.olStatus === OL_STATUS.ACCEPTED) {
      console.log("Status is ACCEPTED, opening dialog..."); // DEBUG
      setDataToSubmit(data); 
      setShowConfirmDialog(true);
    } else {
      onFormSave(data);
    }
  };

  const onErrors = (errs) => {
    console.log("VALIDATION ERRORS:", errs);
  };
  
  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle onClose={onClose}>Approval Details</DialogTitle>
      <DialogContent>
        {submitting && <LinearProgress />}
        <form onSubmit={handleSubmit(handleMainSubmit,onErrors)}>
          <Typography variant="caption" style={{ fontSize: "15px" }}>Enter Remarks<span style={{ color: "red" }}>*</span></Typography>
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
              // required: {
              //   message: "Required",
              //   value: true,
              // },
            })}
            placeholder="Enter Remarks"
            multiline
            minRows={4}
            required
            maxRows={10}
            variant="outlined"
            fullWidth
            onInput={restrict.remarks}
            error={!!errors?.remarks}
            helperText={errors.remarks?.message}
          />

          <div style={{ margin: "12px 0px 0px 0px" }}>
            <Grid container spacing={2}>
              {roleId !== USER_ROLE_ID.ROLE_INSPECTOR && (
                <Grid item xs={12} md={4}>
                  <Controller
                    name="olStatus"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <FormControl>
                        <FormLabel style={{ fontSize: 14 }}>Select Status</FormLabel>
                        <ToggleButtonGroup
                          value={value}
                          exclusive
                          onChange={(e, v) => {
                            if (v !== null) {
                              onChange(v); 
                            }
                          }}
                          size="small"
                        >
                          <ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.acceptColor}
                            value={OL_STATUS.ACCEPTED}
                          >
                            ACCEPT
                          </ToggleButton>
                          <ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.rejectColor}
                            value={OL_STATUS.REJECTED}
                          >
                            REJECT
                          </ToggleButton>
                          {/* {(roleId === USER_ROLE_ID.ROLE_AC || roleId === USER_ROLE_ID.ROLE_DAC || roleId === USER_ROLE_ID.ROLE_DC) && (
                            // <ToggleButton
                            //   style={{
                            //     textTransform: "capitalize",
                            //     fontWeight: 600,
                            //     minWidth: 120,
                            //   }}
                            //   className={classes.returnColor}
                            //   value={OL_STATUS.RETURN_QACL}
                            // >
                            //   Return OACL
                            // </ToggleButton>
                          )} */}
                        </ToggleButtonGroup>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {((roleId === USER_ROLE_ID.ROLE_DC && watchOlStatus !== OL_STATUS.ACCEPTED) ||
                (roleId !== USER_ROLE_ID.ROLE_DC)
              ) && (
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="nextApprover"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <AutoCompleteNew
                          labelText="Select Next Approver"
                          loading={nextEmployeesLoading}
                          data={nextEmployees}
                          getOptionLabel={(o) => o.ename + (o.orgName ? " - (" + o.orgName + ")" : "")}
                          required
                          value={value}
                          onChange={(_, v) => onChange(v)}
                          error={!!errors.nextApprover}
                          helperText={errors.nextApprover?.message}
                        />
                      )}
                    />
                  </Grid>
                )}

{roleId === USER_ROLE_ID.ROLE_INSPECTOR && (
  <Grid item xs={12} sm={6}>
    <InputLabel style={{ fontSize: "0.875rem" }}>Attachment</InputLabel>
    
    {/* This Box mimics the MUI Outlined TextField appearance */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "4px 8px", // Mimics TextField padding
        border: "1px solid rgba(0, 0, 0, 0.23)", // Default MUI border color
        borderRadius: "4px",
        height: "32px", // Standard MUI small height
        gap: "8px",
        width:"50%",
        transition: "border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "rgba(0, 0, 0, 0.87)", // Hover effect
        },
      }}
    >
      <Button
        variant="outlined"
        component="label"
        size="small"
        sx={{
          textTransform: "none",
          padding: "2px 10px",
          fontSize: "0.875rem",
        }}
      >
        Choose Files
        <input
          type="file"
          hidden
          multiple
          ref={fileInputRef}
          onChange={handleUploadImage}
        />
      </Button>

      {/* This replaces the unreliable native filename with your accurate state */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: "0.875rem", 
          color: selectedFileToUpload.length > 0 ? "text.primary" : "text.secondary",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {selectedFileToUpload.length > 0
          ? `${selectedFileToUpload.length} file(s) selected`
          : "No file chosen"}
      </Typography>
    </Box>
  </Grid>
)}

              {roleId === USER_ROLE_ID.ROLE_INSPECTOR && selectedFileToUpload.length > 0 && (
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
          <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
        </form>
      </DialogContent>
      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        aria-describedby="are-you-sure-dialog"
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to <b>ACCEPT</b> 
          </Typography>
          <Typography>
          <b>Sample selected</b>: {records[0]?.sampleSelectedCount} , <b>Sample Tested</b>: {records[0]?.testedSampleCount} , 
          <b>Other Sample Selected</b>: {records[0]?.faiSampleSelectedCount} , <b>Other Sample Tested</b>: {records[0]?.testedFaiSampleCount}
          </Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => {
      onFormSave(dataToSubmit); 
      setShowConfirmDialog(false);
    }}  color="primary" variant="contained" autoFocus>
            Accept
          </Button>
          <Button onClick={handleCancelConfirm} color="secondary" variant="contained">
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
     
    </Dialog>
  );
}

const defaultValues = { remarks: "" };
