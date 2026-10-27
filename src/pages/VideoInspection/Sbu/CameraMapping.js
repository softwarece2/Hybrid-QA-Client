import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import TextField from "../../../components/TextField";
import axiosInstance from "pages/Services/AxiosInstance";
import {
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "components/Button";
import { teal } from "@material-ui/core/colors";
import useTable, { StyledTableCell, StyledTableRow } from "components/UseTable";
import { useSelector } from "react-redux";
import { saveSBUCameraMap, editSbuCameraMapping } from "../../../../src/pages/Services/URLs";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { restrict } from "restrict";


const usersSchema = yup.object().shape({
  sbuName: yup.string().required("Required").typeError("required"),
  cameraIp: yup
  .string()
  .matches(/^[\d.]+$/, "Invalid IP format (Numbers and Decimal only)")
  .required("Required"),
});

const useStyles = makeStyles((theme) => ({
  browseBtnWrapper: {
    border: "1px solid",
    borderColor: teal[100],
    borderRadius: "4px",
    display: "inline-block",
    borderBlockStyle: "ridge",
    minWidth: 300,
  },
  browseBtnContainer: {
    display: "flex",
    alignItems: "center",
  },
  browseBtn: {
    textTransform: "capitalize",
    backgroundColor: teal[100],
    borderRadius: "4px",
  },
  autoComplete: {
    padding: "12px 8px 8px 4px",
  },
  browse: {
    padding: "12px 0px 8px 4px",
  },
  icon: {
    color: "#f44336",
  },
  buttonProgress: {
    color: "white",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main,
    },
  },
  // NEW STYLE: Fixes the overflowing chips
  customMultiSelect: {
    "& .MuiOutlinedInput-root": {
      flexWrap: "wrap",          // Allows chips to wrap to next line
      height: "auto !important", // Forces box to grow vertically
      minHeight: "15px",         // Standard height for empty state
      padding: "6px !important", // Adjust padding for look
      alignItems: "flex-start",  // Aligns text/chips to top
    },
    // "& .MuiAutocomplete-endAdornment": {
    //   top: "8px !important",     // Keeps the dropdown arrow at the top right
    // }  
  },
}));

const headCells = [
  {
    label: "Camera IP *",
    field: "cameraIp",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Camera Name *",
    field: "sbuName",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Test Name",
    field: "testDesc",
    align: "left",
    disableSorting: true,
    width: "350px", 
  },
];

const defaultArray = {
  sbuName: "",
  cameraIp: "",
  tests: [],
};

const defaultValues = {
  array: [defaultArray],
};
const schema = yup.object().shape({
  array: yup.array().of(usersSchema).min(1),
});

const CameraMapping = ({ appTestDetails, fetch }) => {
  const classes = useStyles();
  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [testOptions, setTestOptions] = useState([]);

  const [edit, setEdit] = useState(false);
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "array",
  });

  const { TblHead } = useTable(records, headCells);

  useEffect(() => {
    axiosInstanceAte
      .get("/tests/getAllTests")
      .then(({ data }) => {
        setTestOptions(data);
      })
      .catch((err) => {
        console.error("Error fetching test options", err);
      });
  }, []);

  const handleReset = () => {
    reset({
      array: [{ sbuName: "", cameraIp: "", tests: [] }],
    });
    setEdit(false);
  };

  const handleRemoveItem = (index) => {
    remove(index, 1);
  };
  const handleListAdd = () => {
    const getFirstRowData = getValues("array") ? getValues("array")[0] : null;
    if (getFirstRowData) {
      const defaultData = { tests: [] };
      append(defaultData);
    } else {
      append(defaultArray);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const req = data.array.map((item) => ({
        cameraIp: item.cameraIp || "",
        sbuName: item.sbuName || "",
        salesGrpId: loggedInUser.salesGrpId,
        tests: item.tests ? item.tests.map((t) => ({ id: t.id })) : [],
      }));
      
      await axiosInstanceAte.post(saveSBUCameraMap, req);

      const str = "Data Successfully Saved.";
      toast.success(str);
      fetch();
      handleReset();
    } catch (error) {
      console.error("Error saving data:", error);
      let errorMessage = "Failed to save"; // Default fallback message

      if (error.response) {
        errorMessage = error.response.data.message || error.response.data || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appTestDetails && Object.keys(appTestDetails).length > 0) {
      const processedDetails = {
        array: [
          {
            sbuName: appTestDetails.sbuName,
            cameraIp: appTestDetails.cameraIp,
            id: appTestDetails.id,
            tests: appTestDetails.tests || [],
          },
        ],
      };
      setEdit(true);
      reset(processedDetails);
    } else {
      setEdit(false);
    }
  }, [appTestDetails, reset, getValues]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const item = data.array[0];
      const req = {
        id: item?.id,
        cameraIp: item?.cameraIp || "",
        sbuName: item?.sbuName || "",
        salesGrpId: loggedInUser.salesGrpId,
        tests: item.tests ? item.tests.map((t) => ({ id: t.id })) : [],
      };
      const response = await axiosInstanceAte.post(editSbuCameraMapping, req);

      const str = response.data || "Data Successfully Updated";
      toast.success(str);
      fetch();
      handleReset();
    } catch (error) {
      console.error("Error Updated data:", error);
      const errorMessage = error.response?.data || "Failed to Update";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
console.log(testOptions,"testOptionstestOptions")
  return (
    <>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className={classes.browseBtnContainer}>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.autoComplete} align="right">
              <Button
                startIcon={<AddCircleIcon />}
                variant="contained"
                color="primary"
                obs={"form"}
                onClick={handleListAdd}
                disabled={edit}
              >
                Add Row
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.autoComplete}>
              <TableContainer style={{ maxHeight: "600px", overflow: "visible" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                >
                  <TblHead />
                  {fields.length !== 0 ? (
                    <TableBody>
                      {fields?.map((input, index) => (
                        <StyledTableRow key={input.id} style={{ verticalAlign: 'top' }}>
                          <StyledTableCell className={classes.remarks} style={{ verticalAlign: 'top' }}>
                            <Controller
                              name={`array[${index}].cameraIp`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <TextField
                                  placeholder="Camera IP"
                                  {...props}
                                  onChange={onChange}
                                  value={value}
                                  onInput ={restrict.number}
                                  inputProps={{maxLength:15}}
                                  size="small"
                                  error={!!errors.array?.[index]?.cameraIp}
                                  helperText={errors.array?.[index]?.cameraIp?.message}
                                />
                              )}
                            />
                          </StyledTableCell>
                          
                          <StyledTableCell className={classes.remarks} style={{ verticalAlign: 'top' }}>
                            <Controller
                              name={`array[${index}].sbuName`}
                              control={control}
                              render={({ field: { onChange, value, ...props } }) => (
                                <TextField
                                  placeholder="Camera Name"
                                  {...props}
                                  onChange={onChange}
                                  value={value}
                                  inputProps={{maxLength:15}}
                                  size="small"
                                  error={!!errors.array?.[index]?.sbuName}
                                  helperText={errors.array?.[index]?.sbuName?.message}
                                />
                              )}
                            />
                          </StyledTableCell>

                          {/* Test Name Autocomplete with Custom Style */}
                          <StyledTableCell 
                            className={classes.remarks} 
                            style={{ 
                              minWidth: 350, 
                              whiteSpace: 'normal', 
                              verticalAlign: 'middle' 
                            }}
                          >
                            <Controller
                              name={`array[${index}].tests`}
                              control={control}
                              defaultValue={[]}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  multiple
                                  className={classes.customMultiSelect}
                                  options={testOptions}
                                  disableCloseOnSelect
                                  getOptionLabel={(option) => option.testDesc || ""}
                                  getOptionSelected={(option, value) => option.id === value.id}
                                  value={value || []}
                                  onChange={(e, data) => onChange(data)}
                                  
                                  // Dropdown List Items
                                  renderOption={(option, { selected }) => (
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                      <span>{option.testDesc}</span>
                                      {selected && <span style={{ color: teal[500], fontWeight: 'bold' }}>✓</span>}
                                    </div>
                                  )}

                                  // Selected Chips (Tags)
                                  renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                      <Chip
                                        label={option.testDesc}
                                        size="small"
                                        {...getTagProps({ index })}
                                        style={{
                                            margin: "2px",
                                            borderRadius: "4px",
                                            backgroundColor: "#f5f5f5",
                                            border: "1px solid #e0e0e0",
                                        }}
                                      />
                                    ))
                                  }

                                  renderInput={(params) => (
                                    <TextField 
                                      {...params} 
                                      variant="outlined"
                                      placeholder={value && value.length > 0 ? "" : "Select Tests"} 
                                      size="small"
                                      style={{ minWidth: "100%" }}
                                    />
                                  )}
                                />
                              )}
                            />
                          </StyledTableCell>

                          <StyledTableCell className={classes.remarks} style={{ width: "20px", verticalAlign: 'top' }}>
                            {index === 0 ? null : (
                              <IconButton aria-label="delete" onClick={() => handleRemoveItem(index)}>
                                <DeleteIcon className={classes.icon} />
                              </IconButton>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <Grid item xs={12} align="center">
                      <Typography className={classes.text}> No Records To Display</Typography>
                    </Grid>
                  )}
                </Table>
              </TableContainer>
              <br />
              <Grid container spacing={2} align="left">
                <Grid item xs={6} align="right">
                  {edit ? (
                    <Button
                      variant="contained"
                      className={!isDirty ? classes.disabledButton : classes.button}
                      disabled={!isDirty}
                      onClick={handleSubmit(handleUpdate)}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} type="submit" disabled={loading}>
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />}
                      Submit
                    </Button>
                  )}
                </Grid>

                <Grid item xs={6} align="left">
                  <Button variant="contained" color="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </form>
    </>
  );
};

export default CameraMapping;