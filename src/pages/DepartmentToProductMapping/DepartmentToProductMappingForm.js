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
} from "@material-ui/core";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import TextField from "../../components/TextField";
import axiosInstance from "pages/Services/AxiosInstance";
import { StyledTableCell, StyledTableRow } from "Utils";
  
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
  
const schema = yup.object().shape({
  departmentId: yup.string().required("Required"),
  mapper: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required("Required"),
      })
    )
    .min(1, "Please add minimum one row"),
});
  
const defaultValuesArray = {
  productId: "",
};
  
const defaultValues = {
  departmentId: "",
  mapper: [defaultValuesArray],
};
  
export default function DepartmentToProductMappingForm({
  refresh,
  selectedRow,
  setSelectedRow,
  edit,
  setEdit
}) {
  const [products, setProducts] = useState([]);
  const [saving, setIsSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { fields} = useFieldArray({ control, name: "mapper" });
  
  const onSubmit = (data) => {
    setIsSaving(false);
  
    const req = {
      departmentId: data.departmentId,
      productId: data.mapper[0].productId, // Extract productId from the mapper array
    };
  
    axiosInstanceAte
      .post("deptProdMap/save", req)
      .then(() => {
        toast.success("Saved successfully");
        refresh();
        reset(defaultValues);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error.response?.data || "Failed to submit, please try again"
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  
  const onUpdate = (data) => {
    let productId = 0;
    if (data.mapper?.length) {
      productId = data.mapper[0].productId;
    }
    const req = {
      id: selectedRow?.id,
      departmentId: data.departmentId,
      productId,
    };
  
    setIsSaving(true);
    axiosInstanceAte
      .post("deptProdMap/update", req)
      .then(() => {
        reset(defaultValues);
        refresh();
        setSelectedRow(null);
        toast.success("Updated Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Department already mapped to another Product");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  
  useEffect(() => {
    axiosInstance("department/getAllActiveDepts")
      .then(({ data }) => {
        setDepartments(data);
      })
      .catch(console.log);
    axiosInstanceAte("spec/getAllProduct")
      .then(({ data }) => {
        setProducts(data);
      })
      .catch(console.log);
  }, [reset]);
  
  useEffect(() => {
    if (selectedRow) {
      reset({
        departmentId: selectedRow.departmentId,
        mapper: [{productId: selectedRow.productId }],
      });
    }
  }, [selectedRow, reset]);
  
  return (
    <Paper style={{ maxWidth: 600, marginInline: "auto", marginBottom: 16 }}>
      <Box style={{ backgroundColor: "#205375", color: "white", padding: 8 }}>
        <Typography style={{ fontSize: "0.875rem" }}>
           {!edit ? "Department to Product mapping " : "Edit Department to Product mapping"}
        </Typography>
      </Box>
      <form style={{ padding: 8 }} onSubmit={handleSubmit(onSubmit)}>
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
                  Department
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
                 Product
                </StyledTableCell>
                {/* <StyledTableCell style={{ fontSize: 14, backgroundColor: "#eaeaea", color: "#205375", fontWeight:600 ,paddingLeft:12}} align="center">
                  <IconButton
                    onClick={() => append(defaultValuesArray)}
                    disabled={selectedRow}
                    size="small"
                    style={{ color: "black" }}
                    title="Add more row"
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </StyledTableCell> */}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <StyledTableRow key={field.id}>
                  <StyledTableCell>
                    <Controller
                      name="departmentId"
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <TextField
                            {...field}
                            select
                            SelectProps={{ native: true }}
                            required
                            error={!!error}
                            helperText={error?.message}
                          >
                            <option value="">Select Department </option>
                            {departments.map((dept) => {
                              return (
                                <option key={dept.id} value={dept.id}>
                                  {dept.departmentName}
                                </option>
                              );
                            })}
                          </TextField>
                        );
                      }}
                    />
                  </StyledTableCell>
  
                  <StyledTableCell>
                    <Controller
                      name={`mapper.${index}.productId`}
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <TextField
                            {...field}
                            select
                            SelectProps={{ native: true }}
                            required
                            error={!!error}
                            helperText={error?.message}
                          >
                            <option value="">Select Product </option>
                            {products.map((product) => {
                              return (
                                <option key={product.id} value={product.id}>
                                  {product.prodName}
                                </option>
                              );
                            })}
                          </TextField>
                        );
                      }}
                    />
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">
                    <IconButton disabled={selectedRow} size="small" title="Delete row" color="secondary" onClick={() => remove(index)}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </StyledTableCell> */}
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
  setEdit(false)
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </Paper>
  );
}                                                                         
