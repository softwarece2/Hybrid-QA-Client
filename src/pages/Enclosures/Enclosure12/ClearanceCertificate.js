/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as yup from "yup";
//material-ui

import {
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
 
  Paper,
  Table,
  TableBody,
  Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../components/TextField";
// import {TextField} as TF from '@mui/material/TextField';
import { restrict } from "restrict";
//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete } from "@material-ui/lab";

import MultilineTextField from "components/MultilineTextField";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import { selectItem } from "Redux/Actions/SelectTreeItem";
import { getLineItemsByOLId } from "Redux/Actions/SupplyOrder/OLAction";
import useTable, { StyledTableCell, StyledTableRow } from "../../../components/UseTable";
import Button from "components/Button";
import TextArea from "components/TextArea";
import AutoCompleteNew from "components/AutoCompleteNew";
import { toast } from "react-toastify";
import {getINoteSignatoryList, saveCc } from "Redux/Actions/Enclosure/INoteAction";
import NewTextField from "components/table/NewTextField";
import ClearanceCertificateView from "./ClearanceCertificateView";
import moment from "moment";
import INoteTable from "pages/InspectorModule/INote/INoteTable";
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
  buttonProgress: {
    color: "white",
  },
  space: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: "100%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "80%",
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
  icon: {
    color: "#f44336",
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  textArea: {
    fontSize: "0.875rem",
    fontWeight: 400,
    //maxWidth: "200px",
  },
  tableCellText: {
    fontSize: "0.875rem",
  },
  tableCellTextArea: {
    border: "1px solid black",
    minWidth: "150px",
  },
  remarks: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  header: {
    border: "none",
    // borderBottom: "1px solid black",
    textDecoration: "underLine",
    fontWeight: 500,
    outline: "none",
  },
}));

const headCells = [

  { id: "claimId", label: "Sl.No", align: "left", disableSorting: true },
  {
    id: "totalClaimedAmount",
    label: "Description",
    field: "description",
    align: "left",
    disableSorting: true,
  },
  {
    id: "claimDate",
    label: "Part No",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Unit SL .NO",
    field: "unitSlNo",
    align: "left",
    disableSorting: true,
  },
  {
    label: "Hologram No.10 ↑ N002 ",
    align: "left",
    disableSorting: true,
  },

  {
    label: "",
    align: "left",
    disableSorting: true,
  },
];
const arraySchema = yup.object().shape({
  hologramNo: yup
    .string()
    .required("Required")
    .typeError("Required"),

  unitSlNo: yup
    .string()
    .required("Required")
    .typeError("Required"),
  partNo: yup
    .string()
    .required("Required")
    .typeError("Required"),
});
const arrSchema = yup.object().shape({
  remarks: yup
    .string()
    .required("Required")
    .typeError("Required"),
});
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Required")
    .typeError("required"),
  copyTo: yup
    .string()
    .required("Required")
    .typeError("Required"),
  addressedTo: yup
    .string()
    .required("Required")
    .typeError("Required"),
  letterDate: yup
    .string()
    .required("Required")
    .typeError("Required"),
  array: yup
    .array()
    .of(arraySchema)
    .required("Must have fields")
    .typeError("Required"),
  input: yup
    .array()
    .of(arrSchema)
    .required("Must have fields")
    .typeError("Required"),
});

export default function ClearanceCertificate({ rowData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
 
  const [loadingDraft, setLoadingDraft] = React.useState(false);
  const [val, setVal] = React.useState({});
  const count = 1;

  const [signatoryList, setSignatoryList] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [signatoryError, setSignatoryError] = useState(null);
  const [isSignatoryDirty, setIsSignatoryDirty] = useState(false);
  const [title, setTitle] = useState("CLEARANCE CERTIFICATE");
  const [addTable, setAddTable] = useState(false);

  const [disable, setDisable] = useState(false);
  const [data, setData] = useState({});

  const [records, setRecords] = useState([null]);

  const loggedInUser = useSelector((state) => state?.loggedInUser);

  const [filterFn, setFilterFn] = useState({ fn: (items) => items });
  const [inputList, setInputList] = useState([
    {
      data: "",
    },
  ]);
  const [remarkList, setRemarkList] = useState([
    {
      data: "",
    },
  ]);

  const { TblContainer, TblHead } = useTable(
    records,
    headCells,
    filterFn
  );
  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
    remove(index, 1);
    //resetform();
  };
  const handleListAdd = () => {
    setInputList([
      ...inputList,
      {
        data: "",
        count: count + 1,
      },
    ]);
  };
  const handleListAddRemarks = () => {
    setRemarkList([
      ...remarkList,
      {
        data: "",
      },
    ]);
  };
  console.log("hiii", val);
  console.log("hiii", selectedSignatory);
  const handleRemoveRemarkItem = (index) => {
    console.log("handleRemoveRemarkItem");
    const newList = [...remarkList];
    newList.splice(index, 1);
    setRemarkList(newList);
    remove(index, 1);
    //resetform();
  };
  const defArray = {
    remarks: "",
    id: "",
    isTable: false,
  };
  const defaultArray = {
    partNo: "",
    description: "",
    unitSlNo: "",
    hologramNo: "",
    id: "",
    defArray: [defArray],
  };

  const defaultValues = {
    array: [defaultArray],
    title: "CLEARANCE CERTIFICATE",
    input: [defArray],
    copyTo: "",
    addressedTo: "",
    letterDate: "",
  };
  const {
    handleSubmit,

    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { fields,  remove } = useFieldArray(
    {
      control,
      name: "array",
    },
    {
      control,
      name: "input",
    }
  );

  const fetchLI = (id) => {
    setLoading(true);
    console.log("wrdjehrjehruo", id);
    if (id !== undefined) {
      getLineItemsByOLId(id)
        .then((data) => {
          console.log("this is function");
          setRecords(data);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setLoading(false));
    }

    setRecords([]);
  };
  console.log("tdgdg", data);
  useEffect(() => {
    fetchLI(rowData?.id);
  }, []);
  const getINoteSignatories = () => {
    getINoteSignatoryList(loggedInUser?.orgId)
      .then((res) => setSignatoryList(res))
      .catch((err) => toast.error("Something went wrong"));
  };
  const setSigntoryErrTrue = () => {
    setSignatoryError({ error: true, msg: "Required" });
  };
  const setSigntoryErrFalse = () => {
    setSignatoryError({ error: false, msg: null });
  };

  const onFormSubmit = (data) => {
    if (selectedSignatory === null) {
      setSigntoryErrTrue();
      console.log("rkgrselectedSignatory", selectedSignatory);
    } else {
      console.log("rkgr", records);
      setSigntoryErrFalse();
      setLoading(true);
      const value = {
        offerLetterId: rowData?.id,
        copyTo: data.copyTo,
        addressedTo: data.addressedTo,
        title: title,
        letterDate: data.letterDate,
        signatory: selectedSignatory?.id,
        createdBy: 2,
        clearanceLetterPointDtos: data.input?.map((item) => ({
          contentText: item.remarks,
          clearanceLetterItemDtos:
            item.isTable === true
              ? data.array?.map((data) => ({
                olLineItemId: data.id,
                hologramNo: data.hologramNo,
                unitSlNo: data.unitSlNo,
              }))
              : [],
        })),
      };
      console.log("data of cc", value);
      dispatch(saveCc(value))
        .then((res) => {
          if (res) toast.success("Data successfully submitted");
          setLoading(false);
          setDisable(true);
        })
        .catch((error) => {
          console.log("error", error);
          toast.error("some error occured");
        })
        .then(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    // getINoteByOlId();
    getINoteSignatories();
  }, []);
  useEffect(() => {
    if (isSignatoryDirty && selectedSignatory) setSigntoryErrFalse();
  }, [selectedSignatory]);





  const inputStyles = {
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    textDecoration: "underline",
    textAlign: "center",
  };

  console.log("nameeee", title);
  console.log(getValues(), "getValues");
  return (
    <>
      {open && (
        <ClearanceCertificateView
          open={open}
          setOpen={setOpen}
          data={getValues()}
          val={val}
          title={title}
          signatory={selectedSignatory}
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} align="left">
          <Button
            type="submit"
            onClick={() => dispatch(selectItem(<INoteTable />))}
            variant="contained"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>

        {/* <Grid container> */}
        <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
          <Controller
            name="addressedTo"
            control={control}
            render={({ field: { onChange, value, ...props } }) => (
              <MultilineTextField
                style={{ fontSize: "0.875rem", fontWeight: 300 }}
                placeholder="Address"
                labelText="Address"
                size="small"
                {...props}
                onChange={onChange}
                value={value}
                required
                rows={6}
                cols={6}
                onInput={restrict.general}
                inputProps={{
                  readOnly: disable,
                  maxLength: 500,
                }}
                error={!!errors.addressedTo}
                helperText={errors.addressedTo?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={7} lg={7} xl={7}></Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <Controller
            name="letterDate"
            control={control}
            // value={value}
            render={({ field: { onChange, value, ...props } }) => (
              <TextField
                labelText="Select Date"
                placeholder="Delivery date"
                onChange={onChange}
                value={moment(value).format("YYYY-MM-DD")}
                type="date"
                size="small"
                required
                inputProps={{
                  readOnly: disable,
                }}
                error={!!errors.letterDate}
                helperText={errors.letterDate?.message}
              />
            )}
          />
        </Grid>
        {/* </Grid> */}
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <NewTextField
                    // label="title"
                    // name="title"
                    value={value}
                    // mediumWidth
                    fullWidth
                    multiline
                    maxRows={6}
                    onChange={onChange}
                    onInput={restrict.general}
                    inputProps={{ maxLength: 600, style: inputStyles, readOnly: disable }}
                    variant="standard"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                );
              }}
            ></Controller>
          </Grid>
        </Grid>
      </Grid>

      <br />
      <Paper className={classes.paper}>
        <br />

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center" style={{ margin: "auto", overflowX: "auto" }}>
          <div>
            <Grid container spacing={0}>
              {remarkList?.map((input, index) => (
                <Grid container spacing={0} key={input.id}>
                  <Grid xs={1} sm={1} md={1} lg={1} xl={1} style={{ paddingTop: 15 }}>
                    <Typography className={classes.subject}>{index + 1}.</Typography>{" "}
                  </Grid>
                  <Grid xs={8}>
                    <Controller
                      name={`input[${index}].remarks`}
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MultilineTextField
                            //   size="small"
                            style={{ paddingTop: 15 }}
                            onChange={onChange}
                            value={value}
                            onInput={restrict.general}
                            inputProps={{
                              readOnly: disable,
                              maxLength: 500,
                            }}
                            error={!!errors.input?.[index]?.remarks}
                            helperText={errors.input?.[index]?.remarks?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid xs={1} style={{ paddingTop: 15, paddingLeft: 4 }}>
                    {index === 0 ? (
                      <Button
                        startIcon={<AddCircleIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleListAddRemarks}
                        disabled={disable}
                      >
                        Add
                      </Button>
                    ) : (
                      <IconButton aria-label="delete" onClick={() => handleRemoveRemarkItem(index)} disabled={disable}>
                        <DeleteIcon className={classes.icon} />
                      </IconButton>
                    )}
                  </Grid>
                  {!addTable && remarkList?.length === index + 1 && (
                    <Grid xs={1} style={{ paddingTop: 15, paddingLeft: 8 }}>
                      <Button
                        startIcon={<AddCircleIcon />}
                        variant="contained"
                        color="primary"
                        obs={"form"}
                        onClick={() => {
                          setAddTable(true);
                          setVal(remarkList?.length);
                          setValue(`input[${index}].isTable`, true);
                          console.log("hiirtrti", remarkList?.length);
                        }}
                        disabled={disable}
                      >
                        Add Table
                      </Button>
                    </Grid>
                  )}
                  {addTable && val === index + 1 && (
                    <Grid xs={1} style={{ paddingTop: 15 }}>
                      <Button
                        startIcon={<DeleteIcon className={classes.icon} />}
                        variant="contained"
                        color="primary"
                        obs={"form"}
                        onClick={() => {
                          setAddTable(false);
                          //  setVal(index);
                          console.log("hiii", addTable);
                        }}
                        disabled={disable}
                      >
                        Remove Table
                      </Button>
                    </Grid>
                  )}
                  {addTable && val === index + 1 && (
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
                        paddingRight: "250px",
                        paddingTop: "50px",
                        paddingLeft: "128px",
                      }}
                    >
                      <Grid container>
                        <TblContainer align="center" style={{ maxHeight: "600px" }}>
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
                            {fields.length !== 0 ? (
                              <TableBody>
                                {inputList?.map((input, index) => (
                                  <StyledTableRow>
                                    <StyledTableCell className={classes.tableCell}>{index + 1}.</StyledTableCell>
                                    <StyledTableCell className={classes.remarks}>
                                      <Controller
                                        name={`array[${index}].description`}
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                          <Autocomplete
                                            // id="combo-box-demo"
                                            options={records}
                                            onChange={(e, v) => {
                                              e.preventDefault();
                                              onChange(v);
                                              if (v) {
                                                console.log(getValues(), "getValues");
                                                console.log(v);
                                                setValue(`array[${index}].id`, v?.id);
                                                setValue(`array[${index}].partNo`, v?.partNo);
                                              }
                                            }}
                                            disabled={disable}
                                            value={value}
                                            getOptionLabel={(option) => option.description}
                                            style={{ width: 250 }}
                                             renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.remarks}>
                                      <Controller
                                        name={`array[${index}].partNo`}
                                        control={control}
                                        render={({ field: { onChange, value, ...props } }) => (
                                          <TextField
                                            placeholder="part number"
                                            {...props}
                                            onChange={onChange}
                                            value={value}
                                            onInput={restrict.general}
                                            inputProps={{ readOnly: true, maxLength: 100 }}
                                            size="small"
                                          />
                                        )}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.remarks}>
                                      <Controller
                                        name={`array[${index}].unitSlNo`}
                                        control={control}
                                        render={({ field: { onChange, value, ...props } }) => (
                                          <TextField
                                            placeholder="Unit Sl. No."
                                            {...props}
                                            onChange={onChange}
                                            value={value}
                                            onInput={restrict.general}
                                            inputProps={{
                                              readOnly: disable,
                                              maxLength: 100,
                                            }}
                                            size="small"
                                            error={!!errors.array?.[index]?.unitSlNo}
                                            helperText={errors.array?.[index]?.unitSlNo?.message}
                                          />
                                        )}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.remarks}>
                                      <Controller
                                        name={`array[${index}].hologramNo`}
                                        control={control}
                                        render={({ field: { onChange, value, ...props } }) => (
                                          <MultilineTextField
                                            // className={classes.textArea}
                                            placeholder="Observation"
                                            size="small"
                                            {...props}
                                            onChange={onChange}
                                            value={value}
                                            onInput={restrict.general}
                                            inputProps={{
                                              readOnly: disable,
                                              maxLength: 500,
                                            }}
                                            error={!!errors.array?.[index]?.hologramNo}
                                            helperText={errors.array?.[index]?.hologramNo?.message}
                                          />
                                        )}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell className={classes.remarks}>
                                      {index + 1 !== count ? null : (
                                        <IconButton
                                          variant=""
                                          color="primary"
                                          onClick={handleListAdd}
                                          disabled={disable}
                                        >
                                          <AddCircleIcon />
                                        </IconButton>
                                      )}
                                      {index === 0 ? null : (
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() => handleRemoveItem(index)}
                                          disabled={disable}
                                        >
                                          <DeleteIcon className={classes.icon} />
                                        </IconButton>
                                      )}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))}
                              </TableBody>
                            ) : (
                              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
                                <Typography className={classes.text}> No Records To Display</Typography>
                              </Grid>
                            )}
                          </Table>
                        </TblContainer>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              ))}
            </Grid>
          </div>
        </Grid>
        <br />
        <br />
        <br />
        <Grid container spacing={2} style={{ padding: "30px" }}>
          <Grid item xs={9} sm={9} md={9} lg={9} xl={9} align="left">
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3} align="left">
            <AutoCompleteNew
              labelText="Select Signatory"
              data={signatoryList}
              required
              getOptionLabel={(o) => o?.ename}
              onChange={(e, v) => {
                setSelectedSignatory(v);
                setIsSignatoryDirty(true);
              }}
              value={selectedSignatory}
            // disabled={disable}
            />
            <FormHelperText error={!!signatoryError?.error}>{signatoryError?.msg}</FormHelperText>
            {selectedSignatory && (
              <>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.enameHi}</Typography>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.ename}</Typography>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.designationHi}</Typography>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.designation}</Typography>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.roleNameHi}</Typography>
                <Typography className={classes.textSizeBold}>{selectedSignatory?.roleName}</Typography>
                <Typography className={classes.textSizeBold}>वरिष्ठ् गुणवत्ता आश्वासन अधिकारी के लिए</Typography>
                <Typography className={classes.textSizeBold}>For Senior Quality Assurance Officer</Typography>
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography className={classes.heading}>
              Copy to: <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "red" }}>*</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Controller
              name="copyTo"
              labelText="COPY TO"
              control={control}
              render={({ field: { onChange, value, ...props } }) => (
                <TextArea
                  style={{ fontSize: "0.875rem", fontWeight: 300 }}
                  placeholder="COPY TO"
                  size="small"
                  {...props}
                  onChange={onChange}
                  value={value}
                  required
                  onInput={restrict.general}
                  inputProps={{ maxLength: 500 }}
                  error={!!errors.copyTo}
                  readOnly={disable}
                  helperText={errors.copyTo?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      <div className={classes.space} align="center">
        <Grid container spacing={2}>
          {!loading && (
            <Grid item xs={6} sm={6} md={6} lg={10} xl={10} align="right">
              <Button
                type="submit"
                onClick={handleSubmit(onFormSubmit)}
                variant="contained"
                color="secondary"
                disabled={disable}
              >
                {loadingDraft && <CircularProgress size={24} className={classes.buttonProgress} />} &nbsp; Submit
              </Button>
            </Grid>
          )}
          {!loading && (
            <Grid item xs={1} align="right">
              <Button variant="contained" className={classes.btn} onClick={() => setOpen(true)}>
                Preview
              </Button>
            </Grid>
          )}
        </Grid>
      </div>

    </>
  );
}
