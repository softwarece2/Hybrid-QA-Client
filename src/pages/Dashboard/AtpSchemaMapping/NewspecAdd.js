import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Card, CardHeader, Grid, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/Button";
import AutoCompleteNew from "components/AutoCompleteNew";
import TextField from "../../../components/TextField";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { Typography } from "antd";
import TextArea from "components/TextArea";
import MultilineTextField from "components/MultilineTextField";
import { Autocomplete } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
  },
  root: {
    color: theme.palette.text.primary,
    padding: 2,
  },
  asterisk: {
    color: theme.palette.error.dark,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "0.875rem",
  },
  cardContent: {
    textAlign: "left",
    padding: 16,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  reset: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main,
    },
  },
}));
export default function NewspecAdd({
  watchTest,
  watchProduct,
  onSpecAdded,
}) {
  const classes = useStyles();
  const [paramTypes, setParamTypes] = useState([]);
  const [obsTypes, setObsTypes] = useState([]);
  const [obsValue, setObsValue] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [paramTypesResponse] = await Promise.all([
          axiosInstanceAte("spec/getAllFields"),
        ]);
        setParamTypes(paramTypesResponse.data.paramType);
        setUnits(paramTypesResponse.data.units);
        setObsTypes(paramTypesResponse.data.obsType);
        setObsValue(paramTypesResponse.data.obsValue);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to fetch initial data.");
      }
    };
    fetchInitialData();
  }, []);

  const schema = yup.object({
    paramTypeId: yup.number().required("Param Type is required"),
    specVal: yup.string().required("Spec Value is required"),
    paramTypeId: yup.number().required("Param Type is required"),
    unitId: yup.number().required("Unit is required"),
    paramCode: yup.string().required("Param Code is required"),
    tyClauseNo: yup.string().required("Type Clause No is required"),
    slNo: yup.number().required("Sr. No is required"),
    obsTypeId: yup.number().required("Select OBS Type"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const defaultValues = {
    prodId: "",
    testId: "",
    specVal: "",
    paramCode: "",
    tyClauseNo: "",
    paramTypeId: "",
    obsTypeId: "",
    unitId: "",
    slNo: "",
    min: "",
    max: "",
    obsValues: "yes_no",
  };

  const watchObsTypeId = watch("obsTypeId");
  const isIntegerOrDouble =
    obsTypes.find((item) => item.id === watchObsTypeId)?.type === "Integer" ||
    obsTypes.find((item) => item.id === watchObsTypeId)?.type === "Double";
  const isBooleanObsType =
    obsTypes.find((item) => item.id === watchObsTypeId)?.type === "Boolean";
  const isCustomBooleanObsType =
    obsTypes.find((item) => item.id === watchObsTypeId)?.type ===
    "Custom Boolean";

  const onSubmit = async (data) => {

    try {
      const obsTypeId = data.obsTypeId;
      const obsType = obsTypes.find((item) => item.id === obsTypeId);

      const payload = {
        id: data.id,
        prodId: watchProduct?.id,
        testId: watchTest?.testId,
        specVal: data.specVal,
        paramCode: data.paramCode,
        tyClauseNo: data.tyClauseNo,
        paramTypeId: data.paramTypeId,
        obsTypeId: data.obsTypeId,
        unitId: data.unitId,
        slNo: data.slNo,
        min: data.min,
        max: data.max
      };
      if (data.min > data.max) {
        toast.error("Min value cannot be greater than Max value.");
        return;
      }

      if (isCustomBooleanObsType) {
        payload.obsValue = data.obsValue.map(item => item.id).join(', ');
      }

      if (isBooleanObsType) {
        payload.obsValue = "yes_no";
      }

      const response = await axiosInstanceAte.post("spec/add", payload);
      toast.success(response?.message ?? "Spec added successfully!");
      reset();
        onSpecAdded();
    } catch (error) { }
  };



  return (
    <div align="center" style={{ padding: 12 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={classes.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1px",
              padding: "10px",
            }}
          >
            <Typography
              variant="body1 "
              style={{ color: "#b01e68", fontWeight: "bold" }}
            >
              Product Name :
            </Typography>
            <Controller
              name="id"
              control={control}
              render={() => (
                <Typography>
                  &nbsp;&nbsp;{watchProduct?.prodName || "N/A"}
                </Typography>
              )}
            />
            &nbsp;&nbsp;
            <Typography
              variant="body1 "
              style={{ color: "#b01e68", fontWeight: "bold" }}
            >
              Test Name :
            </Typography>
            <Controller
              name="testId"
              control={control}
              render={() => (
                <Typography labelText="Test Name">
                  &nbsp;&nbsp;
                  {watchTest?.testName || "N/A"}
                </Typography>
              )}
            />
          </div>
          <CardHeader
            classes={{
              root: classes.cardHeader,
              title: classes.cardTitle,
            }}
            style={{ textAlign: "left" }}
            title="Add New Spec"
          />
          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="paramTypeId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={paramTypes}
                      value={paramTypes.find((item) => item.id === value) || null} 
                      required
                      labelText="Select Param Type"
                      getOptionLabel={(o) => o.paramType}
                      onChange={(e, v) => {
                        onChange(v?.id);
                      }}
                      error={!!errors.paramTypeId}
                      helperText={errors.paramTypeId?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="unitId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={units}
                      value={units.find((u) => u.id === value) || null}
                      required
                      labelText="Select Units"
                      getOptionLabel={(o) => o.uints}
                      onChange={(e, v) => {
                        onChange(v?.id);
                      }}
                    
                      error={!!errors.unitId}
                      helperText={errors.unitId?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="paramCode"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Param Code"}
                        placeholder={"Param Code Value"}
                        type="text"
                        required
                        value={value || ""}
                        onChange={onChange}
                        inputProps={{ maxLength: 150 }}
                        error={!!errors.paramCode}
                        helperText={errors.paramCode?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="tyClauseNo"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Type Clause No"}
                        placeholder={"Type Clause No"}
                        type="text"
                        required
                        value={value || ""}
                        onChange={onChange}
                        inputProps={{ maxLength: 150 }}
                        error={!!errors.tyClauseNo}
                        helperText={errors.tyClauseNo?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="slNo"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      labelText={"Sr. No"}
                      placeholder={"Sr. No"}
                      required
                      type="number"
                      value={value || ""}
                      onChange={onChange}
                      error={!!errors.slNo}
                      helperText={errors.slNo?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Controller
                  name="specVal"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <MultilineTextField
                        multiline
                        labelText={"Spec Value"}
                        placeholder={"Spec Value"}
                        type="string"
                        required
                        value={value || ""}
                        onChange={onChange}
                        error={!!errors.specVal}
                        helperText={errors.specVal?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="obsTypeId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={obsTypes}
                      value={obsTypes.find((obs) => obs.id === value) || null}
                      required
                      labelText="Select OBS Type"
                      getOptionLabel={(o) => o.type}
                      onChange={(e, v) => {
                        onChange(v?.id);
                      }}
                      error={!!errors.obsTypeId}
                      helperText={errors.obsTypeId?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              {isIntegerOrDouble && (
                <>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <Controller
                      name="min"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          labelText={"Min Value"}
                          placeholder={"Min Value"}
                          type="number"
                          value={value || ""}
                          onChange={onChange}
                          error={!!errors.min}
                          helperText={errors.min?.message}
                        />
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <Controller
                      name="max"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          labelText={"Max Value"}
                          placeholder={"Max Value"}
                          type="number"
                          value={value || ""}
                          onChange={onChange}
                          error={!!errors.max}
                          helperText={errors.max?.message}
                        />
                      )}
                    ></Controller>
                  </Grid>

                </>
              )}
              {isBooleanObsType && (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="obsValue"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        labelText={"OBS Value"}
                        placeholder={"Yes/No"}
                        type="string"
                        value={"Yes/No"}
                        disabled
                      />
                    )}
                  />
                </Grid>
              )}

              {isCustomBooleanObsType && (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="obsValue"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={obsValue || []}
                        value={value || []}
                        filterSelectedOptions
                        disableCloseOnSelect
                        onChange={(event, newValue) => onChange(newValue)}
                        getOptionLabel={(option) => option.obsValue}
                        getOptionSelected={(option, value) =>
                          option.id === value.id
                        }
                        renderInput={(params) => (
                          <TextField
                            variant="outlined"
                            {...params}
                            labelText="Select OBS Value"
                            aria-describedby="my-helper-text"
                            error={!!errors?.obsValues}
                            helperText={errors?.obsValues?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6} xl={6} align="right">
                  <Button className={classes.button} type="submit">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
