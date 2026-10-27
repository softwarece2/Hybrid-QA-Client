/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//redux
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { inputToUpper } from "../../../restrict";

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
import { saveOpaDetails } from "../../../Redux/Actions/UserManagement/OpaAction";


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

const schema = yup.object().shape({
  opaName: yup
    .string()
    .trim()
    .typeError("Opa Name is required")
    .required("Opa Name is required"),
  opashortName: yup
    .string()
    .trim()
    .required("Short Name is required"),
  opaAddress: yup
    .string()
    .trim()
    .required("Address is required"),
  opaStatus: yup.boolean().required("Status is required"),
});

export default function AddOPAForm({ fetch, opaDetails }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  let defaultValues = {
    id: 0,
    opaName: "",
    opashortName: "",
    opaAddress: "",
    opaStatus: "",
  };

  // const [values, setValues] = useState(defaultValues);

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // console.log(getValues(), "val");

  const executeSubmit = (data) => {
    dispatch(saveOpaDetails(data))
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const str = `${
            edit ? "Data Successfully Updated." : "Data Successfully Submitted."
          }`;
          fetch();
          toast.success(str);
          resetForm();
        } else if (res.response.status === 409) {
          toast.warning(res.response.data);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const resetForm = () => {
    reset(defaultValues);
    setEdit(false);
  };

  useEffect(() => {
    Object.keys(opaDetails).length === 0 ? setEdit(false) : setEdit(true);
    console.log("opaDetails values", opaDetails);
    reset(opaDetails);
  }, [opaDetails]);

  console.log("values", getValues());

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
            title="OPA Form"
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="opaName"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"OPA Name"}
                        placeholder={"OPA Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 500 }}
                        //   onInput={restrict.alphanumeric}
                        value={value}
                        onChange={onChange}
                        error={!!errors.opaName}
                        helperText={errors.opaName?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="opashortName"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"OPA Short Name"}
                        placeholder={"OPA Short Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 10 }}
                        onInput={inputToUpper}
                        value={value}
                        onChange={onChange}
                        error={!!errors.opashortName}
                        helperText={errors.opashortName?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="opaAddress"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <MultilineTextField
                        labelText={"Address"}
                        placeholder={"Address"}
                        required
                        maxRows={4}
                        inputProps={{ maxLength: 200 }}
                        // onInput={restrict.alphanumeric}
                        value={value}
                        onChange={onChange}
                        error={!!errors.opaAddress}
                        helperText={errors.opaAddress?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="opaStatus"
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
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6} xl={6} align="right">
                  {edit ? (
                    <Button
                      className={classes.button}
                      onClick={handleSubmit(executeSubmit)}
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
