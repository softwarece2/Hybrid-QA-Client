import {
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import TextField from "../../components/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import moment from "moment";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { DialogTitle } from "Utils";
import { SaveSubmissionSlip, UpdateSubmissionSlip } from "pages/Services/URLs";
import { Autocomplete } from "@material-ui/lab";

//import SelectAllAutocomplete from "pages/SOModule/InStageQC/InStageSO/custom-autocomplete";
import SelectAllUpdateAutocomplete from "pages/SOModule/InStageQC/InStageSO/update-autocomplete";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultValues = {
  olNumber: "",
  offeredDate: "",
  lineItems: [{ offeredQty: "", regNos: [] }],
};

const usersSchema = yup.object().shape({
  offeredQty: yup.string().required("Required").typeError("required"),
  regNos: yup
    .array()
    .required("required")
    .min(yup.ref("offeredQty"), "select qty should same as offered qty")
    .max(yup.ref("offeredQty"), "select qty should same as offered qty"),
});

const schema = yup.object().shape({
  olNumber: yup.string().required("Required").min(10,"Min Length should be 10"),
  offeredDate: yup.date().typeError("Required").required("Required"),
  lineItems: yup.array().of(usersSchema).min(1),
});


export default function EditT({
  selectedLI: selectedSo,
  onClose,
  warrants,
  soObj,
  sSlipDet,
  getOlData
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset,getValues, formState: { errors,isDirty } } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "lineItems",
  });



  const onFormSubmit = async (data) => {
    setLoading(true);
     try {
      const req = {
        id: soObj.id,
        offerDate: moment(data.offeredDate).format("YYYY-MM-DD"),
        olNumber: data.olNumber,
        soLiId: warrants?.soLiId,
        warrantId: soObj?.warrantId,
        subSlipLineItemDtos: [{
          offeredQty: data?.lineItems[0]?.offeredQty,
          issueLevel: data.issueLavel,
          priority: data.priority,
          registerNumbers: {
          
            ids: data?.lineItems[0]?.regNos?.map(e => e?.lineItemSerialId) 
          }
        }],
      };

      await axiosInstance.post(UpdateSubmissionSlip, req);
      toast.success("Updated Successfully");
      onClose();
      getOlData();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data || "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const selectedRegs = sSlipDet.allRegNos?.filter(r=>  sSlipDet.regNos.some(sr=> sr.lineItemSerialId === r.lineItemSerialId)) || []
   reset({
      olNumber: sSlipDet.olNumber,

      offeredDate: sSlipDet.offerDate
        ? moment(sSlipDet.offerDate).format("YYYY-MM-DD")
        : "",

      lineItems: [
        {
          offeredQty: sSlipDet.offeredQty || 0,
          regNos:  selectedRegs,

        }
      ],

    });
    setSelectedOptions(selectedRegs)

  }, [reset, selectedSo, sSlipDet]);

  // useEffect(() => {


  // }, [reset, sSlipDet,selectedSo]);

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>

        <Typography style={{ alignItems: "left" }}>
          <b>Edit submissionSlip</b>  <br/>Selected SubmissionSlip Number: <b>{sSlipDet?.olNumber}</b>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Controller
                name="olNumber"
                control={control}
                render={({
                  field: { onChange, value, ...props },
                  fieldState: { error },
                }) => (
                  <TextField
                    labelText="Submission Slip No."
                    size="small"
                    {...props}
                    onChange={(e) => {
                      const upperValue = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      onChange(upperValue);
                    }}
                    value={value}
                    required
                    inputProps={{ maxLength: 10 }}
                    error={errors.olNumber}
                    helperText={errors.olNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Controller
                name="offeredDate"
                control={control}
                render={({
                  field: { onChange, value, ...props },
                  fieldState: { error },
                }) => (
                  <TextField
                    labelText="Offered Date"
                    type="date"
                    onKeyDown={(e) => e.preventDefault()}
                    size="small"
                    {...props}
                    onChange={onChange}
                    value={value}
                    required
                    inputProps={{ maxLength: 1000 }}
                    error={errors.offeredDate}
                    helperText={errors.offeredDate?.message}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12}>
              <TableContainer
                style={{ maxHeight: "300px", paddingTop: "10px" }}
              >
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                  stickyHeader
                >
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        Line Item/ Indent Sl No.
                      </StyledTableCell>
                      <StyledTableCell>
                        Material No./EP Code No.
                      </StyledTableCell>
                      <StyledTableCell>Material Description</StyledTableCell>
                      <StyledTableCell>Remaining Qty</StyledTableCell>
                      <StyledTableCell style={{ width: 120 }}>
                        Offered Qty <span style={{ color: "red" }}>*</span>
                      </StyledTableCell>

                      <StyledTableCell style={{ width: 300 }}>
                        Registration No.
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((rowData, index) => (
                      <TableRow>
                        <StyledTableCell>
                          {warrants?.soLineItemNo}
                        </StyledTableCell>
                        <StyledTableCell>{warrants?.partNumber}</StyledTableCell>
                        <StyledTableCell>
                          {warrants?.materialDescription}
                        </StyledTableCell>
                        <StyledTableCell>
                          {warrants?.remQuantity || " "}
                        </StyledTableCell>

                        <StyledTableCell>
                          <Controller
                            name={`lineItems[${index}].offeredQty`}
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <TextField
                                style={{ maxWidth: 120 }}
                                size="small"
                                fullWidth
                                value={value}
                                onChange={onChange}
                                error={error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                         
                          <Controller
                            name={`lineItems[${index}].regNos`}
                            control={control}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <>
                                <SelectAllUpdateAutocomplete
                                  multiple
                                  initialOptions={sSlipDet?.allRegNos || []}
                                  disableCloseOnSelect
                                  value={value}
                                  selectedOptions={selectedOptions}
                                  setSelectedOptions={setSelectedOptions}
                                  onChange={(v) => {
                                    onChange(v);
                                  }}
                                />
                                {error && <FormHelperText error>{error?.message}</FormHelperText>}
                              </>
                            )}
                          />
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <br />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
        
          onClick={handleSubmit(onFormSubmit)}
          disabled={!isDirty || loading}
        >
          {loading && <CircularProgress size={24} color="default" />}
          Update
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
