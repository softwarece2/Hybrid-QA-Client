import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
//material-ui
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import { restrict } from "restrict";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllOrganization } from "pages/Services/URLs";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.dark,
  },
  root: {
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
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

const schema = yup.object().shape({
  unitName: yup
    .string()
    .required("Unit Name is required")
    .min(2, "Unit Name minimum length 2 character")
    .trim(),
  organizationId: yup.string().required("organization is required"),
});

const defaultValues = {
  organizationId: "",
  unitName: "",
  active: "yes",
};

export default function UnitForm({ reload, selectedRow, setSelectedRow }) {
  const classes = useStyles();
  const [organizations, setOrganizations] = useState([]);

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
  };

  async function onSubmit(data) {
    console.log(data);

    if (!selectedRow) {
      //EDIT
      const req = {
        organizationId: data.organizationId,
        unitName: data.unitName,
        active: data.active === "yes",
      };
      try {
        await axiosInstance.post("unit/save", req);
        reload();
        resetForm()
      } catch (error) {
        toast.error("Failed to save unit, try after sometime.");
      }
    } else {
      //ADD
      const req = {
        id: selectedRow.id,
        organizationId: data.organizationId,
        unitName: data.unitName,
        active: data.active === "yes",
      };
      try {
        await axiosInstance.post("updateUnit", req);
        reload();
        resetForm()
      } catch (error) {
        toast.error("Failed to update unit, try after sometime.");
      }
    }
  }

  async function getOrganizations() {
    try {
      const { data } = await axiosInstance(getAllOrganization);
      setOrganizations(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    if (selectedRow) {
      reset({ ...selectedRow, active: selectedRow.active ? "yes" : "no" });
    }
  }, [reset, selectedRow]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box component={Paper} elevation={1}>
        <Typography
          style={{ padding: "8px 16px", background: "#205375", color: "white" }}
        >
          Unit Form
        </Typography>

        <Grid container spacing={2} style={{ padding: 16 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="organizationId"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  select
                  size="small"
                  labelText="Organization"
                  placeholder="Organization"
                  required
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem value="">
                    <em>Select organization</em>
                  </MenuItem>
                    {organizations.map((org) => (
                      <MenuItem value={org.id}>{org.organizationName}</MenuItem>
                    ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="unitName"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    labelText="Unit Name"
                    placeholder="Unit Name"
                    required
                    inputProps={{ minLength: 2, maxLength: 20 }}
                    onInput={restrict.indenter}
                    value={value}
                    onChange={onChange}
                    error={!!errors.unitName}
                    helperText={errors.unitName?.message}
                  />
                );
              }}
            ></Controller>
          </Grid>
          {selectedRow && (
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Active</FormLabel>
                <Controller
                  name="active"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          )}

          <Grid item xs={6} xl={6} align="right">
            <Button
              className={!isDirty ? classes.disabledButton : classes.button}
              disabled={!isDirty}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {selectedRow ? "Update" : "Submit"}
            </Button>
          </Grid>
          <Grid item xs={6} xl={6} align="left">
            <Button className={classes.reset} onClick={resetForm}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
