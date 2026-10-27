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
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { StyledTableCell, StyledTableRow } from "Utils";
import * as yup from "yup";

import PrintProduct110 from "./PrintProduct110";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  id: 0,
  specs: yup
    .array()
    .of(yup.object().shape({ obsVal: yup.string().typeError("Required").required("Required") }))
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
  obsVal: "",
  status: "",
  //   default
  specId: "",
  obsTypeId: "",
  id: 0,
};

const defaultValues = {
  specs: [defaultValuesArr],
};

export default function Product101({ selectedTest, regNo, ol, roundTest }) {
  const { control, getValues, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const { fields } = useFieldArray({ name: "specs", control });
  const productId = ol.productId;
  const testId = selectedTest.testId;
   const roundId = selectedTest.roundId;
  const devId = regNo.id;
  const [saving, setSaving] = useState(false);
  const [specData, setSpecData] = useState([]);
  const [responseData, setResponseData] = useState(null);
 const [openTvnemPrint, setOpenTvnemPrint] = useState(false);
 const roleIsAuthorized =  loggedInUser.roleId === 7 ||  loggedInUser.roleId === 16;
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
      const { data } = await axiosInstanceIol.get(`/ate/getAteByDevIdProdIdTestId/${devId}/${productId}/${testId}/${roundId}`);
     setResponseData(data)
      return data
    } catch (error) {
      console.log(error);
    }
  }
  async function setVal(data){
    const specD = data?.length ? data[0].specDtos : (specData?.[0]?.specDtos||[]) 
    const obsVals = await getSavedObsVal();
    if(Object.keys(obsVals || {})?.length){
      const merged = specD.map((s, i) => ({
        ...s,
        obsVal: obsVals.prodAteDtos?.[i]?.obsValue,
        id: obsVals.prodAteDtos?.[i]?.id,
        specId: s.id,
        status: obsVals.prodAteDtos?.[i]?.status,
      }))
      reset({ id: obsVals.id || 0, specs: merged });
    }else{
      reset({ specs: specD.map(s => ({ ...s, specId: s.id, id: 0 })) || [] });
    }
  }
useEffect(() => {
    (async()=>{
      const data = await getSpecs()
      setVal(data)
    })()
      
  }, []);

  async function onSubmit(data, isDraft) {
    setSaving(true);
    const lastRound = roundTest?.length;
    try {
      if (isDraft === "isDraft") {
        const req = {
          id: roundTest[lastRound-1]?.id || 0,
          testId: testId,
          devId: regNo.id,
          olLineItemId: ol.id,
          roundId: roundTest[lastRound-1]?.roundId,
          isQa: roundTest[lastRound-1]?.isQa,
          productId,
         
          prodAteDtos: data.specs.map((spec) => ({
            specId: spec.specId,
            obsValue: spec.obsVal,
            status: spec.status,
            id: spec.id || 0,
            testId: data.specs[0]?.testId

          })),
        };
        console.log(req,"saved");
        await axiosInstanceIol.post("/ate/save", req);
        await setVal()
        toast.success("Saved Successfully");
      } else {
        const req = {
          id:  roundTest[lastRound-1]?.id  || 0,
          devId: regNo.id,
          olLineItemId: ol.id,
          roundId: roundTest[lastRound-1]?.roundId,
          isQa: roundTest[lastRound-1]?.isQa,
          productId,
          
          prodAteDtos: data.specs.map((spec) => ({
            specId: spec.specId,
            obsValue: spec.obsVal,
            status: spec.status,
            id: spec.id||0,
            testId: data.specs[0]?.testId
          })),
        };
        console.log(req,"sbumit");
        await axiosInstanceIol.post("/ate/submit", req);
        await setVal()
        toast.success("Submitted Successfully");
      }
    } catch (error) {
      toast.error("Failed to save");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

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
         Submitted By : <b>{responseData?.submittedBy}</b>
        </Typography>
          <Typography>
         Submitted Date : <b>{responseData?.submittedDate}</b>
        </Typography>
        {/* <Typography>
          Param Code : <b>{getValues("specs")?.length ? getValues("specs")[0].paramCode : "n/a"}</b>
        </Typography>
        <Typography>
          Main type : <b>{getValues("specs")?.length ? getValues("specs")[0]?.mainType : "n/a"}</b>
        </Typography> */}
      </div>
      <TableContainer style={{ maxHeight: 600, overflowY: "auto", border: "1px solid lightgrey" }}>
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
                    name={`specs.${index}.obsVal`}
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      if (spec.obsTypeId === 4) {
                        return (
                          <div style={{ width: 120 }}>
                            <label style={{ fontSize: 12 }}>
                              <input type="radio" value="ok" checked={field.value === "ok"}
                               onChange={() => field.onChange("ok")} 
                               disabled={saving||responseData?.submittedDate}
                               />
                              OK
                            </label>

                            <label style={{ fontSize: 12 }}>
                              <input
                                type="radio"
                                value="not ok"
                                checked={field.value === "not ok"}
                                onChange={() => field.onChange("not ok")}
                               disabled={saving||responseData?.submittedDate}
                              />
                              Not OK
                            </label>
                            <FormHelperText error={error}>{error?.message}</FormHelperText>
                          </div>
                        );
                      }
                      return (
                        <div>
                          <input type="number" {...field}
                          disabled={saving||responseData?.submittedDate}
                         />
                          <FormHelperText error={error}>{error?.message}</FormHelperText>
                        </div>
                      );
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <GetObsVal
                    obsVal={watch(`specs.${index}.obsVal`)}
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
              onClick={async () => {setOpenTvnemPrint(true); }}
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

function GetObsVal({ min, max, obsVal, setValue, index }) {
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

    if (obsVal === "ok" || obsVal === "not ok") {
      res = obsVal === "ok" ? "Pass" : "Fail";
    } else if (obsVal) {
      res = obsVal >= min && obsVal <= max ? "Pass" : "Fail";
    }
    setResult(res);
    setValue(`specs.${index}.status`, res);
  }, [obsVal, min, max, setValue, index]);

  // console.log(result,"res");

  return <span style={result === "N/A" ? labelStyle : result === "Pass" ? passStyle : failStyle}>{result}</span>;
}
