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
import { SaveSubmissionSlip } from "pages/Services/URLs";
import { Autocomplete } from "@material-ui/lab";

 import SelectAllAutocomplete from "pages/SOModule/InStageQC/InStageSO/custom-autocomplete";
import { restrict } from "restrict";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const defaultValues = {
  olNumber: "",
  offeredDate: "",
  lineItems: [{ offeredQty: "", regNos: [] }],
};

//To be verified with pooja. It has been removed in june branch
const usersSchema = yup.object().shape({
  offeredQty: yup.string().required("Required").typeError("required"),
  regNos: yup
  .array()
  .required("required")
  .min(yup.ref("offeredQty"), "select qty should same as offered qty")
  .max(yup.ref("offeredQty"), "select qty should same as offered qty"),
});

const schema = yup.object().shape({
  olNumber: yup.string().required("Required").min(10, "Length should be 10"),
  offeredDate: yup.date().typeError("Required").required("Required"),
  registrationNo: yup.string(),
  lineItems: yup.array().when("registrationNo", (registrationNo, schema) => {
    // Note: registrationNo is passed as an array in newer Yup versions [val]
    const regNo = Array.isArray(registrationNo) ? registrationNo[0] : registrationNo;

    if (regNo == 3) {
      // If regNo is 3, we use a modified version of usersSchema
      return schema.of(
        yup.object().shape({
          offeredQty: yup.number().required("Required"),
          regNos: yup.array().notRequired()
        })
      ).nullable();
    } else {
      // If regNo is NOT 3, we enforce the math logic
      return schema.of(
        yup.object().shape({
          offeredQty: yup.number().required("Required"),
          regNos: yup.array()
            .required("required")
            .min(yup.ref("offeredQty"), "select qty should same as offered qty")
            .max(yup.ref("offeredQty"), "select qty should same as offered qty")
        })
      ).min(1);
    }
  }),
});

export default function CreatT({
  selectedLI: selectedSo,
  onClose,
  warrants,
  soObj,
}) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "lineItems",
  });

  console.log(errors,"errors");
  


  const onFormSubmit = async (data) => {
  setLoading(true);
  console.log(data, "warrant");
  
  try {
    const req = {
      warrantId: soObj.id,
      offerDate: moment(data.offeredDate).format("YYYY-MM-DD"),
      olNumber: data.olNumber,
      soLiId: warrants?.soLiId,
    subSlipLineItemDtos: [
  {
    ...(warrants?.registrationNo === 3 
      ? {  offeredQty: data.lineItems[0]?.offeredQty || 0,} 
      : { offeredQty: data?.lineItems[0]?.offeredQty || 0 }
    ),
    issueLevel: data.issueLavel, 
    priority: data.priority,
     
    ...(warrants?.registrationNo === 3
      ? {
          registerNumbers: {
    
            ids: warrants?.warrantDetailsDtos?.map((e) => e?.lineItemSerialNoId) || [],
          },
        }
      : {
          registerNumbers: {
            ids: data?.lineItems[0]?.regNos?.map(e=>e?.lineItemSerialNoId) || [],
          },
        }),
  },
],
    };
await axiosInstance.post(SaveSubmissionSlip, req);
    toast.success("Saved Successfully");
    onClose();
  } catch (error) {
    console.error(error);
    // Improved error message handling
    const errorMsg = error.response?.data?.message || error.response?.data || "An error occurred. Please try again later.";
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
    reset({ registrationNo: warrants.registrationNo });
  }, [reset, selectedSo, warrants]);

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
          <b>Create submissionSlip</b> <br />
          Selected Warrant Number: <b>{soObj?.categoryName}</b>
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
                    // onChange={onChange}
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
                     inputProps={{ 
          maxLength: 1000, 
          max: new Date().toISOString().split('T')[0] 
        }}
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
                      <StyledTableCell>{warrants.registrationNo !== 3?"Remaining Qty":""}</StyledTableCell>
                      {/* {warrants.registrationNo === 3? */}
 <StyledTableCell style={{ width: 120 }}>
                        Offered Qty <span style={{ color: "red" }}>*</span>
                      </StyledTableCell>
{/* :""} */}
                   <StyledTableCell style={{ width: 300 }}>
  {warrants.registrationNo !== 3 && (
    <>
      Registration No. <span style={{ color: "red" }}>*</span>
    </>
  )}
</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((rowData, index) => (
                      <TableRow>
                        <StyledTableCell>
                          {warrants?.soLineItemNo}
                        </StyledTableCell>
                        <StyledTableCell>
                          {warrants?.partNumber}
                        </StyledTableCell>
                        <StyledTableCell>
                          {warrants?.materialDescription}
                        </StyledTableCell>
                        <StyledTableCell>
                          {warrants.registrationNo !== 3?warrants?.remQuantity : ""}
                        </StyledTableCell>
{warrants.registrationNo !== 3 ? (
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
                                onInput={restrict.digit}
                              />
                            )}
                          />
                        </StyledTableCell>
): <StyledTableCell>
                          {warrants?.offeredQty}
                        </StyledTableCell>}
{warrants.registrationNo !== 3 ? (
                        <StyledTableCell>
                        <Controller
                         name={`lineItems[${index}].regNos`}
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                            <SelectAllAutocomplete
                              multiple
                              initialOptions={warrants?.warrantDetailsDtos || []}
                              disableCloseOnSelect
                              value={value}
                              required
                              onChange={(v) => {
                                onChange(v);
                              }}
                            />
                            {error && <FormHelperText error={error}>{error?.message}</FormHelperText>}
                          </>
                          
                          )}
                        />
                      </StyledTableCell>
):   <StyledTableCell>
                        <StyledTableCell>
  {warrants.registrationNo!==3?warrants?.warrantDetailsDtos?.[0]?.lineItemSerialNo:"N/A"}
</StyledTableCell>
                        </StyledTableCell>}
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
          disabled={loading}
          onClick={handleSubmit(onFormSubmit)}
         
        >
          {loading && <CircularProgress size={24} color="default" />}
          Submit
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
