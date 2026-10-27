/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { USER_ROLE_ID } from "../../../../Globals";

//material-ui
import { Typography, CardContent, CardHeader, Grid, InputLabel, ListItemText, Tooltip, withStyles, MenuItem } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { orange, pink } from "@material-ui/core/colors";
import { Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

//pages
import SODetailsStatus from "./SODetailsStatus";

//components
import Button from "../../../../components/Button";
import MultilineTextField from "../../../../components/MultilineTextField";
import TextField from "../../../../components/TextField";
import { viewDocument } from "pages/HomePage/UserLogin";

//redux
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllSupplyOrder, saveSupplyOrderData } from "Redux/Actions/SupplyOrder/SOAction";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import { consignee, indenter, iNote, supplier, getAccountTypeDetails } from "Redux/Actions/SupplyOrder/SODropdownAction";

//icons
import "font-awesome/css/font-awesome.min.css";
import { saveAllotSubordinate } from "Redux/Actions/Allotjc/AllotjcAction";
import { restrict } from "restrict";
import LineItemsTable from "pages/SOModule/LineItemsDetails/LineItemsTable";
import CustomizedInputs from "../../../../components/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    padding: 2,
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  card: {
    maxWidth: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    height: 10,
  },
  cardTitle: {
    fontSize: "0.875rem",
  },
  text: {
    fontSize: "0.875rem",
  },
  cardContent: {
    textAlign: "left",
    // padding: 16,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonJC: {
    backgroundColor: orange[700],
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: orange[700],
    },
  },
  buttonImport: {
    backgroundColor: "#E0F7FE",
    color: theme.palette.common.black,
    "&:hover, &:focus": {
      color: theme.palette.common.black,
      background: "#E0F7FE",
    },
  },
  textFieldRoot: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    // height: 44,
  },
  input: {
    fontSize: "1rem",
    fontWeight: 500,
    // borderRadius: 20,
    color: pink[700],
    // padding: "4px 8px",
  },
  asterisk: {
    color: theme.palette.error.dark,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  checkbox: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
    },
  },
}));
const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
}))(MenuItem);

const registrations = [
  {
    value: "1",
    label: "Registration Number",
  },
  {
    value: "2",
    label: "Running Number",
  },
];

const defaultValues = {
  // id: "",
  salesGroupId: "",
  indenterId: "",
  consigneeIds: "",
  inoteTypeId: "",
  supplierId: "",
  modifiedDate: "",
  orderNo: "",
  fileNo: "",
  soType: "",
  orderDate: "",
  description: "",
  noOfItems: null,
  totalQty: null,
  value: null,
  ddStr: "",
  receiptDate: "",
  dd: null,
  indentNo: "",
  isRegistrationNo: "1",
  drawingNo: "",
  referenceNo: "",
};

const schema = yup.object().shape({
  indenterId: yup.string().typeError("Required").required(" Required"),
  // soType: yup.string().typeError("Required").required(" Required"),
  // consigneeIds: yup
  //   .array()
  //   .min(1, "Required")
  //   .typeError("Required")
  //   .required("Required"),
  supplierId: yup.string().typeError("Required").required("Required"),
  // inoteTypeId: yup.string().typeError("Required").required("Required"),
  orderNo: yup.string().typeError("Required").required("Required"),
  // fileNo: yup.string().trim(),
  accountTypeId: yup.string().typeError("Required").required("Required"),

  description: yup.string().typeError("Required").required("Required"),
  // dd: yup.string().nullable().typeError("Required").required("Required"),
  receiptDate: yup.string().nullable().typeError("Required").required("Required"),
  // orderDate: yup.string().nullable().typeError("Required").required("Required"),
  //  isRegistrationNo: yup.string().nullable().typeError("Required").required("Required"),
});

function Title({ children }) {
  return (
    <Typography
      color="primary"
      style={{
        paddingLeft: 20,
        backgroundColor: "#b3e5fc",
        fontWeight: 500,
        fontFamily: "sans-serif",
        borderRadius: "0 0 12px 12px",
        fontSize: "0.875rem",
      }}
    >
      {children}
    </Typography>
  );
}
const DownloadResponse = ({ data }) => {
  function handlePdfView(url) {
    axiosInstanceTran
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        viewDocument(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }

  function handleDownload(url) {
    axiosInstanceTran
      .get(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        saveAs(data, url.split("/").pop());
      })
      .catch(() => toast.error("Failed to download, Please try again!"));
  }

  const truncateFileName = (fileName, maxLength = 20) => {
    if (fileName.length > maxLength) {
      return fileName.slice(0, maxLength) + "...";
    }
    return fileName;
  };
  return (
    <Grid container spacing={0}>
      <Grid xs={12}>
        <Typography
          align="center"
          style={{
            backgroundColor: "#205375",
            color: "white",
            marginTop: 8,
            fontSize: "0.875rem",
          }}
        >
          Uploaded Files
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} style={{ border: "1px solid 	#D5EDFC" }}>
        <Title>Amendments</Title>
        {data?.amendments?.length ? (
          data.amendments.map((el) => (
            <StyledMenuItem style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" title={el.split("/").pop()}>
                    {truncateFileName(el.split("/").pop())}
                  </Typography>
                }
              />
               <Tooltip title="View File">
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid 	#D5EDFC" }}>
        <Title>Attachments</Title>
        {data?.attachments?.length ? (
          data.attachments.map((el) => (
            <StyledMenuItem style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" title={el.split("/").pop()}>
                    {truncateFileName(el.split("/").pop())}
                  </Typography>
                }
              />
               <Tooltip title="View File">
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ border: "1px solid 	#D5EDFC" }}>
        <Title>SO</Title>
        {data?.poFiles?.length ? (
          data.poFiles.map((el) => (
            <StyledMenuItem style={{ padding: "0px 0px 0px 10px" }}>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" title={el.split("/").pop()}>
                    {truncateFileName(el.split("/").pop())}
                  </Typography>
                }
              />
               <Tooltip title="View File">
              <IconButton size="small" onClick={() => handlePdfView(el)}>
                <VisibilityIcon color="primary" />
              </IconButton>
              </Tooltip>
              <Tooltip title="Download File">
                <IconButton
                  size="small"
                  onClick={() => {
                    handleDownload(el);
                  }}
                >
                  <GetAppIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </StyledMenuItem>
          ))
        ) : (
          <Typography align="center" style={{ fontSize: "0.875rem" }}>
            No files found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default function SODetailsForm({ soObj, open, setOpen, fetchSO, getSoBySoId }) {
  console.log("soObj : ", soObj);
  const classes = useStyles();
  const dispatch = useDispatch();
  const iNoteDetails = useSelector((store) => store.soDropdownReducer.iNote);
  const indentDetails = useSelector((store) => store.soDropdownReducer.indent);

  const acctDetails = useSelector((store) => store.soDropdownReducer.accountTypes);
  const [edit, setEdit] = useState(false);
  const [hide, setHide] = useState(false);
  const supplierDetails = useSelector((store) => store.soDropdownReducer.supplier);
  const orgId = useSelector((store) => store.loggedInUser?.orgId);
  const reportingOfficerId = useSelector((store) => store.loggedInUser?.reportingOfficerId);
  const [responseData, setResponseData] = useState();

  const consigneeDetails = useSelector((store) => store.soDropdownReducer.consignee);

  const [remarks, setRemarks] = React.useState("");

  const options = [
    { value: 1, label: "Main" },
    { value: 2, label: "Spares" },
  ];

  const {
    handleSubmit,
    reset,
    control,

    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  // const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getAllSupplyOrder());
    dispatch(iNote());
    dispatch(indenter());
    dispatch(supplier());
    dispatch(consignee());
    dispatch(getAccountTypeDetails());
  }, []);

  const onFormSubmit = (data) => {
    const value = {
      id: soObj.id,
      indenterId: data.indenterId,
      consigneeIds: data.consigneeIds,
      ddStr: data.dd,
      receiptDate: data.receiptDate,
      orderDate: data.orderDate,
      inoteTypeId: data.inoteTypeId,
      supplierId: data.supplierId,
      soType: data.soType,
      description: data.description,
      lotNo: data.lotNo,
      organizationId: orgId,
      accountTypeId: data.accountTypeId,
      orderNo: data.orderNo,
      fileNo: data.fileNo,
      drawingNo: data.drawingNo,
      referenceNo: data.referenceNo,
      isRegistrationNo: data.isRegistrationNo ? true : false,
    };
    dispatch(saveSupplyOrderData(value));
     fetchSO();
  };
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const handleNotify = () => {
    const value = {
      id: 0,
      supplyOrderId: soObj?.id,
      supplyOrderName: soObj?.orderNo,
      allotedBy: loggedInUser?.empId,
      allotedTo: reportingOfficerId,
    };

    dispatch(saveAllotSubordinate(value, "QAO"));
  };

  React.useEffect(() => {
    setEdit(true);
    if (soObj.jcqaoName !== null) {
      setHide(true);
    }
    reset({
      status: soObj?.status,
      indenterId: soObj?.indenterId,
      soType: soObj?.soType,
      supplierId: soObj?.supplierId,
      dd: soObj?.dd !== null ? moment(soObj?.dd).format("YYYY-MM-DD") : "",
      description: soObj?.description,
      consigneeIds: soObj?.consigneeIds,
      inoteTypeId: soObj?.inoteTypeId,
      remarks: soObj?.remarks,
      lotNo: soObj?.lotNo,
      accountTypeId: soObj.accountTypeId,
      orderDate: soObj?.orderDate,
      receiptDate: soObj?.receiptDate,
      orderNo: soObj?.orderNo,
      fileNo: soObj?.fileNo,
      drawingNo: soObj?.drawingNo,
      referenceNo: soObj?.referenceNo,
      isRegistrationNo: soObj?.isRegistrationNo === null ? "1" : !soObj?.isRegistrationNo ? "2" : "1",
    });
    setResponseData(soObj);
    setRemarks(soObj.remarks);
  }, [reset, soObj]);

  console.log("consignee details", consigneeDetails.isRegistrationNo);

  return (
    <div align="center" id="edit-section">
      <div style={{ padding: "12px 0px 0px 0px" }}>
        <Card className={classes.card}>
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CardHeader
                classes={{
                  root: classes.cardHeader,
                  title: classes.cardTitle,
                }}
                style={{ textAlign: "left" }}
                title="SO/PO Details"
              />
            </Grid>
          </Grid>
          <CardContent className={classes.cardContent}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="orderNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="SO/PO Number"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      // disabled
                      onInput={restrict.general}
                      inputProps={{ maxLength: 100 }}
                      error={!!errors.orderNo}
                      helperText={errors.orderNo?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="orderDate"
                  control={control}
                  // value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="SO/PO Date"
                      placeholder="Delivery date"
                      onChange={onChange}
                      value={moment(value).format("YYYY-MM-DD")}
                      type="date"
                      size="small"
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      // {...props}
                      // inputProps={{
                      //   min: moment(new Date()).format("YYYY-MM-DD"),
                      // }}
                      inputProps={{
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      error={!!errors.orderDate}
                      helperText={errors.orderDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <Controller
                  name="receiptDate"
                  control={control}
                  // value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText=" Receipt Date"
                      // <span style={{ fontWeight: 600 }}>Receipt Date:</span> {moment(soObj?.receiptDate).format("DD-MM-YYYY")}
                      placeholder="Receipt date"
                      onChange={onChange}
                      value={moment(value).format("YYYY-MM-DD")}
                      type="date"
                      size="small"
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      // {...props}
                      // inputProps={{
                      //   min: moment(new Date()).format("YYYY-MM-DD"),
                      // }}
                      error={!!errors.receiptDate}
                      helperText={errors.receiptDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="indenterId"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            // disabled={disabled}
                            //error={error}
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            required={true}
                            style={{ fontSize: "0.875rem" }}
                          >
                            {"Indent/ OPA"}
                          </InputLabel>
                          <Autocomplete
                            options={indentDetails}
                            value={indentDetails.find((item) => item.id === value) || ""}
                            labelText="Indentor ID"
                            getOptionLabel={(o) => o.name}
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
                                error={!!errors.indenterId}
                                helperText={errors.indenterId?.message}
                              />
                            )}
                            onChange={(e, v) => {
                              onChange(v?.id);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="supplierId"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                            {"Supplier"}
                          </InputLabel>
                          <Autocomplete
                            options={supplierDetails}
                            value={supplierDetails.find((item) => item.id == value) || ""}
                            labelText="Supplier ID"
                            getOptionLabel={(o) => o.name}
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
                                error={!!errors.supplierId}
                                helperText={errors.supplierId?.message}
                              />
                            )}
                            onChange={(e, v) => {
                              onChange(v?.id);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="consigneeIds"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                            {"Consignee"}
                          </InputLabel>
                          <Autocomplete
                            multiple
                            options={consigneeDetails}
                            value={
                              consigneeDetails?.filter((item) =>
                                value?.includes(item?.id)
                              ) || ""
                            }
                            onChange={(e, v) => {
                              const data = v?.map((item) => item?.id);
                              onChange(data);
                            }}
                            // getOptionValue={(option) => option["id"]}
                            getOptionLabel={(o) => o.name}
                            disableCloseOnSelect
                            filterSelectedOptions
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
                                error={!!errors.consigneeIds}
                                helperText={errors.consigneeIds?.message}
                              />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="soType"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                            {"Supply Type"}
                          </InputLabel>
                          <Autocomplete
                            options={options}
                            value={
                              options.find((item) => item.value === value) || ""
                            }
                            labelText="Supply Type"
                            getOptionLabel={(o) => o.label}
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
                                error={!!errors.soType}
                                helperText={errors.soType?.message}
                              />
                            )}
                            onChange={(e, v) => {
                              onChange(v?.value);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="inoteTypeId"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                            {"INote Type"}
                          </InputLabel>
                          <Autocomplete
                            options={iNoteDetails}
                            value={
                              iNoteDetails.find((item) => item.id == value) ||
                              ""
                            }
                            labelText="I-Note ID"
                            getOptionLabel={(o) => o.name}
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
                                error={!!errors.inoteTypeId}
                                helperText={errors.inoteTypeId?.message}
                              />
                            )}
                            onChange={(e, v) => {
                              onChange(v?.id);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="dd"
                    control={control}
                    // value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Delivery Date"
                        placeholder="Delivery date"
                        onChange={onChange}
                        value={value}
                        type="date"
                        size="small"
                        onKeyDown={(e) => e.preventDefault()}
                        // {...props}
                        inputProps={{
                          min: moment(new Date()).format("YYYY-MM-DD"),
                        }}
                        // error={!!errors.dd}
                        // helperText={errors.dd?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="accountTypeId"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                            {"Account Type"}
                          </InputLabel>
                          <Autocomplete
                            options={acctDetails}
                            value={acctDetails.find((item) => item.id === value) || ""}
                            labelText="Account Type"
                            getOptionLabel={(o) => o.name}
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
                                error={!!errors.accountTypeId}
                                helperText={errors.accountTypeId?.message}
                              />
                            )}
                            onChange={(e, v) => {
                              onChange(v?.id);
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    control={control}
                    name="isRegistrationNo"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <CustomizedInputs
                        select
                        labelText="Registration/Running No."
                        SelectProps={{ native: true }}
                        fullWidth
                        required
                        onChange={onChange}
                        value={value}
                      
                          error={!!errors.isRegistrationNo}
                      helperText={errors.isRegistrationNo?.message}
                      >
                        <option value="">Select</option>
                        {registrations.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                        
                      </CustomizedInputs>
                    )}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="lotNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Enter Lot Number"
                        placeholder="Enter Lot No"
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value}
                        inputProps={{ maxLength: 2 }}
                        onInput={restrict.digit}
                      />
                    )}
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="fileNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Order Master No."
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value}
                        onInput={restrict.general}
                        inputProps={{ maxLength: 25 }}
                        // error={!!errors.fileNo}
                        // helperText={errors.fileNo?.message}
                      />
                    )}
                  />
        </Grid>
        <Grid  item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="drawingNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Drawing No."
                        size="small"
                        {...props}
                        full
                        onChange={onChange}
                        value={value}
                        onInput={restrict.general}
                        inputProps={{ maxLength: 25 }}
                        // error={!!errors.fileNo}
                        // helperText={errors.fileNo?.message}
                      />
                    )}
                  />
              </Grid> */}
                {/* <Grid  item xs={12} sm={6} md={4} lg={4} xl={4}>
                   <Controller
                    name="referenceNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="Reference No."
                        size="small"
                        {...props}
                        full
                        onChange={onChange}
                        value={value}
                        onInput={restrict.general}
                        inputProps={{ maxLength: 25 }}
                  />
                    )}
                  />                
                </Grid> */}
                <Grid item xs={12} sm={6} md={4} lg={12} xl={8}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MultilineTextField
                        rows={7}
                        labelText="SO Description"
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value || ""}
                        required
                        onInput={restrict.general}
                        inputProps={{ maxLength: 500 }}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <Typography style={{ fontSize: "0.7rem", color: "red" }}>
                    Note: Total Quantity and Total Value will be auto fetched
                  </Typography>
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    labelText="Total Items"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={soObj?.noOfItems === null ? "" : soObj?.noOfItems}
                  />
                </Grid> */}

                {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    labelText="Total Quantity"
                    value={soObj?.totalQty === null ? "" : soObj?.totalQty}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    labelText="Total Value"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={soObj?.value === null ? "" : soObj?.value}
                  />
                </Grid> */}
              </Grid>
            </form>
          </CardContent>

          {responseData && <DownloadResponse data={responseData} />}
        </Card>

        <Grid container spacing={2} alignItems="center" style={{ padding: "12px 0px 0px 0px" }}>
          <Grid item xs={12} sm={12} md={11} lg={12} xl={12}>
            <SODetailsStatus soObj={soObj} getSoBySoId={getSoBySoId} />
          </Grid>
        </Grid>
      </div>

      <div className={classes.space}>
        <Button variant="contained" color="secondary" onClick={handleClose}>
          Close
        </Button>

        <Button
          // className={classes.button}
          onClick={handleSubmit(onFormSubmit)}
          type="submit"
          className={!isDirty ? classes.disabledButton : classes.button}
          disabled={!isDirty}
        >
          Submit
        </Button>

        {loggedInUser?.roleId === USER_ROLE_ID?.ROLE_OIC_ADMIN && (
          <Button type="submit" className={classes.buttonJC} variant="contained" onClick={handleNotify} disabled={soObj?.isNotifiedToJc}>
            Notify QAO
          </Button>
        )}
      </div>

      {/* {
        <Socket
          url={`${"TRANSACTION_URL"}olms-websocket`}
          topics={["/topic/cqae"]}
          onConnect={() => console.log("Updating Supply Order List - Connected")}
          onDisconnect={() => console.log("Updating Supply Order List- Disconnected")}
          onMessage={msg => {
            console.log(" msg", msg);
          }}
        />
      } */}
    </div>
  );
}
