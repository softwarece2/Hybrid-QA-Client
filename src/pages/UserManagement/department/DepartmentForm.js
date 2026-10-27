import { useEffect, useState } from "react";

//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

//material-ui
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { restrict } from "restrict";
import axiosInstance from "pages/Services/AxiosInstance";
import { 
  departmentGetAllDepartmentType,
  getAllSalesGroups,
 } from "pages/Services/URLs";
import { toast } from "react-toastify";
import CustomizedInputs from "components/TextField";
import { useStylesMaster } from "../SalesGroup/SalesGroupForm";

const schema = yup.object().shape({
  departmentName: yup.string().required("Department Name is required").min(2, "Department Name minimum length 2 character").trim(),
  sectionCode:yup.string().nullable().required("Section Code is required").max(2, "Section Code of length 2 character").required("Required"),
  salesGroupId: yup.string().required("salesGroup is required"),
  departmentTypeId: yup.string().required("departmentType is required"),
  active: yup.string(),
});

const defaultValues = {
  salesGroupId: "",
  departmentTypeId: "",
  departmentName: "",
  sectionCode: "",
  active: "yes",
};

export default function DepartmentForm({ reload, selectedRow, setSelectedRow,edit, setEdit }) {
  const classes = useStylesMaster();
  const [salesGroups, setSalesGroups] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [saving, setSaving] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    reset(defaultValues);
    setSelectedRow(null);
     setEdit(false);
  };

  async function onSubmit(data) {
    setSaving(true);
    if (!selectedRow) {
      //EDIT
      const req = {
        salesGrpId: data.salesGroupId,
        departmentTypeId: data.departmentTypeId,
        departmentName: data.departmentName,
        sectionCode: data.sectionCode,
        status: data.active === "yes",
      };
      try {
        await axiosInstance.post("department/saveDept", req);
        toast.success("Department Added successfully!");//IVNV Observation Added toast message Modified by:Shruti Sanjay Date:09-07-2026
        reload();
        resetForm();
      } catch (error) {
        toast.error("Department Name already exist");
      }
    } else {
      //ADD
      const req = {
        id: selectedRow.id,
        salesGrpId: data.salesGroupId,
        departmentName: data.departmentName,
        sectionCode: data.sectionCode,
        status: data.active === "yes",
        departmentTypeId: data.departmentTypeId,
      };
      try {
        await axiosInstance.post("department/updateDept", req);
        toast.success("Department updated successfully!"); //IVNV Observation Added toast message Modified by:Shruti Sanjay Date:09-07-2026
        reload();
        resetForm();
      } catch (error) {
        toast.error("Failed to update department, try after sometime.");
      }
    }
    setSaving(false);
  }

  async function getSalesGroups() {
    try {
      const { data } = await axiosInstance(getAllSalesGroups);
      //  updated sales group logic to filter by active status only ,Modified By:Gopala krishna
      const activeGroups = data
      .filter(item => item.active === true)
      setSalesGroups(activeGroups);
    } catch (error) {
      console.log(error);
    }
  }
  async function getDepartmentTypes(){
    try {
      const { data } = await axiosInstance(departmentGetAllDepartmentType);
      setDepartmentTypes(data);

    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    getDepartmentTypes();
    getSalesGroups();
  }, []);

  useEffect(() => {
    if (selectedRow) {
      reset({
        ...selectedRow,
        active: selectedRow.status ? "yes" : "no", 
        salesGroupId: selectedRow.salesGrpId, 
        departmentTypeId: selectedRow.departmentTypeId
      });
    }
  }, [reset, selectedRow]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box component={Paper} elevation={1}>
        <Typography style={{ padding: "8px 16px", background: "#205375", color: "white" }}> {!edit ? "Department Form " : "Edit Department Form"}</Typography>

        <Grid container spacing={2} style={{ padding: 16 }}>
          <Grid item xs={12} sm={2}>
            <Controller
              name="salesGroupId"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CustomizedInputs
                  select
                  size="small"
                  SelectProps={{ native: true }}
                  labelText="SalesGroup"
                  placeholder="SalesGroup"
                  required
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                >
                  <option value="">Select SalesGroup</option>
                  {salesGroups.map((sg) => (
                    <option value={sg.id}>{sg.name}</option>
                  ))}
                </CustomizedInputs>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                >
                  <option value="">Select Department Type</option>
                  {departmentTypes.map((item) => (
                    <option value={item.id}>{item.departmentType}</option>
                  ))}
                </CustomizedInputs>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="departmentName"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <CustomizedInputs
                    labelText="Department/Section Name"
                    placeholder="Department/Section Name"
                    required
                    inputProps={{ minLength: 2, maxLength: 200 }}
                    onInput={restrict.indenter}
                    value={value}
                    onChange={onChange}
                    error={!!errors.departmentName}
                    helperText={errors.departmentName?.message}
                  />
                );
              }}
            ></Controller>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controller
              name="sectionCode"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <CustomizedInputs
                    labelText="Section Code"
                    placeholder="Section Code"
                    required
                    inputProps={{ maxLength: 2}}
                    onInput={restrict.digit}
                    value={value}
                    onChange={onChange}
                    error={!!errors.sectionCode}
                    helperText={errors.sectionCode?.message}
                  />
                );
              }}
            ></Controller>
          </Grid>

          {selectedRow && (
            <Grid item xs={12}>
              <FormControl component="fieldset" size="small">
                <FormLabel component="legend">Active Status</FormLabel>
                <Controller
                  name="active"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} xl={12} align="center">
            <Button
               className={classes.button} 
              disabled={saving}
              type="submit"
              style={{ textTransform: "capitalize" }}
              size="small"
              onClick={handleSubmit(onSubmit)}
            >
              {saving && <CircularProgress size={24} />}
              {selectedRow ? "Update" : "Submit"}
            </Button>
            <Button size="small" style={{ textTransform: "capitalize",marginLeft:'10px' }} className={classes.reset} onClick={resetForm}>
              Reset
            </Button>
          </Grid>
        </Grid>
        
      </Box>
    </form>
  );
}
