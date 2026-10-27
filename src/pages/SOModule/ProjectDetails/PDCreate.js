import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { restrict } from "restrict";
import TextField from "components/TextField";
//material ui
import {
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "components/Button";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
//redux
import { useSelector } from "react-redux";
import { savePDImport, updatePD } from "pages/Services/URLs";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { DeleteOutline } from "@material-ui/icons";
import moment from "moment";
// const usersSchema = yup.object().shape({
//   projectName: yup.string().required("Required").typeError("Required"),
//   shipNo: yup.string().required("Required").typeError("Required"),
//   itemCategory: yup.string().required("Required").typeError("Required"),
//   saleOrderNo: yup.string().required("Required").typeError("Required"),
//   revNo: yup.string().required("Required").typeError("Required"),
//   wtIssueDate: yup.date().required("Required").typeError("Required"),
//   estDate: yup.date().required("Required").typeError("Required"),
// });

const headCells = [
  // {
  //   label: "Detailed Nomenclature",
  //   field: "projectName",
  //   align: "left",
  //   disableSorting: true,
  //   required: true,
  // },

  {
    label: "Warrant No.",
    field: "",
    align: "left",
    disableSorting: true,
    required: true,
  },
  {
    label: "Warrant Qty",
    field: "Warrant No",
    align: "left",
    disableSorting: true,
    required: true,
  },
    {
    label: "Wt. IssueDate",
    required: true,
  },
  // {
  //   label: "Remaining Qty",
  //   field: "",
  //   align: "left",
  //   disableSorting: true,
  //   required: true,
  // },
  {
    label: "Operation No.",
    field: "opNo",
    align: "left",
    disableSorting: true,
    required: true,
  },
  {
    label: "R.F/EST.No",
    field: "shipNo",
    align: "left",
    disableSorting: true,
    required: true,
  },
  {
    label: "R.F/EST Date",
    required: true,
  },

  // {
  //   label: "Work Order No.",
  //   field: "saleOrderNo",
  //   align: "left",
  //   disableSorting: true,
  //   required: true,
  // },
  {
    label: "Rev No.",
    required: true,
  },

];

const defaultArray = {

  shipNo: "",
  categoryName: "",
  qty: '',
  opNo: "",
  saleOrderNo: "",
  revNo: '',
  wtIssueDate: "",
  estDate: "",
};

const defaultValues = {
  array: [defaultArray],
};
// const schema = yup.object().shape({
//   array: yup.array().of(usersSchema).min(1),
// });
const rowSchema = yup.object().shape({
  categoryName: yup.string().required("Warrant No. is required field"),
  qty: yup.string().required("Warrant Qty is required field"),
  wtIssueDate: yup.string().required("Wt. Issue Date is required field"),
  opNo: yup.string().required("Operation No. is required field"),
  shipNo: yup.string().trim().required("R.F/EST.No is required field"),
  estDate: yup.string().required("R.F/EST Date is required field"),
  revNo: yup.string().required("Rev No. is required field"),
});
const schema = yup.object().shape({
  array: yup.array().of(rowSchema), 
});

const PDCreate = ({ selectedRow, fetchPD, edit, updateData, setEdit }) => {
  const loggedInUser = useSelector((state) => state?.loggedInUser);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "array",
  });

  const handleSave = async (data) => {
    // const isDuplicate = data.array.some((el, i) =>
    //   data.array.some((innerEl, j) => {
    //     if (i === j) {
    //       return false;
    //     } else {
    //       return innerEl.saleOrderNo === el.saleOrderNo;
    //     }
    //   })
    // );

    // if (isDuplicate) {
    //   toast.warn("Duplicate Sale Order Details is present in the form");
    //   return;
    // }
    console.log("test")
    const req = data?.array.map((p) => {
      return {
        shipNo: p.shipNo,
        categoryName: p.categoryName,
        qty: p.qty,
        opNo: p.opNo,
        // saleOrderNo: p.saleOrderNo,
        revNo: p.revNo,
        wtIssueDate: moment(p.wtIssueDate).format("YYYY-MM-DD"),
        estDate: moment(p.estDate).format("YYYY-MM-DD"),
      };
    });
    setLoading(true);
    try {
      await axiosInstanceTrans.post(savePDImport, {
        empId: loggedInUser?.empId,
        soLiId: selectedRow.id,
        dataDtos: req,
      });
      fetchPD(selectedRow?.id);
      reset()
      toast.success("Warrant Added Successfully");
    } catch (error) {
      toast.error(error.response.data);
      console.log("savePDImportDetails error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    const req = {
      id: updateData.id,
      shipName: data.array[0].shipNo,
      categoryName: data.array[0].categoryName,
      qty: data.array[0].qty,
      opNo: data.array[0].opNo,
      revNo: data.array[0].revNo,
      wtIssueDate: moment(data.array[0].wtIssueDate).format("YYYY-MM-DD"),
      estDate: moment(data.array[0].estDate).format("YYYY-MM-DD"),
    };
    setLoading(true);
    try {
      await axiosInstanceTrans.post(updatePD, req);
      fetchPD(selectedRow?.id);
      setEdit(false);
      reset(defaultValues)
      toast.success("Updated Successfully");
    } catch (error) {
      toast.error(error.response.data);
      console.log("update Project details error", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (updateData) {
      reset({
        array: [{
          categoryName: updateData?.categoryName || '',
          qty: updateData?.qty || '',
          opNo: updateData?.opNo || '',
          revNo: updateData?.revNo || '',
          estDate: updateData?.estDate || '',
          shipNo: updateData?.shipName || '',
          wtIssueDate: updateData?.wtIssueDate || '',
        }]
      });
    }
  }, [updateData, reset]);

  return (
    <div style={{ marginInline: "auto", maxWidth: 2000 }}>
      <form onSubmit={handleSubmit(handleSave)}>
        <TableContainer style={{ maxHeight: 200 }} component={Paper}>
          {loading && <LinearProgress />}
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {headCells.map((el, index) => (
                  <StyledTableCell key={index}>
                    {el.label} {el.required && <span style={{ color: "red" }}>*</span>}
                  </StyledTableCell>
                ))}
                <StyledTableCell>
                  <IconButton size="small" disabled={edit} title="Add more row" onClick={() => append(defaultArray)}>
                    <AddCircleIcon style={{  color: edit ? "rgba(0, 0, 0, 0.26)" : "white"  }} fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fields?.map((input, index) => (
                <StyledTableRow key={input.id}>
                  {/* <StyledTableCell>
                    <Controller
                      name={`array[${index}].projectName`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState:{error} }) => (
                        <TextField
                          variant="outlined"
                          placeholder="Detailed Nomenclature"
                          {...props}
                          onChange={onChange}
                          value={value}
                          size="small"
                          required
                          // onInput={restrict.somapping}
                          inputProps={{ maxLength: 100 }}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </StyledTableCell> */}

                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].categoryName`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          placeholder="Warrant No."
                          {...props}
                          onChange={onChange}
                          value={value}
                          size="small"
                          onInput={restrict.warrantNo}
                          inputProps={{ maxLength: 100 }}
                          error={!!errors.array?.[index]?.categoryName}
                          helperText={errors.array?.[index]?.categoryName?.message}
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].qty`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          placeholder="Warrant Qty"
                          {...props}
                          onChange={onChange}
                          value={value}
                          size="small"
                          // onInput={restrict.number}
                          onInput={restrict.digits}
                          inputProps={{ maxLength: 20 }}
                          error={!!errors.array?.[index]?.qty}
                          helperText={errors.array?.[index]?.qty?.message}
                        />
                      )}
                    />
                  </StyledTableCell>
 <StyledTableCell>
                    <Controller
                      name={`array[${index}].wtIssueDate`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          type="date"
                          size="small"
                          onKeyDown={(e) => e.preventDefault()}
                          {...props}
                          onChange={onChange}
                          value={value}
                          inputProps={{ max: moment(new Date()).format("YYYY-MM-DD") }}
                          error={!!errors.array?.[index]?.wtIssueDate}
                          helperText={errors.array?.[index]?.wtIssueDate?.message}
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].opNo`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          placeholder="Operation No."
                          {...props}
                          onChange={onChange}
                          value={value}
                          size="small"
                          onInput={restrict.number}
                          inputProps={{ maxLength: 100 }}
                          error={!!errors.array?.[index]?.opNo}
                          helperText={errors.array?.[index]?.opNo?.message}
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].shipNo`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          placeholder="R.F/EST.No."
                          {...props}
                          onChange={onChange}
                          value={value}
                          size="small"
                          // onInput={restrict.number}
                          onInput={restrict.digits}
                          inputProps={{ maxLength: 50 }}
                          error={!!errors.array?.[index]?.shipNo}
                          helperText={errors.array?.[index]?.shipNo?.message}
                        />
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].estDate`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          type="date"
                          size="small"
                          onKeyDown={(e) => e.preventDefault()}
                          {...props}
                          onChange={onChange}
                          value={value || ''}
                          inputProps={{ max: moment(new Date()).format("YYYY-MM-DD") }}
                          error={!!errors.array?.[index]?.estDate}
                          helperText={errors.array?.[index]?.estDate?.message}
                        />
                      )}
                    />
                  </StyledTableCell>
                 

                  {/* <StyledTableCell>
                    <Controller
                      name={`array[${index}].saleOrderNo`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState:{error} }) => (
                        <TextField
                          variant="outlined"
                          // className={classes.textArea}
                          placeholder="Work Order No."
                          size="small"
                          {...props}
                          onChange={onChange}
                          value={value}
                          required
                          // onInput={restrict.number}
                          inputProps={{ maxLength: 100 }}
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </StyledTableCell> */}

                  <StyledTableCell>
                    <Controller
                      name={`array[${index}].revNo`}
                      control={control}
                      render={({ field: { onChange, value, ...props }, fieldState: { error } }) => (
                        <TextField
                          variant="outlined"
                          // className={classes.textArea}
                          placeholder="Rev No."
                          size="small"
                          {...props}
                          onChange={onChange}
                          value={value}
                          required
                          onInput={restrict.digits}
                          inputProps={{ maxLength: 8 }}
                          error={!!errors.array?.[index]?.revNo}
                          helperText={errors.array?.[index]?.revNo?.message}
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    {index !== 0 && (
                      <IconButton title="Delete row" onClick={() => remove(index)} size="small">
                        <DeleteOutline color="error" fontSize="small" />
                      </IconButton>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: "center", marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} disabled={loading}>
            {loading && <CircularProgress size={24} color="primary" />}
            Submit
          </Button>
          {edit && (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: '16px' }}
              onClick={(e) => {
                reset(defaultValues);
              }}
            >
              Reset
            </Button>
          )} */}
          <>

            {edit ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(handleUpdate)}
                  disabled={loading || !isDirty} 
                >
                  {loading && <CircularProgress size={24} color="primary" />}
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: '16px' }}
                  onClick={() =>{
                    reset(defaultValues);
                    setEdit(false);
                  }
                }
                >
                  Reset
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(handleSave)}
                disabled={loading}
              >
                {loading && <CircularProgress size={24} color="primary" />}
                Submit
              </Button>
            )}
          </>
        </div>
      </form>
    </div>
  );
};

export default PDCreate;
