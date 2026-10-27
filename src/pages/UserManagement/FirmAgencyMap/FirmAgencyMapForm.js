/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

//
import TextField from "components/TextField";
import Button from "components/Button";
import { getFirmDetails, getInspectionAgencyDetails } from "../FirmInspAgencyAction";
import { saveFirmAgencyDetails } from "Redux/Actions/UserManagement/SalesGroupAction";
import { updateFirmAgencyDetails } from "Redux/Actions/UserManagement/SalesGroupAction";


const useStyles = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.dark,
  },
  root: {
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
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
  id: yup.string().required("Firm is required"),
  inspectionAgencyIds: yup
    .array()
    .min(1, "Required")
    .typeError("Required")
    .required("Inspection Agency Required"),
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultValues = {
  id: "",
  inspectionAgencyIds: [],
};

export default function FirmAgencyMapForm({ fetch, firmAgencyObj, setFirmAgency, setEdit, edit }) {
  const isEdit = Object.keys(firmAgencyObj).length !== 0;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const firmDetails = useSelector((store) => store.orgReducer.firmType);
  const inspectionAgencyDetails = useSelector(
    (store) => store.orgReducer.inspectionAgencyType
  );

  useEffect(() => {
    dispatch(getFirmDetails());
    dispatch(getInspectionAgencyDetails());
  }, []);

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
    setFirmAgency({}); 
    if (setEdit) setEdit(false); 

  };
  const handleSuccess = () => {
    fetch();
    toast.success(isEdit ? "Data Successfully Updated." : "Data Successfully Submitted.");
    reset(defaultValues);
    setFirmAgency({});
  };

  const executeSubmit = (data) => {
    const req = {
      id: data.id,
      inspectionAgencyIds: data.inspectionAgencyIds.map((el) => el.id),
    };
    setIsSaving(true);
    dispatch(saveFirmAgencyDetails(req))
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success("Data Successfully Submitted.");
          fetch();
          reset(defaultValues);
        } else if (res.response && res.response.status === 409) {
          // This catches the "Firm already exists" error from backend
          toast.warning(res.response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => setIsSaving(false));
  };
  
  const executeUpdate = (data) => {
    const req = {
      id: data.id,
      inspectionAgencyIds: data.inspectionAgencyIds.map((el) => el.id),
    };
    setIsSaving(true);
    dispatch(updateFirmAgencyDetails(req))
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          handleSuccess(); 
        } else if (res.response && res.response.status === 409) {
          toast.warning(res.response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => setIsSaving(false));
  };

  useEffect(() => {
    if (isEdit) {
      reset({
        id: firmAgencyObj.id,
        inspectionAgencyIds: inspectionAgencyDetails.filter((ins) =>
          firmAgencyObj.inspectionAgencies.some((e) => e.id === ins.id)
        ),
      });
    }
  }, [firmAgencyObj]);

  // console.log(firmAgencyObj, "firmAgencyObj");

  return (
    <form onSubmit={handleSubmit(executeSubmit)}>
      <Card style={{ maxWidth: 600, marginInline: "auto", marginBottom: 8 }}>
        <CardHeader
          classes={{
            root: classes.cardHeader,
            title: classes.cardTitle,
          }}
          style={{ textAlign: "left" }}
          title={!isEdit ? "Firm Agency Mapping" : "Edit Firm Agency Mapping"}
        />

        <CardContent style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <Controller
              name="id"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.root,
                      }}
                      required={true}
                    >
                      Firm Name
                    </InputLabel>
                    <Autocomplete
                      fullWidth
                      options={firmDetails}
                      value={firmDetails.find((item) => item.id == value) || ""}
                      // labelText="SalesGroup Type"
                      getOptionLabel={(o) => o.organizationName}
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            classes: {
                              input: classes.input,
                              root: classes.textFieldRoot,
                            },
                          }}
                          size="small"
                          error={!!errors.id}
                          helperText={errors.id?.message}
                        />
                      )}
                      onChange={(e, v) => {
                        onChange(v?.id);
                      }}
                    />
                  </>
                );
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Controller
              name="inspectionAgencyIds"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <>
                    <InputLabel
                      classes={{
                        asterisk: classes.asterisk,
                        root: classes.root,
                      }}
                      required={true}
                    >
                      Inspection Agency
                    </InputLabel>
                    <Autocomplete
                      fullWidth
                      multiple
                      id="checkboxes-tags-demo"
                      value={value}
                      onChange={(e, v) => {
                        onChange(v);
                      }}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      options={inspectionAgencyDetails}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.orgName}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.orgName}
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            classes: {
                              input: classes.input,
                              root: classes.textFieldRoot,
                            },
                          }}
                          size="small"
                          variant="outlined"
                          error={!!errors.inspectionAgencyIds}
                          helperText={errors.inspectionAgencyIds?.message}
                        />
                      )}
                    />
                  </>
                );
              }}
            />
          </div>
        </CardContent>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          {isEdit ? (
            <Button
              className={!isDirty ? classes.disabledButton : classes.button}
              disabled={!isDirty || isSaving}
              onClick={handleSubmit(executeUpdate)}
            >
              {isSaving && <CircularProgress size={24} />} Update
            </Button>
          ) : (
            <Button
              disabled={isSaving}
              className={classes.button}
              onClick={handleSubmit(executeSubmit)}
            >
              {isSaving && <CircularProgress size={24} />} Submit
            </Button>
          )}

          <Button
            style={{ marginLeft: "8px" }}
            className={classes.reset}
            onClick={resetForm}
          >
            Reset
          </Button>
        </div>
      </Card>
    </form>
  );
}
