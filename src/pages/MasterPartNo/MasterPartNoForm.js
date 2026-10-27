import React, { useEffect, useState } from "react";
import { Grid, RadioGroup, FormControlLabel, Radio, Button, Paper, Box, Typography, CircularProgress } from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TextField from "../../components/TextField";
import axiosInstance from "pages/Services/AxiosInstance";
import { restrict } from "restrict";
import AutoCompleteNew from "components/AutoCompleteNew";

const schema = yup.object().shape({
  partNo: yup.string().required("Required"),
  catPartNo: yup.string(),
  // nsnPartNo: yup.string().required("Required"),
  materialDescription: yup.string().required("Required"),
  active: yup.string().required("Status is required"),
  drawingNo: yup.string().required("Drawing No. is required")
});
const UOM_ID = 1;
const defaultValues = {
  partNo: "",
  catPartNo: "",
  nsnPartNo: "",
  materialDescription: "",
  active: true,
  uomId: "",
  drawingNo: "",
  itemCategoryId: "",
};

export default function MasterPartNoForm({ refresh, selectedRow, setSelectedRow, edit, setEdit }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const salesGrpId = loggedInUser?.salesGrpId;
  const [saving, setIsSaving] = useState(false);
  const [uom, setUom] = useState([]);
  const [itemCategory, setitemCategory] = useState([]);
  const [parts, setParts] = useState([]);

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data,"data");
    const req = {
      partNo: data.partNo,
      catPartNo: data.catPartNo,
      nsnPartNo: data.nsnPartNo,
      materialDescription: data.materialDescription,
      uomId: data.uomId?.id,
      itemCategoryId: data.itemCategoryId?.id,
      drawingNo: data.drawingNo,
      active: data.active,
    };

    axiosInstance
      .post("partNumber/save", req)
      .then(() => {
        refresh();
        reset(defaultValues);
        setSelectedRow(null);
        toast.success("Saved successfully");
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Failed to submit, please try again");
        toast.error("Material No./EP Code No. Already exist");

      })
      .finally(() => {
        setIsSaving(false);
      });
  };


  const onUpdate = (data) => {
    const req = {
      id: selectedRow?.id || 0,
      partNo: data?.partNo,
      catPartNo: data?.catPartNo,
      nsnPartNo: data?.nsnPartNo,
      materialDescription: data?.materialDescription,
      active: data?.active === "true",
      uomId: data?.uomId?.id,
      itemCategoryId: data?.itemCategoryId?.id,
      drawingNo: data?.drawingNo,
      active: data?.active,
    };
    setIsSaving(true);
    axiosInstance
      .post("partNumber/update", req)
      .then(() => {
        reset(defaultValues);
        refresh();
        setSelectedRow(null);
        toast.success("Updated successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Material No./EP Code No. Already exist");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // useEffect(() => {
  //   if (selectedRow) {
  //     reset({
  //       ...selectedRow, active: selectedRow.active ? "true" : "false",
  //     });

  //   }
  // }, [selectedRow, reset, salesGrpId]);

useEffect(() => {
  if (edit && selectedRow) {
    reset({ 
      ...selectedRow, active: selectedRow?.active ? "true" : "false",
      uomId: uom?.find((el) => el?.id === selectedRow?.uomId),
      itemCategoryId: itemCategory?.find((el) => el?.id === selectedRow?.itemCategoryId),
      // active: selectedRow?.qaAgencies?.map((el) => el?.active),
    }
);
}
}, [edit, selectedRow]);

  const fetchParts = async () => {
    try {
      const { data } = await axiosInstance("partNumber/getAllActive");
      setParts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchitemCategory = async () => {
    try {
      const { data } = await axiosInstance("itemCategory/getAllActive");
      setitemCategory(data);
    } catch (error) {
      console.log(error, "error");
    }
  };


  const fetchUom = async () => {
    try {
      const { data } = await axiosInstance("uom/getAllActive");
      setUom(data);
      setValue(`array.0.uomName`, data.find(u => u.id === UOM_ID))
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    fetchUom();
    fetchitemCategory();
    fetchParts();
  }, []);

  return (
    <Paper style={{ maxWidth: 900, marginInline: "auto", marginBottom: 16 }}>
      <Box style={{ backgroundColor: "#205375", color: "white", padding: 8 }}>
        <Typography style={{ fontSize: "0.875rem" }}> {!edit ? "Material No./EP Code No form" : "Edit Material No./EP Code No form"}</Typography>
      </Box>
      <form style={{ padding: 16 }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="partNo"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    labelText="	Material No./EP Code No."
                    placeholder="Enter Material No./EP Code No."
                    required
                    onInput={restrict.epCode}
                    inputProps={{ maxLength: 200 }}
                    error={!!error}
                    helperText={error?.message}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name="catPartNo"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    labelText="CAT Part No."
                    placeholder="CAT number"
                    // required
                    onInput={restrict.epCode}
                    inputProps={{ maxLength: 200 }}
                    error={!!error}
                    helperText={error?.message}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name="nsnPartNo"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    labelText="NSN Part No."
                    placeholder="Enter NSN Part number"
                    inputProps={{ maxLength: 200 }}
                    onInput={restrict.epCode}
                  // required
                  // error={!!error}
                  // helperText={error?.message}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="materialDescription"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    labelText="Material description"
                    placeholder="Enter Material description"
                    inputProps={{ maxLength: 200 }}
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="drawingNo"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    labelText="Drawing No."
                    placeholder="Enter Drawing No."
                    inputProps={{ maxLength: 200 }}
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="uomId"
              control={control}
              render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                <AutoCompleteNew
                  labelText="Uom"
                  data={uom || []}
                  getOptionLabel={(o) => o?.unit}
                  {...props}
                  value={value}
                  onChange={(e, v) => {
                    onChange(v);
                    // setProjectName(e.target.value);
                  }}
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <Controller
              name="itemCategoryId"
              control={control}
              render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                <AutoCompleteNew
                  labelText="Item Category"
                  data={itemCategory || []}
                  getOptionLabel={(o) => o?.category}
                  {...props}
                  value={value}
                  onChange={(e, v) => {
                    onChange(v);
                    // setProjectName(e.target.value);
                  }}
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          {selectedRow ? (
            <Grid item xs={12}>
              <Controller
                name="active"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <RadioGroup name="radio-buttons-group" onChange={onChange} row defaultValue={value} value={value}>
                      <FormControlLabel value="true" control={<Radio size="small" />} label="Active" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="Inactive" />
                    </RadioGroup>
                  );
                }}
              ></Controller>
            </Grid>
          ) : null}

          <Grid item xs={12} style={{ display: "flex", gap: 8, justifyContent: "center" }} align="center">
            {selectedRow ? (
              <Button
                style={{ textTransform: "capitalize" }}
                variant="contained"
                size="small"
                color="secondary"
                disabled={!isDirty || saving}
                onClick={handleSubmit(onUpdate)}
              >
                {saving && <CircularProgress size={24} />} Update
              </Button>
            ) : (
              <Button
                style={{ textTransform: "capitalize" }}
                variant="contained"
                size="small"
                disabled={saving}
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                {saving && <CircularProgress size={24} />} Submit
              </Button>
            )}

            <Button
              style={{ textTransform: "capitalize" }}
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                reset(defaultValues);
                setSelectedRow(null);
                setEdit(false)
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
