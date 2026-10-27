/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardContent, CardHeader, CircularProgress, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AutoCompleteNew from "components/AutoCompleteNew";
import Button from "components/Button";
import MultilineTextField from "components/MultilineTextField";
import TextField from "components/TextField";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getFileNoList, getSoDetailsByFile, saveCrossCheck } from "Redux/Actions/SupplyOrder/RegistersAction";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  typo: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  buttonProgress: {
    color: "white",
  },
}));
const defaultValues = {
  file: "",
  item: "",
  designation: "",
  testCarried: "",
  crossVerifyBy: "",
  crossVerifyDate: "",
  remarks: "",
  inspectionDate: "",
  lineItem: "",
  soLineItemId: null,
};
const schema = yup.object().shape({
  file: yup
    .object()
    .nullable()
    .required("Required"),
  lineItem: yup
    .object()
    .nullable()
    .required("Required"),
  designation: yup
    .string()
    .typeError("required")
    .required(" required"),
  testCarried: yup
    .string()
    .typeError("required")
    .required(" required"),
  crossVerifyBy: yup
    .string()
    .typeError("required")
    .required(" required"),
  crossVerifyDate: yup
    .string()
    .typeError("required")
    .required(" required"),
  remarks: yup
    .string()
    .typeError("required")
    .required(" required"),
  inspectionDate: yup
    .string()
    .typeError("required")
    .required(" required"),
});
export default function PORegister() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const user = useSelector((store) => store.loggedInUser);
  const [records, setRecords] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileNo, setFileNo] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [soLineItemId, setSoLineItemId] = useState(null);
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
 
  //getFileNoList
  const getFileNo = () => {
    setLoading(true);
    dispatch(getFileNoList(orgId))
      .then((res) => {
        setFileList(res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));

    // }
  };

  const getSoDetails = (id) => {
    setLoading(true);
    if (id) {
      dispatch(getSoDetailsByFile(id))
        .then((res) => {
          setRecords(res);
          setItemList(res?.items);
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => setLoading(false));
    }
    // }
  };
  const onFormSubmit = (data) => {
    setLoadingDraft(true);
    const value = {
      testCarried: data?.testCarried,
      crossVerifyBy: data?.crossVerifyBy,
      crossVerifyDate: data?.crossVerifyDate,
      remarks: data?.remarks,
      individualResponsible: data?.designation,
      soLineItemId: soLineItemId,
      createdBy: user?.empId,
      inspectionDate: data?.inspectionDate,
    };
    console.log("value", value);
    dispatch(saveCrossCheck(value))
      .then(() => {
        reset(defaultValues);
        setRecords([]);
        setItemList([]);
        setDesc("");
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };
  useEffect(() => {
    getFileNo();
  }, []);
  console.log("eurger", records, itemList);
  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}> </form>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography style={{ fontSize: "0.875rem" }}>Cross Check Register</Typography>}
        />
        <CardContent justifyContent="center">
          <Grid container spacing={0} justifyContent="center">
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="inspectionDate"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        type="date"
                        size="small"
                        labelText="Date of Inspection"
                        placeholder="Date of Inspection"
                        value={value}
                        required
                        onChange={onChange}
                        error={!!errors.inspectionDate}
                        helperText={errors.inspectionDate?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} style={{ paddingTop: "13px" }}>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        labelText="Select File No"
                        data={fileList}
                        value={value || null}
                        {...props}
                        required
                        getOptionLabel={(options) => options.name}
                        onChange={(e, v) => {
                          setItemList([]);
                          console.log("sdjsjd", v);
                          onChange(v);
                          setValue("lineItem", null);
                          setFileNo(v?.id);
                          getSoDetails(v?.id);
                        }}
                        error={!!errors.file}
                        helperText={errors.file?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField
                    size="small"
                    labelText="Supplier ID"
                    placeholder="Supplier ID"
                    value={records?.supplier ? records?.supplier : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField
                    size="small"
                    labelText="SO/PO Number"
                    placeholder="SO/PO Number"
                    value={records?.supplyOrderNo ? records?.supplyOrderNo : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TextField
                    size="small"
                    labelText="SO Date"
                    placeholder="SO Date"
                    value={records?.supplyOrderDate ? moment(records?.supplyOrderDate).format("DD-MM-YYYY") : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} style={{ paddingTop: "13px" }}>
                  <Controller
                    name="lineItem"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        labelText="Select Line Item"
                        data={itemList}
                        value={value || ""}
                        getOptionLabel={(o) => o.name}
                        onChange={(e, v) => {
                          onChange(v);
                          setDesc(v?.description);
                          setSoLineItemId(v?.id);
                        }}
                        required
                        error={!!errors.lineItem}
                        helperText={errors.lineItem?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={6} xl={3}>
                  <MultilineTextField
                    size="small"
                    labelText="Firm Name &amp; Address"
                    placeholder="Firm Name &amp; Address"
                    value={records?.firmAddress ? records?.firmAddress : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <MultilineTextField
                    size="small"
                    labelText="SO Description"
                    placeholder="SO Description"
                    value={records?.soDescription ? records?.soDescription : ""}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <TextField
                    size="small"
                    labelText="Item Description"
                    placeholder="Item Description"
                    value={desc ? desc : ""}
                  />
                </Grid>
              </Grid>
              <br />
              <Typography className={classes.typo} style={{ paddingBottom: 7 }}>
                <u>Individual Responsible Details</u>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="designation"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MultilineTextField
                        size="small"
                        labelText="Name &amp; Designation"
                        placeholder="Name &amp; Designation"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!errors.designation}
                        helperText={errors.designation?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="testCarried"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MultilineTextField
                        size="small"
                        labelText="Details of Test Carried out"
                        placeholder="Details of Test Carried out"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!errors.testCarried}
                        helperText={errors.testCarried?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="crossVerifyBy"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MultilineTextField
                        size="small"
                        labelText="Cross Verification By"
                        placeholder="Cross Verification By"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!errors.crossVerifyBy}
                        helperText={errors.crossVerifyBy?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <Controller
                    name="crossVerifyDate"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        size="small"
                        type="date"
                        labelText="Cross Verification Date"
                        placeholder="Cross Verification Date"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!errors.crossVerifyDate}
                        helperText={errors.crossVerifyDate?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6} xl={6}>
                  <Controller
                    name="remarks"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MultilineTextField
                        size="small"
                        labelText="Remarks"
                        placeholder="Remarks"
                        required
                        value={value}
                        onChange={onChange}
                        error={!!errors.remarks}
                        helperText={errors.remarks?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} align="center">
                  <Button size="small" color="primary" variant="contained" onClick={handleSubmit(onFormSubmit)}>
                    {loadingDraft && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                        // color="white"
                      />
                    )}
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
