/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

//hooks
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

//redux
import { useDispatch, useSelector } from "react-redux";

//material-ui
import { Card, CardHeader, Grid, CardContent, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//components
import TextField from "../../components/TextField";
import Button from "components/Button";

//actions

import {  getUsersByOrgId, getUsersByOrgTypeId, saveAolData } from "Redux/Actions/UserManagement/AddNewUserAction";
import AutoCompleteNew from "components/AutoCompleteNew";
import moment from "moment";

const useStyles = makeStyles(theme => ({
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

let defaultValues = {
 
  ename:"",
  rolename:"",
  typeOfAbs:"",
  assignedTo:"",
  fromDate:"",
  toDate:"",
  assignedRole: "",
  type:"",
  asnDesg:""
};

export default function AODorAOL({ getData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [records, setRecords] = useState([]);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [loading,setLoading]= React.useState(false);
  const orgTypeId = useSelector(store => store.loggedInUser?.orgTypeId);
  const orgId = useSelector(store => store.loggedInUser?.orgId);
const role = [
    {
      id: "1",
      name: "AOL",
    },
    {
      id: "2",
      name: "AOD",
    }
    
  ];

  useEffect(() => {
    dispatch(getUsersByOrgTypeId(orgTypeId));
  }, []);

  const schema = yup.object().shape({
  
      ename: yup
      .object()
      .shape()
      .typeError("Required").required("Required"),
      typeOfAbs:yup
      .object()
      .shape()
      .typeError("Required").required("Required"),
      assignedTo:yup
      .object()
      .shape()
      .typeError("Required"). required("Required"),
      fromDate:yup
      .string()
      .trim()
      .typeError("Required").required("Required"),
      toDate:yup
      .string()
      .trim()
      .typeError("Required").required("Required"),

  });
  const {

    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  
  
  } = useForm({
    defaultValues,
    mode: "onChange" || "onSubmit" ,
  resolver: yupResolver(schema),
  });

  const executeSubmit = data => {
    console.log("efjrh",data)
    setLoadingDraft(true);
    const value = {
      aolEmpId:data?.assignedTo?.empId,
      asnEmpId: data?.ename?.empId,
      fromDate: data?.fromDate,
      toDate: data?.toDate,
      createdBy: 1,
      asnDesg: data?.assignedRole,
      type:data?.typeOfAbs?.name
    };
    dispatch(saveAolData(value)).then(res => {
      getData();
      resetForm();
    }).finally(()=>{
setLoadingDraft(false);
  })
  };

  const resetForm = () => {
    reset(defaultValues);
    setEdit(false);
  };


  const fetchData = () => {
    setLoading(true);
     dispatch(getUsersByOrgId(orgId))
       .then((res) => {
         setRecords(res);
        }).catch((error) => {
         console.log("error", error);
       })
        .finally(() => setLoading(false));
   };
 useEffect(() => {
  fetchData();
 }, []);
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
            title={!edit ? "Create User" : "Edit User"}
          />

          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                  name="ename"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={records}
                      value={value}
                      labelText="Select Associate Officer"
                      required
                      getOptionLabel={o => o?.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setValue("rolename", v?.roleName);
                      }}
                        error={!!errors.ename}
                        helperText={errors.ename?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="rolename"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Rolename"}
                        placeholder={"Rolename"}
                         required
                        inputProps={{ maxLength: 10 ,readOnly:true}}
                        value={value}
            
                        onChange={onChange}
                      />
                    );
                  }}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="typeOfAbs"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={role}
                      value={value}
                      labelText="Select type"
                      required
                      getOptionLabel={o => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                      }}
                        error={!!errors.typeOfAbs}
                        helperText={errors.typeOfAbs?.message}
                    />
                  )}
                ></Controller>
              </Grid>
               <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <AutoCompleteNew
                      data={records}
                      value={value}
                      labelText="Select  Employee (AOD/AOL)"
                      required
                      getOptionLabel={o => o.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        setValue("assignedRole", v?.roleName);
                      }}
                        error={!!errors.assignedTo}
                        helperText={errors.assignedTo?.message}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="assignedRole"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <TextField
                        labelText={"Assigned Role"}
                        placeholder={"Assigned Role"}
                         required
                        inputProps={{ maxLength: 10 ,readOnly:true}}
                        value={value}
            
                        onChange={onChange}
                      />
                    );
                  }}
                ></Controller>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="From Date"
                      placeholder="From date"
                      onChange={onChange}
                      value={moment(value).format("YYYY-MM-DD")}
                      type="date"
                      size="small"
                      required

                      error={!!errors.fromDate}
                      helperText={errors.fromDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="To Date"
                      placeholder=""
                      onChange={onChange}
                      value={moment(value).format("YYYY-MM-DD")}
                      type="date"
                      size="small"
                      required

                      error={!!errors.toDate}
                      helperText={errors.toDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6} xl={6} align="right">
                    <Button
                      className={classes.button}
                      type="submit"
                      onClick={() => {
                        handleSubmit(executeSubmit);
                        console.log("handleSubmit");
                        trigger()
                        console.log(errors);
                      }}
                      disabled={loadingDraft}
                    >
                      {loadingDraft && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                        color="primary"
                      />)}
                      Submit
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
