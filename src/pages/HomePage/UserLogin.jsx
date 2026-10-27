import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import { MASTER_URL, encryptionSecret } from "../../config.js";
import { LOGIN_TYPE, USER_ROLE } from "../../Redux/Types";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGlobalStyles } from "Styles";
import { toast } from "react-toastify";

//component
import Button from "components/Button";
import TextField from "components/TextField";
import { restrict } from "restrict";
import { LOGGED_IN_USER } from "Redux/Types";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import {  Dialog,  Typography,  Card,   InputAdornment,  Grid, } from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";

//icons
import { Lock, VisibilityOff, Visibility, Person } from "@material-ui/icons";
import Replay from "@material-ui/icons/Replay";

//global

import axios from "axios";

import { DialogActions, DialogContent } from "Utils/index.js";

const useStyles = makeStyles((theme) => ({
  btn: {
    fontSize: "16px",
    textTransform: "none",
    marginTop: 20,
    backgroundColor: "#fd7e14",
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      color: theme.palette.common.white,
      background: "#E26A2C",
    },
  },
  heading: {
    fontSize: "1.5rem",
    paddingBottom: 24,
    color: "#15133C",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.2rem",
    },
  },
  
  card: {

    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xl")]: {
      padding: "120px 58px 120px 58px",
    },
    [theme.breakpoints.down("lg")]: {
      padding: "60px 58px 60px 58px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "19px 58px 19px 58px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "30px 58px 30px 58px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "12px 58px 12px 58px",
    },
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .typeError("Username is required")
    .required("Username is required"),

  password: yup
    .string()
    .trim()
    .typeError("Password is required")
    .required("Password is required"),
  captchaStr: yup
    .string()
    .trim()
    .typeError("Captcha is required")
    .required("Captcha is required"),
});

export const encryptFn = (data) => {
  var key = CryptoJS.enc.Latin1.parse(encryptionSecret);
  var iv = CryptoJS.enc.Latin1.parse(encryptionSecret);
  var encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
};

const openPdf = (base64String, title) => {
  let pdfWindow = window.open("");
  pdfWindow.document.write( "<iframe title='" +  title + "' width='100%' height='100%' target='_blank' src='" +
      encodeURI(base64String) +  "'></iframe>" );
};

export const viewDocument = (blob) => {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    var base64data = reader.result;
    openPdf(base64data);
  };
};





export default function UserLogin({ history }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);

  const [isDirty, setIsDirty] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = useState("");
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(30);
  const [getCaptchaa, setGetCaptchaa] = useState(true);
  const dispatch = useDispatch();
  const [captcha, setCaptcha] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const classes1 = useGlobalStyles();

  let defaultValues = {
    username: "",
    password: "Admin@123",
    captchaStr: "captcha",
    id: null,
  };

  const {
    register,
    watch,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

const submitLogin = async (data, forceLogin) => {
    try {
      setLoading(true);
      // if (event.key === "Enter" || event.type === "click") {
      let url = MASTER_URL + "user/userLogin";
      if(forceLogin){
        url = MASTER_URL + "user/forceLogin";
      }
      const encryptedUserName = encryptFn(data.username);
      const encryptedPassword = encryptFn(data.password);

      const { data: value } = await axios.post(url, {
        userName: encryptedUserName,
        password: encryptedPassword,
        id: getCaptchaa?.captchaId,
        captcha: data.captchaStr,
      });
      if (value.message === "success") {
        setLoading(false);
        localStorage.setItem("User", JSON.stringify(value));
        localStorage.setItem("AccessToken", JSON.stringify(value?.token));
        dispatch({ type: LOGGED_IN_USER, payload: value });
        navigate("/layout");
      } else {
        toast.error(value.message);
      }
    } catch (error) {
      console.log(error, "error");
      if (error.response.status === 409) {
        setOpenLoginAlert(true);
        setErrorMessage(error.response.data.message);
      } else {
        setOpenLoginAlert(false);
        getCaptcha();
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEnter = (event) => {};

  const getCaptcha = () => {
    const captchaUrl = MASTER_URL + "captcha/get";
    axios
      .get(captchaUrl)
      .then((res) => {
        setGetCaptchaa(res.data);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleResend = async () => {
    setSec(30);
    setMin(1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (sec > 0) {
        setSec(sec - 1);
      }
      if (sec === 0) {
        if (min === 0) {
          clearInterval(timer);
        } else {
          setMin(min - 1);
          setSec(59);
        }
      }
    }, 1000); // clearing interval
    return () => clearInterval(timer);
  });
  const handleChange = (code) => setCode(code);

  const handleBtnClick = (type) => {
    dispatch({ type: LOGIN_TYPE, payload: type });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (data, event) => {
    dispatch({ type: USER_ROLE, payload: data.username });
  };
  useEffect(() => {
    getCaptcha();
    sessionStorage.setItem("sessionExpireCount", false);
  }, []);

  let photo = getCaptchaa?.captchaString;
  let photoString = "data:image/png;base64," + photo;
  return (
    <>
      <form onSubmit={handleSubmit((data)=>submitLogin(data))} autoComplete="new-password">
        <Card className={classes.card}>
          <Typography align="center" className={classes.heading}>
            Login
          </Typography>

          <>
            <div className={classes1.formGroup}>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <TextField
                      labelText={t("Username")}
                      placeholder={t("Username")}
                      onKeyDown={(e) =>
                        e.keyCode === 13 && handleSubmit(submitLogin)(e)
                      }
                      required
                      disabled={isDirty}
                      className={classes.text}
                      inputProps={{ maxLength: 20 }}
                      onInput={restrict.alphanumeric}
                      autoComplete="new-password"
                      autoFocus={true}
                      value={value}
                      onChange={onChange}
                      error={!!errors.username}
                      InputProps={{
                        classes: {
                          input: classes.inputSize,
                        },

                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                      helperText={errors.username?.message}
                    />
                  );
                }}
              ></Controller>
            </div>
            <div className={classes1.formGroup}>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <TextField
                      labelText={t("Password")}
                      placeholder={t("Password")}
                      onKeyDown={(e) =>
                        e.keyCode === 13 && handleSubmit(submitLogin)(e)
                      }
                      required
                      disabled={isDirty}
                      className={classes.text}
                      inputProps={{ maxLength: 20 }}
                      value={value}
                      autoComplete="new-password"
                      onChange={onChange}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        classes: {
                          input: classes.inputSize,
                        },
                        endAdornment: (
                          <InputAdornment position="start">
                            {showPassword ? (
                              <Visibility
                                style={{ cursor: "pointer" }}
                                onClick={handleClickShowPassword}
                              />
                            ) : (
                              <VisibilityOff
                                style={{ cursor: "pointer" }}
                                onClick={handleClickShowPassword}
                              />
                            )}
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  );
                }}
              ></Controller>
              <Grid container spacing={2} style={{ marginTop: "15px" }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid>
                    <img
                      src={photoString}
                      alt="Captcha"
                      style={{ height: 50, width: "100%" }}
                    />
                  </Grid>
                  <Grid alignItems="right">
                    <Button
                      onClick={getCaptcha}
                      startIcon={<Replay color="primary" />}
                    >
                      <Typography color="primary" style={{ fontSize: "12px" }}>
                        Reload Captcha
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} alignItems="right">
                  <Controller
                    name="captchaStr"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Enter Captcha"
                        placeholder="Enter Captcha"
                        autoComplete="new-password"
                        size="small"
                        required
                        {...props}
                        onChange={onChange}
                        inputProps={{ maxLength: 5 }}
                        value={value}
                        error={!!errors.captchaStr}
                        helperText={errors.captchaStr?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
            <Button
              type="submit"
              // form="form"
              align="center"
              style={{ marginTop: "15px" }}
              disabled={loading}
              color="primary"
              variant="contained"
            >
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}{" "}
              Submit
            </Button>
          </>
        </Card>
      </form>
     <Dialog onClose={openLoginAlert} open={openLoginAlert} maxWidth={"sm"}>
        <DialogContent>
          <Typography gutterBottom>{errorMessage}</Typography>
          <Typography variant="h6" gutterBottom>
            Do you want to terminate it and proceed?
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleSubmit((data)=>submitLogin(data, true))}
          >
            Yes
          </Button>
          <Button color="default" variant="contained" onClick={()=>setOpenLoginAlert(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
