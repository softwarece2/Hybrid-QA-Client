import { yupResolver } from "@hookform/resolvers/yup";
import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import axiosInstanceIol from "pages/Services/AxiosInstanceIol";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { DialogTitle, StyledTableCell, StyledTableRow } from "Utils";
import * as yup from "yup";
import { saveAs } from "file-saver";

import PrintProduct105 from "./PrintProduct105";
import { useSelector, useDispatch } from "react-redux";
import { selectItem } from "../../../Redux/Actions/SelectTreeItem";

import { ORG_TYPE, USER_ROLE_ID } from "Globals.js";
import Active from "components/Active";
import InActive from "components/InActive";
import ActionButton from "components/ActionButton"
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import VideoInspection from "video/cv2";
import { DeleteOutline, GetApp } from "@material-ui/icons";
import { PaperComponent } from "Utils/D3Tree";
import { OPEN_RI } from "Redux/Types";
import WebCam from "meet";
import { VideoPlayer } from "pages/SOModule/OL/Edit";
import CameraRequest from "video/cameraRequest/CameraRequest";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import Widget from "widget";
import toggleRI from "Redux/Reducer/toggleRI";
import axiosInstanceAte from "pages/Services/AxiosInstanceAte";
import { getAllCameraRequests } from "pages/Services/URLs";

const schema = yup.object().shape({
  id: 0,
  specs: yup
    .array()
    .of(
      yup.object().shape({
        // activeStatus: yup.boolean(),
        obsValTx: yup.string().nullable().when("activeStatus", (activeStatus) => {
          if (activeStatus) {
            return yup.string().typeError("Required").required("Required");
          }
        }),

      })
    )
    .min(1),
});

const buttonStyle = {
  textTransform: "capitalize",
  background: "#5853c7",
  border: 0,
  color: "white",
  paddingBlock: 4,
  paddingInline: 8,
  borderRadius: 4,
  cursor: "pointer",
};

const radioOptionsMap = {
  ok_notok: [
    ["ok", "OK"],
    ["not ok", "Not OK"],
  ],
  aligned_notaligned: [
    ["aligned", "Aligned"],
    ["not aligned", "Not Aligned"],
  ],
  smooth_hard: [
    ["smooth", "Smooth"],
    ["not hard", "Hard/Jerky"],
  ],
  open_close: [
    ["open", "Open"],
    ["not open", "Not Open"],
  ],
  noflik_flik: [
    ["noflik", "Not Flik"],
    ["not noflik", "Flik"],
  ],
  nobreakdown_breakdown: [
    ["breakdown", "Not Breakdown"],
    ["not breakdown", "Breakdown"],
  ],
  opproper_notopproper: [
    ["opproper", "Proper"],
    ["not opproper", "Not Proper"],
  ],
};

// Max file size (10MB)
const maxSize = 10 * 1024 * 1024; // bytes

// Allowed file types
const allowedTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
];

export const labelStyle = {
  padding: "5px 10px",
  borderRadius: "5px",
  fontSize: "0.9em",
  display: "inline-block",
  minWidth: "40px",
  textAlign: "center",
  backgroundColor: "lightgrey",
};

export const passStyle = {
  ...labelStyle,
  textAlign: "center",
  backgroundColor: "green",
  color: "white",
  paddingInline: 8,
  paddingBlock: 4,
};

export const failStyle = {
  ...labelStyle,
  textAlign: "center",
  backgroundColor: "#d10404",
  color: "white",
  paddingInline: 8,
  paddingBlock: 4,
};

const defaultValues = {
  specs: [],
};

export default function Product105({ selectedTest, regNo, ol, roundTest, rowData, samples, qcTest , olNum}) {
  const { control, getValues, reset, handleSubmit, watch, setValue, clearErrors } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  // console.log("selectedTest ", selectedTest);

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const orgTypeId = loggedInUser?.orgTypeId;
  const dispatch = useDispatch();
  const { fields } = useFieldArray({ name: "specs", control });

  const roundTestId = roundTest.id;
  const productId = ol.productId || rowData?.productId;
  const testId = selectedTest.testId;
  const testName = selectedTest.testName;
  // const devId = regNo.id;
  const devId = regNo.serialNoId || roundTest.subSlipSerialNoId || regNo.id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openTvnemPrint, setOpenTvnemPrint] = useState(false);
  const savedValues = getValues();
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [openCam, setOpenCam] = useState(false);
  const [openCameraReq, setOpenCameraReq] = useState(false);
  const [openSavedVideo, setOpenVidePlayer] = useState(false);
  //state that denotes if video cam access was provided; prop passed to <VideoInspection>
  const [videoCamAccess, setVideoCamAccess] = useState(false);

  const regId = samples?.map((number) => number?.regId);
  const prod = samples?.map((number1) => number1?.productId);

  const roleIsAuthorized = loggedInUser?.roleId === 7 || loggedInUser?.roleId === 16;
  const hasAccessToAdd = loggedInUser?.orgTypeId === ORG_TYPE.QA_AGENCY;
  const isOfficer =
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_DC ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_AC ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_DAC ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_AE ||
    loggedInUser?.roleId === USER_ROLE_ID.ROLE_JE || loggedInUser?.roleId === USER_ROLE_ID.ROLE_DO;

  //if user is DO/HSO in Firm QC, they should not access camera access request window
  const isQC = orgTypeId === ORG_TYPE.FIRM;
  async function getObsVal() {
    let url = `ate/getAteByDevIdProdIdTestId/v2/${regNo.id}/${productId}/${testId}/${roundTest?.roundId}`;
    if (qcTest) {
      url = `ate/getAteByDevIdProdIdTestId/v2/${roundTest?.subSlipSerialNoId}/${productId}/${testId}/${roundTest?.roundId}?qa=false`;
    } else if (loggedInUser?.roleId === USER_ROLE_ID.ROLE_INSPECTOR || isOfficer) {
      url = `ate/getAteByDevIdProdIdTestId/v2/${devId}/${productId}/${testId}/${roundTest?.roundId}/?qa=true&olLiId=${ol?.olLineItemId || ol?.id}`;
    } else if (isOfficer) {
      url = `ate/getAteByDevIdProdIdTestId/v2/${regId}/${prod}/${testId}/${roundTest?.roundId}`;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstanceIol.get(url);
      const specs = [];
      const specIds = [];

      data.prodAteDtos.forEach((s) => {
        specs.push({
          ...s,
          status: s.status || "N/A",
        });

        if (s.activeStatus) {
          specIds.push(s.specId);
        }
      })

      reset({
        ...data,
        specs,
      });
      // console.log(specIds);

      setSelected(specIds)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  {/*
  > Function to check whether video camera access is provided for selectedTest, called in useEffect hook below.
  > Toast messages for pending, approved and denied status
  > Auto-opens the Video Inspection element by updating state value of openCam
 */}
  async function checkVideoCameraAccessByTest() {
    try {
      const { data } = await axiosInstanceAte(getAllCameraRequests);
      let statusText = `Camera Access to test ${testName}`;
      // console.log("camAccess " + JSON.stringify(data));

      // .find() returns the first object that matches the condition
      const matchingRecord = data.find(item =>
        Number(item.testId) === Number(testId)
      );
      if (!matchingRecord) {
        console.warn("No camera request record found for testId:", testId);
        setOpenCam(false);
        return;
      }
      const requestStatus = matchingRecord?.statusId;
      switch (requestStatus) {
        case 1:
          statusText += ` pending approval.`;
          toast.info(statusText);
          break;
        case 2:
          statusText += ` approved.`;
          setVideoCamAccess(true);
          setOpenCam(true);
          toast.success(statusText);
          break;
        case 3:
          statusText += ` denied.`;
          setOpenCam(false);
          toast.error(statusText);
          break;

        default:
          statusText += ` unknown statusId.`;
          console.warn(statusText);
          setOpenCam(false);
          break;
      }
    } catch (error) {
      console.error("Error checking camera access:", error);
    }
  }
  useEffect(() => {
    getObsVal();
  }, []);
  useEffect(() => {
    if(!isQC) checkVideoCameraAccessByTest();
  }, []);

  // const productIdQa = hasAccessToAdd ? rowData.productId : "";
  // const olId = hasAccessToAdd ? rowData.offerLetterId : "";

  async function onSubmit(data, isDraft) {
    setSaving(true);

    try {
      const endpoint = isDraft === "isDraft" ? "ate/save" : "ate/submit";

      const req = {
        id: roundTest.id,
        testId: isDraft === "isDraft" ? testId : undefined,
        devId: regNo.id,

        [hasAccessToAdd ? 'olLineItemId' : 'subSlipLineItemId']: ol.id,
        roundId: roundTest.roundId,
        isQa: roundTest.isQa,
        productId,
        ...(hasAccessToAdd && {
          productId: rowData.productId,
          olId: rowData.offerLetterId,
        }),
        prodAteDtos: data.specs.map((spec) => ({
          specId: spec.specId,
          obsValue: spec.obsValTx,
          status: spec.status,
          id: spec.id || 0,
          testId,
          activeStatus: selected.includes(spec.specId),
        })),
      };

      await axiosInstanceIol.post(endpoint, req);
      getObsVal(); // refresh
      const successMessage = isDraft === "isDraft" ? "Saved Successfully" : "Submitted Successfully";
      toast.success(successMessage);
    } catch (error) {
      toast.error("Please Test Atleast One Parameter Before Submitting");
      console.error(error); // Use console.error for errors
    } finally {
      setSaving(false);
    }
  }
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    let checkedSpecs = []
    if (checked) {
      fields.forEach((spec, index) => {
        checkedSpecs.push(spec.specId);
        setValue(`specs.${index}.activeStatus`, true);
      })
    } else {
      fields.forEach((_, index) => {
        setValue(`specs.${index}.activeStatus`, false);
      })
      checkedSpecs = []
    }
    setSelected(checkedSpecs);
  }

  const handleCheckboxChange = (specId, event) => {
    const checked = event.target.checked;
    setSelected((prevSelected) => (checked ? [...prevSelected, specId] : prevSelected.filter((id) => id !== specId)));

    // If a checkbox is unchecked, and selectAll is true, update selectAll to false
    if (!checked && selectAll) {
      setSelectAll(false);
    }
  };
  const specs = watch("specs");
  const isAnyFail = specs?.some((s) => s.status === "Fail");
  const [initialSelected, setInitialSelected] = useState([]);
  const isTestReportFinished = !!savedValues?.submittedDate || isAnyFail;
  //state to check if any cameras are toggled ON
  const [activeCams, setActiveCams]=useState(0);
  //method passed from parent Widget to VideoInspection child, to get number of active cameras
  const checkActiveCams = (value)=>{
    setActiveCams(value);
  }
  //conditional close function lets you close window only if cameras are off. Minimize is allowed.
  const handleVideoInspectionClose = ()=>{
    if(activeCams>0){
      let warn = "";
      (activeCams===1) ? warn = "1 camera stream is still running, please turn it off." : warn = activeCams + " camera streams are still running, please turn them off.";
      toast.info(warn);
    }else{
      setOpenCam(false);
    }
  }

  useEffect(() => {
    if (!isAnyFail) {
      setInitialSelected(selected);
    }
  }, [selected, isAnyFail]);

  useEffect(() => {
    if (!specs?.length) return;

    // FAIL exists
    if (isAnyFail) {
      const updatedSelected = [];

      specs.forEach((spec, index) => {
        const value = spec.obsValTx;
        const status = spec.status;

        const isFilled =
          (value !== null && value !== undefined && value !== "") ||
          (status && status !== "N/A");

        if (status === "Fail") {
          // only failed row active
          setValue(`specs.${index}.activeStatus`, true);
          updatedSelected.push(spec.specId);
        } else if (!isFilled) {
          // empty rows inactive
          setValue(`specs.${index}.activeStatus`, false);
          clearErrors(`specs.${index}.obsValTx`); //IVNV Observation for Handling Required Validation Modified by:Shruti Sanjay Date:07-07-2026
        } else {
          // filled rows remain active
          setValue(`specs.${index}.activeStatus`, true);
          updatedSelected.push(spec.specId);
        }
      });

      setSelected(updatedSelected);
    }

    // FAIL removed → RESTORE PREVIOUS STATE
    else {
      const restoredSelected = [];

      specs.forEach((spec, index) => {
        const wasSelected = initialSelected.includes(spec.specId);

        if (wasSelected) {
          //restore only previously selected rows
          setValue(`specs.${index}.activeStatus`, true);
          restoredSelected.push(spec.specId);
        } else {
          //  keep others inactive
          setValue(`specs.${index}.activeStatus`, false);
        }
      });

      setSelected(restoredSelected);
    }
  }, [isAnyFail, specs, setValue, clearErrors]);
console.log("product5,", olNum)
  return (
    <>
      {openSavedVideo && <VideoPlayer onClose={() => setOpenVidePlayer(false)} loggedInUser={loggedInUser} olNumber={ol?.offerLetterNo} devId={devId} testId={testId} />}
      {openTvnemPrint && (
        <PrintProduct105
          open={openTvnemPrint}
          responseData={savedValues}
          onClose={() => setOpenTvnemPrint(false)}
          ol={ol}
          regNo={regNo}
          testName={testName}
        />
      )}
      <form style={{ position: "relative" }}>
        <Backdrop
          open={loading}
          style={{
            zIndex: 10,
            position: "absolute",
            backgroundColor: "#ffffff80",
            backdropFilter: "blur(1px)",
            alignItems: "flex-start",
            paddingTop: "20%",
          }}
        >
          <Typography>Loading please wait...</Typography>
          <CircularProgress size={16} disableShrink />
        </Backdrop>
        <div
          style={{
            display: "flex",
            gap: 16,
            border: "1px solid lightgrey",
            padding: "8px 16px",
            marginBottom: 8,
            borderRadius: 4,
            justifyContent: "space-between"
          }}
        >
          <Typography>Device No. : {!hasAccessToAdd ? regNo.serialNo : ol.serialNo}</Typography>
          <Typography>
            Line Item No. : <b>{ol?.lineItemNo || ol?.soLineItemNo}</b>
          </Typography>
          <Typography>
            Submitted By : <b>{savedValues?.submittedBy}</b>
          </Typography>
          <Typography>
            Submitted Date : <b>{savedValues?.submittedDate}</b>
          </Typography>
          <Button
            disabled={isTestReportFinished || isQC}
            size="small"
            style={(isTestReportFinished || isQC) ? {
              backgroundColor: "grey",
              color: "white",
              minWidth: 100,
            } : {
              backgroundColor: "green",
              color: "white",
              minWidth: 100,
            }}
            variant="contained"
            onClick={() => {
              if (orgTypeId === ORG_TYPE.QA_AGENCY) {
                setOpenCameraReq(true);
              } else {
                //TODO: check the rowData 
                dispatch({ type: OPEN_RI, olNumber: ol?.offerLetterNo, lineItemNo: rowData?.soLineItemNo, devId: rowData?.devId, testId: rowData?.testId, productId: rowData?.productId });

              }
            }}
          >
            Video Camera Request
          </Button>

          <Button
            disabled={isTestReportFinished}
            size="small"
            style={isTestReportFinished ? {
              backgroundColor: "grey",
              color: "white",
              minWidth: 100,
            } : {
              backgroundColor: "green",
              color: "white",
              minWidth: 100,
            }}
            variant="contained"
            onClick={() => {
              if (orgTypeId === ORG_TYPE.QA_AGENCY || ORG_TYPE.FIRM) {
                // console.log("orgTypeId: ", orgTypeId);
                setOpenCam(true);
              } else {
                //TODO: check the rowData 
                dispatch({ type: OPEN_RI, olNumber: ol?.offerLetterNo, lineItemNo: rowData?.soLineItemNo, devId: rowData?.devId, testId: rowData?.testId, productId: rowData?.productId });

              }
            }}
          >
            Video Cam
          </Button>

          {openCam && (
            <Widget title={"Video Inspection"} onClose={handleVideoInspectionClose}>
              <VideoInspection checkActiveCams={checkActiveCams} regNo={regNo}  camAccess={videoCamAccess} olNum={olNum} olId={ol?.offerLetterId} olLiNum={ol?.soLineItemNo} olLiId={ol?.id} devId={regNo?.id} testId={testId} productId={selectedTest.productId} testName={selectedTest.testName} isQc={isQC} />
            </Widget>
          )}
          {openCameraReq && orgTypeId != ORG_TYPE.FIRM
            && (
              <Dialog open maxWidth={"lg"} fullWidth PaperComponent={(props) => <PaperComponent id="draggable-dialog-title14" {...props} />}>
                <DialogTitle id="draggable-dialog-title14" onClose={() => setOpenCameraReq(false)} style={{ cursor: "move" }}>
                  Video Camera Request Window
                </DialogTitle>
                <DialogContent>
                  {/* <WebCam rowData={rowData} olNumber={ol?.offerLetterNo} onClose={() => setOpenCam(false)} />
                <VideoInspection lineItemNo={rowData?.soLineItemNo} olNumber={ol?.offerLetterNo} devId={rowData?.devId} testId={rowData?.testId} productId={rowData?.productId} onClose={() => setOpenCam(false)} /> */}
                <CameraRequest
                  olId={ol?.offerLetterId}
                  testId={testId}
                  testName={testName}
                  olNumber={ol?.offerLetterNo}
                  onClose={() => setOpenCameraReq(false)}
                  olLiId={ol?.id}
                  devId={regNo?.id}
                  ol={ol}
                />
              </DialogContent>
            </Dialog>
          )}



          <ActionButton
            fullWidth
            variant="contained"
            size="medium"
            color="primary"
            obs={"video"}
            startIcon={<VideocamOutlinedIcon />}
            onClick={() => {
              setOpenVidePlayer(true);
            }}
          // disabled={!rowData?.isReturned}
          >
            Saved Videos
          </ActionButton>
          {/* <Typography>
          Param Code : <b>{getValues("specs")?.length ? getValues("specs")[0].paramCode : "n/a"}</b>
        </Typography>
        <Typography>
          Main type : <b>{getValues("specs")?.length ? getValues("specs")[0]?.mainType : "n/a"}</b>
        </Typography> */}
        </div>
        <TableContainer
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            border: "1px solid lightgrey",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        // label="Select All"
                        disabled={!!savedValues?.submittedDate || isAnyFail || !roleIsAuthorized}
                        checked={selectAll}
                        onChange={handleSelectAll}
                        color="primary"
                        style={{
                          backgroundColor: "secondary",
                          alignContent: "center",
                          color: "white",
                        }}
                      />
                    }
                    label={<p style={{ fontSize: 12 }}>Select All</p>}
                    labelPlacement="end"
                  />
                </StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Status</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>S.No.</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Parameter type</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0, width: 600 }}>Parameter description</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>TY clause no</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Min. value</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Max. value</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Unit</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 15 }}>Observation</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Test Status</StyledTableCell>
                <StyledTableCell style={{ fontSize: 12, padding: 0 }}>Upload</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {fields.map((spec, index) => {
                // const isRowActive = selected.includes(spec.specId);
                const currentValue = watch(`specs.${index}.obsValTx`);
                const currentStatus = specs?.[index]?.status;

                const isRowActive =
                  selected.includes(spec.specId) ||
                  (!!currentValue && currentValue !== "") ||
                  (currentStatus && currentStatus !== "N/A");

                return (
                  <TableRow>
                    <StyledTableCell>
                      <Checkbox
                        disabled={
                          !!savedValues?.submittedDate ||
                          (isAnyFail && currentStatus !== "Fail")|| !roleIsAuthorized
                        }
                        checked={selected.includes(spec.specId)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          setValue(`specs.${index}.activeStatus`, isChecked);

                          if (!isChecked) {
                            // When unchecking, clear values and reset status to N/A
                            setValue(`specs.${index}.obsValTx`, '');
                            setValue(`specs.${index}.status`, 'N/A');
                          }

                          handleCheckboxChange(spec.specId, event);
                        }}
                        color="secondary"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {/* Conditional rendering of Active/Inactive */}
                      {isRowActive ? <Active /> : <InActive />}
                    </StyledTableCell>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{spec.paramType}</StyledTableCell>
                    <StyledTableCell>{spec.specVal}</StyledTableCell>
                    <StyledTableCell>{spec.tyClauseNo}</StyledTableCell>
                    <StyledTableCell>{spec.min}</StyledTableCell>
                    <StyledTableCell>{spec.max}</StyledTableCell>
                    <StyledTableCell>{spec.unit || "-"}</StyledTableCell>
                    <StyledTableCell>
                      <Controller
                        name={`specs.${index}.obsValTx`}
                        control={control}
                        render={({ field, fieldState: { error } }) => {
                          const radioOptions = radioOptionsMap[spec.obsValue];

                          if (radioOptions && spec.obsType === "Boolean") {
                            return (
                              <div style={{ width: 180 }}>
                                {radioOptions.map(([value, label], i) => (
                                  <label key={i}>
                                    <input

                                      type="radio"
                                      value={value}
                                      checked={field.value === value}
                                      onChange={() => {
                                        field.onChange(value);
                                        setValue(`specs.${index}.status`, value === "ok" ? "Pass" : "Fail");
                                      }}
                                      disabled={
                                        !isRowActive ||
                                        !!savedValues?.submittedDate ||
                                        (isAnyFail && currentStatus !== "Fail")
                                      }
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
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  const obsValTx = parseFloat(e.target.value); // convert to number
                                  let res = "N/A";
                                  if (!isNaN(obsValTx)) {
                                    res =
                                      obsValTx >= getValues(`specs.${index}.min`) && obsValTx <= getValues(`specs.${index}.max`)
                                        ? "Pass"
                                        : "Fail";
                                  }
                                  setValue(`specs.${index}.status`, res);
                                }}

                                // disabled={saving || savedValues?.submittedDate || !isRowActive}
                                disabled={
                                  !isRowActive ||
                                  !!savedValues?.submittedDate ||
                                  (isAnyFail && currentStatus !== "Fail")
                                }

                              />
                              <FormHelperText error={error}>{error?.message}</FormHelperText>
                            </div>
                          );
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <GetObsVal
                        watch={watch}
                        index={index}
                        obsValue={watch(`specs.${index}.obsValTx`)}
                        min={getValues(`specs.${index}.min`)}
                        max={getValues(`specs.${index}.max`)}
                        setValue={setValue}
                        spec={spec} // Pass the spec object to GetObsVal
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <FileUploader
                        disabled={!isRowActive || !!savedValues?.submittedDate}
                        spec={spec}
                        user={loggedInUser}
                        productId={productId}
                        testId={testId}
                        devId={devId}
                        roundId={roundTest.roundId}
                        regNo={regNo}
                      />
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 12,
            gap: 12,
          }}
        >
          {saving && <CircularProgress size={20} />}

          {roleIsAuthorized && (
            <>
              <Button
                disabled={saving || !!savedValues?.submittedDate}
                onClick={() => onSubmit(getValues(), "isDraft")}
                size="small"
                variant="contained"
                color="primary"
                style={{ textTransform: "capitalize" }}
              >
                Save as draft
              </Button>
              <Button
                disabled={saving || !!savedValues?.submittedDate}
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
            disabled={!savedValues?.submittedDate}
            onClick={async () => {
              setOpenTvnemPrint(true);
            }}
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

const GetObsVal = ({ watch, index, min, max, obsValue, setValue, spec }) => {
  const result = watch(`specs.${index}.status`);

  useEffect(() => {
    if (obsValue === "" || obsValue === null || obsValue === undefined) {
      setValue(`specs.${index}.status`, "N/A");
      return;
    }

    let res = "N/A";
    // Use a lookup object for string-based pass/fail logic
    const passFailMap = {
      ok: "Pass",
      "not ok": "Fail",
      aligned: "Pass",
      "not aligned": "Fail",
      smooth: "Pass",
      "not hard": "Fail",
      open: "Pass",
      "not open": "Fail",
      noflik: "Pass",
      "not noflik": "Fail",
      breakdown: "Pass",
      "not breakdown": "Fail",
      opproper: "Pass",
      "not opproper": "Fail",
    };

    if (passFailMap[obsValue.toString().toLowerCase()]) {
      res = passFailMap[obsValue.toString().toLowerCase()];
    }
    else if (!isNaN(parseFloat(obsValue))) {
      const numVal = parseFloat(obsValue);
      res = numVal >= min && numVal <= max ? "Pass" : "Fail";
        }

    setValue(`specs.${index}.status`, res);
  }, [obsValue, min, max, setValue, index]);

  const currentStatus = result || "N/A";
  const statusStyle = currentStatus === "Pass"
    ? passStyle
    : currentStatus === "Fail"
      ? failStyle
      : labelStyle; // labelStyle is the default (grey/neutral)

  return <span style={statusStyle}>{currentStatus}</span>;
};

const FileUploader = ({ spec, user, productId, testId, devId, roundId, disabled, regNo }) => {
  const [uploading, setUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState({
    fileDownloadUrl: spec.fileDownloadUrl,
    origFileName: spec.origFileName,
    fileUploadId: spec?.fileUploadId,
  });
  const fileInputRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (fileInputRef.current && fileDetails && !uploading) {
      fileInputRef.current.value = "";
    }
  }, [fileDetails, uploading]);

  const handleFileChange = async (event) => {
    setFileDetails({ fileDownloadUrl: null, origFileName: "", fileUploadId: null });
    setUploading(true);

    setUploading(true);
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a file.");
      setUploading(false);
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds the maximum limit of 10MB.");
      setUploading(false);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed types are PDF, Excel, and images.");
      setUploading(false);
      return;
    }

    const req = {
      origFileName: file.name || "",
      uploadedById: user?.empId,
      devId: regNo.id,
      prodId: productId,
      testId: testId,
      roundId,
      specId: spec.specId,
    };

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ateTestReportUploadDtoStr", JSON.stringify(req));

      const { data } = await axiosInstanceIol.post("ateReport/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileDetails({ fileDownloadUrl: data.fileDownloadUrl, origFileName: data.origFileName, fileUploadId: data?.id });
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("Upload failed.");
      setFileDetails({ fileDownloadUrl: null, origFileName: "", fileUploadId: null });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileDetails?.fileDownloadUrl) return;

    setDownloading(true);

    try {
      const { data } = await axiosInstanceIol.get(fileDetails.fileDownloadUrl, {
        responseType: "blob",
      });
      saveAs(data, fileDetails?.fileDownloadUrl.split("/").pop());
    } catch (error) {
      toast.error("Failed to download file, try again.");
      console.error("Error downloading file:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileDetails?.fileUploadId) return;

    setDeleting(true);

    try {
      const { data } = await axiosInstanceIol.post(`ateReport/delete/${fileDetails?.fileUploadId}`);
      toast.success(data || "File deleted successfully!");
      setFileDetails({ fileDownloadUrl: "", origFileName: "", fileUploadId: "" });
    } catch (error) {
      toast.error("Failed to delete file, try again.");
      console.error("Error deleting file:", error);
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  const onClose = () => setOpenDialog(false);
  const handleOpenDialog = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialog(true);
  };

  return (
    <div>
      {fileDetails.fileDownloadUrl ? (
        <div style={{ display: "flex", gap: 8 }}>
          <button style={buttonStyle} onClick={handleDownload} 
          // disabled={uploading || downloading || disabled}
          >
            <GetApp style={{ fontSize: 12 }} /> {fileDetails?.origFileName}
          </button>
          <button 
  style={{ 
    ...buttonStyle,
    backgroundColor: (uploading || deleting || disabled) ? "#bdbdbd" : "#c75365",
    cursor: (uploading || deleting || disabled) ? " " : "pointer"
  }} 
  onClick={handleOpenDialog} 
  disabled={uploading || deleting || disabled}
>
  <DeleteOutline style={{ fontSize: 16 }} />
</button>
        </div>
      ) : (
        <>
          {uploading ? (
            <div>
              <CircularProgress size={24} color="primary" />
              Uploading...
            </div>
          ) : (
            <input type="file" onChange={handleFileChange} disabled={uploading || disabled} ref={fileInputRef} />
          )}
        </>
      )}

      <Dialog open={openDialog} maxWidth="xs">
        <DialogTitle onClose={onClose}>Delete file: {fileDetails?.origFileName}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Do you want to Delete this file ? </Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="contained" color="primary" onClick={handleDelete} disabled={deleting}>
            {deleting && <CircularProgress size={24} />}
            YES
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={onClose}>
            NO
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
