/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
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
  FormHelperText,
  Box,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { orgtypename } from "Redux/Actions/UserManagement/OrganizationTypeAction";

//components
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";

//actions
import { Autocomplete } from "@material-ui/lab";
import { restrict } from "restrict";

import { Typography } from "antd";
import {
  saveOrganizationDetails,
  updateOrganizationDetails,
} from "../../../Redux/Actions/UserManagement/OrganizationAction";
import { CloseIcon } from "widget/icons";
import { Close } from "@material-ui/icons";

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

// const OrgRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9{}(\)\-,]+$/;

const schema = yup.object().shape({
  organizationName: yup
    .string()
    .min(2, "Organization Name minimum length 2 characters")
    .trim()
    .typeError("Organization Name is required")
    // .matches(OrgRegex, "Invalid Organization Name")
    .required("Organization Name is required"),
  email: yup
    .string()
    .required("Email Id is required")
    .email("Email Should be valid")
    .typeError("Organization Name is required"),
  mobile: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[7-9]\d{9}$/, "Enter valid Mobile Number")
    .typeError("Organization Name is required"),
  organizationTypeId: yup
    .string()
    .typeError("Organization Type is required")
    .required("Organization Type is required"),
  organizationAddress: yup
    .string()
    .min(4, "Organization Address minimum length 4 characters")
    .trim()
    .typeError("Organization Address is required")
    .required("Organization Address is required"),
  stdCode: yup
    .string()
    .nullable()
    .trim()
    .when("organizationTypeId", (organizationTypeId) => {
      if (organizationTypeId == 1) {
        return (
          yup
            .string()
            .trim()
            .required("Required")
            // .max(avlQty, "Total must be less than available")
            .typeError("Required")
        );
      }
    }),
  // inoteSerialStrt: yup
  //   .string()
  //   .nullable()
  //   .trim()
  //   .when("organizationTypeId", (organizationTypeId) => {
  //     if (organizationTypeId == 1) {
  //       return (
  //         yup
  //           .string()
  //           .trim()
  //           .required("Required")
  //           // .max(avlQty, "Total must be less than available")
  //           .typeError("Required")
  //       );
  //     }
  //   }),
  // inoteCode: yup
  //   .string()
  //   .nullable()
  //   .trim()
  //   .when("organizationTypeId", (organizationTypeId) => {
  //     if (organizationTypeId == 1) {
  //       return (
  //         yup
  //           .string()
  //           .trim()
  //           .required("Required")
  //           // .max(avlQty, "Total must be less than available")
  //           .typeError("Required")
  //       );
  //     }
  //   }),
});

export default function AddOrgForm({ fetch, orgDetails, edit, setEdit }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [edit, setEdit] = useState(false);

  const [previewLogo, setPreviewLogo] = useState(null);
  const [logoWarningMsg, setLogoWarningMsg] = useState(null);
  const [logo, setLogo] = useState(undefined);
  console.log("edit", edit);

  let defaultValues = {
    organizationName: "",
    email: "",
    mobile: "",
    organizationTypeId: null,
    active: "true",
    // inoteSerialStrt: "",
    stdCode: "",
    // inoteCode: "",
    organizationAddress: "",
    logoStr: "",
    logo: "",
  };

  // const [values, setValues] = useState(defaultValues);
  const orgtypeDetails = useSelector(
    (store) => store.orgTypeReducer.orgtypename
  );

  useEffect(() => {
    dispatch(orgtypename());
    console.log("test", orgtypeDetails);
  }, []);

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

  const typeWatcher = useWatch({ control, name: "organizationTypeId" });
  console.log("typeWatcher", typeWatcher);

  const executeSubmit = (data) => {
    const value = {
      ...data,
      logoStr: logo || orgDetails.logoStr,
    }
    if (previewLogo) {
      dispatch(saveOrganizationDetails(value))
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            console.log("abcd", res.response);
            const str = `${
              edit
                ? "Data Successfully Updated."
                : "Data Successfully Submitted."
            }`;
            fetch();
            toast.success(str);
            resetForm();
          } else if (res.response.status === 409) {
            toast.warning(res.response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Something went wrong");
        });
    } else {
      toast.error("Please Select a file");
    }
  };

  const executeUpdate = (data) => {
    console.log("eheh", logo, orgDetails.logoStr);
    const value = {
      id: data?.id,
      organizationName: data?.organizationName,
      organizationTypeId: data?.organizationTypeId,
      email: data?.email,
      mobile: data?.mobile,
      stdCode: data?.stdCode,
      // inoteCode: data?.inoteCode,
      // inoteSerialStrt: data?.inoteSerialStrt,s
      organizationAddress: data?.organizationAddress,
      active: data?.active,
      logoStr: logo || orgDetails.logoStr,
    };
    console.log("value", value);
    dispatch(updateOrganizationDetails(value))
      .then((res) => {
        console.log("it is coming");
        if (res.status === 200 || res.status === 201) {
          console.log("abcd", res.response);
          const str = `${
            edit ? "Data Successfully Updated." : "Data Successfully Submitted."
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
    setEdit(false);
  };

  const removeLogo = () => {
    setLogo(undefined);
    setPreviewLogo(null);
    setLogoWarningMsg("");
    // This clears the actual file input field so the same file can be re-selected if needed
    const fileInput = document.getElementById("logoStr");
    if (fileInput) {
      fileInput.value = "";
    }
  };


  const resetForm = () => {
    reset(defaultValues);
    setPreviewLogo(null);
    setLogo(""); 
    const fileFieldId = document.getElementById("logoStr")
    fileFieldId.value = ''
    setEdit(false);
    removeLogo();
  };

  useEffect(() => {
    Object.keys(orgDetails).length === 0 ? setEdit(false) : setEdit(true);
    console.log("orgDetails values", orgDetails);
    reset(orgDetails);
  }, [orgDetails]);

  console.log("val", getValues(), errors);
  console.log("edit", edit);
  useEffect(() => {
    console.log("edit2", orgDetails?.logo, edit);
    if (edit) {
      console.log("edit23", orgDetails?.logo, orgDetails?.organizationTypeId);
      reset({
        ...orgDetails,
        organizationTypeId:
          orgtypeDetails?.find((el) => el.id === orgDetails?.organizationTypeId)
            ?.id || null, // Set default to null or some other fallback value
      });

      if (orgDetails?.logo) {
        setPreviewLogo(`data:image/png;base64, ${orgDetails?.logo}`);
      }
      console.log("asdsjd", previewLogo, orgDetails?.organizationTypeId);
    }
  }, [orgDetails, orgtypeDetails, orgDetails?.logo]);

  const fileToBase64 = (event) => {
    const file = event.target.files[0];
    if (file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const fileChange = React.useCallback(async (event) => {
    setLogoWarningMsg("");
    setPreviewLogo(undefined);
    const file = event.target.files[0];
    if (file) {
      const name = file.name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);

      const allowedExtensions = ["jpg", "png", "jpeg"];
      if (!allowedExtensions.includes(ext?.toLowerCase())) {
        setLogoWarningMsg("Only jpg/png files allowed");
      } else {
        let img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          let imageWidth = img.width;
          let imageHeight = img.height;
          let imageSize = file.size;
          console.log(
            "width",
            imageWidth,
            "height",
            imageHeight,
            "size",
            imageSize
          );

          if (imageSize > 262144) {
            setLogoWarningMsg("Image too big (max 256kb)");
            setPreviewLogo(undefined);
          } else if (imageWidth > 200 || imageHeight > 200) {
            setLogoWarningMsg("Image should be within 200*200 size");
            setPreviewLogo(undefined);
          } else {
            setPreviewLogo(URL.createObjectURL(file));
            const base64 = await fileToBase64(event);
            setLogo(base64);
          }
        };
      }
    }
  }, []);
  console.log(errors);
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
            title={!edit ? "Organization Form " : "Edit Organization Form"}
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={5} lg={6} xl={6}>
                <Controller
                  name="organizationName"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Organization Name"}
                        placeholder={"Organization Name"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ minLength: 2, maxLength: 50 }}
                        onInput={restrict.orgnameInput}
                        value={value}
                        onChange={onChange}
                        error={!!errors.organizationName}
                        helperText={errors.organizationName?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>

              <Grid item xs={12} sm={6} md={5} lg={6} xl={6}>
                <Controller
                  name="organizationTypeId"
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
                          style={{ fontSize: "0.875rem" }}
                        >
                          {"Organization Type"}
                        </InputLabel>
                        <Autocomplete
                          options={orgtypeDetails}
                          value={
                            orgtypeDetails.find((item) => item.id == value) ||
                            ""
                          }
                          // labelText="Organization Type"
                          getOptionLabel={(o) => o.typeName}
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
                              error={!!errors.organizationTypeId}
                              helperText={errors.organizationTypeId?.message}
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

              <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Mobile Number"}
                        placeholder={"Mobile Number"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 10 }}
                        onInput={restrict.digits}
                        value={value}
                        onChange={onChange}
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Email Id"}
                        placeholder={"Email Id"}
                        required
                        onInput={restrict.email}
                        inputProps={{ maxLength: 50 }}
                        value={value}
                        onChange={onChange}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>

             

              <Grid item xs={10} sm={4} md={4} lg={6} xl={6}>
              <Box>
                <Typography variant="subtitle1" style={{fontSize: "0.875rem" }}>Organization Address <span style={{ color: 'red' }}>*</span> 
                </Typography> 
                <Controller
                  name="organizationAddress"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <MuiTextField
                        placeholder={"Organization Address"}
                        multiline
                        minRows={2}
                        required
                       //maxRows={10}
                        variant="outlined"
                        fullWidth    
                        //   disabled={isDirty}
                        inputProps={{ minLength: 2, maxLength: 200 }}
                        onInput={restrict.address}
                        value={value}
                        onChange={onChange}
                        error={!!errors.organizationAddress}
                        helperText={errors.organizationAddress?.message}
                      />
                    );
                  }}
                ></Controller>
                </Box>
              </Grid>

              {typeWatcher == 1 ? (
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <Controller
                    name="stdCode"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          labelText={"STD Code"}
                          placeholder={"STD Code"}
                          required
                          //   disabled={isDirty}
                          inputProps={{ minLength: 2, maxLength: 7 }}
                          onInput={restrict.usernameInput}
                          value={value}
                          onChange={onChange}
                          error={!!errors.stdCode}
                          helperText={errors.stdCode?.message}
                        />
                      );
                    }}
                  ></Controller>
                </Grid>
              ) : null}

              {/* {typeWatcher == 1 ? (
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <Controller
                    name="inoteCode"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          labelText={"I-Note Code"}
                          placeholder={"I-Note Code"}
                          required
                          onInput={restrict.usernameInput}
                          //   disabled={isDirty}
                          inputProps={{ minLength: 2, maxLength: 5 }}
                          value={value}
                          onChange={onChange}
                          error={!!errors.inoteCode}
                          helperText={errors.inoteCode?.message}
                        />
                      );
                    }}
                  ></Controller>
                </Grid>
              ) : null}

              {typeWatcher == 1 ? (
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <Controller
                    name="inoteSerialStrt"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextField
                          labelText={"I-Note Serial Start"}
                          placeholder={"I-Note Serial Start"}
                          required
                          //   disabled={isDirty}
                          inputProps={{ minLength: 2, maxLength: 5 }}
                          onInput={restrict.usernameInput}
                          value={value}
                          onChange={onChange}
                          error={!!errors.inoteSerialStrt}
                          helperText={errors.inoteSerialStrt?.message}
                        />
                      );
                    }}
                  ></Controller>
                </Grid>
              ) : null} */}

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Typography style={{ fontSize: "0.875rem" }}>
                  Upload Logo <span style={{ color: "red" }}>*</span>
                </Typography>
                <input
                  id="logoStr"
                  InputProps={{ className: classes.input }}
                  width="50%"
                  type="file"
                  accept=".jpg,.png"
                  onChange={fileChange}
                  error={errors.logo}
                />
                <br />
                <span style={{ color: "red" }}>{logoWarningMsg}</span>
                {/* {previewLogo && (
                  <img
                    className="preview"
                    src={previewLogo}
                    alt="Preview Logo"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                      marginTop: "10px",
                    }}
                  />
                )} */}
                        {previewLogo && (
                <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
                  <img
                    className="preview"
                    src={previewLogo}
                    alt="Preview Logo"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                  <IconButton
                    aria-label="remove"
                    onClick={removeLogo}
                    style={{
                      position: "absolute",
                    }}
                    size="small"
                  >
                    <Close fontSize="small" color="action" />
                  </IconButton>
                </div>
              )}
                <FormHelperText>
                  only .jpg or .png files are accepted.
                </FormHelperText>
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
