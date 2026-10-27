/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";

//material-ui
import {
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";

//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";

//components
import { Visibility, VisibilityOff } from "@material-ui/icons";
import AutoCompleteNew from "components/AutoCompleteNew";
import { encryptFn } from "pages/HomePage/UserLogin";
import axiosInstance from "pages/Services/AxiosInstance";
import { getAllSalesGroups } from "pages/Services/URLs";
import { useDispatch } from "react-redux";
import { restrict } from "restrict";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import { toast } from "react-toastify";
import {
  getInspectionAgencyDetails,
  saveUser,
  updateUser,
} from "Redux/Actions/UserManagement/AddNewUserAction";

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
const defaultValues = {
  ename: "",
  username: "",
  password: "",
  genderName: "",
  roleId: "",
  salesGrp: null,
  organization: null,
  active:null,
};
const schema = yup.object().shape({
  password: yup
    .string()
    .required("Required Password")
    .matches(
      /^(?=.*\d)(?=.*[_!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Password(min 8 characters) must contain at least one lowercase letter, one uppercase letter, and one number,one special character"
    )
    .required("Required"),
  ename: yup.string().trim().required("Required"),
  username: yup.string().trim().required("Required "),
  genderName: yup
    .object()
    .shape()
    .nullable()
    .typeError("Required")
    .required("Required "),
  roleId: yup
    .object()
    .shape()
    .nullable()
    .typeError("Required")
    .required("Required "),
  salesGrp: yup
    .object()
    .shape()
    .nullable()
    .notRequired()
    .when("roleId", (roleId) => {
      console.log(roleId, "roleId");
      if (roleId[0]?.id === 9) {
        return yup
          .object()
          .shape()
          .nullable()
          .typeError("Required")
          .required("Required");
      }
    }),
  organization: yup
    .object()
    .shape()
    .nullable()
    .notRequired()
    .when("roleId", (roleId) => {
      console.log(roleId, "roleId");
      if (roleId[0]?.id === 2 || roleId[0]?.id === 14) {
        return yup
          .object()
          .shape()
          .nullable()
          .typeError("Required")
          .required("Required");
      }
    }),
});
const gender = [
  {
    id: "F",
    name: "Female",
  },
  {
    id: "M",
    name: "Male",
  },
  { id: "O", name: "Others" },
];
const roles = [
  {
    id: 2,
    name: "OIC Admin",
  },
  {
    id: 9,
    name: " SBU Admin",
  },
];

export default function AddUserForm({ fetch, userDetails, row, isEditMode }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showPassword1, setShowPassword1] = useState(false);
  
  const [data, setData] = useState([]);

  const [records, setRecords] = useState([]);
  const [orgId, setOrgId] = useState();
  // const orgId = useSelector(store => store.loggedInUser?.orgId);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const typeWatcher = useWatch({ control, name: "roleId" });
  console.log("typeWatcher", typeWatcher);

  const resetForm = () => {
    reset(defaultValues);
  };
  const executeSubmit = (data) => {
    const encryptedUsername = encryptFn(data.username);
    const encryptedPassword = encryptFn(data.password);
    const value = {
      ename: data.ename,
      roleId: data.roleId?.id,
      genderName: data.genderName?.id,
      orgId: orgId,
      salesGrpId: data.salesGrp?.id,
      createdBy: 1,
      password: encryptedPassword,
      username: encryptedUsername,
      // reportingOfficerId:0
    };

    dispatch(saveUser(value))
      .then((res) => {
        resetForm(); // Ensure this is correctly defined
        fetch(); // Ensure this is properly defined
      })
      .catch((error) => {
        console.error("Dispatch Error:", error);
        toast.error("Something went wrong");
      });
  };
  const executeUpdate = (data) => {
    const encryptedUsername = encryptFn(data.username);
    const encryptedPassword = encryptFn(data.password);
    const value = {
      id: data?.id,
      ename: data.ename,
      roleId: data.roleId?.id,
      genderName: data.genderName?.id,
      orgId: orgId,
      salesGrpId: data.salesGrp?.id,
      createdBy: 1,
      password: encryptedPassword,
      username: encryptedUsername,
      empId: data?.empId,
      active:data.active === 'true'
    };

    dispatch(updateUser(value))
      .then((res) => {
        resetForm(); // Ensure this is correctly defined
        fetch(); // Ensure this is properly defined
      })
      .catch((error) => {
        console.error("Dispatch Error:", error);
        toast.error("Something went wrong");
      });
  };
  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const fetchSalesGroup = () => {
    //  setLoading(true);
    axiosInstance
      .get(getAllSalesGroups)
      .then(({ data }) => {
        setRecords(
          data.map((el, i) => ({
            ...el,
            SalesGroupStatus: el?.active,
            //active: el?.active === true ? <Active /> : el?.active === false ? <InActive /> : null,
          }))
        );
        //  setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        //setLoading(false);
      });
  };

  const fetchDetails = () => {
    dispatch(getInspectionAgencyDetails())
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchSalesGroup();
    fetchDetails();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      reset({
        ...userDetails,
        genderName: gender.find((el) => el.id === userDetails.genderName),
        roleId: roles.find((el) => el.id === userDetails.roleId),
        organization: data?.find((el) => el.id === userDetails.orgId),
        salesGrp: records?.find((el) => el.id === userDetails.salesGrpId),
      });
    }
  }, [isEditMode, userDetails]);
  console.log(userDetails, "userDetails");
  return (
    <div align="center">
      <form onSubmit={handleSubmit(executeSubmit)} autocomplete="off">
        <Card className={classes.card}>
          <CardHeader
            classes={{
              root: classes.cardHeader,
              title: classes.cardTitle,
            }}
            style={{ textAlign: "left" }}
            title="User Form"
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="ename"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Employee Name"}
                        placeholder={"Employee Name"}
                        //   disabled={isDirty}
                        inputProps={{ minLength: 3, maxLength: 100 }}
                        onInput={restrict.onlyCharacter}
                        value={value}
                        onChange={onChange}
                        error={!!errors.ename}
                        helperText={errors.ename?.message}
                        required
                        //  error={errors.ename}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Username"}
                        placeholder={"Username"}
                        required
                        inputProps={{
                          minLength: 3,
                          maxLength: 20,
                          autoComplete: "off",
                        }}
                        onInput={restrict.usernameInput}
                        value={value}
                        onChange={onChange}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Enter Password"}
                        placeholder={"Enter Password"}
                        type={showPassword1 ? "text" : "password"}
                        required
                        inputProps={{
                          maxLength: 20,
                          autoComplete: "new-password",
                        }}
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        InputProps={{
                          className: classes.input,

                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword1}>
                                {showPassword1 ? (
                                  <Visibility style={{ fontSize: "20px" }} />
                                ) : (
                                  <VisibilityOff style={{ fontSize: "20px" }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.password}
                        helperText={errors.password?.message}

                        // error={passwordErr}
                        // helperText={passwordErr ? "Remark required" : ""}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="genderName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={gender}
                      value={value}
                      required
                      labelText="Select Gender"
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        // getData(v?.seniorityId);
                      }}
                      error={!!errors.genderName}
                      helperText={errors.genderName?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={roles}
                      value={value}
                      labelText="Select Role"
                      required
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        setValue("organization", null);
                        setValue("salesGrp", null);
                        setOrgId("");
                      }}
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                    />
                  )}
                ></Controller>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                {typeWatcher?.id === 9 ? (
                  <Controller
                    name="salesGrp"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <AutoCompleteNew
                        data={records}
                        value={value}
                        labelText="Select Sales Group"
                        required
                        getOptionLabel={(o) => o.name}
                        onChange={(e, v) => {
                          onChange(v);
                          setOrgId(v?.organizationId);
                        }}
                        error={!!errors.salesGrp}
                        helperText={errors.salesGrp?.message}
                      />
                    )}
                  ></Controller>
                ) : typeWatcher?.id === 2 || typeWatcher?.id === 14 ? (
                  <Controller
                    name="organization"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <AutoCompleteNew
                        data={data}
                        value={value}
                        required
                        labelText="Select Organization"
                        getOptionLabel={(o) => o?.orgName}
                        onChange={(e, v) => {
                          onChange(v);
                          setValue("salesGrp", null);
                          setOrgId(v?.id);
                        }}
                        error={!!errors.organization}
                        helperText={errors.organization?.message}
                      />
                    )}
                  ></Controller>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                {isEditMode ? (
                  <Controller
                    name="active"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControl component="fieldset">
                <FormLabel component="legend">Active</FormLabel>
                <RadioGroup row aria-label="Active Status" name="active" value={value} onChange={onChange}>
                  <FormControlLabel value={'true'} control={<Radio />} label="Active" />
                  <FormControlLabel value={'false'} control={<Radio />} label="InActive" />
                </RadioGroup>
              </FormControl>
                    )}
                  ></Controller>
               ):null}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} xl={6} align="right">
                {isEditMode ? (
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
