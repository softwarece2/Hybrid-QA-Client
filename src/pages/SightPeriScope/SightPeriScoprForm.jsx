import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { StyledTableCell, StyledTableRow } from "Utils";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const rowList = [
  {
    testName: "Out ward appearance",
    specifiedValue: "As PER TY",
    fieldName: "outwAppear",
    type: "radio",
    id: 0,
  },
  {
    testName: "Field of View",
    specifiedValue: "Horizontal > 30°",
    fieldName: "fieldViewHoriz",
    type: "number",
    id: 1,
  },
  {
    testName: "Field of View",
    specifiedValue: "Vertical > 28° But not less than 5% of 28° V FOV",
    fieldName: "fieldViewVert",
    type: "number",
    id: 2,
  },
  {
    testName: "Magnification",
    specifiedValue: "1 x ± 0.1x",
    fieldName: "magnif",
    type: "number",
    id: 3,
  },
  {
    testName: "Difference in Magnification of Left and Right Eye Piece",
    specifiedValue: "10% of largest value",
    fieldName: "diffMagnif",
    type: "number",
    id: 4,
  },
  {
    testName: "Resolving Power (LEFT)",
    specifiedValue: "Not more than 1.7+0.1m Radian at optimum light level",
    fieldName: "resPowL",
    type: "number",
    id: 5,
  },
  {
    testName: "Resolving Power (RIGHT)",
    specifiedValue: "Not more than 1.7+0.1m Radian at optimum light level",
    fieldName: "resPowR",
    type: "number",
    id: 6,
  },
  {
    testName: "Diopter difference of both E.P ",
    specifiedValue: "0.3D Max",
    fieldName: "diffAdjustEp",
    id: 16,
  },
  {
    testName: "Diopter adjustment of both E.P (LEFT)",
    specifiedValue: "(-)0.5 D to (-)1.0 Diopter",
    fieldName: "adjustEpL",
    type: "number",
    id: 7,
  },
  {
    testName: "Diopter adjustment of both E.P (RIGHT)",
    specifiedValue: "(-)0.5 D to (-)1.0 Diopter",
    fieldName: "adjustEpR",
    type: "number",
    id: 8,
  },
  {
    testName: "Non Parallelism of optical axes (LEFT)",
    specifiedValue: "Horizontal = 3°00' to 5°30'",
    fieldName: "nonParallelOpticalHorizL",
    fieldNames: ["nonParallelOpticalHorizLDegree", "nonParallelOpticalHorizLMinute"],
    type: "degMin",
    id: 9,
  },
  {
    testName: "Non Parallelism of optical axes (RIGHT)",
    specifiedValue: "Horizontal = 3°00' to 5°30'",
    fieldName: "nonParallelOpticalHorizR",
    fieldNames: ["nonParallelOpticalHorizRDegree", "nonParallelOpticalHorizRMinute"],
    type: "degMin",
    id: 10,
  },
  {
    testName: "Non Parallelism of optical axes (LEFT)",
    specifiedValue: "Vertical =1°(Max)",
    fieldName: "nonParallelOpticalVertL",
    type: "radio",
    id: 11,
  },
  {
    testName: "Non Parallelism of optical axes (RIGHT)",
    specifiedValue: "Vertical =1°(Max)",
    fieldName: "nonParallelOpticalVertR",
    type: "radio",
    id: 12,
  },
  {
    testName: "Cleanliness of Optical",
    specifiedValue: "As PER TY",
    fieldName: "opticalClean",
    type: "radio",
    id: 13,
  },
  {
    testName: "Movement of iris Diaphragm",
    specifiedValue: "Should be Smooth",
    fieldName: "movIris",
    type: "radio",
    id: 14,
  },
  {
    testName: "Range",
    specifiedValue: "150 meter analysis",
    fieldName: "range",
    type: "number",
    id: 15,
  },
];

const defaultValues = {
  deviceName: "",
  id: 0,
  visualTest: 0,
  outwAppear: "",
  fieldViewHoriz: "",
  fieldViewVert: "",
  magnif: "",
  diffMagnif: "",
  resPowL: "",
  resPowR: "",
  adjustEpL: "",
  adjustEpR: "",
  diffAdjustEp: "",
  nonParallelOpticalHorizLDegree: "",
  nonParallelOpticalHorizRDegree: "",
  nonParallelOpticalHorizLMinute: "",
  nonParallelOpticalHorizRMinute: "",

  nonParallelOpticalVertL: "",
  nonParallelOpticalVertR: "",
  opticalClean: "",
  movIris: "",
  range: "",
};

const schema = yup.object({
  outwAppear: yup.string().required("Required"),
  deviceName: yup.string().required("Required"),
  opticalClean: yup.string().required("Required"),
  movIris: yup.string().required("Required"),
  nonParallelOpticalVertR: yup.string().required("Required"),
  nonParallelOpticalVertL: yup.string().required("Required"),
  range: yup.number().typeError("Invalid value").min(0).max(150),
  fieldViewHoriz: yup.number().typeError("Invalid value").min(30),
  fieldViewVert: yup.number().typeError("Invalid value").max(28).min(5),
  magnif: yup.number().typeError("Invalid value").max(10).min(0),
  resPowL: yup.number().typeError("Invalid value").max(1.8),
  resPowR: yup.number().typeError("Invalid value").max(1.8),
  adjustEpL: yup.number().typeError("Invalid value").min(-0.5).max(1),
  adjustEpR: yup.number().typeError("Invalid value").min(-0.5).max(1),
  nonParallelOpticalHorizLDegree: yup.number().typeError("Invalid value").max(360).min(0),
  nonParallelOpticalHorizLMinute: yup.number().typeError("Invalid value").max(60).min(0),
  nonParallelOpticalHorizRDegree: yup.number().typeError("Invalid value").max(360).min(0),
  nonParallelOpticalHorizRMinute: yup.number().typeError("Invalid value").max(60).min(0),
});

function createReq(data, rowData, final, selectedUploadRow) {
  return {
    id: data.id || 0,
    devName: data.deviceName,
    olLineItemId: rowData.id,
    productTypeId: 2,
    inspStageId: final ? 3 : 1,
    applicableTestId: selectedUploadRow.id,
    visualTestDto: {
      id: data.visualTest || 0,
      outwardAppear: data.outwAppear === "OK" ? 1 : data.outwAppear === "Not OK" ? 0 : undefined,
      viewHoriz: data.fieldViewHoriz !== "" ? +data.fieldViewHoriz : null,
      viewVerti: data.fieldViewVert !== "" ? +data.fieldViewVert : null,
      magnification: data.magnif !== "" ? +data.magnif : null,
      diffMagLr: data.diffMagnif !== "" ? +data.diffMagnif : null,
      resolvingPwrL: data.resPowL !== "" ? +data.resPowL : null,
      resolvingPwrR: data.resPowR !== "" ? +data.resPowR : null,
      diopterAdjL: data.adjustEpL !== "" ? +data.adjustEpL : null,
      diopterAdjR: data.adjustEpR !== "" ? +data.adjustEpR : null,
      diopterDiff: data.diffAdjustEp !== "" ? +data.diffAdjustEp : null,
      parallelVertiL: data.nonParallelOpticalVertL === "Aligned" ? 1 : data.nonParallelOpticalVertL === "Not Aligned" ? 0 : undefined,
      parallelVertiR: data.nonParallelOpticalVertR === "Aligned" ? 1 : data.nonParallelOpticalVertR === "Not Aligned" ? 0 : undefined,
      parallelHorizDegL: data.nonParallelOpticalHorizLDegree !== "" ? +data.nonParallelOpticalHorizLDegree : null,
      parallelHorizMinL: data.nonParallelOpticalHorizLMinute !== "" ? +data.nonParallelOpticalHorizLMinute : null,
      parallelHorizDegR: data.nonParallelOpticalHorizRDegree !== "" ? +data.nonParallelOpticalHorizRDegree : null,
      parallelHorizMinR: data.nonParallelOpticalHorizRMinute !== "" ? +data.nonParallelOpticalHorizRMinute : null,
      cleanOptical: data.opticalClean === "OK" ? 1 : data.opticalClean === "Not OK" ? 0 : undefined,
      movementIrisDiaphragm: data.movIris === "Smooth" ? 1 : data.movIris === "Hard/jerky" ? 0 : undefined,
      visualInspStageId: final ? 3 : 1,
      range: data.range,
    },
  };
}

export default function SightPeriScopeForm({
  rowData,
  selectedUploadRow,
  getRecords,
  selectedRow,
  setSelectedRow,
  final,
  formLoading,
  isSubmitted,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveAsDraft, setIsSaveAsDraft] = useState(false);
  const { control, reset, getValues, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all",
  });

  function onSubmit(data) {
    setIsSaving(true);

    axiosInstanceIol
      .post("visualTest/submitVisualTest", createReq(data, rowData, final, selectedUploadRow))
      .then(() => {
        getRecords();
        reset(defaultValues);
        toast.success("Submitted Successfully");
        setSelectedRow(null);
      })
      .catch(console.log)
      .finally(() => setIsSaving(false));
  }

  function onSaveAsDraft() {
    setIsSaveAsDraft(true);
    const req = createReq(getValues(), rowData, final, selectedUploadRow);

    axiosInstanceIol
      .post("visualTest/saveVisualTest", req)
      .then(({ data }) => {
        if (!selectedRow) {
          getRecords(data);
        } else {
          getRecords();
        }
        // reset(defaultValues);
        // setSelectedRow(null)
        toast.success("Saved Successfully");
      })
      .catch(console.log)
      .finally(() => setIsSaveAsDraft(false));
  }

  useEffect(() => {
    if (selectedRow) {
      const data = selectedRow;
      if (data.visualTestDto) {
        reset({
          id: data?.id,
          deviceName: data.devName,
          visualTest: data.visualTestDto?.id || 0,
          outwAppear: data.visualTestDto.outwardAppear === 1 ? "OK" : data.visualTestDto.outwardAppear === 0 ? "Not OK" : "",
          fieldViewHoriz: data.visualTestDto.viewHoriz,
          fieldViewVert: data.visualTestDto.viewVerti,
          magnif: data.visualTestDto.magnification,
          diffMagnif: data.visualTestDto.diffMagLr,
          resPowL: data.visualTestDto.resolvingPwrL,
          resPowR: data.visualTestDto.resolvingPwrR,
          adjustEpL: data.visualTestDto.diopterAdjL,
          adjustEpR: data.visualTestDto.diopterAdjR,
          diffAdjustEp: data.visualTestDto.diopterDiff,
          nonParallelOpticalHorizLDegree: data.visualTestDto.parallelHorizDegL,
          nonParallelOpticalHorizRMinute: data.visualTestDto.parallelHorizMinR,
          nonParallelOpticalHorizLMinute: data.visualTestDto.parallelHorizMinL,
          nonParallelOpticalHorizRDegree: data.visualTestDto.parallelHorizDegR,

          nonParallelOpticalVertL:
            data.visualTestDto.parallelVertiL === 1 ? "Aligned" : data.visualTestDto.parallelVertiL === 0 ? "Not Aligned" : "",
          nonParallelOpticalVertR:
            data.visualTestDto.parallelVertiR === 1 ? "Aligned" : data.visualTestDto.parallelVertiR === 0 ? "Not Aligned" : "",
          opticalClean: data.visualTestDto.cleanOptical === 1 ? "OK" : data.visualTestDto.cleanOptical === 0 ? "Not OK" : "",
          movIris:
            data.visualTestDto.movementIrisDiaphragm === 1 ? "Smooth" : data.visualTestDto.movementIrisDiaphragm === 0 ? "Hard/jerky" : "",
          range: data.visualTestDto.range,
        });
      }
    }
  }, [selectedRow, reset]);

  return (
    <>
      <Controller
        name="deviceName"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <TextField
              {...field}
              required
              label="Device Name"
              disabled={rowData?.isView}
              variant="outlined"
              size="small"
              placeholder="Enter Device Name"
              helperText={fieldState.error?.message}
              error={!!fieldState.error}
            />
          );
        }}
      />

      <form>
        <Table size="small" style={{ border: "1px solid lightgrey", marginTop: 14 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ border: "1px solid white" }}>S.No.</StyledTableCell>
              <StyledTableCell style={{ border: "1px solid white" }}>Test</StyledTableCell>
              <StyledTableCell style={{ border: "1px solid white" }}>Specified Value</StyledTableCell>
              <StyledTableCell style={{ border: "1px solid white" }}>Observed values</StyledTableCell>
              {/* <StyledTableCell style={{ border: "1px solid white" }}>Analysis/Result</StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowList.map((l, i) => (
              <TableRow key={l.id}>
                <StyledTableCell>{i + 1}.</StyledTableCell>
                <StyledTableCell>{l.testName}</StyledTableCell>
                <StyledTableCell>{l.specifiedValue}</StyledTableCell>
                <StyledTableCell>
                  {l.type !== "degMin" ? (
                    <Controller
                      control={control}
                      name={l.fieldName}
                      render={({ field: { value, onChange }, fieldState: { error } }) => {
                        if (l.specifiedValue === "As PER TY" && l.type === "radio") {
                          return (
                            <FormControl error={!!error} disabled={isSubmitted || rowData?.isView}>
                              <RadioGroup row onChange={onChange} value={value}>
                                <FormControlLabel
                                  value="OK"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "OK" ? "green" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      OK
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  value="Not OK"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "Not OK" ? "red" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      Not OK
                                    </Typography>
                                  }
                                />
                              </RadioGroup>
                              <FormHelperText> {error?.message}</FormHelperText>
                            </FormControl>
                          );
                        } else if (l.specifiedValue === "Should be Smooth" && l.type === "radio") {
                          return (
                            <FormControl error={!!error} disabled={isSubmitted || rowData?.isView}>
                              <RadioGroup row onChange={onChange} value={value}>
                                <FormControlLabel
                                  value="Smooth"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "Smooth" ? "green" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      Smooth
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  value="Hard/jerky"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "Hard/jerky" ? "red" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      Hard/jerky
                                    </Typography>
                                  }
                                />
                              </RadioGroup>
                              <FormHelperText> {error?.message}</FormHelperText>
                            </FormControl>
                          );
                        } else if (l.type === "radio") {
                          return (
                            <FormControl error={!!error} disabled={isSubmitted || rowData?.isView}>
                              <RadioGroup row onChange={onChange} value={value} r>
                                <FormControlLabel
                                  value="Aligned"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "Aligned" ? "green" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      Aligned
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  value="Not Aligned"
                                  control={
                                    <Radio
                                      style={{
                                        color: value === "Not Aligned" ? "red" : "inherit",
                                      }}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2" color="textSecondary">
                                      Not Aligned
                                    </Typography>
                                  }
                                />
                              </RadioGroup>
                              <FormHelperText> {error?.message}</FormHelperText>
                            </FormControl>
                          );
                        } else {
                          return (
                            <TextField
                              disabled={isSubmitted || rowData?.isView}
                              InputProps={{
                                style: {
                                  color: !value ? "inherit" : !error ? "green" : "red",
                                },
                              }}
                              type={l.type}
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error?.message}
                              placeholder="Enter Observed Value"
                              size="small"
                              inputProps={{ maxLength: 200 }}
                            />
                          );
                        }
                      }}
                    />
                  ) : (
                    <div style={{ display: "flex", gap: 4 }}>
                      <Controller
                        control={control}
                        name={l.fieldNames[0]}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                          <TextField
                            type="number"
                            style={{ maxWidth: 120 }}
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                            placeholder="0-360"
                            size="small"
                            disabled={isSubmitted || rowData?.isView}
                            InputProps={{ maxLength: 200, endAdornment: <InputAdornment>deg</InputAdornment> }}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={l.fieldNames[1]}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                          <TextField
                            style={{ maxWidth: 100 }}
                            type="number"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error?.message}
                            placeholder="0-60"
                            size="small"
                            disabled={isSubmitted || rowData?.isView}
                            InputProps={{ maxLength: 200, endAdornment: <InputAdornment>min</InputAdornment> }}
                          />
                        )}
                      />
                    </div>
                  )}
                </StyledTableCell>
                {/* <StyledTableCell align="right">
                  <Analysis id={i} />
                </StyledTableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!rowData?.isView && (
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <Button
              onClick={() => {
                if (!getValues("deviceName")) {
                  toast.error("Please enter device name");
                  return;
                }
                // trigger();
                onSaveAsDraft();
              }}
              disabled={isSaveAsDraft || formLoading || isSubmitted}
              size="small"
              variant="contained"
              color="secondary"
            >
              {isSaveAsDraft && <CircularProgress size="25px" />} Save as Draft
            </Button>

            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving || formLoading || isSubmitted}
              size="small"
              variant="contained"
              color="secondary"
            >
              {(isSaving || formLoading) && <CircularProgress size="25px" />} Submit
            </Button>
          </div>
        )}
      </form>
    </>
  );
}
