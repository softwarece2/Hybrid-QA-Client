/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  FormHelperText,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { StyledTableCell, StyledTableRow } from "Utils";
import * as yup from "yup";
import PrintProduct110 from "./PrintProduct110";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  id: 0,
  specs: yup
    .array()
    .of(yup.object().shape({ obsValue: yup.string().typeError("Required").required("Required") }))
    .min(1),
});

const defaultValuesArr = {
  paramCode: "",
  mainType: "",
  paramType: "",
  specVal: "",
  tyClauseNo: "",
  min: "",
  max: "",
  uints: "",
  obsValue: "",
  status: "",
  //   default
  specId: "",
  obsTypeId: "",
  id: 0,
};

const defaultValues = {
  specs: [defaultValuesArr],
};

export default function Product110({ selectedTest, regNo, ol, roundTest }) {
  const { control, getValues, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({ name: "specs", control });
  const productId = ol.productId;
  const testId = selectedTest.testId;
  const devId = regNo.id;
  const [saving, setSaving] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [printDisable, setPrintDisable] = useState(true);
  const [specData, setSpecData] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [openTvnemPrint, setOpenTvnemPrint] = useState(false);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const roleIsAuthorized =  loggedInUser.roleId === 7 ||  loggedInUser.roleId === 16;
  const printRef = useRef(null);
  async function getSpecs() {
    try {
      const { data } = await axiosInstanceAte.get(`spec/getSpecsByProdIdTestId/${productId}/${testId}`);
      setSpecData(data)
      return data
    } catch (error) {
      console.log(error);
    }
  }

  async function getSavedObsVal() {
    try {
      const { data } = await axiosInstanceIol.get(`/ate/getAteByDevIdProdIdTestId/${devId}/${productId}/${testId}/${roundTest.roundId}`);
      setResponseData(data)
      return data
    } catch (error) {
      console.log(error);
    }
  }
  async function setVal(data) {
    const specD = data?.length ? data[0].specDtos : (specData?.[0]?.specDtos || [])
    const obsVals = await getSavedObsVal();
    if (Object.keys(obsVals || {})?.length) {
      const merged = specD.map((s, i) => ({
        ...s,
        obsValue: obsVals.prodAteDtos?.[i]?.obsValue,
        id: obsVals.prodAteDtos?.[i]?.id,
        specId: s.id,
        optionType: s.obsValue,
        status: obsVals.prodAteDtos?.[i]?.status,
      }))
      console.log("testmerg2ed", obsVals)

      reset({ id: obsVals.id || 0, specs: merged });
    } else {
      reset({ specs: specD.map(s => ({ ...s, specId: s.id, id: 0, optionType: s.obsValue })) || [] });
    }
  }


  useEffect(() => {
    (async () => {
      const data = await getSpecs()
      setVal(data)
    })()

  }, []);

  async function onSubmit(data, isDraft) {
    setSaving(true);
    setSubmit(true);
    try {
      if (isDraft === "isDraft") {
        const req = {
          id: roundTest.id || 0,
          devId: regNo.id,
          olLineItemId: ol.id,
          roundId: roundTest.roundId,
          isQa: roundTest.isQa,
          productId,

          prodAteDtos: data.specs.map((spec) => ({
            specId: spec.specId,
            obsValue: spec.obsValue,
            status: spec.status,
            id: spec.id || 0,
            testId: data.specs[0]?.testId
          })),
        };
        console.log(req, "saved");
        await axiosInstanceIol.post("/ate/save", req);
        await setVal()
        toast.success("Saved Successfully");
      } else {
        const req = {
          id: roundTest.id || 0,
          devId: regNo.id,
          olLineItemId: ol.id,
          roundId: roundTest.roundId,
          isQa: roundTest.isQa,
          productId,

          prodAteDtos: data.specs.map((spec) => ({
            specId: spec.specId,
            obsValue: spec.obsValue,
            status: spec.status,
            id: spec.id||0,
            testId: data.specs[0]?.testId
          })),
        };
        console.log(req, "sbumit");
        await axiosInstanceIol.post("/ate/submit", req);
        await setVal()
        toast.success("Submitted Successfully");
      }
    } catch (error) {
      toast.error("Failed to Submit");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  useEffect(() => {
    if (submit) {
      setPrintDisable(false);
    } else {
      setPrintDisable(true);
    }
  }, [submit]);


  return (
    <>
      {openTvnemPrint && (
        <PrintProduct110
          open={openTvnemPrint}
          onClose={() => setOpenTvnemPrint(false)}
          productId={productId}
          testId={testId}
          devId={devId}
          ol={ol}
          regNo={regNo}
          roundTest={roundTest}
        />
      )}
      <form>
        <div style={{ display: "flex", gap: 16, border: "1px solid lightgrey", padding: "8px 16px", marginBottom: 8, borderRadius: 4 }}>
          <Typography>
            Device No. : <b>{regNo.registerNo}</b>
          </Typography>
          <Typography>
            Line Item No. : <b>{ol.soLineItemNo}</b>
          </Typography>

          <Typography>
            Submitted By. : <b>{responseData?.submittedBy}</b>
          </Typography>



          <Typography>
            Submitted Date. : <b>{responseData?.submittedDate}</b>
          </Typography>

        </div>
        <TableContainer style={{ maxHeight: 600, overflowY: "auto", border: "1px solid lightgrey" }} ref={printRef}>
          <Table size="small" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>S.No.</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Parameter type</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Parameter description</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>TY clause no</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Min. value</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Max. value</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Unit</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Observation</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Status</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {fields.map((spec, index) => (
                <TableRow>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{spec.paramType}</StyledTableCell>
                  <StyledTableCell>{spec.specVal}</StyledTableCell>
                  <StyledTableCell>{spec.tyClauseNo}</StyledTableCell>
                  <StyledTableCell>{spec.min}</StyledTableCell>
                  <StyledTableCell>{spec.max}</StyledTableCell>
                  <StyledTableCell>{spec.uints}</StyledTableCell>
                  <StyledTableCell>
                    <Controller
                      name={`specs.${index}.obsValue`}
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        const radioOptions = {
                          'ok_notok': [['ok', 'OK'], ['not ok', 'Not OK']],
                          'aligned_notaligned': [['aligned', 'Aligned'], ['not aligned', 'NotAligned']],
                          'smooth_hard': [['smooth', 'Smooth'], ['not hard', 'not Hard/Jerky']],
                          'open_close': [['open', 'Open'], ['not open', 'Not Open']],
                          'noflik_flik': [['noflik', 'No Flik'], ['not noflik', 'not Flik']],
                          'nobreakdown_breakdown': [['breakdown', 'Breakdown'], ['not breakdown', 'not Breakdown']],
                          'opproper_notopproper': [['opproper', 'Proper'], ['not opproper', 'not Proper']],
                        };
                        const options = radioOptions[spec.optionType];
                        console.log(spec, "test78888")
                        if (options && spec.obsType === "Boolean") {
                          return (
                            <div style={{ width: 180 }}>
                              {options.map(([value, label], i) => (
                                <label key={i}>
                                  <input
                                    type="radio"
                                    value={value}
                                    checked={field.value === value}
                                    onChange={() => field.onChange(value)}
                                    disabled={saving || responseData?.submittedDate}
                                  />
                                  {label}
                                </label>
                              ))}
                              <FormHelperText error={error}>{error?.message}</FormHelperText>
                            </div>
                          );
                        }
                        return (
                          <div>
                            <input
                              type="number" {...field}
                              disabled={saving || responseData?.submittedDate}
                            />

                            <FormHelperText error={error}>{error?.message}</FormHelperText>
                          </div>
                        );

                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <GetObsVal
                      obsValue={watch(`specs.${index}.obsValue`)}
                      min={getValues(`specs.${index}.min`)}
                      max={getValues(`specs.${index}.max`)}
                      setValue={setValue}
                      index={index}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12, gap: 12 }}>
          
        {saving && <CircularProgress size={20} />}

{roleIsAuthorized && (
  
  <>
    <Button
      disabled={saving || responseData?.submittedDate}
      onClick={() => onSubmit(getValues(), "isDraft")}
      size="small"
      variant="contained"
      color="primary"
      style={{ textTransform: "capitalize" }}
    >
      Save as draft
    </Button>
    <Button
      disabled={saving || responseData?.submittedDate}
      onClick={handleSubmit(onSubmit)}
      size="small"
      variant="contained"
      color="secondary"
      style={{ textTransform: "capitalize" }}
    >
      Submit
    </Button>
  </>
  )}
          <Button
            disabled={!responseData?.submittedDate}
            onClick={async () => { setOpenTvnemPrint(true); }}
            size="small"
            variant="contained"
            color="secondary"
            style={{ textTransform: "capitalize" }}
          >
            Preview
          </Button>
        </div>
      </form>
    </>
  );
}
function GetObsVal({ min, max, obsValue, setValue, index, radioOptions, param }) {
  const labelStyle = {
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "0.9em",
    display: "inline-block",
    minWidth: "40px",
    textAlign: "center",
    backgroundColor: "lightgrey",
  };
  const passStyle = {
    ...labelStyle,
    textAlign: "center",
    backgroundColor: "green",
    color: "white",
    paddingInline: 8,
    paddingBlock: 4,
  };
  const failStyle = {
    ...labelStyle,
    textAlign: "center",
    backgroundColor: "#d10404",
    color: "white",
    paddingInline: 8,
    paddingBlock: 4,
  };
  const [result, setResult] = useState("N/A");

  useEffect(() => {
    let res = "N/A";

    if (obsValue) {

      if (obsValue === "ok" || obsValue === "not ok") {
        res = obsValue === "ok" ? "Pass" : "Fail";
      } else if (obsValue === "aligned" || obsValue === "not aligned") {
        res = obsValue === "aligned" ? "Pass" : "Fail";
      } else if (obsValue === "smooth" || obsValue === "not hard") {
        res = obsValue === "smooth" ? "Pass" : "Fail";
      }
      else if (obsValue === "open" || obsValue === "not open") {
        res = obsValue === "open" ? "Pass" : "Fail";
      }
      else if (obsValue === "noflik" || obsValue === "not noflik") {
        res = obsValue === "noflik" ? "Pass" : "Fail";
      }
      else if (obsValue === "breakdown" || obsValue === "not breakdown") {
        res = obsValue === "breakdown" ? "Pass" : "Fail";
      }
      else if (obsValue === "opproper" || obsValue === "not opproper") {
        res = obsValue === "opproper" ? "Pass" : "Fail";
      }
      else {
        // Numeric comparison only if obsValue is numeric
        if (!isNaN(obsValue) && !isNaN(min) && !isNaN(max)) {
          res = (parseFloat(obsValue) >= min && parseFloat(obsValue) <= max) ? "Pass" : "Fail";
        }
      }
    }
    setResult(res);
    setValue(`specs.${index}.status`, res);
  }, [obsValue, min, max, setValue, index]);

  return <span style={result === "N/A" ? labelStyle : result === "Pass" ? passStyle : failStyle}>{result}</span>;
}