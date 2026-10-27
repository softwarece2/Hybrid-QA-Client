/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

//hooks
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//redux
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {  restrict } from "../../../restrict";

//material-ui
import {
  Card,
  CardHeader,
  Grid,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//components
import TextField from "../../../components/TextField";
import MultilineTextField from "../../../components/MultilineTextField";
import Button from "../../../components/Button";

//actions

import { saveConsigneeDetails } from "Redux/Actions/UserManagement/ConsigneeAction";
import { updateConsigneeDetails } from "Redux/Actions/UserManagement/ConsigneeAction";

const useStyles = makeStyles((theme) => ({
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
    fontSize: "1rem",
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
    .trim()
    .typeError("Consignee Name is required")
    .required("Consignee Name is required"),

    phone: yup
    .string()
    .trim()
    .typeError("Phone Number is required")
    .required("Phone Number is required"),

  address: yup
    .string()
    .trim()
    .typeError("Address is required")
    .required("Address is required"),

  active: yup.boolean().required("Status is required"),
});

export default function AddConsigneeForm({ fetch, consigneeDetails, records }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  let defaultValues = {
    id: 0,
    name: "",
    phone: "",
    address: "",
    fax: "",
    active: "1",
  };

  // const [values, setValues] = useState(defaultValues);

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // console.log(getValues(), "val");

  const executeSubmit = (data) => {
    console.log("clicked");
    dispatch(saveConsigneeDetails(data))
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."
            }`;
          fetch();
          toast.success(str);
             reset(defaultValues);
        } else if (res.response.status === 409) {
          toast.error(res.response.data);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
 
  };

  const executeUpdate = (data) => {
    console.log("Data", data);
    const value = {
      id: data?.id,
      name: data?.name,
      phone: data?.phone,
      address: data?.address,
      fax: data?.fax,
      active: data?.active,
    };
    console.log("value", value);
    dispatch(updateConsigneeDetails(value))
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

  // useEffect(() => {
  //   reset(defaultValues);
  //   Object.keys(consigneeDetails).length === 0 ? setEdit(false) : setEdit(true);
  //   reset(consigneeDetails);
  //   SetConObj(consigneeDetails);
  // }, [consigneeDetails]);

  useEffect(() => {
    if (consigneeDetails && Object.keys(consigneeDetails).length > 0) {
      setEdit(true);
      const updatedDetails = {
        id: consigneeDetails.id || 0,
        name: consigneeDetails.name || "",
        phone: consigneeDetails.phone || "",
        address: consigneeDetails.address || "",
        fax: consigneeDetails.fax || "",
        active: consigneeDetails.active !== undefined ? consigneeDetails.active : "1",
      };

      reset(updatedDetails);
    } else {
      setEdit(false);
      reset(defaultValues);
    }
  }, [consigneeDetails, reset]);




  console.log("radio value", getValues());

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
            title={!edit ? "Consignee Form" : "Edit Consignee Form"}
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
                        labelText={"Consignee Name"}
                        placeholder={"Consignee Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 100 }}
                        onInput={restrict.indenter}
                        value={value}
                        onChange={onChange}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    );
                  }}
                >
                  {errors.name && <p>{errors.name.message}</p>}
                </Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Phone Number"}
                        placeholder={"Phone Number"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 10 }}
                        onInput={restrict.digits}
                        value={value}
                        onChange={onChange}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="fax"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Fax Number"}
                        placeholder={"Fax Number"}
                        //required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 20 }}
                        onInput={restrict.phoneNumber}
                        value={value}
                        onChange={onChange}
                        error={!!errors.fax}
                        helperText={errors.fax?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <MultilineTextField
                        labelText={"Address"}
                        placeholder={"Address"}
                        required
                        maxRows={4}
                        inputProps={{ maxLength: 300 }}
                        value={value}
                        onChange={onChange}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                {edit ? (
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
                            value="1"
                            control={<Radio size="small" />}
                            label="Active"
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio size="small" />}
                            label="Inactive"
                          />
                        </RadioGroup>
                      );
                    }}
                  ></Controller>
                ) : null}
              </Grid>
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
