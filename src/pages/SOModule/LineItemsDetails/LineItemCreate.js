/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import TextField from "../../../components/TextField";
import { saveLineImportDetails } from "Redux/Actions/SupplyOrder/LineImportAction";
//
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  InputLabel,
} from "@material-ui/core";
import Button from "components/Button";
import { restrict } from "restrict";

import AutoCompleteNew from "components/AutoCompleteNew";
import { useDispatch, useSelector } from "react-redux";
import { DialogTitle } from "Utils";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import { getAllSaleOrderDetails } from "Redux/Actions/SupplyOrder/SOAction";
import { getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";
import axiosInstance from "pages/Services/AxiosInstance";
import axiosInstanceT from "pages/Services/AxiosInstanceTransaction";
import { DeleteOutline } from "@material-ui/icons";
import { getAllSaleOrders } from "pages/Services/URLs";
import moment from "moment/moment";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CustomizedInputs from "../../../components/TextField";


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
}));

const usersSchema = yup.object().shape({
  lineItemNo: yup.string().trim().required("Required").nullable(),
  partNo: yup.string().required("Required").typeError("required").required("Required"),
  itemCategoryName: yup.object().shape().nullable().required("Required").typeError("required"),
  saleOrderNo: yup.object().shape().nullable().required("Required").typeError("required"),
  uomName: yup.object().shape().nullable().required("Required").typeError("required"),
  orderQty: yup.string().required("Required").typeError("required"),
  unitCost: yup.string().required("Required").typeError("required"),
});

const headCells = [

  {
    label: "OLF Order Master No.",
    // required: true,
  },
  {
    label: "Item Category ",
    required: true,
  },
  {
    label: "Line Item/ Indent Sl No.",
    required: true,
  },
  {
    label: "Material No./EP Code No.",
    required: true,
  },
  {
    label: "CAT part no.",
    required: true,
  },
  {
    label: "NSN part no.",
    required: true,
  },
  {
    label: "Material Description",
    required: true,
  },
  // {
  //   label: "Unit Price ",
  //   required: true,
  // },
  { label: "UoM (Unit)", required: true },

  {
    label: "Drawing No.",
    // required: true,
  },
  {
    label: "Delivery Date",
    // required: true,
  },
  {
    label: "Total Quantity",
    required: true,
  },
  {
    label: "Inspection Agency",
    required: true,
  },
  {
    label: "Consignee",
    required: true,
  },
  {
    label: "Reference No.",
    required: true,
  },
  {
    label: "Registration/Running No. ",
  },
  {
    label: "Enter Lot Number",
    required: true,
  },
  {
    label: "Supply Type",
    required: true,
  },
  {
    label: "Order Type",
    required: true,
  },
  {
    label: "Order No.",
    required: true,
  },
  {
    label: "Order Date",
    required: true,
  },

  {
    label: "Action",
  },
];
const UOM_ID = 1;

const options = [
  { value: 1, label: "Main" },
  { value: 2, label: "Spares" },
];

const defaultArray = {
  saleOrderNo: null,
  lineItemNo: "",
  partNo: "",
  description: "",
  uomName: "",
  nsnPartNo: "",
  catPartNo: "",
  itemCategoryName: null,
  unitCost: null,
  orderQty: "",
  consigneeIds: "",
};

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
  array: [defaultArray],
  supplyOrderId: null,
};
const schema = yup.object().shape({
  array: yup.array().of(usersSchema).min(1),
  supplyOrderId: yup.object().typeError("required").required("Please select the required field"),
  consigneeIds: yup
    .array()
    .min(1, "Required")
    .typeError("Required")
    .required("Required"),
});

const LineItemCreate = ({ supplyDetails, refresh, setSupplyOrder }) => {
  const dispatch = useDispatch();
  // const supplyDetails = useSelector((store) => store.soReducer.soBySalesGroup);
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uom, setUom] = useState([]);
  const [itemCategory, setitemCategory] = useState([]);
  const [parts, setParts] = useState([]);
  const [saleOrderList, setSalesOrder] = useState([]);
  const inspectionAgencyDetailsOfFirm = useSelector((store) => store.orgReducer.inspectionAgencyTypeOfFirm);
  const { handleSubmit, reset, control, setValue, setError, getValues, formState: { errors }, } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const consigneeDetails = useSelector(
    (store) => store.soDropdownReducer.consignee
  );
  const { fields, remove, append } = useFieldArray({
    control,
    name: "array",
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleRemoveItem = (index) => {
    remove(index);
  };
  const fetchParts = async () => {
    try {
      const { data } = await axiosInstance("partNumber/getAllActive");
      setParts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (data) => {
    const isDuplicate = data.array.some((el, i) =>
      data.array.some((innerEl, j) => {
        if (i === j) {
          return false;
        } else {
          return innerEl.lineItemNo === el.lineItemNo;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate Sale Order Details is present in the form");
      return;
    }

    const unmappedParts = data.array.filter(li => !li.sectionCode);
    if (unmappedParts.length > 0) {
      toast.error("Product is not mapped to any Department. Map Product to Department");
      return;
    }
    const req = data?.array.map((li) => {
      return {
        saleOrderNo: li.saleOrderNo.saleOrderNo,
        orderNo: li.orderNo,
        lineItemNo: li.lineItemNo,
        partNumberId: li.partNo,
        description: li.description,
        unitCost: li.unitCost,
        uomName: li.uomName.unit,
        itemCategoryName: li.itemCategoryName.category,
        orderQty: li.orderQty,
        createdBy: loggedInUser?.empId,
        catPartNo: li.catPartNo,
        nsnPartNo: li.nsnPartNo,
        consigneeIds: li.consigneeIds,
        isImported: "false",
      };
    });

    const dataVal = {
      supplyOrderId: data.supplyOrderId?.id,
      createdBy: loggedInUser?.empId,
      lineItemDtos: req,
    };
    setLoading(true);
    try {
      const { data: uniqueCheckData } = await axiosInstanceT.post("supplyOrder/checkUniqueIndent", {
        id: data.supplyOrderId?.id,
        indentSlNoList: data?.array.map((li) => li.lineItemNo),
      });
      let hasAnyTrue = false;
      if (Array.isArray(uniqueCheckData)) {
        uniqueCheckData.forEach((d, index) => {
          if (d) {
            hasAnyTrue = true;
            setError(`array.${index}.lineItemNo`, {
              type: "manual",
              message: "Line item should be unique",
            });
          }
        });
      }
      if (hasAnyTrue) {
        throw new Error("Duplicate line item");
      }

      dispatch(saveLineImportDetails(dataVal, handleClose, setLoading, refresh));
    } catch (error) {
      toast.error("Entered Line Item should be unique");
      console.log(error, error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderList = async (id) => {
    if (id) {
      try {
        const { data } = await axiosInstanceT.get(getAllSaleOrders + id);
        setSalesOrder(data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const fetchSalesOrder = async (id) => {
    if (id) {
      try {
        await getOLBySaleOrder(id);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const fetchitemCategory = async () => {
    try {
      const { data } = await axiosInstance("itemCategory/getAllActive");
      setitemCategory(data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchUom = async () => {
    try {
      const { data } = await axiosInstance("uom/getAllActive");
      setUom(data);
      setValue(`array.0.uomName`, data.find(u => u.id === UOM_ID))
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    fetchUom();
    fetchitemCategory();
    fetchParts();
  }, []);
  console.log(getValues(), "pppp");

  return (
    <>
      {/* <Button variant="contained" color="primary" size="small" onClick={(e) => setOpen(true)}>
        Add Line Items
      </Button> */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog open={open} maxWidth="xl" fullWidth>
          <DialogTitle> Add Line Items</DialogTitle>

          <DialogContent dividers>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {/* <Controller
                name="supplyOrderId"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <AutoCompleteNew
                    data={supplyDetails}
                    minWidth={220}
                    required
                    labelText="Enter/ Search Supply Order"
                    getOptionLabel={(o) => o.orderNo}
                    onChange={(e, v) => {
                      onChange(v);
                      fetchOrderList(v?.id);
                      setSupplyOrder(v)
                    }}
                    value={value}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              /> */}

              <Button
                startIcon={<AddCircleIcon />}
                variant="contained"
                color="primary"
                obs={"form"}
                size="small"
                onClick={() => {
                  append({ ...defaultArray, uomName: uom.find(u => u.id == UOM_ID) });
                }}
              >
                Add Row
              </Button>
            </div>

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
                <TableHead>
                  <StyledTableRow>
                    {headCells.map((headCell) => (
                      <StyledTableCell key={headCell.label}>
                        {headCell.label} {headCell.required && <span style={{ color: "red" }}>*</span>}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {fields.map((input, index) => (
                    <StyledTableRow key={input.id}>


                      <StyledTableCell>
                        <Controller
                          name="fileNo"
                          control={control}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField
                              size="small"
                              placeholder="Order Master No."
                              {...props}
                              onChange={onChange}
                              value={value}
                              onInput={restrict.general}
                              inputProps={{ maxLength: 200 }}
                            // error={!!errors.fileNo}
                            // helperText={errors.fileNo?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.itemCategoryName`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
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
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.lineItemNo`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                            <TextField
                              placeholder="Line Item No"
                              {...props}
                              onChange={(e, v) => {
                                onChange(e);
                                //setProjectName(e.target.value);
                              }}
                              value={value}
                              size="small"
                              onInput={restrict.general}
                              inputProps={{ maxLength: 100 }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.partNo`}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              placeholder="Part No"
                              onChange={(event) => {
                                field.onChange(event);
                                const partSelected = parts.find((part) => part.id == event.target.value) || {};
                                setValue(`array.${index}.catPartNo`, partSelected.catPartNo || "");
                                setValue(`array.${index}.nsnPartNo`, partSelected.nsnPartNo || "");
                                setValue(`array.${index}.description`, partSelected.materialDescription || "");
                                setValue(`array.${index}.sectionCode`, partSelected.sectionCode || ""); //set sectionCode on part selection
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
                      </StyledTableCell>

                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.catPartNo`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                            <TextField
                              placeholder="CAT part no."
                              {...props}
                              disabled
                              onChange={onChange}
                              value={value}
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.nsnPartNo`}
                          control={control}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField placeholder="NSN part no." {...props} disabled value={value} size="small" />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.description`}
                          control={control}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField placeholder="Description" {...props} value={value} disabled size="small" />
                          )}
                        />
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        <Controller
                          name={`array.${index}.unitCost`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                            <TextField
                              placeholder="Unit Cost"
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              onInput={restrict.number}
                              inputProps={{ maxLength: 100 }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </StyledTableCell> */}
                      <StyledTableCell>
                        <Controller
                          name={`array.${index}.uomName`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                            <AutoCompleteNew
                              data={uom || []}
                              getOptionLabel={(o) => o?.unit}
                              required
                              {...props}
                              value={value}
                              onChange={(e, v) => {
                                onChange(v);
                                // setProjectName(e.target.value);
                              }}
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name="fileNo"
                          control={control}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField
                              size="small"
                              placeholder="Drawing No."
                              {...props}
                              onChange={onChange}
                              value={value}
                              onInput={restrict.general}
                              inputProps={{ maxLength: 200 }}
                            // error={!!errors.fileNo}
                            // helperText={errors.fileNo?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name="dd"
                          control={control}
                          // value={value}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField
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
                            // error={!!errors.dd}
                            // helperText={errors.dd?.message}
                            />
                          )}
                        />
                      </StyledTableCell>

                      <StyledTableCell style={{ maxWidth: 100 }}>
                        <Controller
                          name={`array.${index}.orderQty`}
                          control={control}
                          render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                            <TextField
                              placeholder="Order Qty"
                              size="small"
                              {...props}
                              onChange={onChange}
                              value={value}
                              onInput={restrict.number}
                              inputProps={{ maxLength: 100 }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 200 }}>
                        <Controller
                          name="inspectionAgencyIds"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <>

                                <Autocomplete
                                  fullWidth
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
                                      variant="outlined"
                                    // error={!!errors.inspectionAgencyIds}
                                    // helperText={errors.inspectionAgencyIds?.message}
                                    />
                                  )}
                                />
                              </>
                            );
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell style={{ width: 150 }}>
                        <Controller
                          name="consigneeIds"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <>
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
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          name="referenceNo"
                          control={control}
                          render={({ field: { onChange, value, ...props } }) => (
                            <TextField
                              size="small"
                              {...props}
                              full
                              onChange={onChange}
                              value={value}
                              onInput={restrict.general}
                              inputProps={{ maxLength: 200 }}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Controller
                          control={control}
                          name="isRegistrationNo"
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <CustomizedInputs
                              select
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
                      </StyledTableCell>
                      <StyledTableCell>
                      <Controller
                    name="lotNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        placeholder="Enter Lot No"
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value}
                        inputProps={{ maxLength: 200 }}
                        onInput={restrict.digit}
                      />
                    )}
                  />
                      </StyledTableCell>
                      <StyledTableCell>
                      <Controller
                    name="soType"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          {/* <InputLabel
                            classes={{
                              asterisk: classes.asterisk,
                              root: classes.root,
                            }}
                            style={{ fontSize: "0.875rem" }}
                            required={true}
                          >
                          </InputLabel> */}
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
                      </StyledTableCell>
                      <StyledTableCell>
                      <Controller
                    name="lotNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        placeholder="Order Type"
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value}
                        inputProps={{ maxLength: 200 }}
                        onInput={restrict.digit}
                      />
                    )}
                  />
                      </StyledTableCell>
                      <StyledTableCell>
                      <Controller
                    name="lotNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        placeholder="Order No."
                        size="small"
                        {...props}
                        onChange={onChange}
                        value={value}
                        inputProps={{ maxLength: 200 }}
                        onInput={restrict.digit}
                      />
                    )}
                  />
                      </StyledTableCell>
                      
                      <StyledTableCell>
                      <Controller
                    name="lotNo"
                    control={control}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        placeholder="Order Date"
                        type="date"
                        size="small"
                        {...props}
                        onChange={onChange}
                      onKeyDown={(e) => e.preventDefault()}
                        value={value}
                      />
                    )}
                  />
                      </StyledTableCell>
                      

                      <StyledTableCell style={{ width: "20px" }}>
                        {index !== 0 && (
                          <IconButton aria-label="delete" onClick={() => handleRemoveItem(index)}>
                            <DeleteOutline />
                          </IconButton>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        </Dialog>
      </form>
    </>
  );
};

export default LineItemCreate;
