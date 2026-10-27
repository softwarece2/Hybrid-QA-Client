/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";

//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

//redux
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { inputToUpper, restrict } from "../../../restrict";

//material-ui
import { Card, CardContent, CardHeader, FormControlLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//components
import Button from "../../../components/Button";
import MultilineTextField from "../../../components/MultilineTextField";
import TextField from "../../../components/TextField";

//actions
import { saveIndenterDetails, updateIndenterDetails } from "../../../Redux/Actions/UserManagement/IndenterAction";

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
  name: yup.string().trim().typeError("Indentor Name is required").required("Indentor Name is required"),
  shortName: yup.string().trim().typeError("Short Name is required").required("Short Name is required"),
  address: yup.string().trim().typeError("Address is required").required("Address is required"),
  //active: yup.boolean().required("Status is required"),
});

export default function AddIndenterForm({ fetch, indenterDetails, records }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  let defaultValues = {
    id: 0,
    name: "",
    shortName: "",
    address: "",
    active: "",
  };

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
  
    const executeSubmit = async (data) => {  
      try {
        const res = await dispatch(saveIndenterDetails(data));
        if (res.status === 200 || res.status === 201) {
          const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."}`;
          fetch(); 
          toast.success(str);
          reset(defaultValues);
        } 
        else if (res.response && res.response.status === 409) {
          toast.warning(res.response.data); 
        } 
        else {
          toast.error("Failed to save data");
        }
      } catch (error) {
        console.error("Submission Error:", error);
        
        if (error.response && error.response.status === 409) {
          toast.warning(error.response.data);
        } else {
          toast.error("Something went wrong");
        }
      }
    };
  const executeUpdate = (data) => {
    console.log("data", data);
    const value = {
      id: data?.id,
      name: data?.name,
      shortName: data?.shortName,
      address: data?.address,
      active: data?.active === "1" ? true : false,
    };
    dispatch(updateIndenterDetails(value))
      .then((res) => {
        console.log("it is coming");
        if (res.status === 200 || res.status === 201) {
          console.log("abcd", res.response);
          const str = `${edit ? "Data Successfully Updated." : "Data Successfully Submitted."}`;
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
    Object.keys(indenterDetails).length === 0 ? setEdit(false) : setEdit(true);
    console.log("indenterDetails values", indenterDetails);
    reset(indenterDetails);
  }, [indenterDetails]);

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
            title={!edit ? "Indentor Form" : "Edit Indentor Form"}
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
                        labelText={"Indentor Name"}
                        placeholder={"Indentor Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 100 }}
                        // onInput={restrict.indenter}
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
                  name="shortName"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Indentor Short Name"}
                        placeholder={"Indentor Short Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 50 }}
                        // onInput={(e) => {
                        //   // restrict.indenter(e);
                        //   inputToUpper(e);
                        // }}
                        value={value}
                        onChange={onChange}
                        error={!!errors.shortName}
                        helperText={errors.shortName?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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
                        inputProps={{ maxLength: 100 }}
                        value={value}
                        onChange={onChange}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
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
                          <FormControlLabel value="1" control={<Radio size="small" />} label="Active" />
                          <FormControlLabel value="0" control={<Radio size="small" />} label="Inactive" />
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
                      className={!isDirty ? classes.disabledButton : classes.button}
                      disabled={!isDirty}
                      onClick={handleSubmit(executeUpdate)}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button className={classes.button} onClick={handleSubmit(executeSubmit)}>
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
