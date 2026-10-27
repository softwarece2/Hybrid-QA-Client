import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@material-ui/core";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle, StyledTableRow } from "Utils";
import CustomizedInputs from "components/TextField";
import { AddOutlined, CheckBox, CheckBoxOutlineBlank, DeleteOutline } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { StyledTableCellFai } from "./Rounds";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const defaultFaiArray = {
  pageNo: "1",
  regNos: [],
};

const faiSchema = yup.object().shape({
  pageNo: yup.string(),
  remarks: yup.string(),
  regNos: yup.array().min(1, "Required"),
});
const schema = yup.object().shape({
  faiDetails: yup.array().of(faiSchema).min(1),
});

export default function AddRound({ onClose, ol, empId, refresh, rounds, selectedRound }) {
  const defaultValues = {
    name: "Round No. " + (rounds.length + 1),
    faiDetails: [defaultFaiArray],
  };
  //   console.log(selectedRound, "selectedRound");

  const { handleSubmit, control, getValues, reset } = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { append, fields, remove } = useFieldArray({ name: "faiDetails", control });

  const [regNos, setRegNos] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let url = `lineItemLots/register/olLineItem/fai/${ol.id}`
    if(selectedRound){
      url = `lineItemLots/register/olLineItem/${ol.id}`
    }
    if (ol) {
      axiosInstance(url)
        .then(({ data }) => {
          if (selectedRound) {
            const allPreviousRegistrations = selectedRound.faiDetails.flatMap((detail) => detail.regNos.map((r) => r.regNo));
            const filteredRegistrations = data.filter((r) => !allPreviousRegistrations.includes(r.id));
            setRegNos(filteredRegistrations);
          } else {
            setRegNos(data);
          }
        })
        .catch(console.error);
    }
  }, [ol, selectedRound]);

  useEffect(() => {
    if (selectedRound) {
      reset({ faiDetails: selectedRound.faiDetails });
    }
  }, [reset, selectedRound]);

  async function onSave(data) {
    setSaving(true);
    try {
      const req = {
        faiDetails: data.faiDetails
          .flatMap((fai) => fai.regNos.map((regNo) => ({ regNo: regNo.id, pageNo: fai.pageNo, id: 0, remarks: regNo.remarks })))
          .filter((r) => r.regNo),
        createdBy: empId,
        submittedBy: empId,
        name: data.name,
        olLineItemId: ol.id,
        id: selectedRound?.id,
      };
      console.log(req, data);
      let url = "faiDetails/submit";
      if (selectedRound) {
        url = "faiDetails/addRegNos";
      }
      await axiosInstanceAte.post(url, req);
      refresh();
      onClose();
      toast.success("RegNos. Added successfully");
    } catch (error) {
      toast.error("Failed to add, please try again");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle onClose={onClose}>{selectedRound ? "Add Registration Numbers" : "Add Round"}</DialogTitle>
      <DialogContent>
        <div style={{ maxWidth: 200, marginBottom: 8 }}>
          <Typography>{selectedRound ? "Edit : "+selectedRound.name : getValues("name")}</Typography>
        </div>
        <TableContainer style={{ maxHeight: 500, overflow: "auto" }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCellFai>Page No.</StyledTableCellFai>
                <StyledTableCellFai>Remarks</StyledTableCellFai>
                <StyledTableCellFai>Registration Nos.</StyledTableCellFai>
                <StyledTableCellFai>
                  <IconButton
                    onClick={() =>
                      append({
                        pageNo: fields.length + 1,
                        regNos: [],
                      })
                    }
                    title="Add Row"
                    size="small"
                    style={{ color: "white" }}
                  >
                    <AddOutlined fontSize="small" />
                  </IconButton>
                </StyledTableCellFai>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {fields.map((item, i) => {
                return (
                  <StyledTableRow key={item.id}>
                    <StyledTableCellFai>
                      <Controller
                        name={`faiDetails.${i}.pageNo`}
                        control={control}
                        render={({ fieldState: { error }, field }) => <CustomizedInputs {...field} variant="contained" disabled />}
                      />
                    </StyledTableCellFai>
                    <StyledTableCellFai>
                      <Controller
                        name={`faiDetails.${i}.remarks`}
                        control={control}
                        render={({ fieldState: { error }, field }) => (
                          <CustomizedInputs {...field} variant="contained" placeHolder="Enter Remarks" />
                        )}
                      />
                    </StyledTableCellFai>

                    <StyledTableCellFai>
                      <Controller
                        name={`faiDetails.${i}.regNos`}
                        control={control}
                        render={({ fieldState: { error }, field: { onChange, value } }) => {
                          if (selectedRound && i < selectedRound.faiDetails.length) {
                            return (
                              <TextField
                                fullWidth
                                multiline
                                size="small"
                                variant="outlined"
                                disabled
                                maxRows={2}
                                value={value.map((r) => r.regName).join(", ")}
                              />
                            );
                          }
                          return (
                            <Autocomplete
                              fullWidth
                              multiple
                              options={regNos}
                              value={value}
                              onChange={(_, v) => {
                                if (v.length > 10) {
                                  toast.info("You have reached the registration limit of 10.");
                                } else {
                                  const isSelected = getValues("faiDetails")
                                    .flatMap((fai) => fai.regNos.map((regNo) => ({ id: regNo.id, pageNo: fai.pageNo })))
                                    .find((e) => v.some((k) => k.id == e.id && getValues(`faiDetails.${i}.pageNo`) != e.pageNo));
                                  if (isSelected) {
                                    toast.info("Reg nos already being selected");
                                  } else {
                                    onChange(v);
                                  }
                                }
                              }}
                              getOptionSelected={(option, value) => option.id === value.id}
                              disableCloseOnSelect
                              getOptionLabel={(option) => option.registerNo}
                              renderTags={(v) => <span>Selected Reg nos: {v.length}</span>}
                              renderOption={(option, { selected }) => {
                                return (
                                  <>
                                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                                    {option.registerNo}
                                  </>
                                );
                              }}
                              renderInput={(params) => (
                                <CustomizedInputs
                                  {...params}
                                  size="small"
                                  variant="contained"
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />
                          );
                        }}
                      />
                    </StyledTableCellFai>
                    <StyledTableCellFai style={{ width: 50 }}>
                      {i !== 0 && (
                        <IconButton onClick={() => remove(i)} title="Remove Row" size="small">
                          <DeleteOutline color="error" fontSize="small" />
                        </IconButton>
                      )}
                    </StyledTableCellFai>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={saving}
          onClick={handleSubmit(onSave)}
          color="primary"
          variant="contained"
          size="small"
          style={{ textTransform: "capitalize" }}
        >
          {saving ? <CircularProgress size={22} /> : "Submit"}
        </Button>
        <Button onClick={onClose} color="secondary" variant="contained" size="small" style={{ textTransform: "capitalize" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
