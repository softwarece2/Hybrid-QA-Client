/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import * as yup from "yup";
import TextField from "../../components/TextField";
import CloudDownload from "@material-ui/icons/CloudDownload";
import moment from "moment";
import FileSaver from "file-saver";
import Excel from "exceljs";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import {
  scrutinyTenderSave,
  scrutinyTenderSubmit,
  scrutinyTenderTender,
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable.js";
import PreviewPrintChecklist from "./PreviewPrintChecklist.js";
import ImportCheckList from "ImportCheckList.js";
import { selectItem } from "Redux/Actions/SelectTreeItem.js";
import * as File from 'xlsx'; 
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
}));

const headCells = [

  { id: "slNo", label: "SI.No", align: "left", disableSorting: true },
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
  {
    id: "actionAndRef",
    label: "Action Reference",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  actionReference: yup.string().trim().nullable(),
  obsSts: yup.string().trim().required("Required"),
  remarks: yup
    .string()
    .trim()
    .when("obsSts", (obsSts) => {
      if (obsSts[0] === "no") {
        return yup.string().trim().required("Required").typeError("Required");
      }
    }),
});

const schema = yup.object().shape({
  scrutinyTenderDetDtos: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});

export default function SOTenderContract({ inObj, sbuAdmin }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const [open, setOpen] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openImport, setOpenImport] = useState(false);
  const user = useSelector((store) => store.loggedInUser);

  const CloseDialog = () => {
    setSaveDialog(false);
  };
  const defaultValues = {
    scrutinyTenderDetDtos: [],
  };

  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "scrutinyTenderDetDtos",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance(scrutinyTenderTender + inObj.id);
      reset({
        scrutinyTenderDetDtos: data.scrutinyTenderDetDtos?.map((el) => ({
          ...el,
          obsSts: el?.obsSts === "no" ? "no" : el?.obsSts === "yes" ? "yes" : "yes",
        })),
      });
      setResponseData(data);
    } catch (error) {
      console.log("error");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const onFormSave = async (importData) => {
    try {
      setLoadingDraft(true);
      let req = {
        id: responseData.id,
        supplyOrderId: inObj?.id,
        scrutinyTenderDetDtos: getValues("scrutinyTenderDetDtos").map((el) => ({
          id: el.id || 0,
          checklistScrutinyTenderId: el.checklistScrutinyTenderId,
          obsSts: el.obsSts,
          remarks: el.remarks,
          actionAndRef: el.actionAndRef,
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
            supplyOrderId: inObj?.id,
            scrutinyTenderDetDtos: importData.map((el) => ({
              id: 0,
              checklistScrutinyTenderId: el?.slNo,
              obsSts: el.obsSts,
              remarks: el?.remarks || "",
              actionAndRef: el.actionAndRef,
            })),
          };
        } else {
          req = {
            id: responseData.id,
            supplyOrderId: inObj?.id,
            scrutinyTenderDetDtos: importData.map((el) => ({
              id:
                responseData?.scrutinyTenderDetDtos?.find(
                  (item) => item?.slNo === el.slNo
                )?.id || 0,
              checklistScrutinyTenderId: el?.slNo,
              obsSts: el.obsSts,
              remarks: el?.remarks || "",
              actionAndRef: el.actionAndRef,
            })),
          };
        }
      }

      toast.success("Saved Successfully");
      getData();
      setOpenImport(false);
    } catch (error) {
      toast.error("Failed to save data");
    } finally {
      setLoadingDraft(false);
    }
  };

  ////  Submit form
  const onFormSubmit = async () => {
    setSaveDialog(true);
  };

  const handleFinalSubmit = async () => {
    try {
      setLoadingSubmit(true);
      const req = {
        id: responseData.id,
        supplyOrderId: inObj?.id,
        sectionOfficerId: user.empId,

        scrutinyTenderDetDtos: getValues("scrutinyTenderDetDtos")?.map(
          (el) => ({
            slNo: el?.slNo,
            id: el.id,
            checklistScrutinyTenderId: el.checklistScrutinyTenderId,
            scrutinyTenderId: responseData.id,
            obsSts:
              el.obsSts === "no" ? "no" : el.obsSts === "yes" ? "yes" : "yes",
            remarks: el.remarks,
            actionAndRef: el.actionAndRef,
          })
        ),
      };
      const { data: result } = await axiosInstance.post(
        scrutinyTenderSubmit,
        req
      );
      toast.success("Saved Successfully");
      setSaveDialog(false);
      getData();
    } catch (error) {
      toast.error("Failed to submit");
      setLoadingSubmit(false);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const printExcel = async () => {
    const wb = new Excel.Workbook();
    const now = moment(new Date()).format("DD-MM-YYYY");
    const time = new Date().toLocaleTimeString();
    const data = getValues("scrutinyTenderDetDtos")?.map((d) => [
      d.slNo,
      d.reference,
      d?.obsSts,
      d.remarks,
      d?.actionAndRef,
    ]);
    const sheet = wb.addWorksheet("SO_PO Scrutiny");
    const tableData = data.map((r, i) => [...r]);
    const wsData = [
      [
        "SI.No",
        "Aspects to be checked",
        "Observation",
        "Remarks",
        "Action Reference",
      ],
      ...tableData,
    ];
    sheet.columns = [
      { width: 6 },
      { width: 100 },
      { width: 30 },
      ...Array(3).fill({ width: 60 }),
    ];
    // Add dropdown validation to OBSERVATION column
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
    ["A1", "B1", "C1", "D1", "E1"].forEach(
      (e) => (sheet.getCell(e).font = { bold: true })
    );

    wb.xlsx
      .writeBuffer()
      .then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, `Scrutiny-tender-contract-${now}, ${time}.xlsx`);
      })
      .catch((error) => {
        toast.error("Failed to download", error);
      });
  };

  const refreshData = () => {
    getData();
  };
  console.log(errors, "eee");
  return (
    <>
      {openImport && (
        <ImportCheckList
          onClose={() => {    setOpenImport(false);    }}
          url={scrutinyTenderSave}
          refresh={refreshData}
          onSubmit={onFormSave}
          isLoading={loadingDraft}
          columns={headCells}
        />
      )}
      {loggedInUser.orgTypeId !== 2 && (
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}
        >
          <Grid item xs={12} align="left">
            <Button
              type="submit"
              onClick={() => dispatch(selectItem(<InspectSOArmyTable />))}
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      )}
      <Paper elevation={2} style={{ padding: "30px" }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
            <Typography className={classes.heading}>
              SQAEL/SEC/ANVIII/7.5.3/FRM-28444
            </Typography>
            <Typography className={classes.heading}>
              Scrutiny of Supply Order/Acceptance of Tender/Contracts
            </Typography>
          </Grid>
        </Grid>
        {user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={8} lg={10} xl={10} align="right">
              <Button
                variant="contained"
                color="primary"
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
                disabled={responseData?.submittedDatetime}
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
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>File No. : </span>
              {inObj?.fileNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO/AT No. :</span>{" "}
              {inObj?.orderNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Applicable To : </span>{" "}
              Army/ Air Force/ Navy/ DGOF/ DGBR/ Para Military/ Engr Regt/ Civil Govt
            </Typography>
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {responseData && (
          <>
            <TableContainer style={{ maxHeight: "600px" }}>
              <Table
                style={{
                  position: "relative",
                  border: "1px solid lightgrey",
                }}
                size="small"
                aria-label="simple table"
                id="data-table-cleanliness-report"
                stickyHeader
              >
                <TableHead>
                  <StyledTableRow>
                    {headCells.map((el) => (
                      <StyledTableCell key={el.id}>{el.label}</StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {fields?.map((item, index) => (
                    <>
                      <StyledTableRow>
                        <StyledTableCell className={classes.tableCell}>
                          {index + 1}
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
                            name={`scrutinyTenderDetDtos[${index}].obsSts`}
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
                                    control={<Radio />}
                                    label="Yes"
                                    disabled={
                                      responseData?.submittedDatetime ||
                                      user_role !==
                                      USER_ROLE_ID.ROLE_INSPECTOR
                                    }
                                  />
                                  <FormControlLabel
                                    value="no"
                                    control={<Radio />}
                                    label="No"
                                    disabled={
                                      responseData?.submittedDatetime ||
                                      user_role !==
                                      USER_ROLE_ID.ROLE_INSPECTOR
                                    }
                                  />
                                </RadioGroup>
                                <FormHelperText
                                  error={
                                    !!errors?.scrutinyTenderDetDtos?.[index]
                                      ?.obsSts
                                  }
                                >
                                  {
                                    errors?.scrutinyTenderDetDtos?.[index]
                                      ?.obsSts?.message
                                  }
                                </FormHelperText>
                              </>
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          style={{ width: "200px" }}
                        >
                          <Controller
                            control={control}
                            name={`scrutinyTenderDetDtos[${index}].remarks`}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                value={value}
                                size="small"
                                // multiline
                                disabled={sbuAdmin}
                                inputProps={{
                                  readOnly:
                                    responseData?.submittedDatetime ||
                                    user_role !==
                                    USER_ROLE_ID.ROLE_INSPECTOR,
                                  maxLength: 500,
                                }}
                                placeholder="Observation"
                                onInput={restrict.general}
                                error={
                                  !!errors?.scrutinyTenderDetDtos?.[index]
                                    ?.remarks
                                }
                                helperText={
                                  errors?.scrutinyTenderDetDtos?.[index]
                                    ?.remarks?.message
                                }
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.remarks}
                          style={{ width: "200px" }}
                        >
                          <Controller
                            control={control}
                            name={`scrutinyTenderDetDtos[${index}].actionAndRef`}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                fullWidth
                                value={value}
                                size="small"
                                // multiline
                                inputProps={{
                                  readOnly:
                                    responseData?.submittedDatetime ||
                                    user_role !==
                                    USER_ROLE_ID.ROLE_INSPECTOR,
                                  maxLength: 500,
                                }}
                                placeholder="Action Reference"
                                onInput={restrict.general}
                                error={
                                  !!errors?.scrutinyTenderDetDtos?.[index]
                                    ?.actionReference
                                }
                                helperText={
                                  errors?.scrutinyTenderDetDtos?.[index]
                                    ?.actionReference?.message
                                }
                              />
                            )}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              container
              spacing={0}
              style={{ paddingTop: 15, paddingBottom: 10 }}
            >
              <Grid item xs={7} sm={7} md={7} lg={7} xl={9} align="right" />

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
                {!responseData?.submittedDatetime &&
                  user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                    <Button
                      onClick={() => {
                        onFormSave();
                      }}
                      variant="contained"
                      disabled={loadingDraft || !responseData || loading}
                      color="secondary"
                    >
                      {loadingDraft && (
                        <CircularProgress size={24} color="primary" />
                      )}{" "}
                      Save as Draft
                    </Button>
                  )}
                {!responseData?.submittedDatetime &&
                  user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                    <Button
                      onClick={handleSubmit(onFormSubmit)}
                      disabled={!responseData || loading}
                      style={{ margin: "0px 8px" }}
                      variant="contained"
                      type="submit"
                      color="primary"
                    >
                      Submit
                    </Button>
                  )}
                {responseData?.submittedDatetime &&
                  user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setOpenScrutinyView(true);
                      }}
                    >
                      Preview
                    </Button>
                  )}
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
      {openScrutinyView && (
        <PreviewPrintChecklist
          title={"SQAEL/SEC/ANVIII/7.5.3/FRM-28444"}
          subTitle={"Scrutiny of Supply Order/Acceptance of Tender/Contracts"}
          inObj={inObj?.id}
          data={getValues("scrutinyTenderDetDtos")}
          columns={headCells}
          onClose={() => {
            setOpenScrutinyView(false);
          }}
          additionalInfo={<Grid container spacing={1} style={{ paddingBlock: "15px" }}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>File No. : </span>
              {inObj?.fileNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO/AT No. :</span>{" "}
              {inObj?.orderNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Applicable To : </span>{" "}
              Army/ Air Force/ Navy/ DGOF/ DGBR/ Para Military/ Engr Regt/ Civil Govt
            </Typography>
          </Grid>
        </Grid>}
        />
      )}
      <Dialog open={saveDialog} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">Are you sure you want to submit</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleFinalSubmit}
            color="primary"
            variant="contained"
            disabled={loadingSubmit}
            size="small"
          >
            {loadingSubmit && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}{" "}
            &nbsp; Yes
          </Button>
          <Button
            onClick={CloseDialog}
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
