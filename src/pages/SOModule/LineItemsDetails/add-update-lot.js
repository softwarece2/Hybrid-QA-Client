/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";

import {
  Button,
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
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  StyledTableCell,
  StyledTableRow,
} from "Utils";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { AddCircle, Delete } from "@material-ui/icons";
import { restrict } from "restrict";
import { financialYears, lineItemlotsSave,lineItemlotsUpdate } from "pages/Services/URLs";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles} from "@material-ui/core/styles";
import LineItemLots from "./lineitem-lots";

const defaultArray = {
  offeredQty: "",
  financialYear: "",
  unitPrice: "",
};
const defaultValues = {
  lineItems: [defaultArray],
};

const usersSchema = yup.object().shape({
  financialYear: yup.string().nullable().required("Required"),
  offeredQty: yup
    .number()
    .required("Required")
    .typeError("Offered Qty is required")
    .min(1, "Minimum should be 1"),
  unitPrice: yup
    .number()
    .required("Required")
    .typeError("Unit Price is required")
    .min(1, "Minimum should be 1"),
});

const schema = yup.object().shape({
  lineItems: yup
    .array()
    .of(usersSchema)
    .min(1)
    .test( "unique-price-per-year", "For the same Financial Year, Unit Price must be different", (lineItems) => {    // Obs No. 114.5  Changes done by SANJAY M.P at 27.02.26  
        if (!lineItems) return true;     

        const seen = new Set();

        for (const item of lineItems) {
           // This compares the multiple yearwise financial year has same Unit Place
          if (item.financialYear && item.unitPrice) {
            const identifier = `${item.financialYear}-${item.unitPrice}`;

            if (seen.has(identifier)) {
              return false; 
            }
            seen.add(identifier);
          }
        }
        return true;
      }
    )
    ,
});

const headCells = ["Financial Year", "Quantity Offered", "Unit Price"];

const useStyles = makeStyles((theme) => ({}));


export default function AddUpdateLot({
  onClose,
  fetchRecords,
  selectedLineItem,
  isEditMode,
  formData,
}) {
  const classes = useStyles();

  const [saving, setSaving] = useState(false);
  const [financialYearsList, setFinancialYearsList] = useState([]);

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "lineItems",
  });

  const getFinancialYearListData = async () => {
    try {
      const { data } = await axiosInstance(financialYears);
      setFinancialYearsList(data);
    } catch (err) {
      console.log(err);
    }
  };

  async function onSubmit(formData) {
    setSaving(true);
    try {
      const req = {
        soLineItemId: selectedLineItem.id,
        totalQty: formData.lineItems.reduce(
          (acc, crr) => acc + crr.offeredQty,
          0
        ),
        lineItems: formData.lineItems.map((el) => ({
          ...el,
          financialYear: el.financialYear,
        })),
      };

      const url = isEditMode ? lineItemlotsUpdate : lineItemlotsSave;
      await axiosInstance.post(url, req);
      toast.success(`${isEditMode ? "Updated" : "Year-wise Added"} Successfully`);
      fetchRecords();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data||"Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    getFinancialYearListData();
  }, []);

  useEffect(() => {
    if (isEditMode && formData) {
      const values = {
        ...formData,
        financialYear: financialYearsList.find(
          (el) => el === formData?.financialYear
        ),
      };
      reset({
        lineItems: [values],
      });
    }
  }, [isEditMode, financialYearsList]);

  // Add this inside your AddUpdateLot component
  useEffect(() => {
    // Check if there is an error specifically on the lineItems array level
    if (errors.lineItems?.message) {
      toast.error(errors.lineItems.message);
    }
  }, [errors.lineItems]);

  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogTitle onClose={onClose}>
        {isEditMode ? "Edit  Financial Year" : "Add Financial Year"}
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <Typography>
            Line Item No. :{" "}
            <span style={{ fontWeight: "600" }}>
              {selectedLineItem.lineItemNo}
            </span>
          </Typography>
          <Typography>
            Material No. :{" "}
            <span style={{ fontWeight: "600" }}>{selectedLineItem.partNo}</span>
          </Typography>
          <Typography>
            Total Qty. :{" "}
            <span style={{ fontWeight: "600" }}>
              {selectedLineItem.orderQty}
            </span>
          </Typography>
          <Typography>
            Remaining Qty. :{" "}
            <span style={{ fontWeight: "600" }}>
              {selectedLineItem.remainingQty}
            </span>
          </Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer style={{ maxHeight: "600px" }}>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  {headCells.map((head) => (
                    <StyledTableCell key={head}> {head} <span style={{ fontSize: 14, color: "red" }}>
                *
                </span> </StyledTableCell>
                  ))}
                  <StyledTableCell>
                    <IconButton
                      onClick={() => {
                        append(defaultArray);
                      }}
                      size="small"
                    >
                      <AddCircle style={{ color: "white" }} fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {fields.map((id, index) => (
                  <StyledTableRow key={id}>
                    <StyledTableCell style={{ minWidth: 200 }}>
                      <Controller
                        name={`lineItems[${index}].financialYear`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <Autocomplete
                            size="small"
                            options={financialYearsList ?? []}
                            getOptionLabel={(o) => o}
                            required
                            {...props}
                            // fullWidth
                            value={value || null}
                            onChange={(e, v) => {
                              onChange(v);
                            }}
                            renderInput={(params) => (
                              <TextField
                                variant="standard"
                                {...params}
                                size="small"
                                placeholder={"Search financial year..."}
                                error={
                                  !!errors.lineItems?.[index]?.financialYear
                                }
                                helperText={
                                  errors.lineItems?.[index]?.financialYear
                                    ?.message
                                }
                              />
                            )}
                          />
                        )}
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Controller
                        name={`lineItems[${index}].offeredQty`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            placeholder="Enter offered quantity"
                            {...props}
                            onChange={onChange}
                            value={value}
                            size="small"
                            fullWidth
                            inputProps={{ maxLength: 200 }}
                            onInput={restrict.digit}
                            error={!!errors.lineItems?.[index]?.offeredQty}
                            helperText={
                              errors.lineItems?.[index]?.offeredQty?.message
                            }
                          />
                        )}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Controller
                        name={`lineItems[${index}].unitPrice`}
                        control={control}
                        render={({ field: { onChange, value, ...props } }) => (
                          <TextField
                            placeholder="Enter unit price"
                            size="small"
                            fullWidth
                            {...props}
                            onInput={restrict.number}
                            onChange={onChange}
                            value={value}
                            error={!!errors.lineItems?.[index]?.unitPrice}
                            helperText={
                              errors.lineItems?.[index]?.unitPrice?.message
                            }
                          />
                        )}
                      />
                    </StyledTableCell>

                    <StyledTableCell style={{ width: "20px" }}>
                      {index === 0 ? null : (
                        <IconButton
                          aria-label="delete"
                          onClick={() => remove(index)}
                          size="small"
                        >
                          <Delete color="error" fontSize="small" />
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
          disabled={saving || !isDirty }
          type="submit"
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          className={!isDirty ? classes.disabledButton : classes.button}

        >
          {saving && <CircularProgress size="24px" />}
          {isEditMode ? "Update" : "Submit"}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
      <LineItemLots selectedLineItem={selectedLineItem} />
    </Dialog>
  );
}
