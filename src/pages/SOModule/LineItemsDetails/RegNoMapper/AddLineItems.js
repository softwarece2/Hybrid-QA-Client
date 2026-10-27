/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

import { saveLineImportDetails } from "Redux/Actions/SupplyOrder/LineImportAction";
//
import { CircularProgress, Dialog, DialogActions, DialogContent, InputLabel, Grid, Typography, Divider } from "@material-ui/core";
import Button from "components/Button";
import { restrict } from "restrict";

import { useDispatch, useSelector } from "react-redux";
import { DialogTitle } from "Utils";
import axiosInstance from "pages/Services/AxiosInstance";
import moment from "moment/moment";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CustomizedInputs from "components/TextField";
import { orange, pink } from "@material-ui/core/colors";
import TextField from "components/TextField";
import { fetchconsigneeId } from "pages/Services/URLs";
import LineItemsTable from "../LineItemsTable";
import LineItemView from "../LineItemView";
import NewLineItemsTable from "../NewLineItemsTable";
import { getLineItemsById } from "Redux/Actions/SupplyOrder/LIAction";



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
  typoField: {
    fontSize: "0.875rem",
  },
}));

const registrations = [
  {
    value: "1",
    label: "Registration Number",
  },
  {
    value: "2",
    label: "Running Number",
  },
  {
    value: "3",
    label: "Without Registration Number",
  },
];
const options = [
  { value: 1, label: "Main" },
  { value: 2, label: "Spares" },
];

const defaultValues = {
  saleOrderNo: "",
  lineItemNo: "",
  partNo: "",
  description: "",
  uomName: "",
  nsnPartNo: "",
  catPartNo: "",
  itemCategoryName: "",
  unitCost: "",
  orderQty: "",
  consigneeId: [],
  orderMasterNo: "",
  inspectionAgency: "",
  supplyType: "",
  itemCategory: "",
  drawingNo: "",
  isRegistrationNo: "",
  dd: "",
  refNo: null,
  lotNo: "",
  orderNo: "",
  sectionCode: "",
  orderTypeId:null,
  orderTypeNo:null,
  orderTypeDate:"",
  registrationNo:"",
};
const schema = yup.object().shape({
  lineItemNo: yup.string().trim().required(),
  partNo: yup.string().required(),
  orderQty: yup.string().required(),
  orderQty: yup.string().required(),
  orderMasterNo: yup.string().trim().required(),
  dd: yup.string().required(),
  unitCost: yup.string().required(),
  saleOrderNo: yup.string().required("Work Order No is required field"),
  supplyType: yup.string().required("Supply Type is required field"),
  inspectionAgency: yup.object().nullable().required("Inspection Agency is required field"),
  // consigneeId :yup.object().nullable().required("Consignee is required field"),
  consigneeId: yup.array().min(1, "Consignee is required field").required("Consignee is required field"),
  registrationNo: yup.string().nullable().required("Registration No is required field"),
  orderTypeDate: yup.string().required(),

});

const AddLineItems = ({ soObj, refresh,fetchSO }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parts, setParts] = useState([]);
  const [consignee, setConsignee] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [registrationTypes, setRegistrationTypes] = useState([]);

  const inspectionAgencyDetailsOfFirm = useSelector((store) => store.orgReducer.inspectionAgencyTypeOfFirm);
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const fetchParts = async () => {
    try {
      const { data } = await axiosInstance("partNumber/getAllActive");
      setParts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchConsignee = async () => {
    try {
      const { data } = await axiosInstance.get(fetchconsigneeId);
      setConsignee(data);
      console.log(data, "dataaaaa");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const req = {
        supplyOrderId: soObj.id,
        saleOrderNo: data.saleOrderNo,
        lineItemDtos: [
          {
            // saleOrderNo: 73,
            consigneeIds: data.consigneeId?.map((c) => c.id),
            orderMasterNo: data.orderMasterNo,
            lineItemNo: data.lineItemNo,
            partNumberId: data.partNo,
            unitCost: data.unitCost,
            refNo:data.refNo,
            orderQty: data.orderQty,
            deliveryDate: data.dd ? moment(data.dd).format("YYYY-MM-DD") : null,
            inspectionAuthorityId: data.inspectionAgency?.id,
            orderTypeDate: data.orderTypeDate,
            orderTypeId: data.orderTypeId,
            orderTypeNo: data.orderTypeNo,
            isImported: false,
            supplyType :data.supplyType,
            registrationNo: data.registrationNo,
            
          },
        ],
      };
      dispatch(saveLineImportDetails(req, handleClose, setLoading, refresh));
      getLineItemsById();
      setTimeout(() => {
        fetchSO();
      }, 200);
     
    } catch (error) {
      toast.error(error.response?.data || "Failed to Create Line Item, please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderTypes = async () => {
    try {
      const { data } = await axiosInstance("orderType/getAll");
      setOrderTypes(data);
    } catch (error) {
      console.log(error, "error");
    }
  };

const getRegNos = async () =>{
  try{
    const {data} = await axiosInstance("/registrationNoType/getAll");
    setRegistrationTypes(data);
  } catch(error) {
    console.log(error,"error");
  }
}

  useEffect(() => {
    if (open) {
      fetchParts();
      getOrderTypes();
      fetchConsignee();
      getRegNos();
    }
  }, [open]);

  return (
    <>
      <Button variant="contained" color="primary" size="small" onClick={(e) => setOpen(true)} style={{width:"150px"}}>
        Add Line Items
      </Button>
      {open && (
        <Dialog open maxWidth="xl">
          <DialogTitle onClose={() => setOpen(false)}>
            {" "}
            Add Line Item <b>(SO/PO: {soObj?.orderNo || "N/A"}</b>,
            <b>Date: {soObj?.orderDate ? moment(soObj.orderDate).format("DD-MM-YYYY") : "N/A"})</b>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`partNo`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      labelText="Material No./EP Code No."
                      placeholder="Part No"
                      onChange={(event) => {
                        field.onChange(event);

                        const p = parts.find((part) => part.id == event.target.value) || {};
                        console.log(p, "ppp");
                        setValue(`catPartNo`, p.catPartNo || "");
                        setValue(`nsnPartNo`, p.nsnPartNo || "");
                        setValue(`description`, p.materialDescription || "");
                        setValue(`sectionCode`, p.sectionCode || "");
                        setValue(`drawingNo`, p.drawingNo || "");
                        setValue(`itemCategory`, p.itemCategory || "");
                        setValue(`uomName`, p.uom || "");
                      }}
                      value={field.value}
                      select
                      SelectProps={{ native: true }}
                      required
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                    >
                      <option value="">Select EP Code </option>
                      {parts.map((part) => {
                        return (
                          <option key={part.id} value={part.id}>
                            {part.partNo}
                          </option>
                        );
                      })}
                    </TextField>
                  )}
                />
              </Grid>
                   <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="itemCategory"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <>
                      <TextField
                        size="small"
                        labelText="Item Category"
                        placeholder="Item Category"
                        {...props}
                        InputProps={{ readOnly: true }}
                        onChange={onChange}
                        value={value}
                        onInput={restrict.general}
                        inputProps={{ maxLength: 200 }}
                      />
                    </>
                  )}
                />
              </Grid>
            
                      <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                  <Controller
                    name={`nsnPartNo`}
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="NSN part no."
                        placeholder="NSN part no."
                        {...props}
                        InputProps={{ readOnly: true }}
                        value={value}
                        size="small"
                      />
                    )}
                  />
                </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`catPartNo`}
                  control={control}
                  render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                    <TextField
                      labelText="CAT part no."
                      placeholder="CAT part no."
                      {...props}
                      InputProps={{ readOnly: true }}
                      onChange={onChange}
                      value={value}
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
                   <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="drawingNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      size="small"
                      labelText="Drawing No"
                      placeholder="Drawing No."
                      {...props}
                      InputProps={{ readOnly: true }}
                      onChange={onChange}
                      value={value}
                      onInput={restrict.general}
                      inputProps={{ maxLength: 200 }}                  
                    />
                  )}
                />
              </Grid>
             
               <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`uomName`}
                  control={control}
                  render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                    <TextField
                      labelText="UOM(unit)"
                      placeholder="unit"
                      {...props}
                      InputProps={{ readOnly: true }}
                      onChange={onChange}
                      value={value}
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
               <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`description`}
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Material Description"
                      placeholder="Description"
                      {...props}
                      value={value}
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  )}
                />
              </Grid>
 <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
      <div style={{ borderTop: '3px solid GRAY', padding: '10px' }}>
        <Typography variant="h6" align="center">  <b>Enter Details</b></Typography>
      </div>
   
    </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            
                <Controller
                  name="saleOrderNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      required
                      size="small"
                      labelText="Work Order No."
                      placeholder="Work Order No."
                      {...props}
                      onChange={onChange}
                      value={value}
                      onInput={restrict.general}
                      inputProps={{ maxLength: 200 }}
                      error={!!errors.saleOrderNo}
                      helperText={errors.saleOrderNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="orderMasterNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      size="small"
                      labelText="Order Master No."
                      placeholder="Order Master No."
                      required
                      {...props}
                      onChange={onChange}
                      value={value}
                      onInput={restrict.general}
                      inputProps={{ maxLength: 200 }}
                      error={!!errors.orderMasterNo}
                      helperText={errors.orderMasterNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`lineItemNo`}
                  control={control}
                  render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                    <TextField
                      labelText="Line Item/ Indent Sl No/ SO SL NO."
                      placeholder="Line Item No"
                      {...props}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      value={value}
                      size="small"
                      required
                      onInput={restrict.general}
                      inputProps={{ maxLength: 100 }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="inspectionAgency"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <>
                        <Autocomplete
                          size="small"
                          id="checkboxes-tags-demo"
                          value={value}
                          onChange={(e, v) => {
                            onChange(v);
                          }}
                          getOptionSelected={(option, value) => option.id === value.id}
                          options={inspectionAgencyDetailsOfFirm}
                          // disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              labelText="Inspection Agency"
                              variant="outlined"
                              required
                              error={!!errors.inspectionAgency}
                              helperText={errors.inspectionAgency?.message}
                            />
                          )}
                        />
                      </>
                    );
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="supplyType"
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
                          value={options.find((item) => item.value === value) || ""}
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
                              required
                              error={!!errors.supplyType}
                              helperText={errors.supplyType?.message}
                            />
                          )}
                          onChange={(e, v) => {
                            onChange(v?.label);
                          }}
                        />
                      </>
                    );
                  }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  control={control}
                  name="supplyType"
                  render={({ field: { onChange, value } }) => (
                    <CustomizedInputs
                      select
                      labelText="Supply Type"
                      SelectProps={{ native: true }}
                      fullWidth
                      onChange={onChange}
                      value={value}
                      required
                      error={!!errors.supplyType}
                      helperText={errors.supplyType?.message}
                    >
                      <option value="">Select</option>
                      {options.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </CustomizedInputs>
                  )}
                />
              </Grid>
         
             
              {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Controller
              name={`itemCategoryName`}
              control={control}
              render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
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
                {"Item Category"}
              </InputLabel>
                <AutoCompleteNew
                  data={itemCategory || []}
                  getOptionLabel={(o) => o?.category}
                  required
                  {...props}
                  value={value}
                  onChange={(e, v) => {
                    onChange(v);
                  }}
                  size="small"
                  error={!!error}
                  helperText={error?.message}
                />
                </>
              )}
              
            />
            </Grid> */}

              {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Close
              </Button>
            </Grid> */}

             
       
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  control={control}
                  name="registrationNo"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomizedInputs
                      select
                      labelText="Registration/Running No."
                      SelectProps={{ native: true }}
                      fullWidth
                      required
                      onChange={onChange}
                      value={value}
                      error={!!errors.registrationNo}
                      helperText={errors.registrationNo?.message}
                    >
                      <option value="">Select</option>
                      {registrationTypes?.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.regType}
                        </option>
                      ))}
                    </CustomizedInputs>
                  )}
                />
              </Grid>
             
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`unitCost`}
                  control={control}
                  render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                    <TextField
                      labelText="Unit Price "
                      placeholder="Unit Cost"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      onInput={restrict.number}
                      inputProps={{ maxLength: 9 }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                name={`uomName`}
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
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
                            {"UoM (Unit)"}
                          </InputLabel>
                  <AutoCompleteNew
                    data={uom || []}
                    getOptionLabel={(o) => o?.unit}
                    required
                    {...props}
                    value={value}
                    onChange={(e, v) => {
                      onChange(v);
                    }}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                  </>
                )}
              />
            </Grid> */}

              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
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
                      required
                      onKeyDown={(e) => e.preventDefault()}
                      // {...props}
                      inputProps={{
                        min: moment(new Date()).format("YYYY-MM-DD"),
                      }}
                      error={!!errors.dd}
                      helperText={errors.dd?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name={`orderQty`}
                  control={control}
                  render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                    <TextField
                      labelText="Total Quantity"
                      placeholder="Order Qty"
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      required
                      onInput={restrict.number}
                      inputProps={{ maxLength: 9 }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="consigneeId"
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
                          required
                        >
                          {"Consignee"}
                        </InputLabel>
                        <Autocomplete
                          multiple
                          options={consignee || []}
                          value={value}
                          onChange={(_, v) => {
                            onChange(v);
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
                              error={!!errors.consigneeId}
                              helperText={errors.consigneeId?.message}
                            />
                          )}
                        />
                      </>
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Controller
                  name="refNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      size="small"
                      labelText="	Reference No"
                      {...props}
                      full
                      onChange={onChange}
                      value={value}
                      onInput={restrict.general}
                      inputProps={{ maxLength: 50 }}
                    />
                  )}
                />
              </Grid>

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

              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="orderTypeId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <CustomizedInputs
                      labelText="BID/RFP/GEM/IFD/IND TYPE"
                      placeholder="BID/RFP/GEM/IFD/IND TYPE"
                      SelectProps={{ native: true }}
                      select
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                    >
                      <option value="" >
                        Select Order Type
                      </option>
                      {orderTypes?.map((ot) => (
                        <option key={ot.id} value={ot.id}>
                          {ot.orderType}
                        </option>
                      ))}
                    </CustomizedInputs>
                  )}
                />
              </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Controller
                  name="orderTypeDate"
                  control={control}
                  // value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="BID/RFP/GEM/IFD/IND DATE"
                      placeholder="BID/RFP/GEM/IFD/IND DATE"
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
                      error={!!errors.orderTypeDate}
                      helperText={errors.orderTypeDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Controller
                  name="orderTypeNo"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="BID/RFP/GEM/IFD/IND NO."
                      placeholder="BID/RFP/GEM/IFD/IND NO."
                      size="small"
                      {...props}
                      onChange={onChange}
                      value={value}
                      inputProps={{ maxLength: 50 }}
                      //  onInput={restrict.digit}
                    />
                  )}
                />
              </Grid>

        
            </Grid>

           
   
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} type="submit" disabled={loading}>
              {loading && <CircularProgress size={24} color="primary" />}
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
          <NewLineItemsTable soObj={soObj} />
        </Dialog>
      )}
    </>
  );
};

export default AddLineItems;