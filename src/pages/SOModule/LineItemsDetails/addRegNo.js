import { useEffect, useState } from "react";

import { Button, Chip, CircularProgress, Dialog, Divider, Grid, Paper, Typography } from "@material-ui/core";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { restrict } from "restrict";
import CustomizedInputs from "components/TextField";
import { CancelRounded } from "@material-ui/icons";

import { toast } from "react-toastify";
import RegNoTable from "./RegNoTable";
import { getRegNoById } from "Redux/Actions/SupplyOrder/LIAction";

const defaultValues = {
  prefix: "",
  start: "",
  end: "",
};

function generateRegNoList(prefix, start, end) {
  if (end - start > 50_000) {
    toast.error("Difference between two number should be less than 50,000");
    return;
  }
  const regNoList = [];
  let endLen = end.toString().length;
  for (let i = start; i <= end; i++) {
    let len = i.toString().length;
    let diff = endLen - len;

    regNoList.push(prefix + Array.from({ length: diff }, () => "0").join("") + i);
  }

  return regNoList;
}

const defaultValuesCustom = {
  customRegNo: "",
};

const schema = yup.object().shape({
  prefix: yup.string().required("Required"),
  start: yup.number().typeError("Required").required("Required").positive("Start No. must be greater than 0"),
  end: yup.number().typeError("Required").required("Required").moreThan(yup.ref("start"), "End No. must be more than Start No."),
});

const schemaCustom = yup.object().shape({
  customRegNo: yup.string().required("Required"),
});

export default function AddRegNo({ onClose, selectedLineItem, refetch }) {
  console.log(selectedLineItem, "selectedLineItem");
  const [saving, setSaving] = useState(false);
  const [regNos, setRegNos] = useState(new Set());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const { handleSubmit, control, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // async function getRegNo() {
  //   if (registrationNumberAdd.selectedYear) {
  //    dispatch({ type: REG_NO_LOADING_TRUE, payload:{id:registrationNumberAdd.selectedYear.id}});
  //     try {
  //       const { data } = await axiosInstance.get("lineItemLots/register/lineItemLot/" + registrationNumberAdd.selectedYear?.id);
  //        dispatch({ type: REG_NO_GET_DATA, payload: { data, id:registrationNumberAdd.selectedYear.id } });
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error.response?.data || "failed to add please try again");
  //     } finally {
  //       dispatch({ type: REG_NO_LOADING_FALSE, payload:{id:registrationNumberAdd.selectedYear.id}});

  //     }
  //   }
  // }

  const {
    handleSubmit: handleSubmitCustom,
    control: controlCustom,
    reset: resetCustom,
  } = useForm({
    defaultValues: defaultValuesCustom,
    resolver: yupResolver(schemaCustom),
  });

  async function onSubmit() {
    if (!regNos.size) {
      toast.info("Please add at least one registration.");
      return;
    }
    setSaving(true);
    try {
      const req = { soLineItemId: selectedLineItem.id, registerNoList: Array.from(regNos) };
      await axiosInstance.post("lineItemLots/register/save", req);
      getRegNoById();
      //TODO:
      //1.  Add refresh
      onClose();
      toast.success("Reg No. Added successfully");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data || "Failed to save, please try again");
    } finally {
      setSaving(false);
    }
  }

  function onRegNoGenerate(data) {
    console.log("data.start", data.start, start, end);
    setRegNos((ps) => {
      return new Set([...ps, ...generateRegNoList(data.prefix, start, end)]);
    });
    reset();
  }

  // function onCustomRegNoGenerate(data) {
  //   setRegNos((ps) => {
  //     return new Set([...ps, data.customRegNo]);
  //   });
  //   resetCustom();
  // }
  function onCustomRegNoGenerate(data) {
    if (regNos.has(data.customRegNo)) {
      toast.error("Registration Number already exists. Please enter a different Registration No.");
      return;
    }

    setRegNos((ps) => {
      return new Set([...ps, data.customRegNo]);
    });
    resetCustom();
  }

  function handleChipDelete(toDelete) {
    setRegNos((ps) => {
      const newSet = new Set(ps); // Create a copy of the set
      newSet.delete(toDelete); // Delete the element
      return newSet; // Return the *new* set
    });
  }


  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogTitle onClose={onClose}>Reg. Number (<b>LI No: {selectedLineItem?.lineItemNo}, WO No: {selectedLineItem?.saleOrderNo}, EP Code: {selectedLineItem?.partNo}, Total Qty: {selectedLineItem?.orderQty}</b>)</DialogTitle>
      <DialogContent>
        <Paper style={{padding:8, marginBottom:8}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <Controller
                name="prefix"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <CustomizedInputs
                    placeholder="Enter Prefix"
                    labelText="Prefix"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    size="small"
                    fullWidth
                     onInput={restrict.remarks}
                     inputProps = {{maxLength : 50}}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="start"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <CustomizedInputs
                    // type="number"
                    placeholder="Enter Starting Number"
                    labelText="Start No."
                    required
                    {...props}
                    onChange={(e) => {
                      console.log("ererer", e.target.value);
                      onChange(e.target.value);
                      setStart(e.target.value);
                    }}
                    value={value}
                    size="small"
                    fullWidth
                    onInput={restrict.digits}
                    inputProps={{ maxLength: 10 }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="end"
                control={control}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <CustomizedInputs
                    // type="number"
                    placeholder="Enter Ending Number"
                    labelText="End No."
                    {...props}
                    onChange={(e) => {
                      onChange(e.target.value);
                      setEnd(e.target.value);
                    }}
                    required
                    value={value}
                    size="small"
                    fullWidth
                    onInput={restrict.digits}
                    inputProps={{ maxLength: 10 }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={1}>
              <Button
                style={{ textTransform: "capitalize", marginTop: 12 }}
                fullWidth
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleSubmit(onRegNoGenerate)}
              >
                Generate
              </Button>
            </Grid>

            <Grid xs={1} style={{ marginTop: 12 }}>
              <Typography align="center">---- OR ----</Typography>
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="customRegNo"
                control={controlCustom}
                render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                  <CustomizedInputs
                    placeholder="Enter Custom Reg No."
                    labelText="Add Custom Reg No."
                    required
                    {...props}
                    onChange={onChange}
                    value={value}
                    size="small"
                    onInput={restrict.remarks}
                    inputProps = {{maxLength : 50}}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={1}>
              <Button
                fullWidth
                style={{ textTransform: "capitalize", marginTop: 12 }}
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleSubmitCustom(onCustomRegNoGenerate)}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center" style={{ color: "Highlight" }}>
                <b>Registration / Running Numbers</b>
              </Typography>
            </Grid>
            <Grid xs={12} container spacing={1} justifyContent="center">
              {Array.from(regNos).map((r) => (
                <Grid item xs={"auto"} key={r}>
                  <Chip
                    variant="outlined"
                    label={r}
                    color="primary"
                    deleteIcon={<CancelRounded style={{ color: "#ff7272" }} />}
                    deletable
                    onDelete={() => handleChipDelete(r)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </form>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBlock: 8 }}>
          <Button
            disabled={saving}
            style={{ textTransform: "capitalize" }}
            size="small"
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            {saving && <CircularProgress size={16} />}
            Submit
          </Button>
          {/* <Button size="small" style={{ textTransform: "capitalize" }} variant="contained" color="secondary" onClick={onClose}>
          Close
        </Button> */}
        </div>
        </Paper>
        <RegNoTable
          selectedLineItem={selectedLineItem}
        />
      </DialogContent>

    </Dialog>
  );
}
