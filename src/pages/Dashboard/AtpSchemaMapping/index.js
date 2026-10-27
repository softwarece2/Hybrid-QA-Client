import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  Grid,
  Box,
  Typography,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { toast } from "react-toastify";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { useForm, Controller } from "react-hook-form";
import { StyledTableCell, StyledTableRow } from "components/UseTable";
import axiosInstance from "pages/Services/AxiosInstance";
import { MASTER_URL } from "config";
import { useReactToPrint } from "react-to-print";
import NewspecAdd from "./NewspecAdd";
import AutoCompleteNew from "components/AutoCompleteNew";
import { Add, Minimize, Visibility, CloudDownload, History, WrapText } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import * as yup from "yup";
import * as File from 'xlsx'; 
import { yupResolver } from "@hookform/resolvers/yup";
import jsPDF from "jspdf";
import 'jspdf-autotable'; 

const defaultValues = {
  remark: "",
  employee: "",
};
export default function AtpSchemaMapping() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [saving, setIsSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [newspecAddDialogOpen, setNewspecAddDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
const[prodloadind,setProdloading]=useState(false);
  const Schema = yup.object().shape({
    remark: edit
      ? yup
        .string()
        .typeError("Enter Remark")
        .required("Enter Remark")
        .min(10, "Remark must be at least 10 Character")
        .max(50, "Remark max only 50 Character")
      : null,
    employee: edit
      ? yup.string().typeError("Select Employee").required("Select Employee")
      : null,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(Schema),
  });

  const watchProduct = watch("prodId");
  const watchTest = watch("testId");
  useEffect(() => {
    axiosInstance(MASTER_URL + "/employee/getAll")
      .then(({ data }) => {
        setEmployee(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstanceAte("spec/getAllProduct");
        setProducts(data);
        const defaultProduct = data.find((product) => product.id === 101);
        if (defaultProduct) {
          setValue("prodId", defaultProduct);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, [setValue]);
  useEffect(() => {
    const fetchTests = async () => {
      if (watchProduct) {
        try {
          const { data } = await axiosInstanceAte(
            `/spec/getTestsByProdId/${watchProduct.id}`
          );
          setDepartments(data);
          const defaultTest = data.find((test) => test.testId === 1001);
          if (defaultTest) {
            setValue("testId", defaultTest);
          }
        } catch (error) {
          console.error("Error fetching tests:", error);
          toast.error("Failed to fetch tests.");
        }
      } else {
        setDepartments([]);
      }
    };

    fetchTests();
  }, [watchProduct, setValue]);


  useEffect(() => {
    const fetchData = async () => {
      if (watchProduct && watchTest) {
        setLoading(true);
        try {
          const { data } = await axiosInstanceAte(
            `/spec/getSpecsByProdIdTestId/${watchProduct.id}/${watchTest.testId}`
          );
          const specData = data[0]?.specDtos || [];
          setRecords(specData.map((spec) => ({ ...spec, dirty: false })));
        } catch (error) {
          console.error("Error fetching specs:", error);
          toast.error("Failed to fetch specs.");
        } finally {
          setLoading(false);
        }
      } else {
        setRecords([]);
      }
    };

    fetchData();
  }, [watchProduct, watchTest, setValue]);

  const handleDownloadPdf = async () => {
    if (watchProduct) {
      setProdloading(true);
      try {
        const { data } = await axiosInstanceAte(
          `/spec/getSpecsByProdId/v1/${watchProduct.id}`
        );
  
        const allSpecData = (data && Array.isArray(data)) ?
          data.reduce((acc, obj) => {
            const currentSpecDtos = obj?.specDtos || [];
            return acc.concat(currentSpecDtos);
          }, []) : [];
  
        if (allSpecData.length > 0) {

        const data = allSpecData.map((row, index) => [
            index + 1,
            row.paramCode,
            row.mainType || "",
            row.paramType,
            row.specVal,
           row.tyClauseNo,
            row.status?"Active":"Inactive" ,
            row.min,
            row.max,
            row.uints,
            row.obsValue
        ]);

          const doc = new jsPDF({
            orientation: 'landscape' 
        });
          doc.autoTable({ 
            head: [['Sr. No', 'Param Code', 'Main Type', 'Parameter Type', 'Parameter Description', 'TY clause No.', 'Status', 'Min Value', 'Max Value', 'Unit', 'Result']],
            body:data,
         
        });

        const filename = `${watchProduct.prodName || 'specifications'}.pdf`;
          doc.save(filename); 
        } else {
          toast.info("No specifications found for this product.");
        }
  
      } catch (error) {
        console.error("Error fetching specs:", error);
        toast.error("Failed to fetch specs.");
      } finally {
        setProdloading(false);
      }
    } else {
      toast.warning("Please select a product.");
    }
  };
  const handleSubmitForm = async (data) => {
    console.log("Form submitted with data:", data);
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleStatusChange = (index) => (event) => {
    const newStatus = event.target.value === "true";
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      status: newStatus,
      dirty: true,
    };
    setRecords(updatedRecords);
  };
  const handleUpdate = async (data) => {
    setIsSaving(true);

    try {
      let payload = {};
      let updateData = records
        .filter((record) => record.dirty)
        .map((record) => ({
          specId: record.id,
          active: record.status,
        }));
      payload.createdById = data.employee;
      payload.remark = data.remark;
      payload.updateDtos = updateData;

      const response = await axiosInstanceAte.post(
        `/spec/status/update`,
        payload
      );

      toast.success("Updated Successfully");
      setEdit(false);
      setRecords(records.map((record) => ({ ...record, dirty: false })));
    } catch (error) {
      console.error("Error updating specs:", error);
      toast.error("Failed to update specs.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleNewSpecAdded = async () => {
    try {
      const { data } = await axiosInstanceAte(
        `/spec/getSpecsByProdIdTestId/${watchProduct?.id}/${watchTest?.testId}`
      );
      const specData = data[0]?.specDtos || [];
      setRecords(specData.map((spec) => ({ ...spec, dirty: false })));
    } catch (error) {
      console.error("Error fetching specs after add:", error);
      toast.error("Failed to fetch specs after adding new spec.");
    }
  };
  const handleNewspecAddDialogOpen = () => {
    setSelectedTest(watchTest);
    setSelectedProduct(watchProduct);
    setNewspecAddDialog(true);
  };

  const handleNewspecAddDialogClose = () => {
    setNewspecAddDialog(false);
  };

  const handleHistoryDialogOpen = () => {
    setSelectedTest(watchTest);
    setHistoryDialogOpen(true);
  };

  const handleHistoryDialogClose = () => {
    setHistoryDialogOpen(false);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    landscape: true,
  });

  const activeRecords = records.filter((record) => record.status === true);

  const handleActivePrint = useReactToPrint({
    content: () => componentRef.current.querySelector(".active-table"),
  });
  const isProductAndTestSelected = watchProduct && watchTest;

  const handleDownload = () => {
    const headers = [
        'Sr. No',
        'Param Code',
        'Main Type',
        'Parameter Type',
        'Parameter Description',
        'TY clause No.',
        'Status',
        'Min Value',
        'Max Value',
        'Unit',
        'Result'
    ];

    const data = records.map((row, index) => [
        index + 1,
        row.paramCode,
        row.mainType || "",
        row.paramType,
        row.specVal,
        row.tyClauseNo,
        row.status?"Active":"Inactive" ,
        row.min,
        row.max,
        row.uints,
        row.obsValue
    ]);
    data.unshift(headers);
    const wb = File.utils.book_new();
    const ws = File.utils.aoa_to_sheet(data); 
    File.utils.book_append_sheet(wb, ws, "myFile");
    File.writeFile(wb, "parameterprotocol.xlsx");
};
  return (
    <>
      <form onSubmit={handleSubmit(edit ? handleUpdate : handleSubmitForm)}>
        <Grid container spacing={2} style={{ marginBottom: "10px", display: 'flex', alignItems: 'center' }}>
          <Grid item xs={2}>
            <Controller
              name="prodId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AutoCompleteNew
                  data={products}
                  value={value}
                  required
                  labelText="Select Product"
                  getOptionLabel={(o) => o.prodName}
                  onChange={(e, v) => {
                    onChange(v);
                  }}
                  error={!!errors.prodId}
                  helperText={errors.prodId?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name="testId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AutoCompleteNew
                  data={departments}
                  value={value}
                  required
                  labelText="Select Test"
                  getOptionLabel={(o) => o.testName}
                  onChange={(e, v) => {
                    onChange(v);
                  }}
                  error={!!errors.testId}
                  helperText={errors.testId?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={8} > {/*  Adjust xs as needed for button width */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
              <Button
              style={{marginTop:"10px"}}
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleNewspecAddDialogOpen}
                disabled={!isProductAndTestSelected}
              >
                <Add />
                &nbsp;&nbsp;Add New Spec
              </Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                style={{ marginTop:"10px", marginLeft: "10px", height: "35px" }}
                size="small"
                disabled={!isProductAndTestSelected}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleHistoryDialogOpen}
                style={{ marginTop:"10px", marginLeft: "10px", height: "35px" }}
                size="small"
                disabled={!isProductAndTestSelected}
                startIcon={<History />}
              >
                View Update History
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                 onClick={handleDownload}
                style={{  marginTop:"10px",marginLeft: "10px" }}
                startIcon={<CloudDownload />}
              >
                Excel
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                 onClick={handleDownloadPdf}
                style={{  marginTop:"10px",marginLeft: "10px" }}
                startIcon={<CloudDownload />}
              >
                Download Protocol
              </Button>
              {isProductAndTestSelected && (
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={{ marginTop:"10px", marginLeft: "10px" }}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              )}
              {isProductAndTestSelected && (
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={{  marginTop:"10px",marginLeft: "10px" }}
                  onClick={handleActivePrint}
                >
                  Latest Active Print
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <TableContainer ref={componentRef}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1px",

              padding: "10px",
            }}
          >
            <Typography
              variant="subtitle2"
              style={{ color: "#b01e68", fontWeight: "bold" }}
            >
              Product Name :
            </Typography>
            <Controller
              name="id"
              control={control}
              render={() => (
                <Typography variant="subtitle2 ">
                  &nbsp;&nbsp;{watchProduct?.prodName || "N/A"}
                </Typography>
              )}
            />
            &nbsp;&nbsp;
            <Typography
              variant="subtitle2 "
              style={{ color: "#b01e68", fontWeight: "bold" }}
            >
              Test Name :
            </Typography>
            <Controller
              name="testId"
              control={control}
              render={() => (
                <Typography variant="subtitle2 ">
                  &nbsp;&nbsp;
                  {watchTest?.testName || "N/A"}
                </Typography>
              )}
            />

          </div>

          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell
                  style={{
                    paddingBlock: "6px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Sr. No
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "6px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Param Code
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "6px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Main Type
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "6px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Parameter Type
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Parameter Description
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  TY clause No.
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Status
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Min Value
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Max Value
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Unit
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Result
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {watchProduct && watchTest && (
              <TableBody>
                {records.map((row, index) => (
                  <TableRow key={row.id}>
                    <StyledTableCell style={{ width: "5%" }}>
                      {index + 1}
                    </StyledTableCell>

                    <StyledTableCell style={{ width: "5%" }}>
                      {row.paramCode}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "10%" }}>
                      {row.mainType || ""}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "10%" }}>
                      {row.paramType}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "30%" }}>
                      {row.specVal}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "10%" }}>
                      {row.tyClauseNo}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "20%" }}>
                      {edit ? (
                        <Controller
                          name={`status_${index}`}
                          control={control}
                          defaultValue={row.status ? "true" : "false"}
                          render={({ field }) => (
                            <RadioGroup
                              aria-label="status"
                              name={`status_${index}`}
                              value={row.status ? "true" : "false"}
                              onChange={handleStatusChange(index)}
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
                      ) : (
                        <>
                          {row.status ? (
                            <Chip
                              style={{
                                backgroundColor: "#d3ffcc",
                                color: "green",
                                borderRadius: "25px",
                                marginTop: "6px",
                                paddingInline: "10px",
                              }}
                              size="small"
                              label="Active"
                            />
                          ) : (
                            <Chip
                              style={{
                                backgroundColor: "#ffebee",
                                color: "red",
                                borderRadius: "25px",
                                marginTop: "6px",
                                paddingInline: "10px",
                              }}
                              size="small"
                              label="Inactive"
                            />
                          )}
                        </>
                      )}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "5%" }}>
                      {row.min}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "5%" }}>
                      {row.max}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "5%" }}>
                      {row.uints}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: "5%" }}>
                      {row.obsValue}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          <div style={{ display: "none" }}>
            <TableContainer className="active-table">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1px",

                  padding: "10px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  style={{ color: "#b01e68", fontWeight: "bold" }}
                >
                  Product Name :
                </Typography>
                <Controller
                  name="id"
                  control={control}
                  render={() => (
                    <Typography variant="subtitle2 ">
                      &nbsp;&nbsp;{watchProduct?.prodName || "N/A"}
                    </Typography>
                  )}
                />
                &nbsp;&nbsp;
                <Typography
                  variant="subtitle2 "
                  style={{ color: "#b01e68", fontWeight: "bold" }}
                >
                  Test Name :
                </Typography>
                <Controller
                  name="testId"
                  control={control}
                  render={() => (
                    <Typography variant="subtitle2 ">
                      &nbsp;&nbsp;
                      {watchTest?.testName || "N/A"}
                    </Typography>
                  )}
                />
              </div>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell
                      style={{
                        paddingBlock: "6px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Sr. No
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "6px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Param Code
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "6px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Main Type
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "6px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Parameter Type
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Parameter Description
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      TY clause No.
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Min Value
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Max Value
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Unit
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        paddingBlock: "0px",
                        background: "#205375",
                        color: "white",
                        fontWeight: "400",
                      }}
                    >
                      Result
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                {watchProduct && watchTest && (
                  <TableBody>
                    {activeRecords.map((row, index) => (
                      <TableRow key={row.id}>
                        <StyledTableCell style={{ width: "5%" }}>
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "5%" }}>
                          {row.paramCode}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "10%" }}>
                          {row.mainType || ""}
                        </StyledTableCell>

                        <StyledTableCell style={{ width: "10%" }}>
                          {row.paramType}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "30%" }}>
                          {row.specVal}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "10%" }}>
                          {row.tyClauseNo}
                        </StyledTableCell>

                        <StyledTableCell style={{ width: "5%" }}>
                          {row.min}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "5%" }}>
                          {row.max}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "5%" }}>
                          {row.uints}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "5%" }}>
                          {row.obsValue}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
        </TableContainer>

        <Grid
          container
          spacing={1}
          style={{ marginBottom: "10px", marginTop: "20px" }}
        >
          {edit && (
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
              <Typography
                variant="body1"
                style={{ color: "GrayText", fontSize: "0.9rem" }}
              >
                Enter Remarks<span style={{color:"red"}}>*</span>
              </Typography>
              <Controller
                name="remark"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    labelText="Enter Remark"
                    size="small"
                    placeholder="Enter Remarks"
                    error={!!error}
                    helperText={error?.message}
                    required
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            style={{ marginTop: "7px", marginLeft: "10px" }}
          >
            {edit && (
              <Controller
                name="employee"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const selectedEmployee = employee.find(
                    (emp) => emp.id === value
                  );
                  return (
                    <AutoCompleteNew
                      data={employee}
                      value={selectedEmployee}
                      required
                      labelText="Select Employee"
                      getOptionLabel={(o) => o.ename}
                      onChange={(e, v) => {
                        onChange(v?.id);
                      }}
                      error={!!errors.employee}
                      helperText={errors.employee?.message}
                    />
                  );
                }}
              />
            )}
          </Grid>
        </Grid>

        <div
          style={{
            display: "flex",
            gap: 5,
            justifyContent: "center",
            marginTop: 8,
          }}
          align="center"
        >
          {edit && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSubmit(handleUpdate)}
            >
              Update
            </Button>
          )}

        </div>
      </form>

      <Dialog
        open={historyDialogOpen}
        onClose={handleHistoryDialogClose}
        maxWidth="xl"
      >
        <DialogTitle
          style={{ textAlign: "center", color: "#205375", fontWeight: "bold" }}
        >
          Update Spec History
        </DialogTitle>
        <DialogContent>
          <SpecHistoryDetails
            watchTestId={selectedTest}
            setRecords={setRecords}
            records={records}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleHistoryDialogClose}
            style={{
              textAlign: "center",

              justifyContent: "space-around",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={newspecAddDialogOpen}
        onClose={handleNewspecAddDialogClose}
        maxWidth="lg"
      >
        <DialogContent>
          <NewspecAdd
            watchProduct={selectedProduct}
            watchTest={selectedTest}
            onSpecAdded={handleNewSpecAdded}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleNewspecAddDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const SpecHistoryDetails = ({ watchTestId }) => {
  const [loadingDependent, setLoadingDependent] = React.useState(false);
  const [historyDetails, setHistoryDetails] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingDependent(true);
      try {
        if (watchTestId) {
          const { data } = await axiosInstanceAte(
            `/spec/status/history?testId=${watchTestId?.testId}`
          );
          setHistoryDetails(data?.specStatusDtos || []);
        }
      } catch (error) {
        toast.error(
          "Failed to get details: " + (error.message || "Unknown error")
        );
      } finally {
        setLoadingDependent(false);
      }
    };

    fetchHistory();
  }, [watchTestId]);

  return (
    <div style={{ padding: "10px", overflow: "auto" }}>
      <div
        style={{
          background: "white",
          maxWidth: "100%",
          marginLeft: "45px",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Sr. No
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                    width: "400px",
                  }}
                >
                  Spec Value
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",

                    width: "100px",
                  }}
                >
                  Status
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                    width: "100px",
                  }}
                >
                  Remark
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Modified By
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    paddingBlock: "0px",
                    background: "#205375",
                    color: "white",
                    fontWeight: "400",
                  }}
                >
                  Date & Time
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {historyDetails?.map((data, index) => (
                <StyledTableRow key={data.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{data.specValue}</StyledTableCell>
                  <StyledTableCell>
                    {data.active ? (
                      <Chip
                        style={{
                          backgroundColor: "#d3ffcc",
                          color: "green",
                          borderRadius: "25px",

                          paddingInline: "10px",
                        }}
                        size="small"
                        label="Active"
                      />
                    ) : (
                      <Chip
                        style={{
                          backgroundColor: "#ffebee",
                          color: "red",
                          borderRadius: "25px",

                          paddingInline: "10px",
                        }}
                        size="small"
                        label="Inactive"
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{data.remark}</StyledTableCell>
                  <StyledTableCell>{data.createdByName}</StyledTableCell>
                  <StyledTableCell>{data.createdAt}</StyledTableCell>
                </StyledTableRow>
              ))}
              {historyDetails?.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} align="center">
                    No history records to display
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
