/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useState } from "react";

//material-ui

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import ReactToPrint from "react-to-print";
import * as yup from "yup";
// import { restrict } from "restrict";

//icons
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

//Redux
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "components/Button";
//pages
import useTable, { StyledTableCell } from "components/UseTable";
import moment from "moment";
import ViewSOScrutiny from "pages/Enclosures/Enclosure1/Checklist1/ViewSOScrutiny";
import ObservationForm from "pages/EnclosuresTable/ObservationForm";
import SOObservationTable from "pages/SOModule/SupplyOrderDetails/SOObservation/SOObservationTable";
import { getPoObsTable } from "Redux/Actions/Enclosure/PoObservationAction";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import TextField from "../../components/TextField";

const arraySchema = yup.object().shape({
  remarks: yup
    .string()
    // .required("Required")
    .nullable(),
});
const schema = yup.object().shape({
  poObservationDet: yup.array().of(arraySchema),
  // .required("Must have fields"),
});

const useStyles = makeStyles((theme) => ({
  pageContent: {
    width: "95%",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      width: "100%",
    },
  },
  icon: {
    color: "#ff3000",
    fontSize: "18px",
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
    fontWeight: 400,
    fontSize: "0.875rem",
  },
  text: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  tableCellText: {
    fontSize: "0.875rem",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
  print: {
    backgroundColor: indigo[800],
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: indigo[800],
      color: theme.palette.common.white,
    },
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

const defaultArray = () => ({
  id: 0,
  poObservationId: "",
  observation: "",
  remarks: "",
  remedialAction: "",
});

export default function POObsTable({ rowData, hide }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const roleId = useSelector((store) => store.loggedInUser?.roleId);
  let componentRef = useRef();
  const poObservation = useSelector(
    (store) => store.poObservationReducer.getPo
  );
  const [records, setRecords] = useState([]);

  const id1 = rowData?.id;
  // const [rem, setRem] = useState(true);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const [idVal, setIdVal] = React.useState(null);
  const [statusVal, setStatusVal] = React.useState(null);
  const [supplerIdVal, setSupplerIdVal] = React.useState(null);
  let i = 0;
  var res;
  var ans = "";
  const { TblContainer } = useTable(
    records,
    // headCells,
    filterFn
  );

  const defaultValues = {
    POObservation: [defaultArray],
  };

  const {
 
    setValue,
    getValues,
    control,
  
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });
 
  React.useEffect(() => {
    const MappedData = records?.map((item) => ({
      id: item?.id,
      poObservatioId: item?.poObservatioId,
      observation: item?.observation,
      remedialAction: item?.remedialAction,
      remarks: item?.remarks,
      isClosed:
        item?.isClosed === null
          ? ""
          : item?.isClosed === true
          ? "true"
          : "false",
    }));
    setValue("POObservation", MappedData);
  }, [records, setValue]);
  console.log("rerer", getValues());

  const fetchValues = () => {
    for (i = 0; i < rowData?.poObservatioIds.length; i++) {
      res = "ids=" + rowData?.poObservatioIds[i];
      if (i !== rowData?.poObservatioIds.length - 1) {
        res = res + "&";
      }
      ans = ans + res;
    }
    if (ans) {
      dispatch(getPoObsTable(ans))
        .then((res) => {
          setIdVal(res?.id);
          setSupplerIdVal(res?.supplyOrderId);
          setRecords(res);
          console.log("edfeuge", records);
          setStatusVal(res?.statusId);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      setRecords([]);
    }
  };

  React.useEffect(() => {
    fetchValues();
    console.log("jejerb", ans);
    //  if(ans){
    //   dispatch(getPoObsTable(ans))
    //       .then(res => {
    //         setIdVal(res?.id);
    //         setSupplerIdVal(res?.supplyOrderId);
    //         setRecords(res);
    //         console.log("edfeuge",records)
    //         setStatusVal(res?.statusId);
    //         console.log("res", res);
    //       })
    //       .catch(error => {
    //         console.log("error", error);
    //       });
    //     }
  }, [dispatch, roleId, rowData]);

  return (
    <>
      <Grid container align="right">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <ViewSOScrutiny id1={id1} />
        </Grid>
      </Grid>
      <Grid container>
        {!hide && (
          <Grid item xs={12} align="left">
            <Button
              type="submit"
              size="small"
              onClick={() =>
                dispatch(
                  selectItem(
                    roleId === 9 ? <SOObservationTable /> : <ObservationForm />
                  )
                )
              }
              variant="contained"
              color="secondary"
              startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
            >
              Back
            </Button>
          </Grid>
        )}
      </Grid>
      <div id="print" ref={(el) => (componentRef = el)}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
            <Typography className={classes.heading}>
              PO OBSERVATION FORM
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} align="left">
            <Typography className={classes.text}>
              <span style={{ fontWeight: "normal" }}>PO.No : </span>{" "}
              {rowData?.orderNo}
              <span style={{ fontWeight: "normal" }}> &amp; Date : </span>{" "}
              {moment(rowData?.orderDate).format("DD-MM-yyyy")}
            </Typography>
          </Grid>
          <br />
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              1. Refer to subject PO
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
            <Typography className={classes.subHeading}>
              2. On scrutiny of subject PO, the following discrepancies are
              observed as:-{" "}
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          {records.length > 0 ? (
            records.map((input, index) => (
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
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  align="left"
                  style={{ paddingBottom: "8px", paddingTop: "8px" }}
                >
                  <Typography className={classes.text} align="left">
                    {" "}
                    <span style={{ fontWeight: "normal" }}>
                      Closure Date :{" "}
                    </span>
                    {input?.closureDate
                      ? moment(input?.closureDate).format("DD-MM-yyyy")
                      : ""}
                  </Typography>
                </Grid>

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
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            {" "}
                            Sl.No
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            {" "}
                            Discrepancies/observation
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            {" "}
                            Observation Category
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            Remedial action by OPA/Vendor(To be filled up by
                            OPA/Vendor)
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left" colSpan={1}>
                          <Typography className={classes.subHeading}>
                            Remarks
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Typography className={classes.subHeading}>
                            Observation Closed
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {input.obsList.length >= 0
                        ? input.obsList.map((input, index) => (
                            <TableRow key={index}>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>
                                {" "}
                                <Controller
                                  control={control}
                                  name={`POObservation[${index}].observation`}
                                  render={({ field: { value } }) => (
                                    <Typography
                                      className={classes.tableCellText}
                                    >
                                      {input?.observation}
                                    </Typography>
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Tooltip title={input?.obsCategory}>
                                  <InfoOutlinedIcon />
                                </Tooltip>
                              </StyledTableCell>

                              <StyledTableCell
                                className={classes.tableCellText}
                              >
                                <Controller
                                  control={control}
                                  name={`POObservation[${index}].remedialAction`}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      value={input?.remedialAction}
                                      onChange={onChange}
                                      placeholder="Remedial action by OPA/Vendor(To be filled up by OPA/Vendor)"
                                      inputProps={{ readOnly: true }}
                                      //disabled={roleId === 9 && statusVal === 1 ? false : true}
                                    />
                                  )}
                                />
                              </StyledTableCell>
                              <StyledTableCell
                                className={classes.tableCellText}
                              >
                                <Controller
                                  control={control}
                                  name={`POObservation[${index}].remarks`}
                                  render={({ field: { value, onChange } }) => (
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      size="small"
                                      value={input?.remarks}
                                      placeholder="Remarks"
                                      onChange={(e) => {
                                        onChange(e);
                                      }}
                                      inputProps={{ readOnly: true }}
                                    />
                                  )}
                                />
                              </StyledTableCell>

                              <StyledTableCell
                                className={classes.tableCellText}
                              >
                                <Controller
                                  name={`POObservation[${index}].isClosed`}
                                  control={control}
                                  render={({ field: { onChange, value } }) => (
                                    <FormControl component="fieldset">
                                      <RadioGroup
                                        row
                                        size="small"
                                        value={
                                          input?.isClosed === null
                                            ? ""
                                            : input?.isClosed === true
                                            ? "true"
                                            : "false"
                                        }
                                      >
                                        <FormControlLabel
                                          value="true"
                                          onChange={onChange}
                                          control={<Radio size="small" />}
                                          label="Yes"
                                          disabled
                                        />
                                        <FormControlLabel
                                          value="false"
                                          onChange={onChange}
                                          control={<Radio size="small" />}
                                          label="No"
                                          disabled
                                        />
                                      </RadioGroup>{" "}
                                    </FormControl>
                                  )}
                                />

                                {/* <FormHelperText error={!!errors.qtTestApplicable}>
                          {errors.qtTestApplicable?.message}
                        </FormHelperText> */}
                              </StyledTableCell>
                            </TableRow>
                          ))
                        : "No item in the list"}
                    </TableBody>
                  </Table>
                </TblContainer>
              </Grid>
            ))
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography className={classes.text}>
                {" "}
                No Records To Display
              </Typography>
            </Grid>
          )}
        </Grid>

        <br />
        <br />
        {rowData?.poObservatioId && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
            <Typography className={classes.subHeading}>
              Signature of the Section Officer
            </Typography>
            <Typography className={classes.subHeading}>
              {poObservation?.secOfficer}
            </Typography>
          </Grid>
        )}
      </div>
    </>
  );
}
