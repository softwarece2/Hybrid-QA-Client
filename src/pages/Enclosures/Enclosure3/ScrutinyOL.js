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
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import { restrict } from "restrict";
import { WING_ID } from "../../../Globals";
//pages
import ViewOLScrutiny from "./ViewOLScrutiny";

//components
import Button from "components/Button";
import useTable, { StyledTableCell, StyledTableRow } from "../../../components/UseTable";

import { yupResolver } from "@hookform/resolvers/yup";
import "jspdf-autotable";
import ViewPrintScrutiny from "pages/Enclosures/Enclosure3/ViewPrintScrutiny";
import InspectOLTable from "pages/InspectorModule/OLInspector/InspectOLTable";
import OLTable from "pages/Sslip/SSlipTable";
import ViewOL from "pages/SOModule/SupplyOrderDetails/View/ViewOL";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getScrutinyOl, saveScrutinyOl, submitScrutinyOL } from "Redux/Actions/Enclosure/CheckScrutinyOLAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import * as yup from "yup";
import TextField from "../../../components/TextField";
import ReturnOLForm from "../Enclosure4/ReturnOLForm";

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
  // { id: "index", label: "S.No.", align: "left" },
  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "claimDate",
    label: "ASPECTS TO BE CHECKED",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimStatus",
    label: "OBSERVATION",
    align: "left",
    disableSorting: true,
  },
  {
    id: "totalClaimedAmount",
    label: "REMARKS",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  obsSts: yup
    .string()
    .required("Required")
    .typeError("required"),
  remarks: yup
    .string()
    .trim()
    .when("obsSts", (obsSts) => {
      if (obsSts === "false") {
        return yup
          .string()
          .trim()
          .required("Required")
          .typeError("Required");
      }
    
    }),
});

const schema = yup.object().shape({
  scrutinyOlMainDet: yup
    .array()
    .of(arraySchema)
    .required("Must have fields"),
});
const defaultArray = () => ({
  id: 0,
  slNo: "",
  checklistId: "",
  obsSts: "true",
  remarks: "",
});

export default function ScrutinyOL({ inObj }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const user_role = useSelector((store) => store.loggedInUser?.roleId);
  const empId = useSelector((state) => state?.loggedInUser?.empId);

  // const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [records, setRecords] = useState([]);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);

  const [obj, setObj] = useState({});
  const [enable, setEnable] = useState();
  const [openScrutinyView, setOpenScrutinyView] = useState(false);
  const [idVal, setIdVal] = React.useState(null);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [responseData, setResponseData] = useState({});

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const CloseDialog = () => {
    setSaveDialog(false);
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const { TblContainer, TblHead} = useTable(
    records,
    headCells,
    filterFn
  );



  ///save draf dilog
  const CloseSaveDialog = () => {
    setSaveDialog(false);
  };

  ///save draf dilog
  const CloseSubmitDialog = () => {
    setSubmitDialog(false);
  };

  const defaultValues = {
    scrutinyOlMainDet: [defaultArray],
  };

  const {
    handleSubmit,
  
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
  
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { fields } = useFieldArray({
    control,
    name: "scrutinyOlMainDet",
  });

  const getData = () => {
    setLoading(true);
    dispatch(getScrutinyOl(inObj?.id))
      .then((res) => {
        setIdVal(res?.id);
        setRecords(res?.inspOlIbDetDtos);
        if (records.length !== 0) {
          setEnable(false);
        }
        setIsSubmit(res?.submittedDate !== "undefined" && res?.submittedDate != null ? true : false);
        console.log("error", "erjyror");
        setResponseData(res);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoading(false));

    // }
  };
  React.useEffect(() => {
    console.log("rftgrfh");
    getData();
    // if (status) {
  }, []);


  React.useEffect(() => {
 
    const MappedData = records?.map((item) => ({
      id: item.id,
      slNo: item.slNo,
      checklistId: item.checklistId,
      remarks: item.remarks,
      reference: item.reference,
      split: item.split,
      obsSts: item.obsSts === "no" ? "false" : item.obsSts === "yes" ? "true" : "true",
      obsType: item.obsType,
    }));
    // console.log("map data-",MappedData, records);
    setValue("scrutinyOlMainDet", MappedData);
    setEnable(getValues("scrutinyOlMainDet")?.some((e) => e?.obsSts === "false"));
  }, [records, setValue]);

  console.log("records val", getValues());

  ////  save drafts
  const onFormSave = () => {
    setLoadingDraft(true);
    console.log("records val", getValues());
    const value = {
      id: idVal,
      offerLetterId: inObj?.id,
      createdBy: empId,
      inspOlIbDetDtos: getValues().scrutinyOlMainDet?.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        obsSts: item.obsSts === "true" ? "yes" : item.obsSts === "false" ? "no" : "",
        obsType: item.obsType,
        remarks: item.remarks,
      })),
    };
    setObj(value);
    console.log("save values - ", value);
    dispatch(saveScrutinyOl(value))
      .then((res) => {
        console.log("responde------------", res);
        setRecords(res?.inspOlIbDetDtos);
        setIdVal(res?.id);
        setResponseData(res);
        CloseSaveDialog();
        getData();
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };

  ////  Submit form
  const onFormSubmit = (data) => {
    setLoadingDraft(true);
    const value = {
      id: idVal,
      offerLetterId: inObj?.id,
      createdBy: empId,
      inspOlIbDetDtos: data.scrutinyOlMainDet?.map((item) => ({
        id: item.id,
        checklistId: item.checklistId,
        obsSts: item.obsSts === "true" ? "yes" : item.obsSts === "false" ? "no" : "",
        obsType: item.obsType,
        remarks: item.remarks,
      })),
    };
    console.log(value);
    dispatch(submitScrutinyOL(value))
      .then((res) => {
        setSaveDialog(false);
        setRecords(res?.inspOlIbDetDtos);
        setIsSubmit(res?.submittedDate !== "undefined" && res?.submittedDate != null ? true : false);
        setResponseData(res);
        getData();
        CloseSubmitDialog();
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => setLoadingDraft(false));
  };

  return (
    <>
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            type="Close"
            onClick={() => {
              if (user_role === 9 ||user_role===10) {
                dispatch(selectItem(<OLTable />));
              } else if (user_role === 3 || user_role === 4 || user_role === 6 || user_role === 2 || user_role === 5) {
                dispatch(selectItem(<ViewOL />));
              } else {
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
      </Grid>{" "}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>Checklist for Scrutiny of Offering letter: IS(IB)/CKL/002</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={10} xl={10} align="right">
        <ViewOLScrutiny />
      </Grid>{" "}
      <br />
      <Grid container spacing={1} style={{ padding: "15px" }}>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Typography style={{ fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 500 }}>SO Number : </span>
            {inObj?.soNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Typography style={{ fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 500 }}>{isArmy ? "QACL" : "OL"} Number : </span>{" "}
            {inObj?.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Typography style={{ fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 500 }}>Offered Date : </span> {inObj?.offerDate}
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
            align="center"
            style={{ margin: "auto", overflowX: "auto" }}
          >
            {" "}
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
                          <StyledTableCell className={classes.tableCell}>{index + 1}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>{item.reference}</StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <FormControl component="fieldset">
                              <Controller
                                name={`scrutinyOlMainDet[${index}].obsSts`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <FormControl component="fieldset">
                                    <RadioGroup
                                      row
                                      size="small"
                                      value={value}
                                      onChange={(e) => {
                                        onChange(e);
                                        setEnable(getValues("scrutinyOlMainDet")?.some((e) => e?.obsSts === "false"));
                                      }}
                                    >
                                      <FormControlLabel
                                        value="true"
                                        disabled={isSubmit || user_role !== 7}
                                        control={<Radio size="small" />}
                                        label="Yes"
                                      />
                                      <FormControlLabel
                                        value="false"
                                        disabled={isSubmit || user_role !== 7}
                                        control={<Radio size="small" />}
                                        label="No"
                                      />
                                    </RadioGroup>
                                    <FormHelperText error={!!errors?.scrutinyOlMainDet?.[index]?.obsSts}>
                                      {errors?.scrutinyOlMainDet?.[index]?.obsSts?.message}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              />
                            </FormControl>
                          </StyledTableCell>
                          <StyledTableCell className={classes.remarks}>
                            <Controller
                              control={control}
                              name={`scrutinyOlMainDet[${index}].remarks`}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  value={value}
                                  size="small"
                                  inputProps={{
                                    readOnly: isSubmit || user_role !== 7,
                                    maxLength: 500,
                                  }}
                                  placeholder="Remarks"
                                  onInput={restrict.general}
                                  error={!!errors?.scrutinyOlMainDet?.[index]?.remarks}
                                  helperText={errors?.scrutinyOlMainDet?.[index]?.remarks?.message}
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
      </Paper>{" "}
      {/* actions */}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={7} sm={7} md={7} lg={7} xl={9} align="right" />
        <Grid item xs={2} sm={2} md={2} lg={2} xl={1} align="right">
          {!isSubmit && user_role === 7 && (
            <Button
              type="submit"
              onClick={handleSubmit(onFormSave)}
              variant="contained"
              className={classes.draft}
              // }+ " " + `${typeof responseData.submittedDate !== "undefined" && responseData.submittedDate != null ? classes.hide : ""}`}
              // disabled={enable}
            >
              {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} &nbsp; Save Drafts
            </Button>
          )}
        </Grid>
        <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="center">
          {!isSubmit && user_role === 7 && (
            <Button
              // className={typeof responseData.submittedDate !== "undefined" && responseData.submittedDate != null ? classes.hide : ""}
              type="submit"
              // onClick={OpenSubmitDialog}
              onClick={() => {
                setSaveDialog(true);
              }}
              variant="contained"
              color="primary"
              disabled={enable}
            >
              Submit
            </Button>
          )}
        </Grid>
        <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="left">
          {!isSubmit && user_role === 7 && (
            <Button
              // Condition to be corrected
              //  className={
              //   typeof responseData.submittedDate !== "undefined" && responseData.submittedDate != null
              //     ? classes.hide
              //     : ""
              // }
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                trigger().then((res) => {
                  console.log("triggerValidation", res);
                  if (res) setOpen(true);
                });

                console.log("clicked");
              }}
              //disabled={getValues("scrutinyOlMainDet")?.every(el => el?.obsSts === "true") ? true : false}
              disabled={!enable}
            >
              Return {isArmy ? "QACL" : "OL"}
            </Button>
          )}
        </Grid>

        <Grid item xs={3} sm={3} md={3} lg={1} xl={1} align="left">
          {isSubmit && (
            <Button
              type="submit"
              // onClick={handleSubmit(onFormSubmit)}
              onClick={() => setOpenScrutinyView(true)}
              variant="contained"
              className={classes.btn}
            >
              Preview
            </Button>
          )}
        </Grid>
      </Grid>
      <ReturnOLForm
        open={open}
        setOpen={setOpen}
        obj={obj}
        inObj={inObj?.id}
        idVal={idVal}
        data={getValues()}
        getData={getData}
      />
      {openScrutinyView && (
        <ViewPrintScrutiny open={openScrutinyView} setOpen={setOpenScrutinyView} inObj={inObj} data={getValues()} obj={obj}/>
      )}
      <Dialog open={saveDialog} onClose={() => setOpen(false)} maxWidth="lg">
        <DialogContent>
          <Typography variant="h6">Are you sure you want to submit</Typography>
        </DialogContent>
        <DialogActions classes={{ root: classes.center }}>
          <Button onClick={handleSubmit(onFormSubmit)} color="primary" variant="contained" size="small">
            {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} &nbsp; Yes
          </Button>
          <Button onClick={CloseDialog} color="secondary" variant="contained" size="small">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
