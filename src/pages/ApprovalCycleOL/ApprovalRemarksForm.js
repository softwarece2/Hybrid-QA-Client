/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import MuiTextField from "@material-ui/core/TextField";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { useSelector } from "react-redux";
import CustomizedInputs from "components/TextField";
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
import { statusStyleMapper, useStylesApproval } from "./ApprovalRfrForm";
import { departmentGetAllDepartmentType } from "pages/Services/URLs";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

// const validationSchema = Yup.object().shape({
//   // Use .nullable() if your initial value is null
//   // Use .required() to ensure a selection is made
//   departmentTypeId: Yup.object().nullable().required('Please select a department'),
//   nextApprover: Yup.object().nullable().required('Please select nextApprover'),
//   remarks:Yup.string().required('Please Enter Remarks').typeError("Required"),
// });
const validationSchema = Yup.object().shape({
  departmentTypeId: Yup.object()
    .nullable()
    .when("olStatus", {
      is: (status) =>
        status === OL_STATUS.ACCEPTED || status === OL_STATUS.REJECTED,
      then: Yup.object()
        .nullable()
        .required("Please select a department"),
      otherwise: Yup.object().nullable(),
    }),

  nextApprover: Yup.object()
    .nullable()
    .when("olStatus", {
      is: (status) =>
        status === OL_STATUS.ACCEPTED || status === OL_STATUS.REJECTED,
      then: Yup.object()
        .nullable()
        .required("Please select nextApprover"),
      otherwise: Yup.object().nullable(),
    }),

  remarks: Yup.string()
    .required("Please Enter Remarks")
    .typeError("Required"),
});

export default function ApprovalRemarksForm({ offerLetter, getAllTableData, onClose, records, sslip,  getSubSlips }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const seniorityId = loggedInUser?.seniority;
  const departmentId = loggedInUser?.departmentId;
  const departmentTypeId = loggedInUser?.departmentTypeId;
  const empId = loggedInUser?.empId;
  const orgId = loggedInUser?.orgId;
  const roleId = loggedInUser?.roleId;

  const classes = useStylesApproval();
  const [submitting, setSubmitting] = useState(false);
  const [loadingReg, setLoadingReg] = useState(false);
  const [nextEmployees, setNextEmployees] = useState([]);
  const [nextEmployeesLoading, setNextEmployeesLoading] = useState(false);
  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState()
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [regNo, setRegNo] = useState()
  const [rfrs, setRfrs] = useState([]);
  const fileInputRef = useRef(null);
  const [allemp, setAllEmp] = useState([])
  const [nextApprover1, setNextApprover] = useState()
  console.log("sslip",sslip);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { departmentTypeId: null, nextApprover: null, olStatus: null, remarks: "" },
  });
  const subSlipId = sslip?.id || offerLetter?.id;
  const getregNo = async () => {
    try {
      const res = await axiosInstanceTrans.get(`subSlipApproval/getRegNoBySubSlipId/${subSlipId}`);


      const dataArray = Array.isArray(res.data) ? res.data : res.data.someProperty || [];
      setRegNo(dataArray);

    } catch (err) {
      console.error("Error fetching regNo:", err);
      setRegNo([]);
    }
  }

  useEffect(() => {
    getregNo();
  }, [subSlipId]);
  useEffect(() => {
    getregNo()
  }, []
  )
  const onFormSave = async (data) => {
    if (data.remarks.trim()) {
      // Check if olStatus is selected
      // if (roleId!=USER_ROLE_ID.ROLE_EXAMINER && data.olStatus === null) {
      //   toast.error("Please select a status");
      //   return;
      // }

      // Check if nextApprover is selected when olStatus is ACCEPTED or REJECTED
  if (
  watchOlStatus !== OL_STATUS.RFR &&
  (
    (roleId !== USER_ROLE_ID.ROLE_DO && data.nextApprover === null) ||
    (roleId === USER_ROLE_ID.ROLE_DO &&
      watchOlStatus === OL_STATUS.REJECTED &&
      data.nextApprover === null)
  )
) {
  toast.error("Please select a Next Approver");
  return;
}
      // if (roleId!==USER_ROLE_ID.ROLE_DO  && data.nextApprover === null) {
      //   toast.error("Please select a Next Approver");
      //   return;
      // }
      // if ((roleId === USER_ROLE_ID.ROLE_DO && watchOlStatus===OL_STATUS.REJECTED)  && data.nextApprover === null) {
      //   toast.error("Please select a Next Approver");
      //   return;
      // }

      setSubmitting(true);
      const reqObj = {
        subSlipId: offerLetter?.id || sslip?.id,
        createdBy: loggedInUser.empId,
        remarks: data.remarks,
        nextApproverId: nextApprover1,
        olStatus: data.olStatus ?? null,
      };
      console.log(nextEmployees, "selectedDepartmentIdselectedDepartmentId")
      if (roleId === USER_ROLE_ID.ROLE_HOS && departmentTypeId === DEPARTMENT_ID.QC) {
        // For HOS_QC
        let isRfr = data.olStatus == OL_STATUS.RFR ? true : data.olStatus == OL_STATUS.APPROVE ? false : undefined
        let req;
        // if (data.olStatus == OL_STATUS.RFR || data.olStatus == OL_STATUS.REJECTED || data.olStatus == OL_STATUS.RECTIFICATION) {
        //   const selectedRfrs = rfrs.filter((r) => r.selected);
        //   if (selectedRfrs.length <= 0 && data.olStatus != OL_STATUS.RECTIFICATION) {
        //     toast.info('Please select at least one registration no for "RFR" or "REJECTION"');
        //     setSubmitting(false);
        //     return;
        //   }
        //   req = {
        //     ids: selectedRfrs.map((e) => e.id),
        //     status: data.olStatus == OL_STATUS.RFR ? REGISTRATION_NUMBER_STATUS.RFR : REGISTRATION_NUMBER_STATUS.REJECTED,
        //   };
        // } else {
        //   req = {
        //     ids: rfrs.map((e) => e.id),
        //     status: REGISTRATION_NUMBER_STATUS.ACCEPTED,
        //   };
        // }

        try {
          const formData = new FormData();
          formData.append("olApprovalDtoStr", JSON.stringify({ ...reqObj, isRfr }));
          await axiosInstanceTrans.post("subSlipApproval/updateInternalSubSlipApproval", formData);
          // if(data.olStatus != OL_STATUS.RECTIFICATION){
          //   await axiosInstanceTrans.post("lineItemLots/register/updateStatus", req);
          // }
          toast.success("submitted successfully");
          reset(defaultValues);
          getAllTableData(offerLetter?.id || sslip?.id);
           getSubSlips();
          onClose();
        } catch (error) {
          console.log(error);
          toast.error("Failed to update!, try again");
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
          await axiosInstanceTrans.post("subSlipApproval/updateInternalSubSlipApproval", formData);
          toast.success("submitted successfully");
          reset(defaultValues);
          getAllTableData(offerLetter?.id || sslip?.id);
           getSubSlips();
          onClose();
        } catch (error) {
          console.log(error);
          toast.error("Failed to update!, try again");
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

    if (+watchOlStatus === OL_STATUS.REJECTED && roleId !== USER_ROLE_ID.ROLE_EXAMINER) {
      url = `employee/getActiveSubOrdinateEmpByIdDeptId/${seniorityId}/${departmentId}`;
    }
    else if (+watchOlStatus === OL_STATUS.ACCEPTED) {
      url = `employee/getAllActiveHosBydepId/${DEPARTMENT_ID.QC}`;
    }

    else if (+watchOlStatus === OL_STATUS.RFR) {
      url = `employee/getAllActiveHOD`;
    }
    setNextEmployees([]);
    setNextEmployeesLoading(true);
    setValue("nextApprover", null);

    axiosInstance(url)
      .then(({ data }) => {
        setNextEmployees(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setNextEmployeesLoading(false);
      });
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
useEffect(() => {
    if (offerLetter||sslip) {
      setLoadingReg(true)
      axiosInstanceTrans("lineItemLots/register/ol/" + subSlipId)
        .then(({ data }) => {
          setRfrs(data.map((d) => ({ ...d, selected: false })).sort((a, b) => a.status - b.status));
        })
        .catch(console.log).finally(() => {
          setLoadingReg(false)
        });
    }
  }, []);
  const handleCheckboxChange = (id) => {
    setRfrs((prevRfrs) => prevRfrs.map((rf) => (rf.id === id ? { ...rf, selected: !rf.selected } : rf)));
  };
  async function getDepartmentTypes() {
    try {
      const { data } = await axiosInstance(departmentGetAllDepartmentType);
      setDepartmentTypes(data);

    } catch (error) {
      console.log(error);
    }
  }
  const userOptions = allemp?.users?.map((user) => ({
    label: user?.name || 'Unknown User',
    value: user?.id || 'unknown'
  })) || [];

  const getAllEmp = async (deptId) => {

    try {
      const { data } = await axiosInstance.get(`employee/getAllActiveEmpBydepId/${deptId}/${subSlipId}`);
      setAllEmp(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  useEffect(() => {
    getDepartmentTypes();
  }, []);
const FinalStatus = Array.isArray(regNo)
  ? regNo.some((r) => r?.finalStatus === "pass")
  : false;
  console.log(regNo, "regNossss")
  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose} style={{ fontSize: "0.875" }}>
        Enter Remarks (Approval Cycle)
      </DialogTitle>
      <DialogContent>
        {loadingReg && <LinearProgress />}
        <TableContainer style={{ maxHeight: 200, overflow: "auto", maxWidth: 400, marginInline: "auto", marginBottom: 20 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              {/* <TableRow style={{ backgroundColor: "#205375" }}> */}
              {/* <StyledTableCell>Select</StyledTableCell> */}
              <StyledTableCell>Reg Nos</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              {/* </TableRow> */}
            </TableHead>
            <TableBody>

              {/* {Array.isArray(regNo) && regNo.map((r) => (
                <StyledTableRow key={r.id || r.serialNo}>
                  <StyledTableCell>{regNo.registrationNo === 3 ?"N/A": r?.serialNo}</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: "#d4edda", color: "#155724" }}>{regNo.registrationNo === 3 ?"N/A":r?.finalStatus}</StyledTableCell>
                </StyledTableRow>
              ))} */}
              {Array.isArray(regNo) &&
  regNo.map((r) => (
    <StyledTableRow key={r.id || r.serialNo}>
      <StyledTableCell>
        {r?.registrationNo === 3 ? "N/A" : r?.serialNo}
      </StyledTableCell>

      <StyledTableCell
        style={{
          backgroundColor:
            r?.finalStatus === "pass" ? "#d4edda" : "#f8d7da",
          color:
            r?.finalStatus === "pass" ? "#155724" : "#721c24",
        }}
      >
        {r?.registrationNo === 3 ? "N/A" : r?.finalStatus}
      </StyledTableCell>
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
            placeholder="Enter Remarks *"
            multiline
            minRows={4}
            required
            maxRows={10}
            variant="outlined"
            fullWidth
            error={!!errors?.remarks}
            helperText={errors.remarks?.message}
          />

          
     {(
  roleId === USER_ROLE_ID?.ROLE_EXAMINER ||
  roleId === USER_ROLE_ID?.ROLE_HOS ||roleId === USER_ROLE_ID?.ROLE_GIC
) && (
  <Grid item xs={12} sm={6}>
    <Controller
      name="olStatus"
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl>
          <FormLabel style={{ fontSize: 14, marginTop: "15px" }}>
            Select Status
          </FormLabel>

          <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(e, v) => onChange(v)}
            size="small"
          >
            <ToggleButton
              style={{
                textTransform: "capitalize",
                fontWeight: 600,
              }}
              // disabled={!FinalStatus}
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
              // disabled={!FinalStatus}
              className={classes.rejectColor}
              value={OL_STATUS.REJECTED}
            >
              REJECT
            </ToggleButton>
{roleId !== USER_ROLE_ID?.ROLE_EXAMINER  && (
            <ToggleButton
              style={{
                textTransform: "capitalize",
                fontWeight: 600,
              }}
              disabled={FinalStatus}
              className={classes.rejectColor}
              value={OL_STATUS.RFR}
            >
              RFR
            </ToggleButton>
            ) }
          </ToggleButtonGroup>

        </FormControl>
      )}
    />
    
  </Grid>
)}
          <Grid container spacing={2} style={{ marginTop: 16 }}>

            {/* <Grid item xs={12} sm={6}>
          <Controller
                  name="departmentTypeId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState:{ error },
                  }) => (
                    <CustomizedInputs
                      select
                      size="small"
                      SelectProps={{ native : true }}
                      labelText="Department Type"
                      placeholder="Department Type"
                      required
                      value={value}
                    onChange={(e, v) => {
              onChange(v);  //Update the controller's value
              console.log("Selected Value:", v);
              setSelectedDepartmentId(departmentId); 
              getAllEmp(departmentId); 
            }}
error={!!error}
                      helperText={error?.message}
                    >
                      <option value="">Select Department Type</option>
                      {departmentTypes?.map((item) => (
                        <option value={item.id}>{item.departmentType}</option>
                      ))}
                    FinalStatus</CustomizedInputs>
                  )}
                />
  </Grid> */}
            {(
               watchOlStatus === OL_STATUS.ACCEPTED || watchOlStatus === OL_STATUS.REJECTED 
) && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="departmentTypeId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <AutoCompleteNew
                    labelText="Select Department"
                    loading={nextEmployeesLoading}
                    data={departmentTypes}
                    getOptionLabel={(o) => o?.departmentType}
                    required
                    value={value}
                    onChange={(e, v) => {
                      onChange(v);
                      console.log("Selected Valussse:", v);
                      setSelectedDepartmentId(v?.id);
                      getAllEmp(v?.id)

                    }}
                 
                    error={!!errors?.departmentTypeId} 
                    helperText={errors.departmentTypeId?.message}
                  />
                )}
              />
            </Grid>
  )}



            {(
               watchOlStatus === OL_STATUS.ACCEPTED || watchOlStatus === OL_STATUS.REJECTED 
) && (
              <Grid item xs={12} sm={6}>
                  <Controller
                    name="nextApprover"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <AutoCompleteNew
                        labelText="Select Next Approver"
                        loading={nextEmployeesLoading}
                        data={userOptions}
                        getOptionLabel={(o) => o.label}
                        required
                        value={value}
                        onChange={(e, v) => {
                          onChange(v);
                          console.log("Selected Valuss:", v);
                          setNextApprover(v?.value)
                        }}
    
                        error={!!errors?.nextApprover} 
                        helperText={errors.nextApprover?.message}
                      />
                    )}
                  />
                </Grid>
              )}


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
                  inputRef={fileInputRef}
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

const defaultValues = { remarks: "" };
