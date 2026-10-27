/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "jspdf-autotable";

//material-ui
import {
  Dialog,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
  DialogActions,
} from "@material-ui/core";
import { DialogContent} from "Utils";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

//redux
import { useDispatch } from "react-redux";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  getFileClosingForms,
  savesFileClosingForm,
  submitsFileClosingForm,
  getCheckfile,
} from "Redux/Actions/Enclosure/FileClosingFormAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";

//pages

import ViewSOScrutiny from "pages/Enclosures/Enclosure1/Checklist1/ViewSOScrutiny";

//components
import TextField from "../../../components/TextField";
import Button from "components/Button";
import useTable, {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/UseTable";

//icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ViewFileClosing from "./ViewFileClosing";
import InspectSOArmyTable from "pages/InspectSoArmy/InspectSOArmyTable";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    // padding: theme.spacing(4),
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
    fontWeight: 500,
  },
  subHeading: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  remarks: {
    width: 300,
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  tableCell: {
    border: "1px solid lightgrey",
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
    fontSize: "0.875rem",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
}));

const arraySchema = yup.object().shape({
  remarks: yup.string().trim().required("Required").typeError("Required"),
  obsSts: yup.string().required("Required").typeError("Required"),
});

const defaultArray = () => ({
  id: 0,
  slNo: "",
  checklistId: "",
  obsSts: "",
  split: "false",
  remarks: "",
});

const headCells = [
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "SL.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "Check of Item",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimStatus",
    label: "Status *",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "Remarks *",
    align: "left",
    disableSorting: true,
  },
];
const schema = yup.object().shape({
  fileDet: yup.array().of(arraySchema).required("Must have fields"),
});

export default function FileClosingForm({ soObj }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const id1 = soObj?.id;
  const [records, setRecords] = useState([]);

  const [idVal, setIdVal] = React.useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [fileClosing, setFileClosing] = useState(false);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => items,
  });
  const defaultValues = {
    fileDet: [defaultArray],
  };
  const {
    TblContainer,
    TblHead,

  } = useTable(records, headCells, filterFn);

  const {
    handleSubmit,

    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { fields } = useFieldArray({
    control,
    name: "fileDet",
  });

  const getAllCheckList = async () => {
    const res = await dispatch(getCheckfile());

    let newArr = getValues("fileDet");
    res?.forEach((item) => {
      newArr.push({
        id: 0,
        checklistId: item?.id,
        slNo: 0,
        reference: item?.reference,
        remarks: "",
        split: false,
        obsSts: null,
        obsType: null,
      });
    });

    setValue("fileDet", newArr);
  };

  React.useEffect(() => {
    setLoading(true);
    dispatch(getFileClosingForms(soObj?.id))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.detDtos);
        setValue("fileDet", res?.detDtos);
        console.log("res", res);
        setResponseData(res);
        if (res?.detDtos?.length === 0) {
          getAllCheckList();
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // React.useEffect(() => {
  //   if (records.length === 0) {
  //     console.log("get all called");
  //     getAllCheckList();
  //   }
  // }, [records]);

  console.log("CheckFile", getValues("fileDet"));

  const onSave = () => {
    console.log("records val", getValues());
    setIsSaved(true);
    const value = {
      id: idVal,
      supplyOrderId: soObj?.id,
      createdBy: 1,
      detDtos: getValues("fileDet")?.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        obsSts: item.obsSts,
        obsType: item.obsType,
        remarks: item.remarks,
      })),
    };
    console.log("save values - ", value);
    dispatch(savesFileClosingForm(value))
      .then((res) => {
        console.log("responde------------", res);
        // setRecords(res?.detDtos);
        setValue("fileDet", res?.detDtos);
        setIdVal(res?.id);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onSubmit = (data) => {
    console.log("GetValues", data);
    setIsSubmitted(true);
    const value = {
      id: idVal,
      createdBy: 1,
      supplyOrderId: soObj?.id,
      detDtos: data?.fileDet?.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        remarks: item.remarks,
        obsSts: item.obsSts,
        obsType: item.obsType,
      })),
    };
    console.log("submit Values", value);
    dispatch(submitsFileClosingForm(value)).then((res) => {
      console.log("submitfileclosingform", res);
      setIdVal(res?.id);
      // setRecords(res?.detDtos);
      setResponseData(res);
      CloseSubmitDialog();
    });
  };


  const CloseSubmitDialog = () => {
    setSubmitDialog(false);
  };
  const OpenSubmitDialog = () => {
    setSubmitDialog(true);
  };

  return (
    <>
      {fileClosing && (
        <ViewFileClosing
          soObj={soObj}
          open={fileClosing}
          setOpen={setFileClosing}
        />
      )}
      <Grid container>
        <Grid item xs={12} align="left">
          <Button
            // type="submit"
            onClick={() => dispatch(selectItem(<InspectSOArmyTable />))}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>{" "}
      </Grid>{" "}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            File closing Form:IS/FRM/002
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Typography className={classes.subHeading}>
            <span style={{ fontWeight: "normal" }}>SO No:</span>{" "}
            {soObj?.orderNo}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Typography className={classes.subHeading}>
            <span style={{ fontWeight: "normal" }}>File No:</span>{" "}
            {soObj?.fileNo}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <ViewSOScrutiny id1={id1} />
        </Grid>
        {""}
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
            align="center"
            style={{
              margin: "auto",
              overflowX: "auto",
            }}
          >
            <Grid container>
              <TblContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                  id="data-table-cleanliness-report"
                >
                  <TblHead />
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
                              name={`fileDet[${index}].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  value={value}
                                  size="small"
                                  placeholder="Status"
                                  error={!!errors.fileDet?.[index]?.obsSts}
                                  helperText={
                                    errors.fileDet?.[index]?.obsSts?.message
                                  }
                                  disabled={!!responseData?.submittedDate}
                                />
                              )}
                            />
                          </StyledTableCell>

                          <StyledTableCell className={classes.remarks}>
                            <Controller
                              control={control}
                              name={`fileDet[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  value={value}
                                  size="small"
                                  placeholder="Remarks"
                                  error={!!errors.fileDet?.[index]?.remarks}
                                  helperText={
                                    errors.fileDet?.[index]?.remarks?.message
                                  }
                                  disabled={!!responseData?.submittedDate}
                                />
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TblContainer>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {!loading && (
        <div className={classes.space} align="right">
          <Button
            // disabled={!!responseData?.submittedDate}
            disabled={!!responseData?.submittedDate || isSaved}
            type="submit"
            variant="contained"
            className={classes.draft}
            onClick={handleSubmit(onSave)}
          >
            Save draft
          </Button>

          <Button
            type="submit"
            // disabled={!!responseData?.submittedDate}
            disabled={!!responseData?.submittedDate || isSubmitted} // Disable the button if it's already submitted
            variant="contained"
            color="primary"
            onClick={OpenSubmitDialog}
          >
            Submit
          </Button>

          <Button
            type="submit"
            onClick={() => setFileClosing(true)}
            variant="contained"
            className={classes.btn}
          >
            Preview
          </Button>
        </div>
      )}
      {/* <Dialog open={open} maxWidth="lg" align="center"> */}
      {/* <DialogTitle
          style={{ fontSize: "0.875rem" }}
          onClose={() => setOpen(false)}
        >
          File closing Form:IS/FRM/002
        </DialogTitle> */}
      {/* <DialogContent dividers style={{ padding: 12, position: "relative" }}>
            <div ref={componentRef}> */}
      {/* <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf />
            <Paper>
              <TblContainer style={{ maxHeight: "600px" }}>
                {loading && <LinearProgress />}
                <Table
                  style={{
                    position: "relative",
                    border: "1px solid lightgrey",
                  }}
                  size="small"
                  aria-label="simple table"
                  id="data-table-cleanliness-report"
                >
                  <TblHead />
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
                              name={`fileDet[${index}].obsSts`}
                              render={({ field: { value, onChange } }) => (
                                <Typography>{value}</Typography>
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Controller
                              control={control}
                              name={`fileDet[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <Typography>{value}</Typography>
                              )}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      </>
                    ))}
                  </TableBody>
                </Table> */}
      {/* {recordsAfterPagingAndSorting()?.length != 0 &&
                recordsAfterPagingAndSorting()?.length != undefined ? (
                  <TblPagination />
                ) : (
                )} */}
      {/* </TblContainer> */}
      {/* </div> */}
      {/* </div> */}
      {/* </DialogContent> */}
      {/* <DialogActions> */}
      {/* <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" space="2">
                Print
              </Button>
            )}
            content={() => componentRef}
          /> */}
      {/* <Button
            text="Print"
            variant="contained"
            // className={classes.print}
            onClick={handlePrint}
            color="primary"
          >
            Print
          </Button> */}
      {/* </DialogActions>
      </Dialog> */}
      <Dialog open={submitDialog} onClose={CloseSubmitDialog} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">
            Are you sure you want to Submit ?
          </Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
            size="small"
          >
            Yes
          </Button>
          <Button
            onClick={CloseSubmitDialog}
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
