
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
//material-ui
import {
  Dialog,
  Grid,
  Typography,
  InputLabel,
} from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";
import { DialogTitle } from "Utils";

//components
import Button from "components/Button";
import { restrict } from "restrict";
import TextField from "../../../components/TextField";

//redux
import { yupResolver } from "@hookform/resolvers/yup";
import { MASTER_URL } from "config";
import axiosInstanceTran from "pages/Services/AxiosInstanceTransaction";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

//icons
import { teal } from "@material-ui/core/colors";
import axiosInstance from "pages/Services/AxiosInstance";
import { fetchconsigneeId, saveLIDetails } from "pages/Services/URLs";
import { PaperComponent } from "Utils/D3Tree";
import { Autocomplete } from "@material-ui/lab";
import CustomizedInputs from "../../../components/TextField";
import moment from "moment/moment";
import AutoCompleteNew from "components/AutoCompleteNew";
import { getInspectionAgencyDetailsAndFirmDetails, getInspectionAgencyDetailsOfFirm } from "pages/UserManagement/FirmInspAgencyAction";

const useStyles = makeStyles((theme) => ({
  radioBtn: {
    "& .MuiTypography-body1": {
      fontSize: "0.875rem",
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
    fontSize: "1rem",
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
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
}));


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

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
  gcs: false,
  gem: "",
  selfCertification: "",
  remarks: "",
  status: "",
  imported: false,
  inspectionAgencyIds: "",
  consigneeIds: "",
};

// const schema = yup.object().shape({
//   partNo: yup.object().typeError("Required").required("partNo Required"),
// });

export default function LineItemsForm({ open, setOpen, dataVal, fetchRecords }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const orgId = loggedInUser?.orgId
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState();

  // const [gcs, setGcs] = React.useState("");
  const [gem, setGem] = React.useState("");
  const [selfCertification, setSelfCertification] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [lineItemNo, setLineItemNo] = useState([]);
  const [parts, setParts] = useState([]);
  const [consignee, setConsignee] = useState([]);
  const [consigneeIds, setConsigneeIds] = useState(null);
  const [orderTypes, setOrderTypes] = useState([]);
  const [registrationTypes, setRegistraionTypes] = useState([]);
  const [updatedTmrUrl, setUpdatedTmrUrl] = useState(null);
  const [uom, setUom] = useState([]);
  const [itemCategory, setItemCategory] = useState([]);
  const [itemCategoryId, setItemCategoryId] = useState(null);
  const [inspectionAuthorityId, setInspectionAuthorityId] = useState(null);
  const [uomId, setUomId] = useState(null);
  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    mode: "onChange",
    // resolver: yupResolver(schema),
  });
console.log("dataval",dataVal);
  const fetchItemCategory = async () => {
    try {
      const data = await axiosInstance(
        MASTER_URL + "itemCategory/getAllActive"
      );
      console.log(data.data, "itemCategory");
      setItemCategory(data.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchUom = async () => {
    try {
      const data = await axiosInstance(MASTER_URL + "uom/getAllActive");
      console.log(data.data, "data");
      setUom(data.data);
    } catch (error) {
      console.log(error, "error");
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

  const fetchSalesOrder = async (id) => {
    if (id) {
      try {
        const data = await getOLBySaleOrder(id);
        setLineItemNo(data);
        console.log(data, "data");
      } catch (error) { }
    }
  };

  useEffect(() => {
    axiosInstance("partNumber/getAll")
      .then(({ data }) => {
        setParts(data);
      })
      .catch(console.log);
    fetchUom();
    fetchConsignee();
    fetchItemCategory();
  }, []);


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
    setRegistraionTypes(data);
  } catch(error) {
    console.log(error,"error");
  }
}

  useEffect(() => {
    if (open) {
      getOrderTypes();
      fetchConsignee();
      getRegNos();
    }
  }, [open]);

  const onFormSubmit = (data) => {
    const formData = new FormData();
    formData.append(
      "soLineItemStr",
      JSON.stringify({
        id: dataVal?.id,
        saleOrderNo: data?.saleOrderNo,
        orderMasterNo: data?.orderMasterNo,
        saleOrderId: data?.saleOrderId,
        lineItemNo: data?.lineItemNo,
        description: data?.description,
        unitCost: data?.unitCost,
        partNumberId: data?.partNo,
        catPartNumber: data.catPartNumber,
        nsnPartNo: data.nsnPartNumber,
        uomId: uomId,
        itemCategoryId: itemCategoryId,
        consigneeIds: data.consigneeIds,
        inspectionAuthorityId:inspectionAuthorityId ? inspectionAuthorityId : dataVal?.inspectionAuthorityId,
        organizationId: getValues("inspectionAgencyIds")?.id,
        orderQty: data?.orderQty,
        gcs: data?.gcs,
        gem: data.gem,
        selfCertification: data.selfCertification,
        remarks: data.remarks,
        status: data.status,
        supplyType:data.supplyType,
         orderTypeId:data?.orderTypeId,
          orderTypeDate:data?.orderTypeDate,
          orderTypeNo:data?.orderTypeNo,
          deliveryDate:data?.deliveryDate,
          refNo:data?.refNo,
                  
        registrationNo:data.registrationNo,

        isImported: data.imported
          ? data.imported === true
            ? true
            : false
          : false,
      })
    );
    formData.append("tmrFile", selectedFile);
    console.log(data.status, "status");
    // selectedFile.forEach((item) => formData.append("tmrFile", item));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axiosInstanceTran
      .post(saveLIDetails, formData, config)
      .then(({ data }) => {
        console.log("file upload res", data);
        setResponseData(data);
        setSelectedFile(null);
        //  setGcs(data.gcs);
        setGem(data.gem);
        setSelfCertification(data.selfCertification);
        setRemarks(data.remarks);
        setStatus(data.status);
        // setStatus(data.statusVal);
        if (data !== "null") {
          toast.success("Data updated successfully");
          fetchRecords();
          setOpen(false);
        } else {
          toast.error("Something went wrong");
        }
      })
      // .catch((err) => console.log("Error in uploading Supply Order attachments", err));
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    console.log("dataVal", dataVal);
    setUpdatedTmrUrl(dataVal?.updatedTmrFileUrl);
    reset({
      ...dataVal,
      partNo: dataVal?.partNumberId,
      itemCategoryName: dataVal?.itemCategoryName,
      supplyType: dataVal?.supplyType,
      inspectionAuthorityName: dataVal?.inspectionAuthorityName,
      consigneeIds: dataVal?.consigneeIds,
     
      imported: dataVal?.imported ? true : false,
      gcs: dataVal?.gcs ? "true" : "false",
    });
  }, [dataVal]);

  const inspectionAgencyDetailsOfFirm = useSelector(
    (store) => store.orgReducer.inspectionAgencyTypeOfFirm
  );
  const dispatch = useDispatch()
  useEffect(()=>{
    if (open) {
    dispatch(getInspectionAgencyDetailsAndFirmDetails(orgId))
    }
  },[open])
console.log("inspectionAgencyDetailsOfFirm",inspectionAgencyDetailsOfFirm)
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Dialog
        open={open}
        maxWidth="lg"
        fullWidth
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title501" {...props} />
        )}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title501">
          {/* Edit Line Items Form (<b>Line Item Number</b>: {dataVal?.lineItemNo}{" "}
          &nbsp;&nbsp; ,&nbsp;&nbsp;&nbsp; <b>Work Order No.</b> :{" "}
          {dataVal?.saleOrderNo}) */}
          Edit Line Items Form
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
                    {/* <option value="">Select EP Code </option> */}
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

            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <Controller
                name="itemCategoryName"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <AutoCompleteNew
                    labelText="Item Category"
                    data={itemCategory}
                    getOptionLabel={(o) => o?.category}
                    required
                    value={
                      itemCategory.find((item) => item.category == value) || ""
                    }
                    {...props}
                    //value={value}
                    onChange={(e, v) => {
                      onChange(v?.category);
                      setItemCategoryId(v?.id);
                    }}
                    size="small"
                    error={!!errors.array?.itemCategoryName}
                    helperText={errors.array?.itemCategoryName?.message}
                  />
                )}
              />
            </Grid>

         

            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Controller
                name={`nsnPartNumber`}
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
                name={`catPartNumber`}
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
                    inputProps={{ maxLength: 25 }}
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
                name={`materialDescription`}
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
                    inputProps={{ maxLength: 25 }}
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
                    inputProps={{ maxLength: 25 }}
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
                name="inspectionAuthorityName"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <AutoCompleteNew
                    labelText="Inspection Agency"
                    data={inspectionAgencyDetailsOfFirm}
                    getOptionLabel={(o) => o?.name}
                    required
                    value={
                      inspectionAgencyDetailsOfFirm.find((item) => item.name == value) || ""
                    }
                    {...props}
                    onChange={(e, v) => {
                      onChange(v?.name);
                      setInspectionAuthorityId(v?.id);
                    }}
                    size="small"
                    error={!!errors.array?.inspectionAuthorityName}
                    helperText={errors.array?.inspectionAuthorityName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Controller
                name="supplyType"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomizedInputs
                  select
                    labelText="Supply Type"
                    SelectProps={{ native: true }}
                    fullWidth
                    onChange={onChange}
                    value={value}
                    size="small"
                    error={!!errors.array?.supplyType}
                    helperText={errors.array?.supplyType?.message}
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


            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Controller
                name="deliveryDate"
                control={control}
                // value={value}
                render={({ field: { onChange, value, ...props } }) => (
                  <TextField
                    labelText="Delivery Date"
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
                    error={!!errors.deliveryDate}
                    helperText={errors.deliveryDate?.message}
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
            {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <Controller
                name="consignee"
                control={control}
                render={({ field: { onChange, value, ...props } }) => (
                  <AutoCompleteNew
                    labelText="consignee"
                    data={consignee}
                    getOptionLabel={(o) => o?.name}
                    required
                    value={
                      consignee.find((item) => item.name == value) || ""
                    }
                    {...props}
                    onChange={(e, v) => {
                      onChange(v?.name);
                      setConsigneeIds(v?.id);
                    }}
                    size="small"
                    error={!!errors.array?.consignee}
                    helperText={errors.array?.consignee?.message}
                  />
                )}
              />
            </Grid> */}
 <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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
                            options={consignee}
                            value={consignee?.filter((item) => value?.includes(item?.id)) || ""}
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
                </Grid>
            <Grid item xs={12} sm={6} md={6} lg={2} xl={2}>
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
                    inputProps={{ maxLength: 25 }}
                  />
                )}
              />
            </Grid>

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
                    <option value="" disabled>
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
                    error={!!errors.orderDate}
                    helperText={errors.orderDate?.message}
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
                    inputProps={{ maxLength: 25 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            className={!isDirty ? classes.disabledButton : classes.button}
            type="submit"
            disabled={!isDirty}
            onClick={handleSubmit(onFormSubmit)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(false);
              setSelectedFile(null);
              // setValue("isImported", false);
            }}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
