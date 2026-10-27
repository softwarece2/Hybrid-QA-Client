/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
//material-ui

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "date-fns";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../../components/TextField";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//components
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AllotSO from "pages/SOModule/AllotInspector/AllotSO";
import { selectItem } from "Redux/Actions/SelectTreeItem";
import{ StyledTableCell } from "../../../components/UseTable";
import Button from "components/Button";
import { restrict } from "restrict";
import {
  getWorkload,
} from "Redux/Actions/SOWorkLoadAction/SoWorkLoadAction";
import { toast } from "react-toastify";
import WorkloadView from "pages/Enclosures/Enclosure16/WorkloadView";
import WorkLoad from "pages/InspectorModule/WorkLoadInsp/WorkLoad";
import moment from "moment";
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
  tableCell: {
    border: "1px solid black",
  },
  tableCellBold: {
    border: "1px solid black",
    fontWeight: "500",
  },

  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
    border: "1px solid black",
    position: "relative",
  },
  datePicker: {
    width: 146,
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 500,
  },
  index: {
    width: 150,
    border: "1px solid black",
    fontWeight: 600,
   
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
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
}));


const defaultValues = {
  id: 0,
  supplyOrderId: null,
  createdBy: null,
  wrkLdPreDetDtos: null,
  wrkLdInprogDetDtos: null,
  wrkLdPostDetDtos: null,
  wrkLdDetDtos: null,
};

export default function WorkLoadAssessment({ soId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openPreview, setOpenPreview] = useState();

  const arraySchema = yup.object().shape({
    remarks: yup.string().nullable(),
  });

  const schema = yup.object().shape({
    wrkLdInprogDetDtos: yup.array().of(arraySchema),
    wrkLdPostDetDtos: yup.array().of(arraySchema),
  });

  const {
    reset,
    control,
    getValues,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const resetData = (res) => {
    res.wrkLdPreDetDtos = res?.wrkLdPreDetDtos?.map((item) => ({
      ...item,
      planCompletion:
        item?.planCompletion &&
        moment(item?.planCompletion, "DD-MM-YYYY").format("YYYY-MM-DD"),
      actualCompletion:
        item?.actualCompletion &&
        moment(item?.actualCompletion, "DD-MM-YYYY").format("YYYY-MM-DD"),
    }));
    reset(res);
  };

  useEffect(() => {
 
    getWorkload(soId)
      .then((res) => {
        console.log("dsdasdsd", res);
        resetData(res);
      })
      .catch((error) => {
        toast.error(error);
      });
    console.log("inside sbu so import");
  }, []);

  const [loading, setLoading] = React.useState(false);

  const user_role = useSelector((store) => store.loggedInUser?.roleId);

  return (
    <>
      {openPreview && (
        <WorkloadView open={openPreview} setOpen={setOpenPreview} soId={soId} />
      )}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="left">
          <Button
            className={classes.button}
            type="back"
            variant="outlined"
            onClick={() => {
              if (user_role === 7) {
                dispatch(selectItem(<WorkLoad />));
              } else {
                dispatch(selectItem(<AllotSO />));
              }
            }}
            startIcon={<FontAwesomeIcon icon={faAngleLeft} />}
          >
            Back
          </Button>
        </Grid>
      </Grid>{" "}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            WORKLOAD ASSESSMENT SHEET - IS/FRM/007
          </Typography>
        </Grid>
      </Grid>
      <br />
      <Paper container>
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
            <Grid container>
              {loading && <LinearProgress />}
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell className={classes.tableCell} align="left">
                      <Typography className={classes.subHeading}>
                        {" "}
                        FILE NO:
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                      colSpan={6}
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        WORKLOAD ASSESSMENT SHEET (WAS)
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Purchase Order issued by{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>
                        {getValues("orderIssuedBy") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      PO No. and Date
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{`${getValues("soOrderNo")} dated ${getValues(
                        "soDate"
                      )}`}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Original Delivery Date
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{getValues("originalDd") ?? "--"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      PO Value
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("value")}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell
                      className={classes.tableCell}
                      colSpan={2}
                      rowSpan={2}
                    >
                      Extended Delivery Date (Without LD/With LD)
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      colSpan={2}
                      rowSpan={2}
                    >
                      <Typography>{getValues("extendedDd") ?? "--"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total Lines Items{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("noOfItems") ?? "--"}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Total QTY{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>{getValues("totalQty")}</Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Main Eqpt / Item
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>
                        {getValues("mainEqptItem") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      supplier
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>
                        {getValues("supplierName") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      QAP/QA&S document reference No.
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <Typography>{getValues("qapRef") ?? "--"}</Typography>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      Any other details
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <Typography>
                        {getValues("otherDetail") ?? "--"}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Sl.No.{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Activity{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Estimated Mandays{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Planned completion(DD/MM/YY){" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Actual Mandays{" "}
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Actual completion (DD/MM/YY){" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Remarks / Reasons for deviation{" "}
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                      colSpan={7}
                    >
                      <u>
                        {" "}
                        <b>PRE INSPECTION PHASE ACTIVITIES</b>{" "}
                      </u>
                    </StyledTableCell>
                  </TableRow>

                  {getValues("wrkLdPreDetDtos") &&
                    Array.isArray(getValues("wrkLdPreDetDtos")) &&
                    getValues("wrkLdPreDetDtos")?.map((item, index) => (
                      <TableRow>
                        <StyledTableCell
                          className={
                            item?.bold
                              ? classes.tableCellBold
                              : classes.tableCell
                          }
                        >
                          {item?.slNo}
                        </StyledTableCell>
                        <StyledTableCell
                          className={
                            item?.bold
                              ? classes.tableCellBold
                              : classes.tableCell
                          }
                        >
                          {item?.inspPhaseActivity}
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPreDetDtos[${index}].estManDays`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                onInput={restrict.dose}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPreDetDtos[${index}].planCompletion`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                type="date"
                                value={value}
                                onChange={onChange}
                                defaultValue="DD/MM/YYYY"
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPreDetDtos[${index}].actualManDays`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                onInput={restrict.dose}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPreDetDtos[${index}].actualCompletion`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                type="date"
                                defaultValue="DD/MM/YYYY"
                                className={classes.textField}
                                value={value}
                                onChange={onChange}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPreDetDtos[${index}].remarks`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                      colSpan={7}
                    >
                      <u>
                        {" "}
                        <b>IN-PROCESS INSPECTION PHASE ACTIVITIES</b>{" "}
                      </u>
                    </StyledTableCell>
                  </TableRow>
                  {getValues("wrkLdInprogDetDtos") &&
                    Array.isArray(getValues("wrkLdInprogDetDtos")) &&
                    getValues("wrkLdInprogDetDtos")?.map((item, index) =>
                      item?.bold ? (
                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            <b>{item?.slNo}</b>{" "}
                          </StyledTableCell>
                          <StyledTableCell
                            className={classes.tableCell}
                            colSpan={7}
                          >
                            <b>{item?.inspPhaseActivity}</b>
                          </StyledTableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            {item?.slNo}{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {" "}
                            {item?.inspPhaseActivity}{" "}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdInprogDetDtos[${index}].estManDays`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  onInput={restrict.dose}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdInprogDetDtos[${index}].planCompletion`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  id="date"
                                  type="date"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={value}
                                  onChange={onChange}
                                  defaultValue="DD/MM/YY"
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdInprogDetDtos[${index}].actualManDays`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  onInput={restrict.dose}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdInprogDetDtos[${index}].actualCompletion`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  id="date"
                                  type="date"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={value}
                                  onChange={onChange}
                                  defaultValue="DD/MM/YY"
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            <Controller
                              name={`wrkLdInprogDetDtos[${index}].remarks`}
                              control={control}
                              render={({
                                field: { onChange, value, ...props },
                              }) => (
                                <TextField
                                  size="small"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </StyledTableCell>
                        </TableRow>
                      )
                    )}

                  <TableRow>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                      colSpan={7}
                    >
                      <u>
                        <b>POST INSPECTION PHASE ACTIVITIES</b>
                      </u>
                    </StyledTableCell>
                  </TableRow>
                  {getValues("wrkLdPostDetDtos") &&
                    Array.isArray(getValues("wrkLdPostDetDtos")) &&
                    getValues("wrkLdPostDetDtos")?.map((item, index) => (
                      <TableRow>
                        <StyledTableCell className={classes.tableCell}>
                          {" "}
                          <b>{item?.slNo}</b>{" "}
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          {" "}
                          <b>{item?.inspPhaseActivity}</b>{" "}
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPostDetDtos[${index}].estManDays`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                onInput={restrict.dose}
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPostDetDtos[${index}].planCompletion`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                id="date"
                                type="date"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={value}
                                onChange={onChange}
                                defaultValue="DD/MM/YY"
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPostDetDtos[${index}].actualManDays`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                onInput={restrict.dose}
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPostDetDtos[${index}].actualCompletion`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                id="date"
                                type="date"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={value}
                                onChange={onChange}
                                defaultValue="DD/MM/YY"
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            name={`wrkLdPostDetDtos[${index}].remarks`}
                            control={control}
                            render={({
                              field: { onChange, value, ...props },
                            }) => (
                              <TextField
                                size="small"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </StyledTableCell>
                      </TableRow>
                    ))}

                  <TableRow>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                      colSpan={7}
                    >
                      <u>
                        <b> SUMMARY </b>
                      </u>
                    </StyledTableCell>
                  </TableRow>

                  <TableRow>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Total Estimated Mandays{" "}
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      <TextField
                        size="small"
                        onInput={restrict.number}
                        inputProps={{ maxLength: 100 }}
                      />
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      Total Actual Mandays{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      <TextField
                        size="small"
                        onInput={restrict.number}
                        inputProps={{ maxLength: 100 }}
                      />
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      I-Note/I and TC/ Dispatch Clearance Reference and Date{" "}
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell} colSpan={2}>
                      <TextField
                        size="small"
                        onInput={restrict.general}
                        inputProps={{ maxLength: 100 }}
                      />
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* {recordsAfterPagingAndSorting()?.length != 0 &&
              recordsAfterPagingAndSorting()?.length != undefined ? (
                <TblPagination />
              ) : (
                ""
              )} */}
            </Grid>
          </Grid>
        </Grid>
      </Paper>{" "}
      <Grid container spacing={0} style={{ paddingTop: 15, paddingBottom: 10 }}>
        <Grid item xs={12} align="right">
          <Grid item xs={1} align="right">
            <Button
              type="submit"
              onClick={() => setOpenPreview(true)}
              variant="contained"
              color="secondary"
              className={classes.btn}
              // disabled={loading || !isDirty}
            >
              Preview
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
