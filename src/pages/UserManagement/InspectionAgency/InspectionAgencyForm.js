/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";

//hooks
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

//material-ui
import {
  Card,
  CardHeader,
  Grid,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//components
import TextField from "../../../components/TextField";
import Button from "components/Button";

//actions
import { restrict } from "restrict";
import {
  getUsersByOrgTypeId,
  saveUser,
  UpdateUserData,
} from "Redux/Actions/UserManagement/AddNewUserAction";
import AutoCompleteNew from "components/AutoCompleteNew";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { encryptFn } from "pages/HomePage/UserLogin";
import axiosInstance from "pages/Services/AxiosInstance";
import {
  getAllInspectionAgencyOfFirm,
  getAllSalesGroups,
} from "pages/Services/URLs";

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
  password: "",
  ename: "",
  department: null,
  username: "",
  genderName: "",
  roleId: "",
  reportingOfficerId: "",
  active: true,
  orgId: "",
};
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



const schemaQa = yup.object().shape({
  password: yup
    .string()
    .nullable()
    .required("Required Password")
    .matches(
      /^(?=.*\d)(?=.*[_!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Password(min 8 characters) must contain at least one lowercase letter, one uppercase letter, and one number,one special character"
    ),
  ename: yup.string().trim().required("Required"),
  username: yup.string().trim().required("Required "),
  genderName: yup.object().shape().nullable().required("Required "),
  roleId: yup.object().shape().nullable().required("Required "),
  orgId: yup.object().shape().nullable().required("Required "),
});
export default function InspectionAgencyForm({ refresh, selectedUser }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [reportingUsers, setReportingUsers] = useState([]);
  const [showPassword1, setShowPassword1] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [salesGroups, setSalesGroups] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [departments, setDepartments] = useState([]);

  //   const orgTypeId = useSelector((store) => store.loggedInUser?.orgTypeId);
  const orgTypeId = 1;
  // const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const usertypeDetails = useSelector((store) => store.orgTypeReducer.usertype);
  // const isNotQaAgency = orgTypeId !== -1;
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schemaQa),
  });

  const getOrgList = async () => {
    try {
      const { data } = await axiosInstance("organization/getByOrgTypeId/" + 1);
      setOrgData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // if()
    dispatch(getUsersByOrgTypeId(orgTypeId));
    axiosInstance("department/getAllByStatusTrue").then(({ data }) => {
      setDepartments(data);
    });
    getOrgList();
  }, []);

  const executeSubmit = (data) => {
    setLoadingDraft(true);
    const encryptedUsername = encryptFn(data.username);
    const encryptedPassword = encryptFn(data.password);
    const value = {
      ...data,
      roleId: data?.roleId?.id,
      genderName: data?.genderName?.id,
      orgId: data.orgId.id,
      orgTypeId: orgTypeId,
      reportingOfficerId: data?.reportingOfficerId?.id,
      departmentId: data.department?.id,
      createdBy: 1,
      password: encryptedPassword,
      username: encryptedUsername,
      active: data.active,
    };

    dispatch(saveUser(value))
      .then((res) => {
        refresh();
        resetForm();
      })
      .finally(() => {
        setEdit(false);
        setLoadingDraft(false);
      });
  };

  const executeUpdate = (data) => {
    const encryptedUsername = encryptFn(data.username);
    const encryptedPassword = encryptFn(data.password);
    const value = {
      ...data,
      id: selectedUser.id,
      roleId: data?.roleId?.id,
      genderName: data?.genderName?.id,
      reportingOfficerId: data?.reportingOfficerId?.id,
      orgId: data.orgId.id,
      orgTypeId: orgTypeId,
      createdBy: 1,
      password: encryptedPassword,
      username: encryptedUsername,
      active: data.active,
      activeStatus: undefined,
      activeStatusOriginal: undefined,
    };
    setLoadingDraft(true);
    dispatch(UpdateUserData(value))
      .then((res) => {
        // const message = edit ? "Data Successfully Updated." : "Data Successfully Submitted.";
        refresh();
        resetForm();
        setEdit(false);
        // toast.success(message);
      })
      .catch((error) => {
        console.error("Error during update:", error);
        toast.error("Something went wrong while updating the data.");
        setEdit(true);
      })
      .finally(() => {
        setLoadingDraft(false);
      });
  };

  const resetForm = () => {
    reset(defaultValues);
    setEdit(false);
  };

  const getReportingUsers = async (seniorityId, departmentId) => {
    let url = `employee/getAllActiveEmpsForOrgType/${seniorityId}/1`;
    const department = getValues("department");
    if (departmentId || department) {
      url =
        "employee/getActiveParentEmpByIdDeptId/" +
        seniorityId +
        "/" +
        (departmentId || department.id);
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(url);
      setReportingUsers(data);
      return data;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  useEffect(() => {
    const resetField = async () => {
      const findSeniority = usertypeDetails.find(
        (el) => el.id === selectedUser.roleId
      );
      const reportingUsers = await getReportingUsers(
        findSeniority?.seniorityId || 0,
        selectedUser.departmentId
      );

      reset({
        ...selectedUser,
        genderName: gender.find((el) => el.id === selectedUser.genderName),
        roleId: findSeniority,
        active: selectedUser?.activeStatusOriginal,
        department: departments.find(
          (el) => el.id === selectedUser.departmentId
        ),
        reportingOfficerId: reportingUsers.find(
          (el) => el.id === selectedUser?.reportingOfficerId
        ),
        orgId: orgData.find((el) => el.id === selectedUser?.orgId),
      });
    };
    if (
      selectedUser &&
      Object.keys(selectedUser)?.length &&
      departments?.length
    ) {
      setEdit(true);
      resetField();
    } else {
      setEdit(false);
    }
  }, [selectedUser, reset, departments, orgData]);

  async function getSalesGroups() {
    try {
      const { data } = await axiosInstance(getAllSalesGroups);
      setSalesGroups(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSalesGroups();
  }, []);

  return (
    <div align="center" style={{ padding: 12 }}>
      <form onSubmit={handleSubmit(executeSubmit)}>
        <Card className={classes.card}>
          <CardHeader
            classes={{
              root: classes.cardHeader,
              title: classes.cardTitle,
            }}
            style={{ textAlign: "left" }}
            title={!edit ? "Create Inspection Agency User " : "Edit User"}
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Controller
                  name="ename"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Employee Name"}
                        placeholder={"Employee Name"}
                        //   disabled={isDirty}
                        inputProps={{ minLength: 2, maxLength: 100 }}
                        onInput={restrict.empName}
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Username"}
                        placeholder={"Username"}
                        required
                        //   disabled={isDirty}
                        inputProps={{ maxLength: 30 }}
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                        }}
                        inputProps={{
                           maxLength: 20,
                          autoComplete: "new-password",
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
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
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Controller
                  name="orgId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={orgData.filter(o => o.active === true) || []}
                      value={value}
                      labelText="Select QA Agency"
                      required
                      getOptionLabel={(o) => o?.organizationName}
                      onChange={(e, v) => {
                        onChange(v);
                      }}
                      error={!!errors.orgId}
                      helperText={errors.orgId?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={usertypeDetails}
                      value={value}
                      labelText="Select Role"
                      required
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        setReportingUsers([]);
                        setValue("reportingOfficerId", null);
                        getReportingUsers(v?.seniorityId);
                      }}
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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
                        setOrgnizationId("");
                      }}
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                    />
                  )}
                ></Controller>
              </Grid> */}
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Controller
                  name="reportingOfficerId"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      labelText="Select Reporting "
                      data={reportingUsers || []}
                      value={value || null}
                      //  required
                      getOptionLabel={(options) => options.ename}
                      onChange={(e, v) => {
                        onChange(v);
                      }}
                    />
                  )}
                />
              </Grid>
              {edit ? (
                <Grid item xs={12}>
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
                      disabled={!isDirty || loadingDraft}
                      onClick={handleSubmit(executeUpdate)}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      className={classes.button}
                      disabled={loadingDraft}
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
