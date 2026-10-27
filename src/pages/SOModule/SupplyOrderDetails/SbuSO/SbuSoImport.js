/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DialogActions, DialogContent } from "Utils";
import * as yup from "yup";

//material-ui
import {
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/Button";

//icons
import { Close } from "@material-ui/icons";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

//pages
import { ExcelDateToJSDate, failedMsg } from "Globals.js";
import { readExcelPD } from "../../ReadExcel/readExcel";

//redux
import { useDispatch, useSelector } from "react-redux";
import { saveSOSbuImportDetails } from "Redux/Actions/SupplyOrder/SOImportAction";
import { getAllSOBySalesGrp } from "Redux/Actions/SupplyOrder/SOAction";
import { getInspectionAgencyDetailsAndFirmDetails, getInspectionAgencyDetailsOfFirm } from "pages/UserManagement/FirmInspAgencyAction";
import { Autocomplete } from "@material-ui/lab";

const usersSchema = yup.object().shape({
  orderNo: yup.string().trim(),

  orderDate: yup.string(),

  receiptDate: yup.string(),

});

const requiredColumns = ["SO/PO Number", "SO/PO Date", "Receipt Date"];

const required = <span style={{ color: "red" }}>*</span>;
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
  browse: {
    padding: "20px 0px 8px 4px",
  },
  tableCell: {
    fontSize: "0.875rem",
  },
  buttonProgress: {
    color: "white",
  },
}));

const headCell = [
  { label: "SO/PO Number", required: true },
  { label: "SO/PO Date", required: true },
  { label: "Receipt Date", required: true },
];

const SbuSoImport = ({ setIsSubmit, fetchSO }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let fileInputRef = useRef(null);

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setOpen(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const schema = yup.object().shape({

    inspectionAgencyIds: yup
      .object()
      .typeError("Required")
      .required("Inspection Agency Required"),
    users: yup
      .array()
      .of(usersSchema)
      .min(1),
  });

  const defaultValues = { inspectionAgencyIds: null, users: [] };

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control,
    name: "users",
  });

  console.log("errors", errors);

  useEffect(() => {
    console.log("inside import");
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    // reset(defaultValues);
    setLoading(true);

    readExcelPD(file)
      .then((d) => {
        console.log("excelUserData d", d);
        if (Array.isArray(d)) {
          const excelUserData = d;
          console.log("excelUserData", excelUserData);
          const isValidColumns = requiredColumns.every(
            (el) => el.trim() in excelUserData[0]
          );
          if (isValidColumns) {
            if (file.size / 1000 > 1024) {
              toast.info("File size cannot exceed more than 1MB");
            } else {
              const mappedUsers = excelUserData?.map((user, id) => ({
                id,
                orderNo: user["SO/PO Number"],
                orderDate: moment(
                  ExcelDateToJSDate(user["SO/PO Date"])
                ).format("DD-MM-yyyy"),
                receiptDate: moment(
                  ExcelDateToJSDate(user["Receipt Date"])
                ).format("DD-MM-yyyy"),
                inspectionAgencyIds: getValues("inspectionAgencyIds")
              }));
              console.log("mappedUsers", mappedUsers);
              setValue("users", mappedUsers);
              setSelectedFile(file);
            }
          } else {
            toast.info("In-valid format");
          }
        } else {
          setSelectedFile(null);
          toast.error(failedMsg);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to read file!");
      })
      .finally(() => setLoading(false));
  };
  console.log("values", getValues());

  const fetchSODropdown = () => {
    setLoading(true);
    dispatch(getAllSOBySalesGrp(loggedInUser?.empId))
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const inspectionAgencyDetailsOfFirm = useSelector(
    (store) => store.orgReducer.inspectionAgencyTypeOfFirm
  );

  useEffect((id) => {
    dispatch(getInspectionAgencyDetailsAndFirmDetails(loggedInUser?.orgId));
  }, []);

  const handleSave = (data) => {
    const isDuplicate = data.users.some((el, i) =>
      data.users.some((innerEl, j) => {
        if (i === j) {
          return false;
        } else {
          return innerEl.orderNo === el.orderNo;
        }
      })
    );

    if (isDuplicate) {
      toast.warn("Duplicate Supply Order is present in excel");
      return;
    }
    console.log("out selectedFile", selectedFile);
    if (selectedFile) {
      console.log("selectedFile", selectedFile);
      const req = data.users.map((user) => {
        return {
          orderNo: user.orderNo,
          orderDate: moment(user.orderDate, "DD-MM-yyyy").format("yyyy-MM-DD"),
          receiptDate: moment(user.receiptDate, "DD-MM-yyyy").format(
            "yyyy-MM-DD"
          ),
        };
      });

      const dataVal = {
        orgId: loggedInUser?.orgId,
        empId: loggedInUser?.empId,
        qaAgencyId: getValues("inspectionAgencyIds")?.id,
        supplyOrderDtos: req,
      };

      dispatch(saveSOSbuImportDetails(dataVal, handleClose, setLoading)).then((res) => {
        console.log("gfg", res)
        if (res.status === 201) {
          toast.success("SO Imported Successfully");
          fetchSO();
          fetchSODropdown();
          setLoading(false);
        }
        else {
          toast.error("Invalid Format");

        }
      }).catch((error) => {
        console.log("error", error);
      })
        .finally(() => setLoading(false));

    }
  };

  const resetImport = () => {
    reset(defaultValues);
  };

  return (
    <>
      {/* <Button
        variant="contained"
        color="primary"
        size="small"
        // className={classes.buttonImport}
        endIcon={<CloudDownloadIcon />}
        onClick={(e) => {
          setOpen(true);
        }}
      >
        Import SO/PO
      </Button> */}
      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      <form onSubmit={handleSubmit(handleSave)}>
        <Dialog open={open} maxWidth="md" fullWidth>
          <DialogContent dividers style={{ padding: 0, position: "relative" }}>
            <div style={{ marginLeft: 12 }}>
              <input
                ref={(refParam) => (fileInputRef = refParam)}
                type="file"
                style={{ display: "none" }}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileInput}
                value={""}
              />

              <div className={classes.browseBtnContainer}>
                <Grid container spacing={0} >
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                    <Controller
                      name="inspectionAgencyIds"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <>
                            <InputLabel
                              classes={{
                                asterisk: classes.asterisk,
                                root: classes.root,
                              }}
                              
                            >
                              Inspection Agency 
                                       {required ? <span style={{ color: "red" }}>*</span> : null}
                                    
                            </InputLabel>
                            <Autocomplete
                              fullWidth
                              size="small"
                              id="checkboxes-tags-demo"
                              value={value}
                              onChange={(e, v) => {
                                if (v === null) {
                                  setShow(true);
                                } else {
                                  setShow(false);
                                }
                                onChange(v);
                              }}
                              getOptionSelected={(option, value) =>
                                option.id === value.id
                              }
                              options={inspectionAgencyDetailsOfFirm}
                              disableCloseOnSelect
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  error={!!errors.inspectionAgencyIds}
                                  helperText={errors.inspectionAgencyIds?.message}
                                />
                              )}
                            />
                          </>
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3} className={classes.browse}>
                    <Typography>
                      <Button
                        onClick={() => {
                          fileInputRef.click();
                        }}
                        className={classes.browseBtn}
                        variant="outlined"
                        size="small"
                        // disabled={!getValues("inspectionAgencyIds")}
                        disabled={show}
                      >
                        Browse
                      </Button>
                      &nbsp;
                      {selectedFile ? (
                        <span> {selectedFile.name}</span>
                      ) : (
                        <Typography
                          component={"span"}
                          variant="caption"
                          color="textSecondary"
                        >
                          No file selected.
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedFile(null);
                          resetImport();
                        }}
                      >
                        <Close fontSize="small" color="action" />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </div>
            <br />
            <TableContainer>
              {loading && <div>Loading..</div>}
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {headCell &&
                      headCell.map((item) => (
                        <TableCell className={classes.tableCell}>
                          {item.label}
                          {item.required ? required : ""}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fields
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item, index) => (
                      <TableRow key={item.id}>
                        {/* <TableCell style={{ width: "10px" }}>{index + 1}</TableCell> */}
                        <TableCell className={classes.tableCell}>
                          {item.orderNo}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.orderDate}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {item.receiptDate}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: "All", value: fields.length }]}
                component="div"
                count={fields.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleSave)}
              type="submit"
              disabled={loading}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                  color="primary"
                />
              )}{" "}
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default SbuSoImport;
