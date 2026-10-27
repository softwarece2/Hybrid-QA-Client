import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import TextField from "components/TextField";
import { StyledTableCell, StyledTableRow } from "Utils";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { MASTER_URL } from "config";
import axiosInstance from "pages/Services/AxiosInstance";

const defaultValuesArray = {
  productId: "",
};

const defaultValues = {
  mapper: [defaultValuesArray],
  testId: "",
};

export default function AtpschemaMappingFormForm({
  refresh,
  selectedRow,
  setSelectedRow,
  edit,
  setEdit,
  onFormSubmit, 
}) {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [saving, setIsSaving] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [status, setStatus] = useState();
  

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(
      yup.object({
        mapper: yup.array().of(
          yup.object({
            productId: yup.string().required("Product is required"),
          })
        ),
        testId: yup.string().required("Test is required"),
      })
    ),
  });

  const { fields } = useFieldArray({ control, name: "mapper" });
  const watchProductId = watch("mapper.[0].productId");

  useEffect(() => {
    if (watchProductId) {
      axiosInstanceAte(`/spec/getTestsByProdId/${watchProductId}`)
        .then(({ data }) => {
          setDepartments(data);
        })
        .catch(console.error);
    } else {
      setDepartments([]);
    }
  }, [watchProductId]);

  useEffect(() => {
    axiosInstanceAte("spec/getAllProduct")
      .then(({ data }) => {
        setProducts(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axiosInstance(MASTER_URL + "/employee/getAll")
      .then(({ data }) => {
        setEmployee(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedRow) {
      reset({
        specId: selectedRow.id,
        testId: selectedRow.testId,
        status: selectedRow.status || "",
        mapper: [{ productId: selectedRow.prodId }],
      });
    }
  }, [selectedRow, reset]);

  const onSubmit = (data) => {
  
    onFormSubmit(data.mapper[0].productId, data.testId)
      .then(() => {
 
        toast.success("Submitted Successfully");
        reset(defaultValues); 
        setSelectedRow(null);
        setEdit(false);
        refresh();
      })
      .catch((error) => {
        console.error("Submission Error:", error);
        toast.error(error.response?.data?.message || "Submission failed");
      });
  };

  const onUpdate = (data) => {
    console.log(selectedRow, "selectedRow");
    console.log(data, "data");
    setIsSaving(true);

    const req = {
      specId: selectedRow.id,
      active: data.status,
      remark: data.remarks,
      createdById: data.employee,
    };

    axiosInstanceAte
      .post(`/spec/status`, req)
      .then(() => {
        reset(defaultValues);
        refresh();
        setSelectedRow(null);
        toast.success("Updated Successfully");
      })
      .catch((error) => {
        console.error("Error updating:", error);
        toast.error(error.response?.data?.message || "Update failed");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Paper style={{ maxWidth: "90%", marginInline: "auto", marginBottom: 16 }}>
      <Box style={{ backgroundColor: "#205375", color: "white", padding: 8 }}>
        <Typography style={{ fontSize: "0.875rem" }}>
          {!edit ? "ATE Schema" : "Edit ATE Schema"}
        </Typography>
      </Box>
      <form
        style={{ padding: 8 }}
        onSubmit={handleSubmit(edit ? onUpdate : onSubmit)}
      >
        <TableContainer style={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell
                  style={{
                    fontSize: 14,
                    backgroundColor: "#eaeaea",
                    color: "#205375",
                    fontWeight: 600,
                    paddingLeft: 12,
                  }}
                >
                  Product
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    fontSize: 14,
                    backgroundColor: "#eaeaea",
                    color: "#205375",
                    fontWeight: 600,
                    paddingLeft: 12,
                  }}
                >
                  Test
                </StyledTableCell>
                {edit && (
                  <StyledTableCell
                    style={{
                      fontSize: 14,
                      backgroundColor: "#eaeaea",
                      color: "#205375",
                      fontWeight: 600,
                      paddingLeft: 12,
                    }}
                  >
                    Status
                  </StyledTableCell>
                )}
                {edit && (
                  <StyledTableCell
                    style={{
                      fontSize: 14,
                      backgroundColor: "#eaeaea",
                      color: "#205375",
                      fontWeight: 600,
                      paddingLeft: 12,
                    }}
                  >
                    Remarks
                  </StyledTableCell>
                )}
                {edit && (
                  <StyledTableCell
                    style={{
                      fontSize: 14,
                      backgroundColor: "#eaeaea",
                      color: "#205375",
                      fontWeight: 600,
                      paddingLeft: 12,
                    }}
                  >
                    Employee Name
                  </StyledTableCell>
                )}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <StyledTableRow key={field.id}>
                  <StyledTableCell>
                    <Controller
                      name={`mapper.${index}.productId`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          select
                          SelectProps={{ native: true }}
                          required
                          error={!!error}
                          helperText={error?.message}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.prodName}
                            </option>
                          ))}
                        </TextField>
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Controller
                      name="testId"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          select
                          SelectProps={{ native: true }}
                          required
                          error={!!error}
                          helperText={error?.message}
                        >
                          <option value="">Select Test</option>
                          {departments.map((dept) => (
                            <option key={dept.testId} value={dept.testId}>
                              {dept.testName}
                            </option>
                          ))}
                        </TextField>
                      )}
                    />
                  </StyledTableCell>

                  {edit && (
                    <StyledTableCell>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <RadioGroup
                            aria-label="status"
                            name="status"
                            value={field.value}
                            onChange={(event) => {
                              field.onChange(event.target.value);
                            }}
                          row
                          >
                            <FormControlLabel
                              control={<Radio />}
                              label="Active"
                              value="true"
                                size="small"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              label="Inactive"
                              value="false"
                                size="small"
                            />
                          </RadioGroup>
                        )}
                      />
                    </StyledTableCell>
                  )}
                  {edit && (
                    <StyledTableCell>
                      <Controller
                        name="remark"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            placeholder="Enter Remarks"
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </StyledTableCell>
                  )}
                  {edit && (
                    <StyledTableCell>
                      <Controller
                        name="employee"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            select
                            SelectProps={{ native: true }}
                            required
                            error={!!error}
                            helperText={error?.message}
                          >
                            <option value="">Select Employee</option>
                            {employee.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.ename}
                              </option>
                            ))}
                          </TextField>
                        )}
                      />
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 8,
          }}
          align="center"
        >
          {selectedRow ? (
            <Button
              style={{ textTransform: "capitalize" }}
              variant="contained"
              size="small"
              color="secondary"
              disabled={!isDirty}
              onClick={handleSubmit(onUpdate)}
            >
              {saving && <CircularProgress size={24} />} Update
            </Button>
          ) : (
            <Button
              style={{ textTransform: "capitalize" }}
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              {saving && <CircularProgress size={24} />} Submit
            </Button>
          )}

          <Button
            style={{ textTransform: "capitalize" }}
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => {
              reset(defaultValues);
              setSelectedRow(null);
              setEdit(false);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </Paper>
  );
}
