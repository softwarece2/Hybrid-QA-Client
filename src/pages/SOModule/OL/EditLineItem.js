/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";

import { Button, Checkbox, CircularProgress, Dialog, Grid, TextField, Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import axiosInstanceMaster from "pages/Services/AxiosInstance";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { teal } from "@material-ui/core/colors";
import { useSelector } from "react-redux";
import { getOLBySaleOrder } from "Redux/Actions/SupplyOrder/LIAction";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const schema = yup.object().shape({
  olNumber: "",
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

const defaultValues = {
  soLineItemNo: null,
  partNumber: "",
  offeredQty: "",
  issueLevel: "",
  priority: "",
  regNos: [],
};

export default function EditLineItem({ onClose, fetchRecords, selectedLineItem, soObj }) {
  const empId = useSelector((state) => state.loggedInUser?.empId);
  const [lineItems, setLineItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [parts, setParts] = useState([]);
  const [allRegsNo, setAllRegsNo] = useState([]);

  const { handleSubmit, reset, control, setValue, getValues } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  console.log(selectedLineItem, soObj, "data");

  useEffect(() => {
    axiosInstanceMaster("partNumber/getAll")
      .then(({ data }) => {
        setParts(data);
      })
      .catch(console.log);
  }, []);

  async function handleFinancialYear(olLiId) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const year = currentYear + "-" + nextYear.toString().slice(2, 4);

    try {
      const { data } = await axiosInstance(`/lineItemLots/register/soLiId/${olLiId}/groupBy/${year}`);
      const flatData = Object.entries(data).flatMap(([date, list]) => list.map((l) => ({ date, ...l })));
      setAllRegsNo(flatData);
      return flatData;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      if (soObj) {
        try {
          const data = await getOLBySaleOrder(soObj.saleOrderId);
          setLineItems(data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [soObj]);

  // async function getSelectedRegNos(id) {
  //   try {
  //     const { data } = await axiosInstance("lineItemLots/register/olLineItem/" + id);
  //     return data || [];
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    (async () => {
      const selectedRegNos = await handleFinancialYear(selectedLineItem.soLineItemId);

      reset({
        olNumber: soObj.olNumber,
        issueLevel: selectedLineItem.issueLevel,
        offeredQty: selectedLineItem.offeredQty,
        priority: selectedLineItem.priority,
        soLineItemNo: selectedLineItem.soLineItemNo,
        partNumber: selectedLineItem.partNumberId,
        regNos: selectedRegNos,
      });
    })();
  }, [reset, soObj, selectedLineItem, lineItems]);

  function onSubmit(data) {
    const req = {
      id: selectedLineItem.id,
      issueLevel: data.issueLevel,
      priority: data.priority,
      offeredQty: data.offeredQty,
      soLineItemNo: data.lineItemNo,
      partNumberId: data.partNumber,
      modifiedBy: empId,
      registerNumbers: {
        ids: data.regNos.map((el) => el.id),
        status: "in-process",
      },
    };
    setSaving(true);
    axiosInstance
      .post("olLineItem/editLineItem", req)
      .then(() => {
        toast.success("Updated Successfully");
        fetchRecords();
        onClose();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to update line item");
      })
      .finally(() => setSaving(false));
  }

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Edit Line Item/ Indent Sl No.</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                OL Number: <b>{getValues("olNumber")}</b>{" "}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography>
                Line Item: <b>{getValues("soLineItemNo")}</b>{" "}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="partNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    placeholder="Part No"
                    label="Part No"
                    onChange={(event) => {
                      field.onChange(event);
                    }}
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    select
                    SelectProps={{ native: true }}
                    required
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  >
                    <option value="">Select part number </option>
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
            <Grid item xs={6}>
              <Controller
                name="offeredQty"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    placeholder="Offered Qty"
                    label="Offered Qty"
                    {...props}
                    onChange={onChange}
                    variant="outlined"
                    value={value}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="issueLevel"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    placeholder="Issue Level"
                    label="Issue Level"
                    {...props}
                    onChange={onChange}
                    variant="outlined"
                    value={value}
                    size="small"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <TextField
                    fullWidth
                    // className={classes.textArea}
                    placeholder="Priority"
                    label="Priority"
                    size="small"
                    {...props}
                    onChange={onChange}
                    variant="outlined"
                    value={value}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="regNos"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    options={allRegsNo}
                    disableCloseOnSelect
                    onChange={(_, v) => onChange(v)}
                    value={value}
                    getOptionLabel={(option) => option.registerNo}
                    getOptionSelected={(o, v) => o.id === v.id}
                    groupBy={(o) => o.date}
                    renderOption={(option, { selected }) => {
                      if (option.data) {
                        // It's a group label
                        return (
                          <div
                            style={{
                              fontWeight: "bold",
                              margin: "5px 0",
                            }}
                          >
                            {option.date}
                          </div>
                        );
                      } else {
                        // It's an option within a group
                        return (
                          <>
                            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 2 }} checked={selected} color="primary" />
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
                        label="Registration Nos."
                        aria-describedby="my-helper-text"
                        error={error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
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
          Update
        </Button>
        <Button style={{ textTransform: "capitalize" }} size="small" variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
