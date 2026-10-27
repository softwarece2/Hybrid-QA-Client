/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {  useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import TextField from "../../../components/TextField";
import { WING_ID } from "../../../Globals";
//material ui
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@material-ui/core";
import Button from "components/Button";


import { teal } from "@material-ui/core/colors";

//redux
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import AutoCompleteNew from "components/AutoCompleteNew";
import useTable, { StyledTableCell, StyledTableRow } from "components/UseTable";
import { useDispatch, useSelector } from "react-redux";
import { getConsignee } from "Redux/Actions/Inspect/InspectOLAction";
import { getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";
import { saveOLImportDetails } from "Redux/Actions/SupplyOrder/OLImportAction";
import { getAllSaleOrderDetails } from "Redux/Actions/SupplyOrder/SOAction";
import { SELECTED_SO_ID } from "Redux/Types";
import { DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";

const usersSchema = yup.object().shape({
  offerLetterNo: yup.string().required("Required").typeError("required"),
  soLineItemNo: yup
    .object()
    .shape()
    .nullable()
    .required("Required")
    .typeError("required"),
  offeredQty: yup.string().required("Required").typeError("required"),
  issueLevel: yup.string().required("Required").typeError("required"),
  priority: yup.string().required("Required").typeError("required"),
  offerDate: yup.date().nullable().required("Required").typeError("required"),
});


const useStyles = makeStyles((theme) => ({
  browseBtnWrapper: {
    border: "1px solid",
    borderColor: teal[100],
    borderRadius: "4px",
    display: "inline-block",
    borderBlockStyle: "ridge",
    minWidth: 300,
  },
  browseBtnContainer: {
    display: "flex",
    alignItems: "center",
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  autoComplete: {
    padding: "12px 8px 8px 4px",
  },
  browse: {
    padding: "12px 0px 8px 4px",
  },
  icon: {
    color: "#f44336",
  },
  buttonProgress: {
    color: "white",
  },
}));

const headCells = [
  {
    label: "OL Number",
    field: "offerLetterNo",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Line Item No.",
    field: "soLineItemNo",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Part No.",
    field: "partNo",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Qty Offered",
    field: "offeredQty",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Issue Level",
    field: "issueLevel",
    align: "left",
    disableSorting: true,
  },
  { label: "Priority", field: "priority", align: "left", disableSorting: true },
  {
    label: "Offered Date",
    field: "offerDate",
    align: "left",
    disableSorting: true,
  },
];

const defaultArray = {
  offerLetterNo: "",
  soLineItemNo: "",
  offeredQty: "",
  issueLevel: "1",
  priority: "High",
  offerDate: null,
};

const defaultValues = {
  saleOrderNo: null,
  array: [defaultArray],
};
const schema = yup.object().shape({
  array: yup.array().of(usersSchema).min(1),
  supplyOrderId: yup
    .object()
    .shape()
    .nullable()
    .required("Please select the required field")
    .typeError("required"),
  saleOrderNo: yup
    .object()
    .shape()
    .nullable()
    .required("Please select the required field")
    .typeError("required"),
  consigneeId: yup
    .object()
    .shape()
    .nullable()
    .required("Please select the required field")
    .typeError("required"),
  lvlOfInspId: yup
    .object()
    .shape()
    .nullable()
    .required("Please select the required field")
    .typeError("required"),
});

const OLCreate = ({ onClose, refresh, selectedOrgGroup }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [open, setOpen] = React.useState(false);


  const [loading, setLoading] = useState(false);

  const [supplyOrderId, setSupplyOrderId] = useState([]);

  const [records, setRecords] = useState([]);
  const [show, setShow] = useState(true);

  const [consigneeId, setConsigneeId] = useState([]);
  const [lineItemNo, setLineItemNo] = useState([]);


  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;



  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors},
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "array",
  });
  // const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const saleOrderList = useSelector((store) => store.soReducer.saleOrders);
  const consigneeDetails = useSelector(
    (store) => store.inspectOLReducer.consigneeBySO
  );
  const lvlOfInspDetails = useSelector(
    (store) => store.inspectOLReducer.lvlOfInsp
  );
  const {

    TblHead,

  } = useTable(records, headCells);



  const handleClose = () => {
    reset();
    setOpen(false);
  };

 

  const handleRemoveItem = (index) => {
    remove(index, 1);
    //resetform();
  };

  const handleListAdd = () => {
    const getFirstRowData = getValues("array") ? getValues("array")[0] : null;
    if (getFirstRowData) {
      const defaultData = {
        offerLetterNo: "",
        issueLevel: "1",
        priority: "High",
        offerDate: "",
      };
      append(defaultData);
    } else {
      append(defaultArray);
    }
  };

  const fetchSaleOrders = (id) => {
    if (id !== undefined) {
      dispatch({
        type: SELECTED_SO_ID,
        payload: id,
      });
      dispatch(getAllSaleOrderDetails(id));
    }
  };

  const fetchConsignee = (id) => {
    if (id !== undefined) {
      dispatch(getConsignee(id));
    }
  };
  const fetchLineItem = async (id) => {
    if (id) {
      try {
        const data = await getOLBySaleOrder(id);
        setLineItemNo(data);
        // console.log(data, "data lineItem");
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log("errors", errors);
  console.log("values", getValues());

  const handleSave = (data) => {
    console.log(data, "data");
    const isDuplicate = data.array.some((el, i) =>
      data.array.some((innerEl, j) => {
        if (i === j) {
          return false;
        } else {
          return innerEl?.soLineItemNo?.id === el?.soLineItemNo?.id;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate Sale Order Details is present in the form");
      return;
    }

    const req = data?.array.map((user) => {
      return {
        offerLetterNo: user.offerLetterNo,
        soLineItemNo: user.soLineItemNo.lineItemNo,
        offeredQty: user.offeredQty,
        issueLevel: user.issueLevel,
        priority: user.priority,
        offerDate: user.offerDate,
      };
    });



    const dataVal = {
      saleOrderNo: data?.saleOrderNo?.id,
      consigneeId: consigneeId,
      inspectionLevelId: getValues("lvlOfInspId").id,
      employeeId: loggedInUser?.empId,
      olLineItemDtos: req,
    };
    console.log("PD", dataVal);
    dispatch(
      saveOLImportDetails(dataVal, supplyOrderId, handleClose, setLoading)
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        // className={classes.buttonImport}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        Add {isArmy ? "QACL" : "OL"}
      </Button>
      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog
          open={open}
          maxWidth="xl"
          fullWidth
          PaperComponent={(props) => (
            <PaperComponent id="draggable-dialog-title33" {...props} />
          )}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title33">
            Add {isArmy ? "QACL" : "OL"}
          </DialogTitle>

          <DialogContent dividers style={{ padding: 0, position: "relative" }}>
            <div className={classes.browseBtnContainer}>
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={classes.autoComplete}
                >
                  <Controller
                    name="supplyOrderId"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        data={supplyDetails}
                        required
                        value={value}
                        labelText="Enter/ Search Supply Order"
                        getOptionLabel={(o) => o.orderNo}
                        onChange={(e, v) => {
                          onChange(v);
                          setSupplyOrderId(v?.id);
                          fetchSaleOrders(v?.id);
                          fetchConsignee(v?.id);
                        }}
                        error={!!errors.supplyOrderId}
                        helperText={errors.supplyOrderId?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={classes.autoComplete}
                >
                  <Controller
                    name="saleOrderNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        data={saleOrderList || []}
                        required
                        {...props}
                        value={value}
                        labelText="Enter/ Search Sale Order"
                        getOptionLabel={(o) => o.saleOrderNo}
                        onChange={(e, v) => {
                          // if (v === null) {
                          //   setShow(true);
                          // } else {
                          //   setShow(false);
                          // }
                          onChange(v);

                          // setSaleOrderId(v?.id);
                          fetchLineItem(v?.id);
                        }}
                        error={!!errors.saleOrderNo}
                        helperText={errors.saleOrderNo?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={classes.autoComplete}
                >
                  <Controller
                    name="consigneeId"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        data={consigneeDetails}
                        required
                        value={value}
                        labelText="Enter/ Search Consignee "
                        getOptionLabel={(o) => o.name}
                        onChange={(e, v) => {
                          if (v === null) {
                            setShow(true);
                          } else {
                            setShow(false);
                          }
                          onChange(v);
                          setConsigneeId(v?.id);
                        }}
                        error={!!errors.consigneeId}
                        helperText={errors.consigneeId?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  className={classes.autoComplete}
                >
                  <Controller
                    name="lvlOfInspId"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <AutoCompleteNew
                        data={lvlOfInspDetails}
                        required
                        value={value}
                        labelText="Enter/ Search Level of Inspection"
                        getOptionLabel={(o) => o.name}
                        onChange={(e, v) => {
                          onChange(v);
                        }}
                        error={!!errors.lvlOfInspId}
                        helperText={errors.lvlOfInspId?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.autoComplete}
                  align="right"
                >
                  <Button
                    startIcon={<AddCircleIcon />}
                    variant="contained"
                    color="primary"
                    obs={"form"}
                    onClick={handleListAdd}
                  >
                    Add Row
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={classes.autoComplete}
                >
                  <TableContainer style={{ maxHeight: "600px" }}>
                    {loading && <LinearProgress />}
                    <Table
                      style={{
                        position: "relative",
                        border: "1px solid lightgrey",
                      }}
                      size="small"
                      aria-label="simple table"
                      id="data-table-cleanliness-report"
                    >
                      <TblHead />
                      {fields.length !== 0 ? (
                        <TableBody>
                          {fields?.map((input, index) => (
                            <StyledTableRow key={input.id}>
                              <StyledTableCell className={classes.tableCell}>
                                <Controller
                                  name={`array[${index}].offerLetterNo`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <TextField
                                      placeholder="Offer Letter No"
                                      {...props}
                                      onChange={(e) => {
                                        // setOfferLetterNo(e.target.value);
                                        onChange(e.target.value);
                                      }}
                                      value={value}
                                      //onChange={onChange}
                                      // value={value || `array[${0}].offerLetterNo`}
                                      size="small"
                                      error={
                                        !!errors.array?.[index]?.offerLetterNo
                                      }
                                      helperText={
                                        errors.array?.[index]?.offerLetterNo
                                          ?.message
                                      }
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].soLineItemNo`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <AutoCompleteNew
                                      data={lineItemNo || []}
                                      getOptionLabel={(o) => o?.lineItemNo}
                                      required
                                      {...props}
                                      value={value}
                                      onChange={(e, v) => {
                                        onChange(v);
                                        setValue(
                                          `array[${index}].partNo`,
                                          v?.partNo
                                        );
                                        // setProjectName(e.target.value);
                                      }}
                                      size="small"
                                      error={
                                        !!errors.array?.[index]?.soLineItemNo
                                      }
                                      helperText={
                                        errors.array?.[index]?.soLineItemNo
                                          ?.message
                                      }
                                    /> /* <Controller
                              name={`array[${index}].soLineItemNo`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  placeholder="Line Item No"
                                  {...props}
                                  onChange={(e,v)=>{
                                    onChange(e);
                               setProjectName(e.target.value);

                                  }}
                                  value={value
                                }
                                  size="small"
                                  error={
                                    !!errors.array?.[index]?.soLineItemNo
                                  }
                                  helperText={
                                    errors.array?.[index]?.soLineItemNo
                                      ?.message
                                  } */
                                    // />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].partNo`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <TextField
                                      placeholder="Part No"
                                      {...props}
                                      onChange={onChange}
                                      value={value}
                                      inputProps={{ readOnly: true }}
                                      size="small"
                                      error={!!errors.array?.[index]?.partNo}
                                      helperText={
                                        errors.array?.[index]?.partNo?.message
                                      }
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].offeredQty`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <TextField
                                      placeholder="Offered Qty"
                                      {...props}
                                      onChange={onChange}
                                      value={value}
                                      size="small"
                                      error={
                                        !!errors.array?.[index]?.offeredQty
                                      }
                                      helperText={
                                        errors.array?.[index]?.offeredQty
                                          ?.message
                                      }
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].issueLevel`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <TextField
                                      placeholder="Issue Level"
                                      {...props}
                                      onChange={onChange}
                                      value={value}
                                      size="small"
                                      error={
                                        !!errors.array?.[index]?.issueLevel
                                      }
                                      helperText={
                                        errors.array?.[index]?.issueLevel
                                          ?.message
                                      }
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].priority`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <TextField
                                      // className={classes.textArea}
                                      placeholder="Priority"
                                      size="small"
                                      {...props}
                                      onChange={onChange}
                                      value={value}
                                      error={!!errors.array?.[index]?.priority}
                                      helperText={
                                        errors.array?.[index]?.priority?.message
                                      }
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell className={classes.remarks}>
                                <Controller
                                  name={`array[${index}].offerDate`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, ...props },
                                  }) => (
                                    <MuiPickersUtilsProvider
                                      utils={DateFnsUtils}
                                    >
                                      <KeyboardDatePicker
                                        variant="dialog"
                                        format="dd/MM/yyyy"
                                        autoOk
                                        id="date-picker-inline"
                                        // label="Start Date"
                                        value={value}
                                        onChange={(d) => {
                                          onChange(d);
                                          getValues("array")?.forEach(
                                            (el, index) => {
                                              setValue(
                                                `array[${index}].offerDate`,
                                                d
                                              );
                                            }
                                          );
                                        }}
                                        KeyboardButtonProps={{
                                          "aria-label": "change date",
                                        }}
                                        clearable
                                        size="small"
                                        inputVariant={"outlined"}
                                        disableFuture
                                        error={
                                          !!errors.array?.[index]?.offerDate
                                        }
                                        helperText={
                                          errors.array?.[index]?.offerDate
                                            ?.message
                                        }
                                      />
                                    </MuiPickersUtilsProvider>
                                    // <TextField
                                    //   // className={classes.textArea}
                                    //   placeholder="Offer Date"
                                    //   type="date"
                                    //   size="small"
                                    //   {...props}
                                    //   onChange={onChange}
                                    //   value={value}
                                    //   error={!!errors.array?.[index]?.offerDate}
                                    //   helperText={
                                    //     errors.array?.[index]?.offerDate
                                    //       ?.message
                                    //   }
                                    // />
                                  )}
                                />
                              </StyledTableCell>

                              <StyledTableCell
                                className={classes.remarks}
                                style={{ width: "20px" }}
                              >
                                {index === 0 ? null : (
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => handleRemoveItem(index)}
                                  >
                                    <DeleteIcon className={classes.icon} />
                                  </IconButton>
                                )}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      ) : (
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          align="center"
                        >
                          <Typography className={classes.text}>
                            {" "}
                            No Records To Display
                          </Typography>
                        </Grid>
                      )}
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleSave)}
              type="submit"
              disabled={loading}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default OLCreate;
