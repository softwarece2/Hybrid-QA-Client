/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
} from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceMaster from "pages/Services/AxiosInstance";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle, StyledTableCell, StyledTableRow } from "Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { AddCircle, Delete } from "@material-ui/icons";
import AutoCompleteNew from "components/AutoCompleteNew";
import { teal } from "@material-ui/core/colors";
import { useSelector } from "react-redux";
import { getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";

import {  getLineItemsBySslipId } from "Redux/Actions/Sslip/SslipAction";
import { restrict } from "restrict";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const usersSchema = yup.object().shape({
  soLineItemNo: yup.object().nullable().required("Required"),
  offeredQty: yup.string().required("Required").typeError("required"),
  issueLevel: yup.string().required("Required").typeError("required"),
  priority: yup.string().required("Required").typeError("required"),
  regNos: yup
    .array()
    .required("required")
    .min(yup.ref("offeredQty"), "select qty should same as offered qty")
    .max(yup.ref("offeredQty"), "select qty should same as offered qty"),
});

const schema = yup.object().shape({
  olNumber: "",
  array: yup.array().of(usersSchema).min(1),
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

const defaultArray = {
  soLineItemNo: null,
  partNumber: "",
  offeredQty: "",
  issueLevel: "",
  priority: "",
  regNos: [],
};

const defaultValues = {
  olNumber: "",
  array: [defaultArray],
};

const headCells = [
  "Line Item/ Indent Sl No.",
  "Material No./EP Code No.",
  "Qty Offered",
  "Issue Level",
  "Priority",
  "Registration No",
  "Action",
];

export default function AddLineItem({ onClose, fetchRecords, soObj }) {
  const classes = useStyles();
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const [lineItems, setLineItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [allRegsNo, setAllRegsNo] = useState({});

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "array",
  });

  const handleRemoveItem = (index) => {
    remove(index, 1);
  };

  useEffect(() => {
    (async () => {
      if (soObj) {
        try {
          const data = await getOLBySaleOrder(soObj.saleOrderId);
          const olLineItems = await getLineItemsBySslipId(soObj.id);
          const lineItemWithDisabledFlag = data.filter((soli) => !olLineItems.some((oli) => oli.soLineItemId === soli.id));
          setLineItems(lineItemWithDisabledFlag);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [soObj]);

  async function getRegNos(olLiId) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const year = currentYear + "-" + nextYear.toString().slice(2, 4);
    try {
      const { data } = await axiosInstance(`/lineItemLots/register/soLiId/${olLiId}/${year}`);
      setAllRegsNo((ps) => ({ ...ps, [olLiId]: data }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    reset({
      olNumber: soObj.olNumber,
      array: [defaultArray],
    });
  }, [reset, soObj]);

  function onSubmit(data) {
    const req = {
      id: soObj.id,
      employeeId: empId,
      saleOrderNo: soObj.saleOrderId,
      olLineItemDtos: data.array.map((li) => ({
        ...li,
        soLineItemNo: li.soLineItemNo.lineItemNo,
        registerNumbers: {
          ids: li.regNos.map((el) => el.id),
          status: "in-process",
        },
      })),
    };

    setSaving(true);
    axiosInstance
      .post("offerLetter/addLineItem", req)
      .then(({ data }) => {
        fetchRecords && fetchRecords();
        onClose();
        toast.success("Saved Successfully");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to save line item");
      })
      .finally(() => {
        setSaving(false);
      });
  }

  const handleListAdd = () => {
    append(defaultArray);
  };

  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogTitle onClose={onClose}>Add Line Item/ Indent Sl No.</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Enter OL Number"
            label="OL Number"
            value={getValues("olNumber")}
            size="small"
            disabled
          />
          <Button size="small" startIcon={<AddCircle fontSize="small" />} variant="contained" color="primary" onClick={handleListAdd}>
            Add Row
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer style={{ maxHeight: "600px" }}>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  {headCells.map((head) => (
                    <StyledTableCell key={head} style={{ fontSize: 13 }}>
                      {head}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {fields.map((id, index) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell style={{ minWidth: 200 }}>
                      <Controller
                        name={`array[${index}].soLineItemNo`}
                        control={control}
                        render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                          <AutoCompleteNew
                            data={lineItems}
                            getOptionLabel={(o) => o?.lineItemNo}
                            required
                            {...props}
                            value={value}
                            onChange={(e, v) => {
                              onChange(v);
                              setValue(`array[${index}].partNumber`, v?.partNumberName || "");
                              if (v) {
                                getRegNos(v.id);
                              }
                            }}
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ maxWidth: 100 }}>
                      <Controller
                        name={`array[${index}].partNumber`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            placeholder="Part No"
                            disabled
                            variant="outlined"
                            value={field.value}
                            required
                            size="small"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ maxWidth: 100 }}>
                      <Controller
                        name={`array[${index}].offeredQty`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            placeholder="Offered Qty"
                            {...props}
                            onChange={onChange}
                            variant="outlined"
                            value={value}
                            size="small"
                            error={!!errors.array?.[index]?.offeredQty}
                            helperText={errors.array?.[index]?.offeredQty?.message}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ maxWidth: 100 }}>
                      <Controller
                        name={`array[${index}].issueLevel`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            placeholder="Issue Level"
                            {...props}
                            onChange={onChange}
                            variant="outlined"
                            value={value}
                            size="small"
                            onInput={restrict.somapping}
                            error={!!errors.array?.[index]?.issueLevel}
                            helperText={errors.array?.[index]?.issueLevel?.message}
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ maxWidth: 100 }}>
                      <Controller
                        name={`array[${index}].priority`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            // className={classes.textArea}
                            placeholder="Priority"
                            size="small"
                            {...props}
                            onChange={onChange}
                            variant="outlined"
                            onInput={restrict.somapping}
                            value={value}
                            error={!!errors.array?.[index]?.priority}
                            helperText={errors.array?.[index]?.priority?.message}
                          />
                        )}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ minWidth: 200 }}>
                      <Controller
                        name={`array[${index}].regNos`}
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            multiple
                            options={allRegsNo[watch(`array[${index}].soLineItemNo`)?.id] || []}
                            disableCloseOnSelect
                            onChange={(_, v) => onChange(v)}
                            value={value}
                            getOptionLabel={(option) => option.registerNo}
                            getOptionSelected={(o, v) => o.id === v.id}
                            groupBy={(o) => o.date}
                            renderOption={(option, { selected }) => {
                              if (option.label) {
                                // It's a group label
                                return (
                                  <div
                                    style={{
                                      fontWeight: "bold",
                                      margin: "5px 0",
                                    }}
                                  >
                                    {option.label}
                                  </div>
                                );
                              } else {
                                // It's an option within a group
                                return (
                                  <>
                                    <Checkbox
                                      icon={icon}
                                      checkedIcon={checkedIcon}
                                      style={{ marginRight: 2 }}
                                      checked={selected}
                                      color="primary"
                                    />
                                    {option.registerNo}
                                  </>
                                );
                              }
                            }}
                            renderTags={(v) => <span>Selected Reg nos: {v.length}</span>}
                            renderInput={(params) => (
                              <TextField
                                variant="outlined"
                                {...params}
                                id="my-input"
                                fullWidth
                                size="small"
                                aria-describedby="my-helper-text"
                                error={error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: "20px" }}>
                      {index === 0 ? null : (
                        <IconButton aria-label="delete" onClick={() => handleRemoveItem(index)}>
                          <Delete className={classes.icon} />
                        </IconButton>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          style={{ textTransform: "capitalize" }}
          disabled={saving}
          type="submit"
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          {saving && <CircularProgress size="24px" />}
          Submit
        </Button>
        <Button style={{ textTransform: "capitalize" }} size="small" variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
