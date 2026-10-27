/** @format */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
//material-ui
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent, Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  TextField,
  FormControl,
  Chip,
  InputLabel
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import { restrict } from "restrict";
import { USER_ROLE_ID } from "../../Globals";
//pages

//components
import Button from "components/Button";
import { StyledTableCell, StyledTableRow } from "../../components/UseTable";

import { yupResolver } from "@hookform/resolvers/yup";
import "jspdf-autotable";
import ViewPrintScrutiny from "pages/Enclosures/Enclosure3/ViewPrintScrutiny";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {  useSelector } from "react-redux";
import * as yup from "yup";
import CloudDownload from "@material-ui/icons/CloudDownload";
import moment from "moment";
import FileSaver from "file-saver";
import Excel from "exceljs";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";
import {
  getPreInspection, scrutinyPreInspectionsave,
  scrutinyPreInspectionsubmit
} from "pages/Services/URLs";
import { toast } from "react-toastify";
import PreviewPrintChecklist from "pages/ScrutinyGI/PreviewPrintChecklist";
import ImportCheckList from "ImportCheckList";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { handleDownload } from "pages/ApprovalCycle/ApprovalCycleje";


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
    color: theme.palette.primary.main
  }
}));

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "slNo", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "reference",
    label: "Aspects to be checked",
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
const arraySchema = yup.object().shape({
  remarks: yup.string().trim(),
  // .when("obsSts", (obsSts) => {
  //   if (obsSts === "false") {
  //     return yup.string().trim().required("Required").typeError("Required");
  //   }
  // })
});
const defaultArray = {
  slNo: "",
  checklistId: "",
  remarks: "",
};
const schema = yup.object().shape({
  scrutinyPreInspectionDetDtos: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});

export default function PreInspection() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const obj = useSelector((state) => state?.inspectOLReducer.inspectOlNumber);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const [openPreView, setOpenPreView] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openImport, setOpenImport] = useState(false);
  const CloseDialog = () => {
    setSaveDialog(false);
  };

  const defaultValues = {
    scrutinyPreInspectionDetDtos: [defaultArray],
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
    name: "scrutinyPreInspectionDetDtos",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance(getPreInspection + obj.id);
      reset({
        scrutinyPreInspectionDetDtos: data.scrutinyPreInspectionDetDtos?.map(
          (el) => ({ ...el, obsSts: el.obsSts })
        ),
      });
      setResponseData(data);
      console.log(data, "data");
    } catch (error) {
      console.log("error");
    } finally {
      setLoading(false);
    }

    // }
  };
  React.useEffect(() => {
    getData();
  }, []);

  // const onFormSave = (data) => {
  //   setLoadingDraft(true);
  //   const value = {
  //     id: 1,
  //     offerLetterId: 1,
  //     createdBy: empId,
  //     scrutinyPreInspectionDetDtos: data.preDispatchMainDet?.map((item) => ({
  //       // id: item.id,
  //       checklistId: item.id,
  //       obsSts:
  //         item.obsSts === "true" ? "yes" : item.obsSts === "false" ? "no" : "",
  //       obsType: item.obsType,
  //       remarks: item.remarks,
  //     })),
  //   };
  //   console.log(value, "value");
  // };
  const onFormSave = async (importData) => {
    console.log(importData, "importData");
    try {
      setLoadingDraft(true);
      let req = {
        id: responseData.id,
        offerLetterId: obj?.id,

        scrutinyPreInspectionDetDtos: getValues(
          "scrutinyPreInspectionDetDtos"
        ).map((el) => ({
          id: el.id || 0,
          checklistScrutinyPreInspectionId: el.checklistScrutinyPreInspectionId,
          obsSts:
            el.obsSts === "no" ? false : el.obsSts === "yes" ? true : false,
          remarks: el.remarks,
        })),
      };
      if (importData) {
        if (responseData.id === 0) {
          req = {
            id: responseData.id,
            offerLetterId: obj?.id,
            scrutinyPreInspectionDetDtos: importData.map((el) => ({
              id: 0,
              checklistScrutinyPreInspectionId: el?.slNo,
              obsSts:
                el.obsSts === "no" ? false : el.obsSts === "yes" ? true : false,
              remarks: el.remarks,
            })),
          };
        } else {
          req = {
            id: responseData.id,
            offerLetterId: obj?.id,
            scrutinyPreInspectionDetDtos: importData.map((el) => ({
              id:
                responseData?.scrutinyPreInspectionDetDtos?.find(
                  (item) => item?.slNo === el.slNo
                )?.id || 0,
              checklistScrutinyPreInspectionId: el?.slNo,
              remarks: el.remarks,
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

  const onFormSubmit = async (data) => {
    try {
      setLoadingDraft(true);
      const req = {
        id: responseData.id,
        offerLetterId: obj?.id,
        createdBy: empId,
        scrutinyPreInspectionDetDtos: data.scrutinyPreInspectionDetDtos?.map(
          (el) => ({
            id: el.id,
            checklistScrutinyPreInspectionId:
              el.checklistScrutinyPreInspectionId,
            obsSts:
              el.obsSts === "no" ? false : el.obsSts === "yes" ? true : false,
            remarks: el.remarks,
          })
        ),
      };
      const { data: result } = await axiosInstance.post(
        scrutinyPreInspectionsubmit,
        req
      );
      toast.success("Submit Successfully");
      setSaveDialog(false);
      getData();
    } catch (error) {
      toast.error("Failed to submit");
    } finally {
      setLoadingDraft(false);
    }
  };
  const printExcel = async () => {
    try {
      // const { data: checkList } = await axiosInstanceMaster.get(PreInspectionReport);
      const wb = new Excel.Workbook();
      const now = moment(new Date()).format("DD-MM-YYYY");
      const time = new Date().toLocaleTimeString();
      const data = getValues("scrutinyPreInspectionDetDtos")?.map((d) => [
        d.slNo,
        d.reference,
        d.remarks,
      ]);
      const sheet = wb.addWorksheet("Inspection PDI of Spares");
      const tableData = data.map((r, i) => [...r]);
      const wsData = [
        ["Sl.No", "Aspects to be checked", "Remarks"],
        ...tableData,
      ];
      sheet.columns = [
        { width: 6 },
        { width: 100 },
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

      // sheet.eachRow(function(obj, rowNumber) {
      //   console.log("obj no", rowNumber);
      //   obj.eachCell((cell, colNumber) => {
      //     if (rowNumber > 0) {
      //       cell.border = {
      //         top: { style: "thin" },
      //         left: { style: "thin" },
      //         bottom: { style: "thin" },
      //         right: { style: "thin" },
      //       };
      //     }
      //   });
      // });

      wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(blob, `PreInspection ${now}, ${time}.xlsx`);
      });
    } catch (error) {
      toast.error("Failed to download");
    }
  };
  const refreshData = () => {
    getData();
  };

  // const loggedInUser = useSelector((store) => store.loggedInUser);
  //   const dispatch = useDispatch();
  return (
    <>
      {openImport && (
        <ImportCheckList
          onClose={() => {
            setOpenImport(false);
          }}
          url={scrutinyPreInspectionsave}
          refresh={refreshData}
          onSubmit={onFormSave}
          isLoading={loadingDraft}
          columns={headCells}
        />
      )}

      <Paper elevation={2} style={{ padding: "30px" }}>
        <Grid container>
          {/* <Grid item xs={12} align="left">
          <Button
            type="submit"
            onClick={() => {
              if (user_role === 9) {
                dispatch(selectItem(<OLTable />));
              } else if (user_role === 3 || user_role === 4 || user_role === 6 || user_role === 2 || user_role === 5) {
                dispatch(selectItem(<ViewOL />));
              } else {
                dispatch(selectItem(<InspectOLTable />));
              }
            }}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid> */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align='center'>
            <Typography className={classes.heading}>
              SQAEL/SEC/ANVIII/7.5.3/FRM-33
            </Typography>
            <Typography className={classes.heading}>
              CHECK LIST FOR PRE-INSPECTION REPORT
            </Typography>
          </Grid>
        </Grid>
        {user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={8} lg={10} xl={10} align='right'>
              <Button
                variant='contained'
                color='primary'
                // size="small"
                // className={classes.buttonImport}
                endIcon={<CloudDownload />}
                onClick={() => {
                  printExcel();
                }}>
                Download Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2} align='right'>
              <Button
                variant='contained'
                color='primary'

                disabled={responseData?.submittedDate}
                endIcon={<CloudDownload />}
                onClick={(e) => {
                  setOpenImport(true);
                }}>
                Upload Excel
              </Button>
            </Grid>
          </Grid>
        )}
        <br />
        <Grid container spacing={1} style={{ padding: "15px" }}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>File No. : </span>
              {obj?.soNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO/AT No. :</span>{" "}
              {obj?.olNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>Applicable To : </span>{" "}
              {obj?.offerDate}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            align='center'
            style={{ margin: "auto", overflowX: "auto" }}>
            {" "}
            <Grid container>
              <TableContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size='small'
                  aria-label='simple table'
                  id='data-table-cleanliness-report'
                  stickyHeader>
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
                    {fields?.map((item, index) => (
                      <>
                        <StyledTableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item.reference}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              control={control}
                              name={`scrutinyPreInspectionDetDtos[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  variant="outlined"
                                  style={{ width: '300px' }}
                                  fullWidth
                                  value={value}
                                  size='small'
                                  multiline
                                  inputProps={{
                                    readOnly:
                                      responseData?.submittedDate ||
                                      user_role !==
                                      USER_ROLE_ID.ROLE_INSPECTOR,
                                    maxLength: 500,
                                  }}
                                  placeholder='Remarks'
                                  onInput={restrict.general}
                                  error={
                                    !!errors?.scrutinyPreInspectionDetDtos?.[
                                      index
                                    ]?.remarks
                                  }
                                  helperText={
                                    errors?.scrutinyPreInspectionDetDtos?.[
                                      index
                                    ]?.remarks?.message
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
            </Grid>
          </Grid>
        </Grid>

        {/* actions */}
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}>
          <Grid item xs={7} sm={7} md={7} lg={7} xl={9} align='right' />
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align='right'>
            {!responseData?.submittedDate &&
              user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                <Button
                  onClick={() => {
                    onFormSave();
                  }}
                  variant='contained'
                  disabled={loadingDraft}
                  color='secondary'>
                  Save as Draft
                </Button>
              )}
            {!responseData?.submittedDate &&
              user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                <Button
                  onClick={() => {
                    setSaveDialog(true);
                  }}
                  style={{ margin: "0px 8px" }}
                  variant='contained'
                  color='primary'>
                  Submit
                </Button>
              )}
            {responseData?.submittedDate &&
              user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setOpenPreView(true);
                  }}>
                  Preview
                </Button>
              )}
          </Grid>
        </Grid>

        {responseData?.submittedDate && (
          <RemarksForm responseData={responseData} user_role={user_role} getData={getData} />
        )}
      </Paper>
      {openPreView && (
        <PreviewPrintChecklist
          title={"SQAEL/SEC/ANVIII/7.5.3/FRM-33"}
          subTitle={"CHECK LIST FOR PRE-INSPECTION REPORT"}
          inObj={obj?.id}
          data={getValues("scrutinyPreInspectionDetDtos")}
          columns={headCells}
          onClose={() => {
            setOpenPreView(false);
          }}
        />
      )}

      {openScrutinyView && (
        <ViewPrintScrutiny
          open={openScrutinyView}
          setOpen={setOpenScrutinyView}
          obj={obj?.id}
          data={getValues()}
        />
      )}
      <Dialog open={saveDialog} onClose={() => setOpen(false)} maxWidth='lg'>
        <DialogContent>
          <Typography variant='h6'>Are you sure you want to submit</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            color='primary'
            variant='contained'
            size='small'>
            {loadingDraft && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}{" "}
            &nbsp; Yes
          </Button>
          <Button
            onClick={CloseDialog}
            color='secondary'
            variant='contained'
            size='small'>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const defaultValues = { remarks: "", soStatus: "" };
function RemarksForm({ responseData, user_role, getData }) {
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
      reset({ remarks: responseData.qaoRemarks, soStatus: responseData.soStatus === 'Approved' ? 1 : 2 })
    }

  }, [reset, responseData])

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
        .post("scrutinyPreInspection/updateByQAO", formData)
        .then(({ data }) => {
          if (data === true) {
            toast.success("Updated successfully");
            reset(defaultValues);
            getData()
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

  if (loggedInUser?.roleId !== USER_ROLE_ID.ROLE_QAO && !responseData.qaoSubmittedDate) {
    return null
  }

  if (responseData.qaoSubmittedDate) {
    return (
      <div>
        <Typography gutterBottom><b className={classes.value}>QAO Remarks:</b> {responseData.qaoRemarks}</Typography>
        <Typography gutterBottom><b className={classes.value}> Status:</b> <span style={{ color: responseData.soStatus === "Approved" ? "green" : "red" }}>{responseData.soStatus}</span></Typography>
        <div>
          <Typography className={classes.value}>
            <b>Attachments:</b>
          </Typography>
          <div style={{ display: "flex", gap: 8 }} >
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
    )
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
        disabled={!!responseData.qaoSubmittedDate || user_role === USER_ROLE_ID.ROLE_INSPECTOR}
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
                <FormControl disabled={!!responseData.qaoSubmittedDate || user_role === USER_ROLE_ID.ROLE_INSPECTOR} style={{ padding: "14px 0px 0px 0px" }} >
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
                      disabled={!!responseData.qaoSubmittedDate || user_role === USER_ROLE_ID.ROLE_INSPECTOR}
                      className={classes.acceptColor}
                      value={1}
                    >
                      Accept
                    </ToggleButton>
                    <ToggleButton
                      disabled={!!responseData.qaoSubmittedDate || user_role === USER_ROLE_ID.ROLE_INSPECTOR}
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

              disabled={!!responseData.qaoSubmittedDate || user_role === USER_ROLE_ID.ROLE_INSPECTOR}
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
            <div style={{ display: "flex", gap: "8px" }}>
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
        {user_role !== USER_ROLE_ID.ROLE_INSPECTOR && <Button
          type="submit"
          disabled={!!responseData.qaoSubmittedDate || submitting}
          onClick={handleSubmit((data) => onFormSave(data, 1))}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>}
      </div>
    </form>
  );
}
