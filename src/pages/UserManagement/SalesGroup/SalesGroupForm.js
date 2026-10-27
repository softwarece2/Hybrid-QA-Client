/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */

import { useEffect, useState } from "react";

//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

//material-ui
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { orgname } from "Redux/Actions/UserManagement/OrganizationNameAction";
import {
  saveSalesGroupDetails,
  updateSalesGroupDetails,
} from "Redux/Actions/UserManagement/SalesGroupAction";

//components
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";

//actions
import { Autocomplete } from "@material-ui/lab";
import { restrict } from "restrict";

export const useStylesMaster = makeStyles((theme) => ({
  asterisk: {
    color: theme.palette.error.dark,
  },
  root: {
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
  },
  card: {
    maxWidth: "100%",
    [theme.breakpoints.down("xl")]: {
      maxWidth: "50%",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "60%",
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: "85%",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
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
  name: yup
    .string()
    .required("SalesGroup Name is required")
    .min(2, "SalesGroup Name minimum length 2 charactes")
    .trim()
    .typeError("SalesGroup Name is required"),
  code: yup.string().required("Code is required").typeError("Code is required"),
  organizationId: yup.string().required("Organization is required"), //Ivnv Obs Changed Name ModifiedBy: Shruti
});

export default function SalesGroupForm({ fetch, salesGroupDetails }) {
  const classes = useStylesMaster();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  let defaultValues = {
    id: 0,
    name: "",
    code: "",
    organizationId: "",
    active: "true",
  };

  const orgnameDetails = useSelector((store) => store.orgReducer.orgname);

  useEffect(() => {
    dispatch(orgname());
    console.log("test", orgnameDetails);
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

  const executeSubmit = (data) => {
    dispatch(saveSalesGroupDetails(data))
      .then((res) => {
        console.log("it is coming");
        if (res.status === 200 || res.status === 201) {
          console.log("abcd", res.response);
          const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."
            }`;
          fetch();
          toast.success(str);
          reset(defaultValues);
        } else if (res.response.status === 409) {
          toast.warning(res.response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };

  const executeUpdate = (data) => {
    dispatch(updateSalesGroupDetails(data))
      .then((res) => {
        console.log("it is coming");
        if (res.status === 200 || res.status === 201) {
          console.log("abcd", res.response);
          const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."
            }`;
          fetch();
          toast.success(str);
          // reset(defaultValues);
          resetForm();
        } else if (res.response.status === 409) {
          toast.warning(res.response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };

  const resetForm = () => {
    reset(defaultValues);
    setEdit(false);
  };

  useEffect(() => {
    Object.keys(salesGroupDetails).length === 0
      ? setEdit(false)
      : setEdit(true);
    console.log("salesGroupDetails values", salesGroupDetails);
    reset(salesGroupDetails);
  }, [salesGroupDetails]);

  return (
    <div align="center">
      <form onSubmit={handleSubmit(executeSubmit)}>
        <Card className={classes.card}>
          <CardHeader
            classes={{
              root: classes.cardHeader,
              title: classes.cardTitle,
            }}
            style={{ textAlign: "left" }}
            title={!edit ? "SalesGroup Form" : "Edit SalesGroup Form"}
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"SalesGroup Name"}
                        placeholder={"SalesGroup Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ minLength: 2, maxLength: 20 }}
                        onInput={restrict.indenter}
                        value={value}
                        onChange={onChange}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Code"}
                        placeholder={"Code"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 10 }}
                        onInput={restrict.digits}
                        value={value}
                        onChange={onChange}
                        error={!!errors.code}
                        helperText={errors.code?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="organizationId"
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
                          {"Organization"}
                        </InputLabel>
                        <Autocomplete
                          options={orgnameDetails}
                          value={
                            orgnameDetails.find((item) => item.id == value) ||
                            ""
                          }
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
                              error={!!errors.organizationId}
                              helperText={errors.organizationId?.message}
                            />
                          )}
                          onChange={(e, v) => {
                            onChange(v?.id);
                          }}
                        />
                      </>
                    );
                  }}
                ></Controller>
              </Grid>
              {edit ? (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="active"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <RadioGroup
                          name="radio-buttons-group"
                          onChange={onChange}
                          row
                          defaultValue={value}
                          value={value}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio size="small" />}
                            label="Active"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio size="small" />}
                            label="Inactive"
                          />
                        </RadioGroup>
                      );
                    }}
                  ></Controller>
                </Grid>
              ) : null}
              <Grid container spacing={2}>
                <Grid item xs={6} xl={6} align="right">
                  {edit ? (
                    <Button
                      className={
                        !isDirty ? classes.disabledButton : classes.button
                      }
                      disabled={!isDirty}
                      onClick={handleSubmit(executeUpdate)}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      className={classes.button}
                      onClick={handleSubmit(executeSubmit)}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
                <Grid item xs={6} xl={6} align="left">
                  <Button
                    className={classes.reset}
                    onClick={(e) => {
                      resetForm();
                    }}
                  >
                    Reset
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
