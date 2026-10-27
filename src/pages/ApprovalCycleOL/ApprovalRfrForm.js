/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import {
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { DialogContent, DialogTitle, StyledTableCell, StyledTableRow } from "Utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "pages/Services/AxiosInstance";
import Button from "components/Button";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import AutoCompleteNew from "components/AutoCompleteNew";
import { DEPARTMENT_ID, OL_STATUS, REGISTRATION_NUMBER_STATUS, USER_ROLE_ID } from "Globals.js";

export const statusStyleMapper = {
  accepted: {
    backgroundColor: "#d4edda", // Light Green
    color: "#155724", // Dark Green
  },
  rejected: {
    backgroundColor: "#f8d7da", // Light Red
    color: "#721c24", // Dark Red
  },
  rfr: {
    backgroundColor: "#ffecd2", // orange
    color: "#814900", // Darker orange
  },
  pending: {
    backgroundColor: "#e8f1ff", // Light Blue
    color: "#0d69c6", // Dark Blue
  },
  "in-process": {
    backgroundColor: "#f0f8ff", // AliceBlue
    color: "#265a88", // Dark Blue
  },
  fail: {
    backgroundColor: "#ffecd2", // orange
    color: "#814900", // Darker orange
  },
  pass: {
    backgroundColor: "#d4edda", // Light Green
    color: "#155724", // Dark Green
  },
};

export const useStylesApproval = makeStyles({
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

  const classes = useStylesApproval();
  const [submitting, setSubmitting] = useState(false);
   const [loadingReg, setLoadingReg] = useState(false);
  const [nextEmployees, setNextEmployees] = useState([]);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const [rfrs, setRfrs] = useState([]);

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

  const onFormSave = async (data) => {
    if (data.remarks.trim()) {
      if (roleId!=USER_ROLE_ID.ROLE_EXAMINER && data.olStatus === null) {
        toast.error("Please select a status");
        return;
      }
      if (
        data.nextApprover === null
      ) {
        toast.error("Please select a Next Approver");
        return;
      }
      setSubmitting(true);
      const reqObj = {
        offerLetterId: offerLetter.id,
        createdBy: loggedInUser.empId,
        remarks: data.remarks,
        nextApproverId: data.nextApprover?.id,
        olStatus: data.olStatus ?? null,
      };

      if (roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC) {
        // For HOS_QC
       let isRfr = data.olStatus == OL_STATUS.RFR ? true : data.olStatus == OL_STATUS.APPROVE ? false : undefined;
       let req;
        if (data.olStatus == OL_STATUS.RFR || data.olStatus == OL_STATUS.REJECTED || data.olStatus == OL_STATUS.RECTIFICATION) {
          const selectedRfrs = rfrs.filter((r) => r.selected);
          if (selectedRfrs.length <= 0 && data.olStatus != OL_STATUS.RECTIFICATION) {
            toast.info('Please select at least one registration no for "RFR" or "REJECTION"');
            setSubmitting(false);
            return;
          }
          req = {
            ids: selectedRfrs.map((e) => e.id),
            status: data.olStatus == OL_STATUS.RFR ? REGISTRATION_NUMBER_STATUS.RFR : REGISTRATION_NUMBER_STATUS.REJECTED,
          };
        } else {
          req = {
            ids: rfrs.map((e) => e.id),
            status: REGISTRATION_NUMBER_STATUS.ACCEPTED,
          };
        }

        try {
          const formData = new FormData();
          formData.append("olApprovalDtoStr", JSON.stringify({...reqObj, isRfr}));
          await axiosInstanceTrans.post("olApproval/updateInternalOlApproval", formData);
          if(data.olStatus != OL_STATUS.RECTIFICATION){
            await axiosInstanceTrans.post("lineItemLots/register/updateStatus", req);
          }
          toast.success("submitted successfully");
          reset(defaultValues);
          getAllTableData(offerLetter.id);
          onClose();
        } catch (error) {
          console.log(error);
          toast.error("Failed to submit!, try again");
        } finally {
          setSubmitting(false);
        }
      } else {
        // FOR OTHERS Users
        const formData = new FormData();
        formData.append("olApprovalDtoStr", JSON.stringify(reqObj));
        for (let i = 0; i < selectedFileToUpload.length; i++) {
          formData.append("uploads", selectedFileToUpload[i]);
        }
        try {
          await axiosInstanceTrans.post("olApproval/updateInternalOlApproval", formData);
          toast.success("submitted successfully");
          reset(defaultValues);
          getAllTableData(offerLetter.id);
          onClose();
        } catch (error) {
          console.log(error);
          toast.error("Failed to submit!, try again");
        } finally {
          setSubmitting(false);
        }
      }
    } else {
      toast.error("Fill the Remarks");
    }
  };

  const watchOlStatus = watch("olStatus");

  useEffect(() => {
    let url = `employee/getActiveParentEmpByIdDeptId/${seniorityId}/${departmentId}`;

    if (+watchOlStatus === OL_STATUS.RECTIFICATION && roleId !== USER_ROLE_ID.ROLE_EXAMINER) {
      url = `employee/getActiveSubOrdinateEmpByIdDeptId/${seniorityId}/${departmentId}`;
    } else if (+watchOlStatus === OL_STATUS.RFR || (roleId === USER_ROLE_ID.ROLE_HOS && departmentId == DEPARTMENT_ID.ASSEMBLY)) {
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

 useEffect(() => {
    if (offerLetter) {
      setLoadingReg(true)
      axiosInstanceTrans("lineItemLots/register/ol/" + offerLetter.id)
        .then(({ data }) => {
          setRfrs(data.map((d) => ({ ...d, selected: false })).sort((a, b) => a.status - b.status));
        })
        .catch(console.log).finally(()=>{
          setLoadingReg(false)
        });
    }
  }, []);

  const handleCheckboxChange = (id) => {
    setRfrs((prevRfrs) => prevRfrs.map((rf) => (rf.id === id ? { ...rf, selected: !rf.selected } : rf)));
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose} style={{ fontSize: "0.875" }}>
        Enter Remarks (RFR Cycle)
      </DialogTitle>
      <DialogContent>
        {loadingReg && <LinearProgress />}
        <TableContainer style={{ maxHeight: 200, overflow: "auto", maxWidth: 400, marginInline: "auto", marginBottom: 20 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: "#205375" }}>
                <StyledTableCell>Select</StyledTableCell>
                <StyledTableCell>Reg Nos</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rfrs.map((r) => (
                <StyledTableRow key={r.id} style={{ ...statusStyleMapper[r.status] }}>
                  <StyledTableCell>
                    <Checkbox
                      disabled={
                        r.status !== REGISTRATION_NUMBER_STATUS.FAIL ||
                        !(roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC)
                      }
                      checked={r.selected} // Use the selected state from the rfrs array
                      onChange={() => handleCheckboxChange(r.id)} // Call a handler function onChange
                    />
                  </StyledTableCell>
                  <StyledTableCell>{r.registerNo}</StyledTableCell>
                  <StyledTableCell>{r.status}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

          <Grid container spacing={2} style={{ marginTop: 16 }}>
            {roleId !== USER_ROLE_ID.ROLE_EXAMINER && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="olStatus"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <FormControl>
                      <FormLabel style={{ fontSize: 14 }}>Send for</FormLabel>
                      <ToggleButtonGroup value={value} exclusive onChange={(e, v) => onChange(v)} size="small">
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
                          {departmentTypeId === DEPARTMENT_ID.QC ? "Testing" : "Rectification"}
                        </ToggleButton>
                        {roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC && (
                          <ToggleButton
                            style={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                            className={classes.rfrcolor}
                            value={OL_STATUS.RFR}
                          >
                            RFR
                          </ToggleButton>
                        )}
                      </ToggleButtonGroup>
                    </FormControl>
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
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
              <Grid item xs={12}>
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} type="submit" onClick={handleSubmit(onFormSave)} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
