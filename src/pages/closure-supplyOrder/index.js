/** @format */
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
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import * as yup from "yup";
import TextField from "../../components/TextField";

import CloudDownload from "@material-ui/icons/CloudDownload";
import moment from "moment";
import FileSaver from "file-saver";
import Excel from "exceljs";
import { toast } from "react-toastify";
import {
 
  scrutinyClosureSupplyOrderGetSupplyOrder,
  scrutinyClosureSupplyOrderSave,
  scrutinyClosureSupplyOrderSubmit,
  scrutinyQaclSave,
} from "pages/Services/URLs";
import axiosInstance from "pages/Services/AxiosInstanceTransaction";




import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import ImportCheckList from "ImportCheckList";
import PreviewPrintChecklist from "pages/ScrutinyGI/PreviewPrintChecklist";
//icons

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  buttonProgress: {
    color: "white",
  },
  hide: {
    display: "none",
    color: theme.palette.primary.contrastText,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  draft: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));

const headCells = [
  { id: "slNo", label: "S.No", align: "left", disableSorting: true },
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
});

const schema = yup.object().shape({
  scrutinyClosureSupplyOrderDetDtos: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});

const defaultArray = {
  id: 0,
  slNo: "",
  checklistId: "",
  remarks: "",
};

export default function ClosureSupplyOrder({ row }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const empId = useSelector((state) => state?.loggedInUser?.empId);
  const [open, setOpen] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [openImport, setOpenImport] = useState(false);




  const CloseDialog = () => {
    setSaveDialog(false);
  };

  const defaultValues = {
    scrutinyClosureSupplyOrderDetDtos: [defaultArray],
  };

  const {
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "scrutinyClosureSupplyOrderDetDtos",
  });

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        scrutinyClosureSupplyOrderGetSupplyOrder + row?.id
      );
      const MappedData = data?.scrutinyClosureSupplyOrderDetDtos?.map(
        (item) => ({
          id: item?.id,
          slNo: item?.slNo,
          checklistId: item.checklistScrutinyClosureSupplyOrderId,
          remarks: item?.remarks,
          reference: item?.reference,
          obsType: item?.obsType,
        })
      );
      reset({
        scrutinyClosureSupplyOrderDetDtos: MappedData,
      });
      setResponseData(data);
    } catch (error) {
      toast.error("error");
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
      id: responseData?.id,
      supplyOrderId: row?.id,
      createdBy: empId,
      scrutinyClosureSupplyOrderDetDtos: getValues(
        "scrutinyClosureSupplyOrderDetDtos"
      )?.map((item) => ({
        id: item.id,
        checklistScrutinyClosureSupplyOrderId: item.checklistId,
        remarks: item.remarks,
      })),
    };
    if (importData) {
      if (responseData.id === 0) {
        req = {
          id: responseData?.id,
          supplyOrderId: row?.id,
          scrutinyClosureSupplyOrderDetDtos: importData.map((el) => ({
            id: 0,
            checklistScrutinyClosureSupplyOrderId: el?.slNo,
            obsSts:
              el.obsSts === "no" ? false : el.obsSts === "yes" ? true : false,
            remarks: el?.remarks || "",
          })),
        };
      } else {
        req = {
          id: responseData?.id,
          supplyOrderId: row?.id,
          scrutinyClosureSupplyOrderDetDtos: importData.map((el) => ({
            id:
              responseData?.scrutinyClosureSupplyOrderDetDtos?.find(
                (item) => item?.slNo === el.slNo
              )?.id || 0,
            checklistScrutinyClosureSupplyOrderId: el?.slNo,
            obsSts:
              el.obsSts === "no" ? false : el.obsSts === "yes" ? true : false,
            remarks: el?.remarks || "",
          })),
        };
      }
    }
    axiosInstance
      .post(scrutinyClosureSupplyOrderSave, req)
      .then((res) => {
        setOpenImport(false);
        getData();
        toast.success("Saved Successfully");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Failed to save ");
        setLoadingDraft(false);
      })
      .finally(() => setLoadingDraft(false));
  };

  ////  Submit form
  const onFormSubmit = (data) => {
    setLoadingSubmit(true);
    const value = {
      id: responseData?.id,
      supplyOrderId: row.id,
      createdBy: empId,
      inspectedBy: responseData.responseData,
      scrutinyClosureSupplyOrderDetDtos:
        data.scrutinyClosureSupplyOrderDetDtos?.map((item) => ({
          id: item.id,
          checklistScrutinyClosureSupplyOrderId: item.checklistId,
          remarks: item.remarks,
        })),
    };
    axiosInstance
      .post(scrutinyClosureSupplyOrderSubmit, value)
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
      //   checklistScrutinyClosureSupplyOrderGetAll
      // );
      const wb = new Excel.Workbook();
      const now = moment(new Date()).format("DD-MM-YYYY");
      const time = new Date().toLocaleTimeString();
      const data = getValues("scrutinyClosureSupplyOrderDetDtos")?.map((d) => [
        d.slNo,
        d.reference,
        d.remarks,
      ]);
      const sheet = wb.addWorksheet("Inspection PDI of Spares");
      const tableData = data.map((r, i) => [...r]);
      const wsData = [
        ["S.No", "Aspects to be checked", "Remarks"],
        ...tableData,
      ];

      sheet.columns = [
        { width: 6 },
        { width: 100 },
        { width: 120 },
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
        FileSaver.saveAs(blob, `closure-supply-order${now}, ${time}.xlsx`);
      });
    } catch (error) {
      toast.error("Failed to download");
    }
  };

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
        <Grid item xs={12} align='left'>
          <Button
            type='Close'
            onClick={() => {
              dispatch(selectItem(<InspectSOArmyTable />));
            }}
            variant='contained'
            color='Secondary'
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={2} style={{ padding: "30px" }}>
        <Typography className={classes.heading} align='center'>
          <b>SQAEL/SEC/ANVIII/7.5.3/CL-43</b>
        </Typography>
        <Typography className={classes.heading} align='center'>
          CHECKLIST FOR CLOSURE OF SUPPLY ORDER (SO)
        </Typography>
        {user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={8} lg={10} xl={10} align='right'>
              <Button
                variant='contained'
                color='primary'
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
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>FILE No : </span>
              {row?.fileNo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Typography style={{ fontSize: "0.875rem" }}>
              <span style={{ fontWeight: 500 }}>SO No :</span> {row?.orderNo}
            </Typography>
          </Grid>
        </Grid>
        <Paper>
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

                            <StyledTableCell className={classes.remarks}>
                              <Controller
                                control={control}
                                name={`scrutinyClosureSupplyOrderDetDtos[${index}].remarks`}
                                render={({ field: { value, onChange } }) => (
                                  <TextField
                                    onChange={(e) => {
                                      onChange(e);
                                    }}
                                    multiline
                                    value={value}
                                    size='small'
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
                                      !!errors
                                        ?.scrutinyClosureSupplyOrderDetDtos?.[
                                        index
                                      ]?.remarks
                                    }
                                    helperText={
                                      errors
                                        ?.scrutinyClosureSupplyOrderDetDtos?.[
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
        </Paper>{" "}
        {/* actions */}
        <Grid
          container
          spacing={0}
          style={{ paddingTop: 15, paddingBottom: 10 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align='right'>
            {!responseData?.submittedDate &&
              user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                <Button
                  onClick={() => {
                    onFormSave();
                  }}
                  variant='contained'
                  disabled={loadingDraft || !responseData}
                  color='secondary'>
                  {loadingDraft && (
                    <CircularProgress size={24} color='primary' />
                  )}{" "}
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
                  color='primary'
                  disabled={!responseData}>
                  Submit
                </Button>
              )}
            {responseData?.submittedDate &&
              user_role === USER_ROLE_ID.ROLE_INSPECTOR && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setOpenScrutinyView(true);
                  }}>
                  Preview
                </Button>
              )}
          </Grid>
        </Grid>
      </Paper>
      {openScrutinyView && (
        <PreviewPrintChecklist
          title={"SQAEL/SEC/ANVIII/7.5.3/CL-43"}
          subTitle={"CHECKLIST FOR CLOSURE OF SUPPLY ORDER (SO)"}
          row={row?.id}
          data={getValues("scrutinyClosureSupplyOrderDetDtos")}
          columns={headCells}
          onClose={() => {
            setOpenScrutinyView(false);
          }}
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
            size='small'
            disabled={loadingSubmit}>
            {loadingSubmit && (
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
