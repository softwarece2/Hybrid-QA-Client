/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React from "react";
import {
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  Typography,
  TableBody,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useTable, { StyledTableCell } from "components/UseTable";
import { getSavedDetailsFCM } from "Redux/Actions/Enclosure/Enclosure2BAction";
import { useDispatch } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

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
    fontWeight: 500,
  },
  subHeading: {
    fontWeight: 500,
  },
  btn: {
    backgroundColor: theme.palette.btn.print,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.btn.print,
      color: theme.palette.common.white,
    },
  },
  index: {
    width: 150,
    border: "1px solid black",
    fontWeight: 600,
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function InspectionPlan({ open, setOpen, idVal }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };
  const { TblPagination, recordsAfterPagingAndSorting } = useTable();
  React.useEffect(() => {
    dispatch(getSavedDetailsFCM(idVal?.id));
  }, []);

  return (
    <div className={classes.root}>
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
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      className={classes.tableCell}
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        Inspection Planned From{" "}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        Inspection Planned To
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        NO of days
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        File No
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        Project
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell
                      className={classes.tableCell}
                      align="center"
                    >
                      <Typography className={classes.subHeading}>
                        {" "}
                        Store description
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell className={classes.tableCell}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          autoOk
                          size="small"
                          style={{ width: "100%", height: "90%" }}
                          inputVariant="outlined"
                          format="dd/MM/yyy"
                          //   margin="normal"
                          id="date-picker-outlined"
                          value={selectedStartDate}
                          onChange={(date) => handleStartDateChange(date)}
                          KeyboardButtonProps={{
                            "#0B9CAB": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          autoOk
                          size="small"
                          style={{ width: "100%", height: "90%" }}
                          inputVariant="outlined"
                          format="dd/MM/yyy"
                          //   margin="normal"
                          id="date-picker-outlined"
                          value={selectedStartDate}
                          onChange={(date) => handleStartDateChange(date)}
                          KeyboardButtonProps={{
                            "#0B9CAB": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      <TextField variant="outlined" size="small" />
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <TextField variant="outlined" size="small" />
                    </StyledTableCell>

                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <TextField variant="outlined" size="small" />
                    </StyledTableCell>
                    <StyledTableCell className={classes.tableCell}>
                      {" "}
                      <TextField variant="outlined" size="small" />
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {recordsAfterPagingAndSorting()?.length != 0 &&
              recordsAfterPagingAndSorting()?.length != undefined ? (
                <TblPagination />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>{" "}
    </div>
  );
}
