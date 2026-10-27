import { useRef } from "react";
import { useState, useEffect } from "react";
import {
  makeStyles,
  Table,
  TableBody,
  TableRow,
  Typography,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  withStyles,
  TableCell,
  FormHelperText,
  InputAdornment,
  Paper,
  CircularProgress,
  LinearProgress,
  TableContainer,
} from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import { StyledTableRow } from "Utils";
import { Cancel, CheckCircle, Print, SaveAltOutlined, SendOutlined } from "@material-ui/icons";

import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomizedInputs from "components/TextField";
import { toast } from "react-toastify";
import { Pagination } from "@material-ui/lab";
import { restrict } from "restrict";

const StyledTableCell = withStyles({
  body: {
    fontSize: 12,
    padding: 4,
    border: "1px solid lightgrey",
  },
})(TableCell);

const StyledTableCellHeader = withStyles({
  body: {
    fontSize: 12,
    padding: 4,
  },
})(TableCell);

const useStyles = makeStyles({
  head: {
    backgroundColor: "#205375",
  },
  headCell: {
    paddingInline: 2,
    color: "white",
    paddingBlock: 4,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  checkedNo:{
    color:"#f44336 !important"
  },
  checkedYes:{
    color:"green !important"
  }
});

const options = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const defaultValues = {
  againstRejection: "",
  rejectionINoteNumber: "",
  rejectionQty: "",
  subQty: "",
  acceptedQty: "",
  remarks: "",
  devices: [
    {
      devId: "",
      devName: "",
      values: [
        {
          id: 0,
          specId: "",
          obsVal: "",
          resultId: "",
        },
      ],
    },
  ],
};

const schema = yup.object().shape({
  devices: yup.array().of(
    yup.object().shape({
      values: yup.array().of(
        yup.object().shape({
          obsVal: yup.string().required("Required"),
        })
      ),
    })
  ),
});

function createPayload(data, ol, currentPage, empId) {
  return {
    faiId: data.faiId,
    subQty: data.subQty,
    actQty: data.acceptedQty,
    rejQty: data.rejectionQty,
    remarks: data.remarks,
    dtoList: data.devices.flatMap((device) =>
      device.values.map((v) => ({
        id: v.id,
        devId: device.devId,
        olLineItemId: ol.id,
        pageNo: currentPage,
        prodId: v.prodId,
        createdById: empId,
        obsRemDtos: [
          {
            specId: v.specId,
            obs: v.obsVal,
            resultId: v.resultId,
          },
        ],
      }))
    ),
  };
}

export default function FaiEntry({ ol, selectedRound, specs, empId }) {
  const componentRef = useRef();
  const classes = useStyles();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // console.log(selectedRound,"selectedRound");

  const totalPages = selectedRound.faiDetails?.length || 1;

  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, getValues, reset, setValue, watch } = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { fields } = useFieldArray({
    control,
    name: "devices",
  });

  async function getSavedObsVal(cP, faiId) {
    try {
      setLoading(true);
      const { data } = await axiosInstanceAte.get("fai/getObsByFaiId/" + faiId + "/" + cP);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const setSaveValues = async () => {
    const savedData = await getSavedObsVal(currentPage, selectedRound.id);
    if (savedData.length > 0) {
      // wrapper class todo
      const devices = Object.values(
        savedData.reduce((acc, { prodId, devId, devName, obsRemDtos, id, submittedDate }) => {
          const { obs, specId, resultId } = obsRemDtos[0];
          if (!acc[devId]) {
            acc[devId] = {
              devId,
              submittedDate,
              devName,
              id,
              values: [],
            };
          }
          acc[devId].values.push({ id, obsVal: obs, specId, prodId, resultId });

          return acc;
        }, {})
      );
      console.log("saved devices", devices);
      reset({ devices, subQty: devices.length, faiId: selectedRound.id, remarks: "" });
    }
  };

  useEffect(() => {
    if (specs.length && currentPage && selectedRound.faiDetails[currentPage - 1]) {
      // console.log(selectedRound.faiDetails[currentPage - 1], "selectedRound.faiDetails");
      const devices = selectedRound.faiDetails[currentPage - 1].regNos.map((s) => ({
        devId: s.regNo,
        devName: s.regName,
        id: 0,
        values: specs.map((s) => ({ id: 0, specId: s.id, obsVal: s.min ? "" : "yes", resultId: s.min ? "" : 0, prodId: s.prodId })),
      }));
      reset({
        faiId: selectedRound.id,
        subQty: devices.length,
        devices,
      });
    }
    // if saved values the set with saved ones
    setSaveValues();
  }, [currentPage, reset, selectedRound, specs]);

  const watchObservation = watch("devices");

  useEffect(() => {
    const acceptedRejectedTotal = watchObservation.reduce(
      (acc, { values }) => {
        const isFailed = values.some((v) => v.resultId == 1);
        return {
          rejected: acc.rejected + (isFailed ? 1 : 0),
          accepted: acc.accepted + (isFailed ? 0 : 1),
        };
      },
      { rejected: 0, accepted: 0 }
    );

    setValue("rejectionQty", acceptedRejectedTotal.rejected.toString());
    setValue("acceptedQty", acceptedRejectedTotal.accepted.toString());
    // console.log(acceptedRejectedTotal, "ppp");
  }, [JSON.stringify(watchObservation)]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRound]);

  async function onSave(data) {
    try {
      setSaving(true);
      const payload = createPayload(data, ol, currentPage, empId);
      await axiosInstanceAte.post("/fai/submitFai", payload);
      setSaveValues();
      toast.success("Submitted Successfully");
    } catch (error) {
      toast.error("Failed to save, please try again");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  async function onSaveAsDraft() {
    const data = getValues();
    try {
      setSaving(true);
      const payload = createPayload(data, ol, currentPage, empId);
      // console.log(data, "data", payload, empId);
      await axiosInstanceAte.post("/fai/saveFai", payload);
      setSaveValues();
      toast.success("Successfully saved");
    } catch (error) {
      toast.error("Failed to save, please try again");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper style={{ border: "1px solid lightgrey", marginTop: 16 }}>
      <div ref={componentRef}>
        <Typography align="center" variant="h5" color="secondary" style={{ textDecoration: "underline", marginBottom: 15 }}>
          INSPECTION REPORT ENTRY FOR - {ol.partNumberName}
        </Typography>

        <Table size="small">
          <TableBody>
            <StyledTableRow>
              <StyledTableCellHeader colSpan={2}>I-NOTE No.</StyledTableCellHeader>
              <StyledTableCellHeader>
                <TextField size="small" variant="outlined" />
              </StyledTableCellHeader>
              <StyledTableCellHeader>SUB QTY</StyledTableCellHeader>
              <StyledTableCellHeader colSpan={2}>
                <Controller
                  control={control}
                  name="subQty"
                  render={({ field: { value } }) => (
                    <CustomizedInputs InputProps={{ readOnly: true }} type="number" fullWidth value={value} />
                  )}
                />
              </StyledTableCellHeader>
              <StyledTableCellHeader>ACT QTY</StyledTableCellHeader>
              <StyledTableCellHeader colSpan={2}>
                <Controller
                  control={control}
                  name="acceptedQty"
                  render={({ field: { value } }) => (
                    <CustomizedInputs type="number" fullWidth InputProps={{ readOnly: true }} value={value} />
                  )}
                />
              </StyledTableCellHeader>
              <StyledTableCellHeader>REJ QTY</StyledTableCellHeader>
              <StyledTableCellHeader colSpan={2}>
                <Controller
                  control={control}
                  name="rejectionQty"
                  render={({ field: { value } }) => (
                    <CustomizedInputs type="number" fullWidth InputProps={{ readOnly: true }} value={value} />
                  )}
                />
              </StyledTableCellHeader>
              <StyledTableCellHeader colSpan={2}>Page No. {currentPage}</StyledTableCellHeader>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCellHeader colSpan={2}>AGAINST - REJECTION I-NOTE</StyledTableCellHeader>
              <StyledTableCellHeader colSpan={4}>
                <Controller
                  control={control}
                  name="againstRejection"
                  render={({ field: { onChange, value } }) => (
                    <CustomizedInputs select SelectProps={{ native: true }} fullWidth onChange={(e) => onChange(e)} value={value}>
                      <option value="">Select</option>
                      {options.map((reg) => (
                        <option key={reg.value} value={reg.value}>
                          {reg.label}
                        </option>
                      ))}
                    </CustomizedInputs>
                  )}
                />
              </StyledTableCellHeader>
              <StyledTableCellHeader colSpan={1}>ENTER REJ-INOTE NUMBER</StyledTableCellHeader>
              <StyledTableCellHeader colSpan={6}>
                <Controller
                  control={control}
                  name="rejectionINoteNumber"
                  render={({ field: { onChange, value } }) => <CustomizedInputs fullWidth onChange={(e) => onChange(e)} value={value} />}
                />
              </StyledTableCellHeader>
            </StyledTableRow>
          </TableBody>
        </Table>

        <div className={classes.pagination}>
          <Typography variant="body2">
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
            size="medium"
            color="primary"
            boundaryCount={1}
          />
        </div>

        <Table size="small" style={{ marginTop: 12 }}>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell colSpan={3}>
                <Typography variant="body2" color="secondary">
                  <b>Registration Numbers</b>
                </Typography>
              </StyledTableCell>
              {fields.map((item, index) => (
                <StyledTableCell key={item.id}>
                  <Typography variant="body1" color="secondary">
                    <b>{getValues(`devices.${index}.devName`)}</b>
                  </Typography>
                </StyledTableCell>
              ))}
            </StyledTableRow>

            <StyledTableRow className={classes.head}>
              <StyledTableCell className={classes.headCell}>S.No.</StyledTableCell>
              <StyledTableCell className={classes.headCell}>TEST</StyledTableCell>
              <StyledTableCell className={classes.headCell}>SPEC. VALUE</StyledTableCell>
              <StyledTableCell colSpan={10} className={classes.headCell}>
                OBSERVATIONS
              </StyledTableCell>
            </StyledTableRow>
            {loading && (
              <StyledTableRow>
                <StyledTableCell colSpan={fields.length + 4}>
                  <LinearProgress />
                </StyledTableCell>
              </StyledTableRow>
            )}

            {specs.map((spec, rowIndex) => (
              <StyledTableRow key={spec.id}>
                <StyledTableCell>{rowIndex + 1}</StyledTableCell>
                <StyledTableCell>{spec.testName}</StyledTableCell>
                <StyledTableCell>{spec.specVal}</StyledTableCell>
                {fields.map((d, colIndex) => (
                  <StyledTableCell key={rowIndex + colIndex + d?.id} style={{ minWidth: 130 }}>
                    <Controller
                      name={`devices.${colIndex}.values.${rowIndex}.obsVal`}
                      control={control}
                      render={({ fieldState: { error }, field: { value, onChange } }) => {
                        if (spec.min && spec.max && spec.specVal.includes("°")) {
                          return (
                            <TextField
                              size="small"
                              variant="outlined"
                              value={value}
                              onInput={restrict.number}
                              onChange={(e) => {
                                const v = e.target.value;
                                const [d = 0, m = 0, s = 0] = v.split(".");
                                const totalSeconds = Math.min(+d, 180) * 3600 + Math.min(+m, 59) * 60 + Math.min(+s, 59);
                                if (totalSeconds > spec.max || totalSeconds < spec.min) {
                                  setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 1); //Fail
                                } else {
                                  setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 0); //Pass
                                }
                                onChange(e);
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {watch(`devices.${colIndex}.values.${rowIndex}.resultId`) === 0 ? (
                                      <CheckCircle fontSize="small" style={{ color: "green" }} />
                                    ) : (
                                      <Cancel fontSize="small" color="error" />
                                    )}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          );
                        } else if (spec.min && spec.max) {
                          return (
                            <TextField
                              type="number"
                              size="small"
                              variant="outlined"
                              value={value}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v > spec.max || v < spec.min) {
                                  setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 1); //Fail
                                } else {
                                  setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 0); //Pass
                                }
                                onChange(e);
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {value > spec.max || value < spec.min ? (
                                      <Cancel fontSize="small" color="error" />
                                    ) : (
                                      <CheckCircle fontSize="small" style={{ color: "green" }} />
                                    )}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          );
                        } else {
                          return (
                            <FormControl>
                              <RadioGroup
                                value={value}
                                onChange={(e) => {
                                  if (e.target.value === "yes") {
                                    setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 0); //Pass
                                  } else {
                                    setValue(`devices.${colIndex}.values.${rowIndex}.resultId`, 1); //Fail
                                  }
                                  onChange(e);
                                }}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio size="small"  classes={{checked:classes.checkedYes}}/>}
                                  label={<Typography variant="caption">Satisfactory</Typography>}
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio size="small" classes={{checked:classes.checkedNo,}}/>}
                                  label={<Typography variant="caption">Non-Satisfactory</Typography>}
                                />
                              </RadioGroup>
                            </FormControl>
                          );
                        }
                      }}
                    />
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TableContainer style={{ marginTop: 32 }}>
          <Table size="small">
            <TableRow>
              <StyledTableCell colSpan={2}>EXAMINED BY</StyledTableCell>
              <StyledTableCell colSpan={3}> -- </StyledTableCell>
              <StyledTableCell colSpan={2}>CHECKED BY</StyledTableCell>
              <StyledTableCell colSpan={3}>--</StyledTableCell>
              <StyledTableCell colSpan={2}>JWM/QC(F)</StyledTableCell>
              <StyledTableCell colSpan={3}>--</StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={2}>REMARKS</StyledTableCell>
              <StyledTableCell colSpan={12}>
                <Controller
                  name="remarks"
                  control={control}
                  render={(field) => <TextField {...field} size="small" fullWidth variant="outlined" />}
                />
              </StyledTableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 16 }}>
        <Button
          startIcon={<Print />}
          onClick={handlePrint}
          style={{ textTransform: "capitalize" }}
          size="small"
          variant="outlined"
          color="primary"
        >
          Print
        </Button>
        <Button
          startIcon={<SendOutlined />}
          disabled={saving || loading || getValues("devices")[0]?.submittedDate}
          onClick={handleSubmit(onSave)}
          style={{ textTransform: "capitalize" }}
          size="small"
          color="secondary"
          variant="outlined"
        >
          {saving ? <CircularProgress size={20} /> : "Submit"}
        </Button>

        <Button
          disabled={saving || loading || getValues("devices")[0]?.submittedDate}
          onClick={onSaveAsDraft}
          startIcon={<SaveAltOutlined />}
          style={{ textTransform: "capitalize" }}
          size="small"
          color="secondary"
          variant="outlined"
        >
          {saving ? <CircularProgress size={20} /> : "Save as Draft"}
        </Button>
      </div>
    </Paper>
  );
}
