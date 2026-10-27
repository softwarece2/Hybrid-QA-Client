import React, { useState} from "react";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { updatePassword } from "Redux/Actions/Login/LoginAction";
// import { useForm, Form } from "../../components/useForm";
import Button from "components/Button";
import CryptoJS from "crypto-js";
import { encryptionSecret } from "../../config.js";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserLogout } from "Redux/Actions/Logout/LogoutAction";

const useStyles = makeStyles((theme) => ({
  input: {
    height: 35,
    width: "100%",
  },
  textField: {
    margin: "5px",
  },
}));

function UpdatePassword(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const userName = useSelector((store) => store.loggedInUser?.username);

  const navigate = useNavigate();
  const user = useSelector((store) => store.loggedInUser);

  const defaultValues = {
    id: 0,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    username: userName,
    currentPassword: "",
    password: "",
  };

  const encryptFn = (data) => {
    // const encryptionSecret = configData.encryptionSecret;
    var key = CryptoJS.enc.Latin1.parse(encryptionSecret);
    var iv = CryptoJS.enc.Latin1.parse(encryptionSecret);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return encrypted.toString();
  };

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Required"),
    newPassword: yup
      .string()
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
        "Password must contain Upper, Lower, Number, Special character and Minimum of 8 characters"
      )
      .when("oldPassword", (oldPassword) => {
        if (oldPassword === getValues("newPassword")) {
          setError("newPassword", {
            type: "custom",
            message: "New password is same as current password. Pls Re-Enter",
          });
        }
      }),
    // .oneOf([yup.ref("oldPassword")], "Your passwords do not match."),
    confirmPassword: yup
      .string()
      .required("Required")
      .oneOf([yup.ref("newPassword")], "Your passwords do not match."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const validateFieldPassword = (value, oldPassword) => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!value) {
      return "this field is required";
    } else if (value === oldPassword) {
      return "Password is same Old Password. Re-Enter";
    } else if (value && value.length < 8) {
      return "Minimum 8 characters required";
    } else if (value && value.length >20) {
      return "Maximum 20 characters allowed";
    } else if (value && !re.test(value)) {
      return "Password must contain Upper,Lower,Number,Special character";
    }
    return "";
  };

 
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };
  const {logout} =  useUserLogout();

  const handleLogout = () => {
    const data = { userName: user?.username };
    logout(data)
      .then((res) => {
        if (res === "success") {
          navigate("/home");
        } 
        // else {
        //   toast.error("Logout failed.");
        // }
      })
      
  };

  const submitChangePassword = (e) => {
    // e.preventDefault();
    const checkPassword = validateFieldPassword(getValues("newPassword"), getValues("oldPassword"));
    if (!checkPassword) {
      setValue("passwordChange", true);
      const encryptedUsername = encryptFn(getValues("username"));
      const encryptedOldPassword = encryptFn(getValues("oldPassword"));
      const encryptedNewPassword = encryptFn(getValues("newPassword"));
      const data = {
        username: encryptedUsername,
        currentPassword: encryptedOldPassword,
        password: encryptedNewPassword,
      };
      console.log("data:", data);
      dispatch(updatePassword(data)).then((res) => {
        if (res === "success") {
          toast.success("Password Changed successfully");
          reset();
          props.onClose();
          setTimeout(() => {
            console.log("Log out!");
            handleLogout();
          }, 2000);
        } else {
          toast.error(res);
        }
      });
    } else {
      toast.error(checkPassword);
    }
  };

  // console.log("values", getValues(), errors);
  // console.log("props", props);

  return (
    // <Form>
    <Grid container spacing={0}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
        <TextField
          {...register("oldPassword")}
          className={classes.textField}
          fullWidth
          variant="outlined"
          size="small"
          label="Current Password *"
          type={showPassword1 ? "text" : "password"}
          // value={values.oldPassword}
          // onChange={handleInputChange}
          error={errors.oldPassword}
          helperText={!!errors?.oldPassword && errors?.oldPassword?.message}
          InputProps={{
            //   className: classes.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword1} onMouseDown={handleMouseDownPassword1}>
                  {showPassword1 ? (
                    <Visibility style={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff style={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 20 }}
        />

        <TextField
          {...register("newPassword")}
          fullWidth
          className={classes.textField}
          variant="outlined"
          size="small"
          label="New Password *"
          type={showPassword ? "text" : "password"}
          // value={values.newPassword}
          // onChange={handleInputChange}
          error={errors.newPassword}
          helperText={!!errors?.newPassword && errors?.newPassword?.message}
          InputProps={{
            //   className: classes.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                  {showPassword ? (
                    <Visibility style={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff style={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 20 }}
        />

        <TextField
          {...register("confirmPassword")}
          variant="outlined"
          fullWidth
          className={classes.textField}
          size="small"
          label="Confirm Password *"
          type={showPassword2 ? "text" : "password"}
          // value={values.confirmPassword}
          // onChange={handleInputChange}
          error={errors.confirmPassword}
          helperText={!!errors?.confirmPassword && errors?.confirmPassword?.message}
          InputProps={{
            //   className: classes.input,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2}>
                  {showPassword2 ? (
                    <Visibility style={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff style={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 20 }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
        <Button variant="contained" color="secondary" onClick={handleSubmit(submitChangePassword)}>
          Update Password
        </Button>
      </Grid>
    </Grid>
    // </Form>
  );
}

export default UpdatePassword;
