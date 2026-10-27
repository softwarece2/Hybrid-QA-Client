/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import * as yup from "yup";
import TextField from "../../../../components/TextField";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
//material-ui
import { CircularProgress, Dialog, Grid, InputLabel, Typography } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/Button";
import { restrict } from "restrict";

//redux
import { useDispatch, useSelector } from "react-redux";

import { PaperComponent } from "Utils/D3Tree";
import { Autocomplete } from "@material-ui/lab";

import { saveSOSbuImportDetails } from "Redux/Actions/SupplyOrder/SOImportAction";
import { getInspectionAgencyDetailsAndFirmDetails, getInspectionAgencyDetailsOfFirm } from "pages/UserManagement/FirmInspAgencyAction";
import { getAllSOBySalesGrp } from "Redux/Actions/SupplyOrder/SOAction";

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
    padding: "12px 0px 8px 4px",
  },
  tableCell: {
    fontSize: "0.875rem",
  },
  buttonProgress: {
    color: "white",
  },
  asterisk: {
    color: "red",
  },
}));

const SbuCreateSo = ({ setIsSubmit, fetchSO }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
    reset();
  };
  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setOpen(false);
  };

  const schema = yup.object().shape({
    orderNo: yup.string().typeError("Required").required(" Required"),
    orderDate: yup.string().nullable().typeError("Required").required(" Required"),
    receiptDate: yup.string().typeError("Required").required(" Required"),
  });

  const defaultValues = {
    orderNo: "",
    orderDate: null,
    receiptDate: "",
  };

  const {
    handleSubmit,
    reset,
    control,

    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

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

  const inspectionAgencyDetailsOfFirm = useSelector((store) => store.orgReducer.inspectionAgencyTypeOfFirm);

  useEffect(
    (id) => {
      if (open) {
        dispatch(getInspectionAgencyDetailsAndFirmDetails(loggedInUser?.orgId));
      }
    },
    [open]
  );

  const handleSave = (data) => {
    const req = [
      {
        orderNo: data.orderNo,
        orderDate: moment(data.orderDate).format("yyyy-MM-DD"),
        receiptDate: moment(data.receiptDate).format("yyyy-MM-DD"),
      },
    ];

    const dataVal = {
      orgId: loggedInUser?.orgId,
      empId: loggedInUser?.empId,
      // qaAgencyId: getValues("inspectionAgencyIds")?.id,
      supplyOrderDtos: req,
    };

    dispatch(saveSOSbuImportDetails(dataVal, handleClose, setLoading))
      .then((res) => {
        console.log("gfg", res.data);
        toast.success("SO Created Successfully");
        fetchSO();
        fetchSODropdown();
        setLoading(false);
      })
      .catch((error) => {
        console.log("error000", error.message);
        toast.error(error.message || "Please check the entered values");
      })
      .finally((error) => {
        setLoading(false);
        console.log("error", error);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        // className={classes.buttonImport}
        onClick={handleOpenDialog}
        // onClick={(e) => {
        //   setOpen(true);
        // }}
      >
        Create SO/PO
      </Button>
      {/* {duplicate && <DuplicateRecord rowData={duplicateRecord} open={true} onClose={()=>{setDuplicate(false)}} headCell={headCell} annexure="Appx F"/>} */}
      {open && (
        <Dialog open maxWidth="md" fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title333" {...props} />}>
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title333">
            Create SO/PO
          </DialogTitle>
          <DialogContent>
            <div className={classes.browseBtnContainer}>
              <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
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
                            required={true}
                          >
                            Inspection Agency
                          </InputLabel>
                          <Autocomplete
                            fullWidth
                            size="small"
                            id="checkboxes-tags-demo"
                            value={value}
                            onChange={(e, v) => {
                              onChange(v);
                            }}
                          
                            getOptionSelected={(option, value) => option.id === value.id}
                            options={inspectionAgencyDetailsOfFirm}
                            // disableCloseOnSelect
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
                </Grid> */}
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Controller
                    name="orderNo"
                    control={control}
                    // value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <TextField
                        labelText="SO/PO Number"
                        // <span style={{ fontWeight: 600 }}>Receipt Date:</span> {moment(soObj?.receiptDate).format("DD-MM-YYYY")}
                        placeholder="SO/PO Number"
                        onChange={onChange}
                        value={value}
                        size="small"
                        required
                        // onInput={restrict.general}
                        inputProps={{ maxLength: 100 }}
                        error={!!errors.orderNo}
                        helperText={errors.orderNo?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Typography variant="body2">
                    Supply Order Date <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Controller
                    name="orderDate"
                    control={control}
                    // value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          variant="dialog"
                          format="dd/MM/yyyy"
                          autoOk
                          id="date-picker-inline"
                          // label="Start Date"
                          value={value}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={onChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          clearable
                          size="small"
                          inputVariant={"outlined"}
                          disableFuture
                          error={!!errors.orderDate}
                          helperText={errors.orderDate?.message}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <Typography variant="body2">
                    Receipt Date <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Controller
                    name="receiptDate"
                    control={control}
                    // value={value}
                    render={({ field: { onChange, value, ...props } }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          variant="dialog"
                          format="dd/MM/yyyy"
                          autoOk
                          id="date-picker-inline"
                          // label="Start Date"
                          value={value}
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={onChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          clearable
                          size="small"
                          inputVariant={"outlined"}
                          disableFuture
                          error={!!errors.receiptDate}
                          helperText={errors.receiptDate?.message}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleSubmit(handleSave)} type="submit" disabled={loading}>
              {loading && <CircularProgress size={24} className={classes.buttonProgress} color="primary" />} Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SbuCreateSo;
