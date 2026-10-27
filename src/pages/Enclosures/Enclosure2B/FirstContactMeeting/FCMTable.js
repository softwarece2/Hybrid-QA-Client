/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";

//material-ui
import DateFnsUtils from "@date-io/date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import "jspdf-autotable";
import moment from "moment";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import { restrict } from "restrict";
import * as yup from "yup";
import TextField from "../../../../components/TextField";
//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../../components/Button";
import useTable, { StyledTableCell } from "../../../../components/UseTable";
//

//Redux
import { AddCircle, Delete } from "@material-ui/icons";
import {
  getSavedDetailsFCM,
  saveFcmDetails,
  submitDetailsFCM,
} from "../../../../Redux/Actions/Enclosure/Enclosure2BAction";
import FCMView from "../FCMView";
import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable";

export const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  tableCell: {
    border: "1px solid black",

  },
  tableCellHeader: {
    border: "1px solid black",
    color: "#fff",
  },

  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",

    position: "relative",
  },
  datePicker: {
    width: 146,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
  index: {
    width: 150,
    border: "1px solid black",
    fontWeight: 600,

  },
}));

const arraySchema = yup.object().shape({
  id: yup.string(),
  vendor: yup.string().typeError("required"),
  itemDesc: yup.string().typeError("required"),
  agency: yup.string().typeError("required"),
});

const schema = yup.object().shape({
  soOrderNo: yup.string().typeError("required").required("required"),
  soDate: yup.string().typeError("required").required("required"),
  dateOfReceipt: yup.string().typeError("required").required("required"),
  itemDescription: yup.string().typeError("required").required("required"),
  noOfItems: yup.string().typeError("required").required("required"),
  opa: yup.string().typeError("required").required("required"),
  deliveryDate: yup.string().typeError("required").required("required"),
  noOfLots: yup.string().typeError("required").required("required"),
  approvedDrg: yup.string().trim().nullable(),
  approvedQap: yup
 
    .string()
    .trim()
    .nullable(),
  oemTechSpecs: yup.string().trim().nullable(),

  importDocs: yup

    .string()
    .trim()
    .nullable(),

  specInst: yup

    .string()
    .trim()
    .nullable(),

  inspDiscrepancy: yup
  
    .string()
    .trim()
    .nullable(),


  qtTestApplicable: yup.string().typeError("required").required(" required"),

  detailBom: yup.string().typeError("required").required(" required"),
  approvedPil: yup.string().typeError("required").required(" required"),
  invoiceOemOriginCert: yup
    .string()
    .typeError("required")
    .required(" required"),
  billEntryWarehouse: yup.string().typeError("required").required(" required"),
  billTransport: yup.string().typeError("required").required(" required"),
  certOfConfirmity: yup.string().typeError("required").required(" required"),
  warranty: yup.string().typeError("required").required(" required"),

  subOrderDet: yup.string().typeError("required").required(" required"),
  meltPouring: yup.string().trim().typeError("required").required("Required"),
  sampleTestNabl: yup
    .string()
    .trim()
    .typeError("required")
    .required("Required"),
  inproInspPcb: yup.string().trim().typeError("required").required("Required"),

  inproInspUnit: yup.string().trim().typeError("required").required("Required"),
  inproInspNpe: yup.string().trim().typeError("required").required("Required"),

  finalQt: yup.string().trim().typeError("required").required("Required"),
  finalFats: yup.string().trim().typeError("required").required("Required"),
  finalPacking: yup.string().trim().typeError("required").required("Required"),

  finalClearance: yup
    .string()
    .trim()
    .typeError("Required")
    .required("Required"),
  finalVendorRating: yup
    .string()
    .trim()
    .typeError("Required")
    .required("Required"),
  finalConsignee: yup
    .string()
    .trim()
    .typeError("Required")
    .required("Required"),
  others: yup.string().trim().typeError("Required").required("Required"),
  fcmVendor: yup.array().of(arraySchema).required("Must have fields"),

 
});

const defaultArray = [{ vendor: "", itemDesc: "", agency: "", id: 0 }];

const defaultValues = {
 
  dateOfReceipt: null,
  itemDescription: "",
  noOfItems: "",
  opa: "",
  deliveryDate: null,
  noOfLots: "",
  approvedDrg: "",
  approvedQap: "",
  oemTechSpecs: "",
  importDocs: "",
  specInst: "",
  inspDiscrepancy: "",
  newDrgDate: null,
  existDrgDate: null,
  freshQapDate: null,
  existQapDate: null,
  qtTestApplicable: "",
  detailBom: "",
  approvedPil: "",
  invoiceOemOriginCert: "",
  billTransport: "",
  billEntryWarehouse: "",
  certOfConfirmity: "",
  warranty: "",
  meltPouring: "",
  sampleTestNabl: "",
  inproInspPcb: "",
  inproInspUnit: "",
  inproInspNpe: "",
  finalQt: "",
  finalFats: "",
  finalPacking: "",
  finalClearance: "",
  finalVendorRating: "",
  finalConsignee: "",
  others: "",
  subOrderDet: "",
  fcmVendor: defaultArray,
};

export default function FCMTable({ soObj }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
   
    TblPagination,
    recordsAfterPagingAndSorting,

  } = useTable();
  const {
    handleSubmit,
    reset,
    control,
 
    getValues,

    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fcmVendor",
  });

  // const [records, setRecords] = useState([]);
  const [savedData, setSavedData] = useState(null);




  const [valueData, setValueData] = React.useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  console.log("buttonVisible", buttonVisible);

  const resetData = (res) => {
    reset({
      id: res?.id,
      soOrderNo: res?.soOrderNo,
      soDate: res?.soDate,
      dateOfReceipt: res?.dateOfReceipt,
      itemDescription: res?.itemDescription,
      noOfItems: res?.noOfItems,
      opa: res?.opa,
      deliveryDate: res?.deliveryDate,
      noOfLots: res?.noOfLots,
      approvedDrg: res?.approvedDrg,
      approvedQap: res?.approvedQap,
      oemTechSpecs: res?.oemTechSpecs,
      importDocs: res?.importDocs,
      specInst: res?.specInst,
      inspDiscrepancy: res?.inspDiscrepancy,
      newDrgDate: res?.newDrgDate,
      existDrgDate: res?.existDrgDate,
      freshQapDate: res?.freshQapDate,
      existQapDate: res?.existQapDate,
      qtTestApplicable: res?.qtTestApplicable ? "true" : "false",
      detailBom: res?.detailBom ? "true" : "false",
      approvedPil: res?.approvedPil ? "true" : "false",
      billTransport: res?.billTransport ? "true" : "false",
      invoiceOemOriginCert: res?.invoiceOemOriginCert ? "true" : "false",
      billEntryWarehouse: res?.billEntryWarehouse ? "true" : "false",
      certOfConfirmity: res?.certOfConfirmity ? "true" : "false",
      warranty: res?.warranty ? "true" : "false",
      meltPouring: res?.meltPouring,
      sampleTestNabl: res?.sampleTestNabl,
      inproInspPcb: res?.inproInspPcb,
      inproInspUnit: res?.inproInspUnit,
      inproInspNpe: res?.inproInspNpe,
      finalQt: res?.finalQt,
      finalFats: res?.finalFats,
      finalPacking: res?.finalPacking,
      finalClearance: res?.finalClearance,
      finalVendorRating: res?.finalVendorRating,
      finalConsignee: res?.finalConsignee,
      others: res?.others,
      subOrderDet: res?.subOrderDet ? "true" : "false",
      submittedDate: res?.submittedDate,
      fcmVendor: res?.fcmVendor
        ? res.fcmVendor.map((el) => ({
            id: el.id,
            vendor: el.vendor,
            itemDesc: el.itemDesc,
            agency: el.agency,
          }))
        : defaultArray,
    });
  };

  React.useEffect(() => {
    dispatch(getSavedDetailsFCM(soObj?.id))
      .then((res) => {
        console.log(typeof res?.billTransport, "transport");
        // if (res?.id !== 0) {
        setSavedData(res);
        const isBtnVisible =
          res?.submittedDate === "" || res?.submittedDate === null
            ? true
            : false;
        setButtonVisible(isBtnVisible);
        resetData(res);
        console.log("wyhetuf", res);
        console.log("wyhetuf", savedData);
        // }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const onFormSubmit = (data) => {
    const req = {
      ...data,
      id: savedData?.id,
      supplyOrderId: soObj?.id,
      soDate: moment(data?.soDate).format("DD-MM-YYYY"),
      deliveryDate: moment(data?.deliveryDate).format("DD-MM-YYYY"),
      dateOfReceipt: moment(data?.dateOfReceipt).format("DD-MM-YYYY"),
      fcmVendor: data.fcmVendor,
    };

    dispatch(submitDetailsFCM(req))
      .then((res) => {
        if (res) {
          setSavedData(res);
          const isBtnVisible = res?.submittedDate === null ? true : false;
          setButtonVisible(isBtnVisible);
          resetData(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSaveAsDraft = () => {
    const data = getValues();
    const req = {
      ...data,
      id: savedData?.id,
      supplyOrderId: soObj?.id,
      soDate: moment(data?.soDate).format("DD-MM-YYYY"),
      deliveryDate: moment(data?.deliveryDate).format("DD-MM-YYYY"),
      dateOfReceipt: moment(data?.dateOfReceipt).format("DD-MM-YYYY"),
      fcmVendor: data.fcmVendor,
    };

    dispatch(saveFcmDetails(req))
      .then((res) => {
        if (res) {
          setSavedData(res);
          resetData(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {/* pass The value as a props to display the entered value  */}
      {/* {openPreview && <Preview onClose={() => setOpenPreview(false)} />} */}
      {openPreview && (
        <FCMView open={openPreview} setOpen={setOpenPreview} idVal={soObj} />
      )}
      <Grid container>
        <Grid item style={{ padding: 8 }} xs={12} align="left">
          <Button
            type="submit"
            onClick={() => dispatch(selectItem(<InspectSOArmyTable />))}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          style={{ padding: 8 }}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          align="center"
        >
          <Typography className={classes.heading}>
            FIRST CONTACT MEETING WITH FIRM ON RECEIPT OF PURCHASE ORDER
          </Typography>
        </Grid>
      </Grid>

      <>
        {buttonVisible ? (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="center"
              style={{ margin: "auto", overflowX: "auto" }}
            >
              <Grid container>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="left"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          Sl.No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                      >
                        <Typography className={classes.subHeading}>
                          DESCRIPTION
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                        colSpan={2}
                      >
                        <Typography className={classes.subHeading}>
                          REMARKS
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        1.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PO No.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="soOrderNo"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                size="small"
                                onChange={onChange}
                                value={value}
                                onInput={restrict.general}
                                error={!!errors.soOrderNo}
                                helperText={errors.soOrderNo?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {soObj?.orderNo} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        2.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PO Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="soDate"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                type="date"
                                size="small"
                                onChange={onChange}
                                value={value}
                                error={!!errors.soDate}
                                helperText={errors.soDate?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {moment(savedData?.soDate).format("DD-MM-YYYY")} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        3.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Date of Receipt of PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="dateOfReceipt"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                type="date"
                                size="small"
                                onChange={onChange}
                                value={moment(value).format("yyyy-MM-DD")}
                                error={!!errors.dateOfReceipt}
                                helperText={errors.dateOfReceipt?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {moment(savedData?.dateOfReceipt).format("DD-MM-YYYY")} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        4.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="itemDescription"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                size="small"
                                onChange={onChange}
                                value={value}
                                onInput={restrict.general}
                                error={!!errors.itemDescription}
                                helperText={errors.itemDescription?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {savedData?.itemDescription} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        5.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        No. of Line Items / Total Quantity
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="noOfItems"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                // InputProps={{
                                //   readOnly: records.submitted ? true : false,
                                // }}
                                size="small"
                                onChange={onChange}
                                value={value}
                                onInput={restrict.number}
                                error={!!errors.noOfItems}
                                helperText={errors.noOfItems?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {savedData?.noOfItems} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        6.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Order Placing Authority
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="opa"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                size="small"
                                onChange={onChange}
                                value={value}
                                onInput={restrict.general}
                                error={!!errors.opa}
                                helperText={errors.opa?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {savedData?.opa} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        7.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Delivery Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="deliveryDate"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                type="date"
                                size="small"
                                onChange={onChange}
                                value={
                                  value
                                    ? moment(value).format("yyyy-MM-DD")
                                    : null
                                }
                                // moment( value).format("YYYY-MM-DD")}
                                inputProps={{
                                  min: moment(new Date()).format("2014-MM-DD"),
                                }}
                                error={!!errors.deliveryDate}
                                helperText={errors.deliveryDate?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {savedData?.deliveryDate} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        8.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PSPP / No.of Lots
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="noOfLots"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                size="small"
                                onChange={onChange}
                                value={value}
                                onInput={restrict.number}
                                error={!!errors.noOfLots}
                                helperText={errors.noOfLots?.message}
                              />
                            );
                          }}
                        ></Controller>
                        {/* {savedData?.noOfLots} */}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        9.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        Inspection Instruction as per PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        Please mark the instructions as applicable-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Approved Drg and QAP
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedDrg"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.approvedDrg}>
                            {errors.approvedDrg?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Approved QAP
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedQap"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.approvedQap}>
                            {errors.approvedQap?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) OEM Tech Specs
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="oemTechSpecs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.oemTechSpecs}>
                            {errors.oemTechSpecs?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Import Documents
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="importDocs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.importDocs}>
                            {errors.importDocs?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) Special Instructions, If any
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="specInst"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.specInst}>
                            {errors.specInst?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Discrepancy in Inspection Instruction, if any, and
                        OPA clarification awaited
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="inspDiscrepancy"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={value}
                                    color="primary"
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                          <FormHelperText error={!!errors.inspDiscrepancy}>
                            {errors.inspDiscrepancy?.message}
                          </FormHelperText>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        10.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Approved Drg and
                        QAP" or "Approved QAP", please furnish details-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      >
                        Details of Drawing
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (a) If first time induction, date of submission of
                            approved drawing to CQAE(WE),Bengaluru-
                          </Grid>

                          <Controller
                            name="newDrgDate"
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  style={{ width: 146 }}
                                  variant="outline"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  format="dd/MM/yyyy"
                                  value={value}
                                  onChange={onChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  error={!!errors.newDrgDate}
                                  helperText={errors.newDrgDate?.message}
                                />
                              </MuiPickersUtilsProvider>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (b) If existing approved drawing is to be used then
                            indicate concurrence details from OPA/ PD with date
                            of using the same -
                          </Grid>

                          <Controller
                            name="existDrgDate"
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  style={{ width: 146 }}
                                  variant="outline"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  format="dd/MM/yyyy"
                                  value={value}
                                  onChange={onChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  error={!!errors.existDrgDate}
                                  helperText={errors.existDrgDate?.message}
                                />
                              </MuiPickersUtilsProvider>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      >
                        Details of QAP
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (a) If fresh QAP is to be made, date of submission
                            of draft QAP alongwith approved Drawings to
                            CQAE(WE), Bengaluru-
                          </Grid>

                          <Controller
                            name="freshQapDate"
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  style={{ width: 146 }}
                                  variant="outline"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  format="dd/MM/yyyy"
                                  value={value}
                                  onChange={onChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  error={!!errors.freshQapDate}
                                  helperText={errors.freshQapDate?.message}
                                />
                              </MuiPickersUtilsProvider>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (b) If existing QAP is to be used then indicate QAP
                            No with date. Concurrence to use the same will be
                            sought by CQAE(WE), Bengaluru from DQA(N), Delhi -
                          </Grid>

                          <Controller
                            name="existQapDate"
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  style={{ width: 146 }}
                                  variant="outline"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  format="dd/MM/yyyy"
                                  value={value}
                                  onChange={onChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  error={!!errors.existQapDate}
                                  helperText={errors.existQapDate?.message}
                                />
                              </MuiPickersUtilsProvider>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                      {/* <StyledTableCell className={classes.tableCell}>(c) QT/ Type test applicable</StyledTableCell> */}
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={6}>(c) QT/ Type test applicable - </Grid>
                          <Grid>
                            {/* <FormControl component="fieldset">
                                <RadioGroup row size="small" value={valueData}>
                                  <FormControlLabel
                                    value="yes"
                                    // onChange={(e) => {
                                    //   setValueData("yes");
                                    // }}
                                    control={<Radio size="small" />}
                                    label="Yes"
                                  />
                                  <FormControlLabel
                                    value="no"
                                    onChange={(e) => {
                                      setValueData("no");
                                    }}
                                    control={<Radio size="small" />}
                                    label="No"
                                  />
                                </RadioGroup>
                              </FormControl> */}
                            <Controller
                              name="qtTestApplicable"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                  value={value}
                                  onChange={onChange}
                                  row
                                >
                                  <FormControlLabel
                                    value="true"
                                    control={
                                      <Radio color="primary" size="small" />
                                    }
                                    label="Yes"
                                    color="primary"
                                  />
                                  <FormControlLabel
                                    value="false"
                                    control={
                                      <Radio color="primary" size="small" />
                                    }
                                    label="No"
                                  />
                                </RadioGroup>
                              )}
                            />
                            <FormHelperText error={!!errors.qtTestApplicable}>
                              {errors.qtTestApplicable?.message}
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        11.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "OEM Tech Specs",
                        please furnish details-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Detailed Bill of Material available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="detailBom"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.detailBom}>
                          {errors.detailBom?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Approved PIL available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="approvedPil"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.approvedPil}>
                          {errors.approvedPil?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        12.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Bill of Lading/ Shipping Bill/ Air Way Bill (Any
                        one)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="billTransport"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.billTransport}>
                          {errors.billTransport?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Invoice by OEM or Country of Origin certificate of
                        equipment with Packing list
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="invoiceOemOriginCert"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.invoiceOemOriginCert}>
                          {errors.invoiceOemOriginCert?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Bill of Entry into Warehouse
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="billEntryWarehouse"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.billEntryWarehouse}>
                          {errors.billEntryWarehouse?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Certificate of Conformity indicating Governing
                        Specifications and values of which the item are tested
                        alongwith OEM Test cerrtificate/ Reports/ Date sheet/
                        Catalouge
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="certOfConfirmity"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.certOfConfirmity}>
                          {errors.certOfConfirmity?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (e)Guarantee/ Warranty
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="warranty"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.warranty}>
                          {errors.warranty?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={15}
                      >
                        13.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Raw Material Inspection
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Melt/ Pouring
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="meltPouring"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.meltPouring}
                              helperText={errors.meltPouring?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Sample testing (NABL)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="sampleTestNabl"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.sampleTestNabl}
                              helperText={errors.sampleTestNabl?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        In Process Inspection (Component level/ Sub-assembly
                        stage/ Unit Level)
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ PCB level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="inproInspPcb"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.inproInspPcb}
                              helperText={errors.inproInspPcb?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ Unit level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="inproInspUnit"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.inproInspUnit}
                              helperText={errors.inproInspUnit?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) NDTs, Pressure Test, ECT
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="inproInspNpe"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.inproInspNpe}
                              helperText={errors.inproInspNpe?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Final Stage
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Qualification Tests (ET, EMI/EMC)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalQt"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalQt}
                              helperText={errors.finalQt?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (g) Pre-FATs, FATS, Endurance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalFats"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalFats}
                              helperText={errors.finalFats?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (h) Packing & Preservation, PDI and Stam in
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalPacking"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalPacking}
                              helperText={errors.finalPacking?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (i) Issuance of I-Note/ I and TC/ Dis atch Clearance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalClearance"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalClearance}
                              helperText={errors.finalClearance?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (j) Issuance of Vendor Ratin
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalVendorRating"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalVendorRating}
                              helperText={errors.finalVendorRating?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (k) Dispatch to Consignee
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="finalConsignee"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.finalConsignee}
                              helperText={errors.finalConsignee?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3 + getValues("fcmVendor").length}
                      >
                        14.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Order Details
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="subOrderDet"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup value={value} onChange={onChange} row>
                              <FormControlLabel
                                value="true"
                                control={<Radio color="primary" size="small" />}
                                label="Yes"
                                color="primary"
                              />
                              <FormControlLabel
                                value="false"
                                control={<Radio color="primary" size="small" />}
                                label="No"
                              />
                            </RadioGroup>
                          )}
                        />
                        <FormHelperText error={!!errors.subOrderDet}>
                          {errors.subOrderDet?.message}
                        </FormHelperText>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Vendor Name and Address
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        QA Jurisdiction/ Sub-Nominated Agency
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        colSpan={3}
                        align="right"
                        className={classes.tableCell}
                      >
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => append(defaultArray)}
                        >
                          <AddCircle />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>

                    {fields?.map((item, index) => (
                      <TableRow key={item.id}>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="right"
                        >
                          <Controller
                            control={control}
                            name={`fcmVendor[${index}].vendor`}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                onChange={onChange}
                                value={value}
                                size="small"
                                placeholder="Sub-Vendor Name and Address"
                                error={!!errors.fcmVendor?.[index]?.vendor}
                                helperText={
                                  errors.fcmVendor?.[index]?.vendor?.message
                                }
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="right"
                        >
                          <Controller
                            control={control}
                            name={`fcmVendor[${index}].itemDesc`}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                onChange={onChange}
                                value={value}
                                size="small"
                                placeholder="Item Description"
                                error={!!errors.fcmVendor?.[index]?.itemDesc}
                                helperText={
                                  errors.fcmVendor?.[index]?.itemDesc?.message
                                }
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="right"
                        >
                          <Grid container>
                            <Grid xs={10} item>
                              <Controller
                                control={control}
                                name={`fcmVendor[${index}].agency`}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    onChange={onChange}
                                    value={value}
                                    size="small"
                                    placeholder="QA Jurisdiction/ Sub-Nominated Agency"
                                    error={!!errors.fcmVendor?.[index]?.agency}
                                    helperText={
                                      errors.fcmVendor?.[index]?.agency?.message
                                    }
                                  />
                                )}
                              />
                            </Grid>
                            <Grid xs={2}>
                              {fields.length !== 0 && (
                                <IconButton
                                  onClick={() => remove(index)}
                                  size="small"
                                  color="error"
                                >
                                  <Delete color="error" fontSize="small" />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        15.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Any other technical issues/ Clarifications pertaining to
                        PO, Drawings, QAP, Subnomination, Delivery Date, Offer
                        Letter etc. if any-
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Controller
                          name="others"
                          control={control}
                          render={({
                            field: { onChange, value, ...props },
                          }) => (
                            <TextField
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              required
                              inputProps={{ maxLength: 200 }}
                              onInput={restrict.general}
                              error={!!errors.others}
                              helperText={errors.others?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {recordsAfterPagingAndSorting()?.length != 0 &&
                recordsAfterPagingAndSorting()?.length != undefined ? (
                  <TblPagination />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              align="center"
              style={{ margin: "auto", overflowX: "auto" }}
            >
              <Grid container>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="left"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          Sl.No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          DESCRIPTION
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                        colSpan={2}
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          REMARKS
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        1.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PO No.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {soObj?.orderNo}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        2.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PO Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {moment(savedData?.soDate).format("DD-MM-yyyy")}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        3.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Date of Receipt of PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.dateOfReceipt}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        4.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.itemDescription}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        5.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        No. of Line Items / Total Quantity
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.noOfItems}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        6.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Order Placing Authority
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.opa}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        7.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Delivery Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.deliveryDate}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        8.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PSPP / No.of Lots
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.noOfLots}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        9.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        {" "}
                        Inspection Instruction as per PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        Please mark the instructions as applicable-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Approved Drg and QAP{" "}
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedDrg"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.approvedDrg ? 1 : 0}
                                    color="primary"
                                    // onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Approved QAP
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedQap"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.approvedQap ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) OEM Tech Specs
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="oemTechSpecs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.oemTechSpecs ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Import Documents
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="importDocs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.importDocs ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) Special Instructions, If any
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="specInst"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.specInst ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Discrepancy in Inspection Instruction, if any, and
                        OPA clarification awaited
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="inspDiscrepancy"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedData?.inspDiscrepancy ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        10.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Approved Drg and
                        QAP" or "Approved QAP", please furnish details-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      >
                        Details of Drawing{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (a) If first time induction, date of submission of
                            approved drawing to CQAE(WE),Bengaluru-
                            {""}
                          </Grid>
                          {savedData?.newDrgDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            {" "}
                            (b) If existing approved drawing is to be used then
                            indicate concurrence details from OPA/ PD with date
                            of using the same -
                          </Grid>

                          {savedData?.existDrgDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      >
                        Details of QAP{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (a) If fresh QAP is to be made, date of submission
                            of draft QAP alongwith approved Drawings to
                            CQAE(WE), Bengaluru-
                          </Grid>
                          {savedData?.freshQapDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={12}>
                            (b) If existing QAP is to be used then indicate QAP
                            No with date. Concurrence to use the same will be
                            sought by CQAE(WE), Bengaluru from DQA(N), Delhi -
                          </Grid>

                          {savedData?.existQapDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container>
                          <Grid xs={6}>(c) QT/ Type test applicable - </Grid>
                          <Controller
                            name="qtTestApplicable"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                // value={
                                //   savedFcm?.qtTestApplicable
                                //     ? "true"
                                //     : "false"
                                // }
                                // onChange={onChange}
                                row
                              >
                                <FormControlLabel
                                  checked={savedData?.qtTestApplicable}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.qtTestApplicable}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        11.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "OEM Tech Specs",
                        please furnish details-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Detailed Bill of Material available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="detailBom"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <FormGroup
                                aria-label="position"
                                // row
                                // checked={
                                //   savedFcm?.detailBom ? "true" : "false"
                                // }
                                // column
                              >
                                <FormControlLabel
                                  checked={savedData?.detailBom}
                                  control={
                                    <Checkbox
                                      color="primary"
                                      labelPlacement="start"
                                    />
                                  }
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.detailBom}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </FormGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Approved PIL available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="approvedPil"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                // value={
                                //   savedFcm?.approvedPil ? "true" : "false"
                                // }
                                column
                              >
                                <FormControlLabel
                                  checked={savedData?.approvedPil}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.approvedPil}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        12.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Bill of Lading/ Shipping Bill/ Air Way Bill (Any
                        one)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <FormControl component="fieldset">
                          <RadioGroup
                            size="small"
                            // value={
                            // savedFcm?.billEntryWarehouse? "true" : "false"
                            // }
                          >
                            <FormControlLabel
                              checked={savedData?.billEntryWarehouse}
                              // onChange={(e) => {
                              //   setValueData("yes");
                              // }}
                              control={<Checkbox color="primary" />}
                              label="Yes"
                              labelPlacement="start"
                            />
                            <FormControlLabel
                              checked={!savedData?.billEntryWarehouse}
                              onChange={(e) => {
                                setValueData("no");
                              }}
                              control={<Checkbox color="primary" />}
                              label="No"
                              labelPlacement="start"
                            />
                          </RadioGroup>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Invoice by OEM or Country of Origin certificate of
                        equipment with Packing list
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="invoiceOemOriginCert"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                              // value={
                              //   savedFcm?.invoiceOemOriginCert
                              //     ? "true"
                              //     : "false"
                              // }
                              >
                                <FormControlLabel
                                  checked={savedData?.invoiceOemOriginCert}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.invoiceOemOriginCert}
                                  control={<Checkbox color="primary" />}
                                  labelPlacement="start"
                                  label="No"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Bill of Entry into Warehouse
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="billEntryWarehouse"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                // value={
                                //   savedFcm?.billEntryWarehouse
                                //     ? "true"
                                //     : "false"
                                // }
                                column
                              >
                                <FormControlLabel
                                  checked={savedData?.billEntryWarehouse}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.billEntryWarehouse}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Certificate of Conformity indicating Governing
                        Specifications and values of which the item are tested
                        alongwith OEM Test cerrtificate/ Reports/ Date sheet/
                        Catalouge
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="certOfConfirmity"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                              // value={
                              //   savedFcm?.certOfConfirmity
                              //     ? "true"
                              //     : "false"
                              // }
                              >
                                <FormControlLabel
                                  checked={savedData?.certOfConfirmity}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.certOfConfirmity}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        {" "}
                        (e)Guarantee/ Warranty
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="warranty"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                              // value={savedFcm?.warranty ? "true" : "false"}
                              >
                                <FormControlLabel
                                  checked={savedData?.warranty}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedData?.warranty}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={15}
                      >
                        13.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Raw Material Inspection
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Melt/ Pouring
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.meltPouring}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        {" "}
                        (b) Sample testing (NABL){" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.sampleTestNabl}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        In Process Inspection (Component level/ Sub-assembly
                        stage/ Unit Level)
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ PCB level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.inproInspPcb}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ Unit level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.inproInspUnit}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) NDTs, Pressure Test, ECT
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.inproInspNpe}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Final Stage
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Qualification Tests (ET, EMI/EMC)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalQt}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (g) Pre-FATs, FATS, Endurance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalFats}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (h) Packing & Preservation, PDI and Stam in
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalPacking}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (i) Issuance of I-Note/ I and TC/ Dispatch Clearance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalClearance}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (j) Issuance of Vendor Ratin
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalVendorRating}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (k) Dispatch to Consignee
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.finalConsignee}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={
                          savedData?.fcmVendor &&
                          savedData?.fcmVendor?.length > 0
                            ? savedData?.fcmVendor?.length + 2
                            : 3
                        }
                      >
                        14.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Order Details
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Typography>{savedData?.subOrderDet}</Typography>
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Vendor Name and Address
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>{" "}
                      <StyledTableCell className={classes.tableCell}>
                        QA Jurisdiction/ Sub-Nominated Agency
                      </StyledTableCell>
                    </TableRow>
                    {savedData?.fcmVendor &&
                    savedData?.fcmVendor?.length > 0 ? (
                      savedData?.fcmVendor?.map((item) => (
                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.vendor}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.itemDesc}
                          </StyledTableCell>{" "}
                          <StyledTableCell className={classes.tableCell}>
                            {item?.agency}
                          </StyledTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell className={classes.tableCell}>
                          {" "}
                          <Typography></Typography>
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="center"
                        >
                          -
                        </StyledTableCell>{" "}
                        <StyledTableCell
                          className={classes.tableCell}
                          align="center"
                        >
                          -
                        </StyledTableCell>{" "}
                      </TableRow>
                    )}{" "}
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        15.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Any other technical issues/ Clarifications pertaining to
                        PO, Drawings, QAP, Subnomination, Delivery Date, Offer
                        Letter etc. if any-
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedData?.others}
                        <Typography></Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {recordsAfterPagingAndSorting()?.length != 0 &&
                recordsAfterPagingAndSorting()?.length != undefined ? (
                  <TblPagination />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <Grid
            item
            style={{ padding: 8 }}
            xs={7}
            sm={7}
            md={7}
            lg={7}
            xl={9}
            align="right"
          />
          <Grid
            item
            style={{ padding: 8 }}
            xs={3}
            sm={3}
            md={3}
            lg={3}
            xl={1}
            align="right"
          >
            {buttonVisible && (
              <Button
                type="submit"
                onClick={() => {
                  onSaveAsDraft();
                }}
                variant="contained"
                className={classes.draft}
                // disabled={loading || !isDirty}
              >
                Save Drafts
              </Button>
            )}
          </Grid>
          <Grid
            item
            style={{ padding: 8 }}
            xs={3}
            sm={3}
            md={3}
            lg={1}
            xl={1}
            align="center"
          >
            {buttonVisible && (
              <Button
                type="submit"
                onClick={handleSubmit(onFormSubmit)}
                variant="contained"
                color="primary"
                // disabled={loading || !isDirty}
              >
                Submit
              </Button>
            )}
          </Grid>

          {!buttonVisible && (
            <Button
              type="submit"
              onClick={() => setOpenPreview(true)}
              variant="contained"
              className={classes.btn}
            >
              Preview
            </Button>
          )}
        </Grid>
        {/* ===================================================================================================================== */}

        {/* </form> */}
      </>
      <br />

      {/* </Grid> */}
    </>
  );
}
