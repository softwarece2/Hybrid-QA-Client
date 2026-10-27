/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
//material-ui
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Chip,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import { restrict } from "restrict";
import { USER_ROLE_ID } from "../../Globals.js";
//pages

//components
import Button from "components/Button";
import { StyledTableCell, StyledTableRow } from "../../components/UseTable";

import { yupResolver } from "@hookform/resolvers/yup";
import "jspdf-autotable";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import * as yup from "yup";

import CloudDownload from "@material-ui/icons/CloudDownload";
import moment from "moment";
import FileSaver from "file-saver";
import Excel from "exceljs";

import { toast } from "react-toastify";

import {
  scrutinyQaclOL,
  scrutinyQaclSave,
  scrutinyQaclsubmit,
} from "pages/Services/URLs";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";

import OLTable from "pages/Sslip/SSlipTable.js";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ImportCheckList from "ImportCheckList";
import PreviewPrintChecklist from "pages/ScrutinyGI/PreviewPrintChecklist";
import { generatePdf } from "./export";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { handleDownload } from "pages/ApprovalCycle/ApprovalCycleje";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import ViewOfferLetters from "pages/SOModule/SupplyOrderDetails/View/ViewOfferLetters";
//icons
const useStyles = makeStyles((theme) => ({
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  buttonProgress: {
    color: "white",
  },
  leftRoot: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  rightRoot: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    minWidth: 80,
    fontSize: 12,
    padding: 5,
  },
  acceptColor: {
    "&.Mui-selected": {
      color: "black",
      backgroundColor: "#B1E9AF",
    },

    "&:hover": {
      backgroundColor: "#B1E9AF !important",
      color: "black",
    },
  },
  rejectColor: {
    "&.Mui-selected": {
      backgroundColor: "#E9AFAF",
      color: "black",
    },
    "&:hover": {
      backgroundColor: "#E9AFAF !important",
      color: "black",
    },
  },
  value: {
    color: theme.palette.primary.main,
  },
}));

const headCells = [
  { id: "slNo", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "reference",
    label: "Aspects to be checked",
    align: "left",
    disableSorting: true,
  },
  {
    id: "obsSts",
    label: "Observation",
    align: "left",
    disableSorting: true,
  },
  {
    id: "remarks",
    label: "Remarks",
    align: "left",
    disableSorting: true,
  },
];
// const arraySchema = yup.object().shape({
//   obsSts: yup.string().trim().required("required"),
//   remarks: yup
//     .string()
//     .trim()
//     .when("obsSts", (obsSts) => {
//       console.log(obsSts[0], "obsSts");
//       if (obsSts[0] === "no") {
//         return yup.string().trim().required("Required").typeError("Required");
//       }
//     }),
// });
const arraySchema = yup.object().shape({
  obsSts: yup.string().trim().required("required"),
  remarks: yup.string().trim(),
  // .when("obsSts", {
  //   is: (obsSts) => obsSts === "no",
  //   then: (schema) =>
  //     schema
  //       .required("This field is required")
  //       .typeError("This field is required"),
  //   otherwise: (schema) => schema.nullable(),
  //   // Or schema.optional(), depending on your needs
  // }),
});

const schema = yup.object().shape({
  scrutinyQACL: yup.array().of(arraySchema).required("Must have fields"),
});

const defaultArray = {
  id: 0,
  slNo: "",
  checklistId: "",
  remarks: "",
  part: "",
  obsSts: "true",
};

export function groupBy(array, keyFn) {
  const groups = {};
  for (const obj of array) {
    const key = keyFn(obj);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(obj);
  }
  return groups;
}

export default function QACLScrutiny({ inObj }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);

  const empId = useSelector((state) => state?.loggedInUser?.empId);

  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openImport, setOpenImport] = useState(false);
  const [groupedData, setGroupedData] = useState({});

  const [isReturnOl, setIsReturnOl] = useState(false);

  const defaultValues = {
    scrutinyQACL: [defaultArray],
  };

  const {
    handleSubmit,
    getValues,

    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        scrutinyQaclOL + (inObj?.id || inObj?.offerLetterId)
      );
      setResponseData(data);
      const MappedData = data?.qaclDetDtos?.map((item) => ({
        id: item?.id,
        slNo: item?.slNo,
        checklistId: item.checklistScrutinyQaclId,
        remarks: item?.remarks,
        reference: item?.reference,
        obsSts:
          item.obsSts === "no" ? "no" : item.obsSts === "yes" ? "yes" : "yes",
        obsType: item?.obsType,
        part: item.part,
      }));
      reset({
        scrutinyQACL: MappedData,
      });
      setGroupedData(groupBy(data?.qaclDetDtos || [], (obj) => obj.part) || {});
      setResponseData(data);
    } catch (error) {
      toast.error("error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    getData();
  };
  React.useEffect(() => {
    getData();
  }, []);

  ////  save drafts
  const onFormSave = (importData) => {
    setLoadingDraft(true);
    let req = {
      id: responseData.id,
      offerLetterId: inObj?.id ?? inObj?.offerLetterId,
      createdBy: empId,
      qaclDetDtos: getValues("scrutinyQACL")?.map((item) => ({
        id: item.id,
        checklistScrutinyQaclId: item.checklistId,
        remarks: item.remarks,
        part: item.part,
        obsSts: item.obsSts,
      })),
    };
    if (importData) {
      const isValid = importData.every(
        (el) => el.obsSts === "yes" || el.obsSts === "no"
      );
      if (!isValid) {
        toast.error("Invalid Excel Data");
        return;
      }
      if (responseData.id === 0) {
        req = {
          id: responseData.id,
          offerLetterId: inObj?.id ?? inObj?.offerLetterId,

          qaclDetDtos: importData.map((el) => ({
            id: 0,
            checklistScrutinyQaclId: responseData?.qaclDetDtos?.find(
              (item) => item?.slNo === el?.slNo
            )?.checklistScrutinyQaclId,
            obsSts: el.obsSts,
            remarks: el?.remarks || "",
            part: el.part,
          })),
        };
      } else {
        req = {
          id: responseData.id,
          offerLetterId: inObj?.id ?? inObj?.offerLetterId,
          qaclDetDtos: importData.map((el) => ({
            id:
              responseData?.qaclDetDtos?.find((item) => item?.slNo === el.slNo)
                ?.id || 0,
            checklistScrutinyQaclId: responseData?.qaclDetDtos?.find(
              (item) => item?.slNo === el?.slNo
            )?.checklistScrutinyQaclId,
            obsSts: el.obsSts,
            remarks: el?.remarks || "",
            part: el.part,
          })),
        };
      }
    }
    axiosInstance
      .post(scrutinyQaclSave, req)
      .then((res) => {
        setOpenImport(false);
        getData();
        toast.success("Saved Successfully");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Failed to save ");
      })
      .finally(() => setLoadingDraft(false));
  };

  ////  Submit form
  const onFormSubmit = () => {
    setSaveDialog(true);
  };

  const handleFinalSubmit = async () => {
    setLoadingSubmit(true);
    const value = {
      id: responseData.id,
      offerLetterId: inObj?.id ?? inObj?.offerLetterId,
      createdBy: empId,
      inspectedBy: responseData.responseData,
      isReturnOL: isReturnOl,
      qaclDetDtos: getValues("scrutinyQACL")?.map((item) => ({
        id: item.id,
        checklistScrutinyQaclId: item.checklistId,
        remarks: item.remarks,
        part: item.part,
        obsSts: item.obsSts,
      })),
    };
    axiosInstance
      .post(scrutinyQaclsubmit, value)
      .then(({ data }) => {
        setSaveDialog(false);
        toast.success("Saved Successfully ");
        getData();
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Failed to save ");
        setLoadingSubmit(false);
      })
      .finally(() => setLoadingSubmit(false));
  };

  const printExcel = async () => {
    try {
      // const { data: checkList } = await axiosInstanceMaster.get(
      //   checklistScrutinyQaclGetAll
      // );
      const wb = new Excel.Workbook();
      const now = moment(new Date()).format("DD-MM-YYYY");
      const time = new Date().toLocaleTimeString();
      const data = getValues("scrutinyQACL")?.map((d) => [
        d.slNo,
        d.reference,
        d.obsSts,
        d.remarks,
      ]);
      const sheet = wb.addWorksheet("Inspection PDI of Spares");
      const tableData = data.map((r, i) => [...r]);
      const wsData = [
        ["Sl.No", "Aspects to be checked", "Observation", "Remarks"],
        ...tableData,
      ];

      sheet.columns = [
        { width: 6 },
        { width: 100 },
        { width: 20 },
        { width: 80 },
        ...Array(3).fill({ width: 30 }),
      ];
      sheet.addRows(wsData);
      const range = (start, end) =>
        Array.from({ length: end }, (_, i) => i + start);

      range(1, 18).forEach(
        (c) =>
          (sheet.getColumn(c).alignment = {
            vertical: "middle",
            horizontal: "left",
          })
      );
      ["A1", "B1", "C1"].forEach(
        (e) => (sheet.getCell(e).font = { bold: true })
      );

      wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, `scrutiny-qacl${now}, ${time}.xlsx`);
      });
    } catch (error) {
      toast.error("Failed to download");
    }
  };

  const enable = responseData.soStatusId === 2;

  const hasSubmitAccess =
    user_role === USER_ROLE_ID.ROLE_AE ||
    user_role === USER_ROLE_ID.ROLE_JE ||
    user_role === USER_ROLE_ID.ROLE_INSPECTOR;

  return (
    <>
      {openImport && (
        <ImportCheckList
          setOpen={setOpenImport}
          onClose={() => {
            setOpenImport(false);
          }}
          url={scrutinyQaclSave}
          refresh={refreshData}
          onSubmit={onFormSave}
          isLoading={loadingDraft}
          columns={headCells}
        />
      )}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            type="Close"
            onClick={() => {
              if (
                user_role === 2 ||
                user_role === 3 ||
                user_role === 4 ||
                user_role === 5 ||
                user_role === 6
              ) {
                dispatch(selectItem(<ViewOL />));
              } else if (user_role === 9) {
                dispatch(selectItem(<OLTable />));
              }
              // else if ((loggedInUser.roleId === 2) === 3) {
              //   dispatch(selectItem(<ViewOfferLetters />));
              // }
              else {
                dispatch(selectItem(<InspectOLTable />));
              }
            }}
            variant="contained"
            color="Secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
            // disabled={loading || !isDirty}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={2} style={{ padding: "30px" }}>
        <Typography className={classes.heading} align="center">
          <b>SQAEL/SEC/ANVIII/7.5.3/FRM-32</b>
        </Typography>
        <Typography className={classes.heading} align="center">
          SCRUTINY OF QACL
        </Typography>
        {user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={8} lg={10} xl={10} align="right">
              <Button
                variant="contained"
                color="primary"
                // size="small"
                // className={classes.buttonImport}
                endIcon={<CloudDownload />}
                onClick={() => {
                  printExcel();
                }}
              >
                Download Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2} align="right">
              <Button
                variant="contained"
                color="primary"
                disabled={responseData?.submittedDate}
                endIcon={<CloudDownload />}
                onClick={(e) => {
                  setOpenImport(true);
                }}
              >
                Upload Excel
              </Button>
            </Grid>
          </Grid>
        )}
        <br />
        <Grid container spacing={1} style={{ paddingBlock: "15px" }}>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO No & Date : </span>
              {responseData?.orderNo} , {responseData?.orderDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Item :</span>{" "}
              {responseData?.description}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}> Qty offered : </span>{" "}
              {responseData?.offeredQty}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}> QACL No & Offer Date : </span>{" "}
              {responseData?.olNumber} {responseData?.offerDate}
            </Typography>
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {Object.entries(groupedData).map(([key, value]) => {
          if (key === "1") {
            return (
              <React.Fragment key={key}>
                <TableContainer>
                  <Table
                    style={{
                      position: "relative",
                      border: "1px solid lightgrey",
                    }}
                    size="small"
                    aria-label="simple table"
                    id="data-table-cleanliness-report-A"
                    stickyHeader
                  >
                    <TableHead>
                      <StyledTableRow>
                        {headCells.map((el) => (
                          <StyledTableCell key={el.id}>
                            {el.label}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {value.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell className={classes.tableCell}>
                            {item.slNo}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item.reference}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            style={{ width: "150px" }}
                          >
                            <Controller
                              control={control}
                              name={`scrutinyQACL[${index}].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    row
                                    onChange={onChange}
                                  >
                                    <FormControlLabel
                                      value="yes"
                                      disabled={
                                        responseData?.submittedDate ||
                                        user_role !==
                                          USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                      control={<Radio />}
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value="no"
                                      disabled={
                                        responseData?.submittedDate ||
                                        user_role !==
                                          USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                      control={<Radio />}
                                      label="No"
                                    />
                                  </RadioGroup>
                                  <FormHelperText
                                    error={
                                      !!errors?.scrutinyQACL?.[index]?.obsSts
                                    }
                                  >
                                    {
                                      errors?.scrutinyQACL?.[index]?.obsSts
                                        ?.message
                                    }
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell style={{ width: "250px" }}>
                            <Controller
                              control={control}
                              name={`scrutinyQACL[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  value={value}
                                  size="small"
                                  inputProps={{
                                    readOnly:
                                      responseData?.submittedDate ||
                                      user_role !== USER_ROLE_ID.ROLE_INSPECTOR,
                                    maxLength: 500,
                                  }}
                                  placeholder="Remarks"
                                  onInput={restrict.general}
                                  error={
                                    !!errors?.scrutinyQACL?.[index]?.remarks
                                  }
                                  helperText={
                                    errors?.scrutinyQACL?.[index]?.remarks
                                      ?.message
                                  }
                                />
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            );
          }
          if (key === "2") {
            return (
              <React.Fragment key={key}>
                <TableContainer
                  style={{ maxHeight: "600px", marginTop: "14px" }}
                >
                  <Table
                    style={{
                      position: "relative",
                      border: "1px solid lightgrey",
                    }}
                    size="small"
                    aria-label="simple table"
                    id="data-table-cleanliness-report-B"
                    stickyHeader
                  >
                    <TableHead>
                      <StyledTableRow>
                        {headCells.map((el) => (
                          <StyledTableCell key={el.id}>
                            {el.label}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {value.map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell className={classes.tableCell}>
                            {item.slNo}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item.reference}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            style={{ width: "150px" }}
                          >
                            <Controller
                              control={control}
                              name={`scrutinyQACL[${
                                index + groupedData[1].length
                              }].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    row
                                    onChange={(event) => {
                                      const selectedValue = event.target.value;
                                      onChange(event); // Update the form value
                                    }}
                                  >
                                    <FormControlLabel
                                      value="yes"
                                      disabled={
                                        responseData?.submittedDate ||
                                        user_role !==
                                          USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                      control={<Radio />}
                                      label="Yes"
                                    />
                                    <FormControlLabel
                                      value="no"
                                      disabled={
                                        responseData?.submittedDate ||
                                        user_role !==
                                          USER_ROLE_ID.ROLE_INSPECTOR
                                      }
                                      control={<Radio />}
                                      label="No"
                                    />
                                  </RadioGroup>
                                  <FormHelperText
                                    error={
                                      !!errors?.scrutinyQACL?.[
                                        index + groupedData[1].length
                                      ]?.obsSts
                                    }
                                  >
                                    {
                                      errors?.scrutinyQACL?.[
                                        index + groupedData[1].length
                                      ]?.obsSts?.message
                                    }
                                  </FormHelperText>
                                </>
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell style={{ width: "250px" }}>
                            <Controller
                              control={control}
                              name={`scrutinyQACL[${
                                index + groupedData[1].length
                              }].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  multiline
                                  fullWidth
                                  variant="outlined"
                                  value={value}
                                  size="small"
                                  inputProps={{
                                    readOnly:
                                      responseData?.submittedDate ||
                                      user_role !== USER_ROLE_ID.ROLE_INSPECTOR,
                                    maxLength: 500,
                                  }}
                                  placeholder="Remarks"
                                  onInput={restrict.general}
                                  error={
                                    !!errors?.scrutinyQACL?.[
                                      index + groupedData[1].length
                                    ]?.remarks
                                  }
                                  helperText={
                                    errors?.scrutinyQACL?.[
                                      index + groupedData[1].length
                                    ]?.remarks?.message
                                  }
                                />
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            );
          }
          return null; // If you want to handle other keys differently or skip them
        })}

        <Grid container spacing={1} style={{ marginTop: 10 }}>
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Examiner(Division)
            </Typography>
            <Typography variant="body1" gutterBottom>
              Signature :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Name :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Designation :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date :
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5}></Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Vetted by
            </Typography>
            <Typography variant="body1" gutterBottom>
              Signature :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Name :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Designation :
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date :
            </Typography>
          </Grid>
        </Grid>

        {/* actions */}
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
            {!responseData?.submittedDate && hasSubmitAccess && (
              <Button
                onClick={() => {
                  onFormSave();
                }}
                variant="contained"
                disabled={loadingDraft || !responseData}
                color="secondary"
              >
                {loadingDraft && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}{" "}
                Save as Draft
              </Button>
            )}
            {!responseData?.submittedDate && hasSubmitAccess && (
              <Button
                onClick={handleSubmit(onFormSubmit)}
                style={{ margin: "0px 8px" }}
                variant="contained"
                disabled={!responseData}
                color="primary"
              >
                Submit
              </Button>
            )}

            {user_role === USER_ROLE_ID.ROLE_QAO && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSaveDialog(true);
                  setIsReturnOl(true);
                }}
                disabled={!enable}
              >
                Return QACL
              </Button>
            )}

            {responseData?.submittedDate && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenScrutinyView(true);
                  }}
                >
                  Preview
                </Button>
                <Button
                  style={{ marginLeft: "8px" }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    generatePdf(responseData.qaclDetDtos, responseData);
                  }}
                >
                  Export Pdf
                </Button>
              </>
            )}
          </Grid>
        </Grid>
        {responseData?.submittedDate && (
          <RemarksForm
            responseData={responseData}
            user_role={user_role}
            refreshData={refreshData}
          />
        )}
      </Paper>
      {openScrutinyView && (
        <PreviewPrintChecklist
          title={"SQAEL/SEC/ANVIII/7.5.3/FRM-32"}
          subTitle={"SCRUTINY OF QACL"}
          inObj={inObj?.id || inObj?.offerLetterId}
          data={getValues("scrutinyQACL")}
          columns={headCells}
          onClose={() => {
            setOpenScrutinyView(false);
          }}
          additionalInfo={
            <Grid container spacing={1} style={{ paddingBlock: "15px" }}>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Typography style={{ fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 500 }}>SO No & Date : </span>
                  {responseData?.orderNo} , {responseData?.orderDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Typography style={{ fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 500 }}>Item :</span>{" "}
                  {responseData?.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Typography style={{ fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 500 }}> Qty offered : </span>{" "}
                  {responseData?.offeredQty}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Typography style={{ fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: 500 }}>
                    {" "}
                    QACL No & Offer Date :{" "}
                  </span>{" "}
                  {responseData?.olNumber} {responseData?.offerDate}
                </Typography>
              </Grid>
            </Grid>
          }
        />
      )}
      <Dialog
        open={saveDialog}
        onClose={() => {
          setSaveDialog(false);
          setLoadingSubmit(false);
        }}
        maxWidth="lg"
      >
        <DialogContent>
          {isReturnOl ? (
            <Typography variant="h6">
              Are you sure you want to Return OL
            </Typography>
          ) : (
            <Typography variant="h6">
              Are you sure you want to submit?
            </Typography>
          )}
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleFinalSubmit}
            color="primary"
            variant="contained"
            disabled={loadingSubmit}
            size="small"
          >
            {loadingSubmit && <CircularProgress size={24} color="primary" />}{" "}
            &nbsp; Yes
          </Button>
          <Button
            onClick={() => {
              setSaveDialog(false);
            }}
            color="secondary"
            variant="contained"
            size="small"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaultValues = { remarks: "", soStatus: "" };
function RemarksForm({ responseData, user_role, refreshData }) {
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);

  const [selectedFileToUpload, setSelectedFileToUpload] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (!!responseData.qaoSubmittedDate) {
      reset({
        remarks: responseData.qaoRemarks,
        soStatus: responseData.soStatus === "Approved" ? 1 : 2,
      });
    }
  }, []);

  const onFormSave = (data) => {
    if (data.remarks.trim()) {
      setSubmitting(true);
      const req = {
        id: responseData.id,
        qaoRemarks: data.remarks,
        soStatusId: data.soStatus,
      };
      const formData = new FormData();
      formData.append("scrutinyQacl", JSON.stringify(req));
      for (let i = 0; i < selectedFileToUpload.length; i++) {
        formData.append("attachments", selectedFileToUpload[i]);
      }
      axiosInstance
        .post("scrutinyQacl/updateQaclByQAO", formData)
        .then(({ data }) => {
          if (data === true) {
            toast.success("Updated successfully");
            refreshData();
          } else {
            toast.error("Failed to update!, try again");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to update!, try again");
        })
        .finally(() => setSubmitting(false));
    } else {
      toast.error("Fill the Remarks");
    }
  };

  const handleUploadImage = (e) => {
    const files = e.target.files;
    const newArr = [];
    for (let i = 0; i < files.length; i++) {
      newArr.push(files[i]);
    }
    setSelectedFileToUpload((ps) => [...ps, ...newArr]);
  };
  const handleDeleteFile = (name) => {
    const filterFile = selectedFileToUpload.filter((el) => el.name !== name);
    setSelectedFileToUpload(filterFile);
  };

  if (
    loggedInUser?.roleId !== USER_ROLE_ID.ROLE_QAO &&
    !responseData.qaoSubmittedDate
  ) {
    return null;
  }

  if (responseData.qaoSubmittedDate) {
    return (
      <div>
        <Typography gutterBottom>
          <b className={classes.value}>QAO Remarks:</b>{" "}
          {responseData.qaoRemarks}
        </Typography>
        <Typography gutterBottom>
          <b className={classes.value}> Status:</b>{" "}
          <span
            style={{
              color: responseData.soStatus === "Approved" ? "green" : "red",
            }}
          >
            {responseData.soStatus}
          </span>
        </Typography>
        <div>
          <Typography className={classes.value}>
            <b>Attachments:</b>
          </Typography>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {responseData?.qalFileUploads?.map((file) => {
              const fileName = file.split("files/");
              return (
                <Chip
                  label={fileName[1] ?? "olms-uploads"}
                  key={file}
                  onDelete={() => handleDownload(fileName[1], file)}
                  deleteIcon={<CloudDownload />}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSave)}>
      <Typography>QAO Remarks:</Typography>
      <TextField
        {...register("remarks", {
          maxLength: {
            message: "Char. should be less than 1000",
            value: 1000,
          },
          minLength: {
            value: 5,
            message: "Char. should be greater than 4",
          },
          required: true,
        })}
        disabled={
          !!responseData.qaoSubmittedDate || user_role !== USER_ROLE_ID.ROLE_QAO
        }
        labelText="Remarks"
        placeholder="Enter Remarks"
        multiline
        minRows={4}
        required
        maxRows={10}
        variant="outlined"
        fullWidth
        onInput={restrict.general}
        error={!!errors?.remarks}
        helperText={errors.remarks?.message}
      />
      <div style={{ margin: "12px 0px 0px 0px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Controller
              name="soStatus"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl
                  disabled={
                    !!responseData.qaoSubmittedDate ||
                    user_role !== USER_ROLE_ID.ROLE_QAO
                  }
                  style={{ padding: "14px 0px 0px 0px" }}
                >
                  <ToggleButtonGroup
                    exclusive
                    onChange={(_, value) => {
                      onChange(value);
                    }}
                    size="small"
                    value={value}
                  >
                    <ToggleButton
                      classes={{
                        // selected: classes.toggleSelection,
                        root: classes.leftRoot,
                      }}
                      disabled={
                        !!responseData.qaoSubmittedDate ||
                        user_role !== USER_ROLE_ID.ROLE_QAO
                      }
                      className={classes.acceptColor}
                      value={1}
                    >
                      Accept
                    </ToggleButton>
                    <ToggleButton
                      disabled={
                        !!responseData.qaoSubmittedDate ||
                        user_role !== USER_ROLE_ID.ROLE_QAO
                      }
                      classes={{
                        root: classes.rightRoot,
                      }}
                      className={classes.rejectColor}
                      value={2}
                    >
                      Reject&nbsp;
                    </ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={6} lg={3} xl={3}>
            <InputLabel style={{ fontSize: "0.875rem" }}>Attachment</InputLabel>
            <TextField
              disabled={
                !!responseData.qaoSubmittedDate ||
                user_role !== USER_ROLE_ID.ROLE_QAO
              }
              size="small"
              variant="outlined"
              type="file"
              inputProps={{
                multiple: "multiple",
              }}
              onChange={handleUploadImage}
            />
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {selectedFileToUpload?.map((el, index) => (
                <Chip
                  label={
                    <Typography
                      variant="body2"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={el?.name}
                    >
                      {el?.name}
                    </Typography>
                  }
                  size="small"
                  onDelete={() => {
                    handleDeleteFile(el?.name);
                  }}
                  key={index}
                />
              ))}
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ textAlign: "right" }}>
        {user_role === USER_ROLE_ID.ROLE_QAO && (
          <Button
            type="submit"
            disabled={
              !!responseData.qaoSubmittedDate ||
              submitting ||
              user_role === USER_ROLE_ID.ROLE_INSPECTOR
            }
            onClick={handleSubmit((data) => onFormSave(data, 1))}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}
