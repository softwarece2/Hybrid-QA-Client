/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
//material-ui

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import "date-fns";
import "jspdf-autotable";


import MultilineTextField from "components/MultilineTextField";
import moment from "moment";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { StyledTableCell } from "../../../components/UseTable";
import { restrict } from "restrict";
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
  paper: {
    padding: "12px 12px 12px 12px",
  },
  size: {
    width: 15,
    height: 15,
  },
  table: {
    minWidth: "100%",
  },
  tableCell: {
    border: "1px solid black",
  },
  heading: {
    textDecoration: "underline",
    fontWeight: 600,
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "0.875rem",
  },
  box: {
    border: "1px solid black",
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover, &:focus": {
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.main,
    },
  },
}));


export default function InspectionTestCertificateForm({
  existing,
  data,
  num,
  date,
}) {
  const classes = useStyles();

  const { setValue, getValues, control } = useFormContext();
  var converter = require("number-to-words");

  const [loading, setLoading] = React.useState(false);

  const { fields } = useFieldArray({
    control,
    name: "inoteLineItems",
  });

  React.useEffect(() => {
    setValue("inoteLineItems", data);
  }, [data]);

  const updaterecordsLineItems = (remarks, id) => {
    console.log(id, remarks);
    const newArr = getValues("inoteLineItems")?.map((item, idx) => {
      if (idx === id) {
        return {
          ...item,
          itemRemarks: remarks,
        };
      }
      return item;
    });
    setValue("inoteLineItems", newArr);
  };

  console.log("ehwegge", getValues("inoteLineItems"), existing);
  return (
    <>
      {" "}
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
          <Typography className={classes.heading}>
            Enclosure to CQAE - WE, Bengaluru Inspection and Test Certificate
            No.
            {num} Dated : {moment(date).format("DD-MMM-YYYY")}
          </Typography>
        </Grid>
      </Grid>
      <br />
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
            <Grid container>
              {loading && <LinearProgress />}
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" className={classes.tableCell}>
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        Sl.No
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        Pg No/ Ind Sl
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        Item Description
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        BEL Part Number
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        Qty
                      </Typography>
                    </TableCell>

                    <TableCell
                      className={classes.tableCell}
                      align="left"
                      colSpan={2}
                    >
                      <Typography
                        className={classes.subHeading}
                        style={{ fontWeight: 700 }}
                      >
                        {" "}
                        Acc Unit{" "}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields?.map((item, index) => (
                    <React.Fragment key={index}>
                      <TableRow key={item.id}>
                        <StyledTableCell
                          className={classes.tableCell}
                          rowSpan={2}
                        >
                          <Typography className={classes.subHeading}>
                            {index + 1}.
                          </Typography>
                        </StyledTableCell>

                        <StyledTableCell
                          className={classes.tableCell}
                          rowSpan={2}
                        >
                          <Controller
                            control={control}
                            name={`inoteLineItems[${index}].indentNo`}
                            render={({ field: { value } }) => (
                              <Typography className={classes.subHeading}>
                                {value}
                              </Typography>
                            )}
                          />
                        </StyledTableCell>

                        <StyledTableCell className={classes.tableCell}>
                          <Controller
                            control={control}
                            name={`inoteLineItems[${index}].description`}
                            render={({ field: { value } }) => (
                              <Typography className={classes.subHeading}>
                                {value}
                              </Typography>
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          rowSpan={2}
                        >
                          <Controller
                            control={control}
                            name={`inoteLineItems[${index}].partNo`}
                            render={({ field: { value } }) => (
                              <Typography className={classes.subHeading}>
                                {value}
                              </Typography>
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          rowSpan={2}
                        >
                          <Controller
                            control={control}
                            name={`inoteLineItems[${index}].tendered`}
                            render={({ field: { value } }) => (
                              <Typography className={classes.subHeading}>
                                {value}
                              </Typography>
                            )}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          rowSpan={2}
                        >
                          <Controller
                            control={control}
                            name={`inoteLineItems[${index}].uom`}
                            render={({ field: { value } }) => (
                              <Typography className={classes.subHeading}>
                                {value}
                              </Typography>
                            )}
                          />
                        </StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell className={classes.tableCell}>
                          {
                            <Controller
                              name={`inoteLineItems[${index}].itemRemarks	`}
                              control={control}
                              render={({ field: { onChange, value } }) => {
                                return (
                                  <MultilineTextField
                                    size="small"
                                    onChange={(e) => {
                                      updaterecordsLineItems(
                                        e.target.value,
                                        index
                                      );
                                    }}
                                    value={item?.itemRemarks}
                                    onInput={restrict.remarks}
                                  />
                                );
                              }}
                            ></Controller>
                          }
                        </StyledTableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
          <Typography className={classes.subHeading}>
            ITEMS INSPECTED :{" "}
            {`${data?.length} (${
              data?.length ? converter.toWords(data?.length) : "-"
            } Only)`}{" "}
          </Typography>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </>
  );
}
