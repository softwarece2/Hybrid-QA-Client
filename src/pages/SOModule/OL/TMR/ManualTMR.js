/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useRef, useState } from "react";
import { Button, CircularProgress, Dialog, IconButton, LinearProgress, makeStyles, TextField } from "@material-ui/core";

import ExcelJS from "exceljs";
import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircle, Delete, Visibility } from "@material-ui/icons";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { DialogActions, DialogContent } from "Utils";
import { useEffect } from "react";
import { saveAs } from "file-saver";

import PublishIcon from "@material-ui/icons/Publish";
import GetAppIcon from "@material-ui/icons/GetApp";
import TableComponent from "components/table";
import ActionButton from "components/ActionButton";
import SampleWiseDetail from "./SampleWiseDetail";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { USER_ROLE_ID } from "Globals.js";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  leftRoot: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    minWidth: 120,
    fontSize: 12,
    padding: 5,
  },
  rightRoot: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    minWidth: 120,
    fontSize: 12,
    padding: 5,
  },
  value: {
    fontSize: "0.875rem",
  },
  toggleSelection: {
    color: "#363636",
    textTransform: "unset",
    fontSize: "0.875rem",
    "&.Mui-selected": {
      color: "black",
      fontWeight: 600,
      backgroundColor: "#B1E9AF",
    },
  },
}));
//for zen technology
const defaultParameter = [
  { param: "Length", min: "70", max: "100", observed: "", cqaeRemarks: "" },
  { param: "Width", min: "28", max: "48", observed: "", cqaeRemarks: "" },
  { param: "Height", min: "25.2", max: "45.2", observed: "", cqaeRemarks: "" },
  { param: "Pitch", min: "29.9", max: "31.1", observed: "", cqaeRemarks: "" },
  {
    param: "Diameter",
    min: "18.95",
    max: "19.05",
    observed: "",
    cqaeRemarks: "",
  },
];
const createExcelFromJSON = async (data) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Add column headers
  const columns = Object.keys(data[0]);
  worksheet.addRow(columns);

  // Add data rows
  data.forEach((item) => {
    const rowValues = columns.map((col) => item[col]);
    worksheet.addRow(rowValues);
  });

  // Write the workbook to a file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "output.xlsx");
  console.log("Excel file created successfully!");
};

const paramSchema = yup.object().shape({
  param: yup.string().required("Required"),
  min: yup
    .number()
    .typeError("invalid")
    .required("Required")
    .test("is-less-than-max", "Min must be less than Max", function (value) {
      const { max } = this.parent;
      return !max || parseFloat(value) <= parseFloat(max);
    }),
  max: yup
    .number()
    .typeError("invalid")
    .required("Required")
    .test("is-greater-than-min", "Max must be greater than Min", function (value) {
      const { min } = this.parent;
      return !min || parseFloat(value) >= parseFloat(min);
    }),
  observed: yup.number().typeError("invalid").required("Required"),
  cqaeRemarks: yup.string(),
  unit: yup.string().required("Required"),
  selectedDatetime: yup
    .date()
    .typeError("Invalid")
    .required("Required")
    .min(new Date("2025"), "Invalid Date")
    .test("is-less-than-max", "Must be <= current date time ", function (value) {
      return new Date(value) <= new Date();
    })
    .nullable(),
});

const schema = yup.object().shape({
  parameter: yup.array().of(paramSchema).min(1),
});

const mappedRole = {
  1: "FIRM",
  2: "INSPECTOR",
  3: "CROSS_CHECK",
  4: "SURPRISE_CHECK",
};

export default function ManualTMR({ selectedUploadRow, onClose, rowData, olNumber }) {
  const classes = useStyles();
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const loggedInUserRoleId = loggedInUser.roleId;
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewSampleData, setOpenViewSampleData] = useState(false);
  const [flag, setFlag] = useState(1);
  const fileInputRef = useRef();
  const defaultArray = {
    param: "",
    min: "",
    max: "",
    observed: "",
    cqaeRemarks: "",
    selectedDatetime: moment(new Date()).format("YYYY-MM-DD HH:mm"),
    unit: "",
  };
  const defaultValues = { parameter: [defaultArray] };

  const { handleSubmit, control, watch, reset, getValues, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parameter",
  });

  async function onSave(formData) {
    console.log(formData);
    // setIsSaving(true);

    const req = formData.parameter.map((el) => ({
      parameter: el.param,
      unit: el.unit,
      expectedMin: el.min,
      expectedMax: el.max,
      result: el.observed,
      createdBy: mappedRole[flag],
      remarks: el.cqaeRemarks,
      olLineItemId: rowData.id,
      appTestId: selectedUploadRow.id,
      selectedDatetime: el.selectedDatetime,
    }));
    // for all remaining tmr save
    let url = "tmrResult/save";
    // for zen hyderabad applicableTestId 18
    if (selectedUploadRow.applicableTestId === 18) {
      url = "dimensionTest/save";
    }
    axiosInstance
      .post(url, req)
      .then(() => {
        toast.success("Saved successfully");
        if (selectedUploadRow.applicableTestId === 18) {
          setValue("parameter", defaultParameter);
        } else {
          reset({ parameter: [defaultArray] });
        }
        getRecords();
      })
      .catch(() => {
        toast.error("Failed to save");
      })
      .finally(() => setIsSaving(false));
  }

  function getRecords(params) {
    let url = `tmrResult/getByCreatedBy/${mappedRole[flag]}/`;
    if (selectedUploadRow.applicableTestId === 18) {
      url = "dimensionTest/getSequences/";
    }
    setLoading(true);
    axiosInstance(url + rowData.id)
      .then(({ data }) => {
        setRecords(data);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getRecords();
  }, [flag]);

  function handleExport() {
    const formData = getValues("parameter").map((item) => ({
      param: item.param,
      unit: item.unit,
      min: item.min,
      max: item.max,
      observed: item.observed,
      cqaeRemarks: item.cqaeRemarks,
      selectedDatetime: item.selectedDatetime,
    }));
    createExcelFromJSON(formData);
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);

      const worksheet = workbook.getWorksheet(1);
      const sheetData = [];

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex !== 1) {
          // Skip header row
          const rowData = {};
          const rowHeader = ["param", "unit", "min", "max", "observed", "cqaeRemarks", "selectedDatetime"];
          row.eachCell((cell, cellIndex) => {
            rowData[rowHeader[cellIndex - 1]] = cell.value;
          });
          sheetData.push(rowData);
        }
      });
      console.log(sheetData, "excel data");
      reset({ parameter: sheetData });
      fileInputRef.current.value = "";
    };

    reader.readAsArrayBuffer(file);
  }
  const handleDisableForm = () => {
    if (!loggedInUserRoleId || !flag) {
      return true;
    }
    if (loggedInUserRoleId === USER_ROLE_ID.ROLE_FIRM_ADMIN && flag == "1") {
      return false;
    }
    if (loggedInUserRoleId === USER_ROLE_ID.ROLE_FIRM_ADMIN && flag !== "1") {
      return true;
    }

    if (loggedInUserRoleId !== USER_ROLE_ID.ROLE_FIRM_ADMIN && flag == "1") {
      return true;
    }
  };
  useEffect(() => {
    if (selectedUploadRow.applicableTestId === 18) {
      setValue("parameter", defaultParameter);
    }
  }, [selectedUploadRow]);
  // ----------------------------- MAIN start CONTENT -------------------------------
  const renderTabs = (
    <ToggleButtonGroup
      value={flag}
      exclusive
      onChange={(_, newvalue) => {
        if (newvalue !== null) {
          setFlag(newvalue);
        }
      }}
      style={{ marginBottom: "12px", justifyContent: "center" }}
      size="small"
    >
      <ToggleButton
        classes={{
          root: classes.leftRoot,
        }}
        color="primary"
        value={1}
        className={classes.toggleSelection}
      >
        Firm
      </ToggleButton>
      <ToggleButton
        className={classes.toggleSelection}
        classes={{
          // selected: classes.toggleSelection,
          root: classes.rightRoot,
        }}
        color="primary"
        value={2}
      >
        Inspector
      </ToggleButton>
      <ToggleButton
        className={classes.toggleSelection}
        classes={{
          // selected: classes.toggleSelection,
          root: classes.rightRoot,
        }}
        color="primary"
        value={3}
      >
        Tier II (Cross Check)
      </ToggleButton>
      <ToggleButton
        className={classes.toggleSelection}
        classes={{
          // selected: classes.toggleSelection,
          root: classes.rightRoot,
        }}
        color="primary"
        value={4}
      >
        Tier III
      </ToggleButton>
    </ToggleButtonGroup>
  );
  const mainContent = (
    <DialogContent style={{ display: "flex", flexDirection: "column" }}>
      {renderTabs}
      {!handleDisableForm() && (
        <>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <input ref={fileInputRef} type="file" hidden onChange={handleImport} />
            <Button
              onClick={() => fileInputRef.current.click()}
              variant="outlined"
              size="small"
              color="secondary"
              startIcon={<GetAppIcon />}
            >
              Import Template
            </Button>
            <Button onClick={handleExport} variant="outlined" size="small" color="secondary" startIcon={<PublishIcon />}>
              Export Template
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSave)}>
            <table
              style={{
                border: "1px solid",
                borderCollapse: "collapse",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    S.No.
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Parameter
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Unit
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Excepted O/P
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Observed O/P
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Test Result
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Date Time
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Remarks
                  </td>

                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    <IconButton
                      size="small"
                      variant="contained"
                      // color="primary"

                      onClick={() => {
                        append(defaultArray);
                      }}
                    >
                      <AddCircle style={{ color: "white" }} />
                    </IconButton>
                  </td>
                </tr>
              </thead>
              <tbody>
                {fields.map((row, index) => {
                  return (
                    <tr key={row.id}>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}.
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <Controller
                          control={control}
                          name={`parameter[${index}].param`}
                          render={({ field: { value, onChange }, fieldState }) => (
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              placeholder="Add Parameter"
                              value={value}
                              onChange={onChange}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <Controller
                          control={control}
                          name={`parameter[${index}].unit`}
                          render={({ field: { value, onChange }, fieldState }) => (
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              placeholder="unit"
                              value={value}
                              onChange={onChange}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <div style={{ display: "flex", gap: 4 }}>
                          <Controller
                            control={control}
                            name={`parameter[${index}].min`}
                            render={({ field: { value, onChange }, fieldState }) => (
                              <TextField
                                type="number"
                                value={value}
                                variant="outlined"
                                size="small"
                                placeholder="min"
                                // onInput={restrict.digit}
                                onChange={onChange}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                          <Controller
                            control={control}
                            name={`parameter[${index}].max`}
                            render={({ field: { value, onChange }, fieldState }) => (
                              <TextField
                                type="number"
                                value={value}
                                variant="outlined"
                                size="small"
                                // onInput={restrict.digit}
                                placeholder="max"
                                onChange={onChange}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <Controller
                          control={control}
                          name={`parameter[${index}].observed`}
                          render={({ field: { value, onChange }, fieldState }) => (
                            <TextField
                              type="number"
                              fullWidth
                              variant="outlined"
                              size="small"
                              placeholder="observed"
                              value={value}
                              onChange={onChange}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                          verticalAlign: "middle",
                        }}
                      >
                        <OkNotOk
                          min={watch(`parameter[${index}].min`)}
                          max={watch(`parameter[${index}].max`)}
                          observed={watch(`parameter[${index}].observed`)}
                        />
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <Controller
                          control={control}
                          name={`parameter[${index}].selectedDatetime`}
                          render={({ field: { value, onChange }, fieldState }) => (
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              type="datetime-local"
                              value={value}
                              onChange={onChange}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </td>
                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <Controller
                          control={control}
                          name={`parameter[${index}].cqaeRemarks`}
                          render={({ field: { value, onChange }, fieldState }) => (
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              multiline
                              placeholder="remarks"
                              value={value}
                              onChange={onChange}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </td>

                      <td
                        style={{
                          border: "1px solid lightgrey",
                          padding: "6px 12px",
                        }}
                      >
                        <IconButton onClick={() => remove(index)} size="small" variant="outlined">
                          <Delete color="error" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button disabled={isSaving} onClick={handleSubmit(onSave)} variant="contained" color="primary" size="small">
                {isSaving && <CircularProgress size={24} color="secondary" />}
                Submit
              </Button>
            </div>
          </form>
        </>
      )}

      <div>
        {loading && <LinearProgress />}
        {selectedUploadRow.applicableTestId === 18 ? (
          <TableComponent
            data={records}
            title={"Submitted Data"}
            columns={[
              {
                header: "sequence",
                field: "sequence",
                render: (rowData) => {
                  return <>{`TMR-${rowData.sequence}`}</>;
                },
              },
            ]}
            actions={[
              {
                icon: () => (
                  <ActionButton variant="contained" size="small" color="secondary" startIcon={<Visibility />}>
                    View
                  </ActionButton>
                ),
                onClick: (event, rowData) => {
                  setSelectedRow(rowData);
                  setOpenViewSampleData(true);
                },
              },
            ]}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", fontSize: 12 }} ref={componentRef}>
            <table style={{ borderCollapse: "collapse", marginTop: 20 }}>
              <thead>
                <tr>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Parameter
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Unit
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Excepted O/P
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Observed O/P
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Test Result
                  </td>
                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Date Time
                  </td>

                  <td
                    style={{
                      border: "1px solid grey",
                      padding: "6px 12px",
                      color: "white",
                      backgroundColor: "#205375",
                    }}
                  >
                    Remarks
                  </td>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.parameter}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.unit}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.expectedMin}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.expectedMax}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.result}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item?.selectedDatetime ? moment(item.selectedDatetime).format("DD-MM-YYYY HH:mm") : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid grey",
                        padding: "6px 12px",
                      }}
                    >
                      {item.remarks}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={6} align="center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 8,
                marginTop: 24,
              }}
            >
              <div>
                TESTED BY: <br /> ______________
                <br />
                SIGNATURE: <br />
                ______________
                <br />
                ST NO: <br /> ______________
                <br />
                DATE: <br /> ______________
              </div>
              <div>
                APPROVED BY: <br /> ____________
                <br />
                SIGNATURE: <br />
                _____________
                <br />
                ST NO: <br />
                _______________
                <br />
                DATE: <br /> _______________
              </div>
              <div>
                ACCEPTED BY: <br />
                _______________
                <br />
                SIGNATURE: <br />
                _______________
                <br />
                ID NO: <br />
                _____________
                <br />
                DATE: <br />
                _____________
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
          <Button variant="contained" color="primary" onClick={handlePrint} size="small">
            Print
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  // ----------------------------- MAIN end CONTENT -------------------------------

  return (
    <>
      {openViewSampleData && (
        <SampleWiseDetail
          rowData={rowData}
          selectedRow={selectedRow}
          selectedUploadRow={selectedUploadRow}
          header={[
            { label: "Parameter", id: "parameter" },
            { label: "Excepted Min", id: "expectedMin" },
            { label: "Excepted Max", id: "expectedMax" },
            { label: "Result", id: "result" },
            { label: "Remarks", id: "remarks" },
          ]}
          onClose={() => {
            setOpenViewSampleData(false);
          }}
        />
      )}
      <Dialog aria-labelledby="manage-table-columns" open fullWidth maxWidth="lg">
        {mainContent}
        <DialogActions>
          <Button size="small" variant="outlined" color="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function OkNotOk({ min, max, observed }) {
  let isOk;
  // console.log(
  //   min,
  //   observed,
  //   max,
  //   "max min, one",
  //   observed >= min || observed <= max
  // );
  if (!min || !max || !observed) {
    isOk = null;
  } else if (+observed < +min || +observed > +max) {
    isOk = false;
  } else {
    isOk = true;
  }

  return (
    <p
      style={{
        backgroundColor: isOk === null ? "lightgrey" : isOk ? "green" : "red",
        color: "white",
        textAlign: "center",
        margin: 0,
      }}
    >
      {isOk === null ? "N/A" : isOk ? "Ok" : "Not Ok"}
    </p>
  );
}
