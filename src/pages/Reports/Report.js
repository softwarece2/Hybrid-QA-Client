/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import "../../App.css";
import { useSelector } from "react-redux";
import TextField from "../../components/DateTextField";
import  { StyledTableCell } from "components/UseTable";
import {pink} from "@material-ui/core/colors";

//material-ui
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
  Dialog,
  Table,
  TableBody,
  TableHead,
  TableRow,
  DialogActions,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteNew from "components/AutoCompleteNew";

import Button from "components/Button";
import {
  consignee,
  indenter,
} from "Redux/Actions/SupplyOrder/SODropdownAction";
import { DialogContent} from "Utils";
import { cleanup } from "@testing-library/react";
import VisibilityIcon from "@material-ui/icons/Visibility";

//icons
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 235,
    width: "100%",
  },
  table: {
    minWidth: "100%",
    border: "1px solid black",
    position: "relative",
  },
  card: {
    padding: 2,
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  heading: {
    padding: "0px 0px 0px 8px",
  },
  textFieldRoot: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    width: "20px",
    // height: 44,
  },
  tableCell: {
    border: "1px solid black",
  },
  asterisk: {
    color: theme.palette.error.dark,
  },
  input: {
    fontSize: "1rem",
    fontWeight: 500,
    // borderRadius: 20,
    color: pink[700],
    // padding: "4px 8px",
  },
  minInput: {
    minHeight: 100,
  },
  subHeading: {
    fontWeight: 500,
  },
  minWidth: {
    minWidth: 100,
  },
}));

export default function Report() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, SetOpen] = useState(false);
  const consigneeDetails = useSelector(
    (store) => store.soDropdownReducer.consignee
  );
  const indentDetails = useSelector((store) => store.soDropdownReducer.indent);
  const projectList = useSelector(
    (store) => store.soDropdownReducer.projectListDetails
  );


  const inspectorData = useSelector(
    (store) => store.soReducer.inspectorDetails
  );

  const {
    control,
    formState: { errors},
  } = useForm({
  
    mode: "onChange",
  });


  const View = (data) => {
    SetOpen(true);
  };
  useEffect(() => {
    cleanup();
    dispatch(indenter());

    dispatch(consignee());
  }, []);

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          className={classes.card}
          disableTypography
          title={<Typography className={classes.heading}>SO Report</Typography>}
        />
        <CardContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="startDate"
                  control={control}
                  // value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="Start Date"
                      placeholder="Start Date"
                      type="date"
                      size="small"
                      required
                      variant="outlined"
                      {...props}
                      // inputProps={{
                      //   min: moment(new Date()).format("YYYY-MM-DD"),
                      // }}
                      error={!!errors.dd}
                      helperText={errors.dd?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="endDate"
                  control={control}
                  // value={value}
                  render={({ field: { onChange, value, ...props } }) => (
                    <TextField
                      labelText="End Date"
                      placeholder="End Date"
                      onChange={onChange}
                      value={value}
                      type="date"
                      size="small"
                      variant="outlined"
                      required
                      // {...props}
                      // inputProps={{
                      //   min: moment(new Date()).format("YYYY-MM-DD"),
                      // }}
                      error={!!errors.dd}
                      helperText={errors.dd?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="projectList"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Project Details"
                      data={projectList}
                      required
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        // setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="supplyOrderId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Select Inspector"
                      data={inspectorData}
                      required
                      getOptionLabel={(o) => o.ename}
                      onChange={(e, v) => {
                        onChange(v);
                        // setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="consigneeId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Consignee"
                      data={consigneeDetails}
                      required
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        // setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
                <Controller
                  name="indenterId"
                  control={control}
                  render={({ field: { onChange, value, ...props } }) => (
                    <AutoCompleteNew
                      labelText="Indentor/QPA"
                      data={indentDetails}
                      required
                      getOptionLabel={(o) => o.name}
                      onChange={(e, v) => {
                        onChange(v);
                        // setEmpVal(v?.id);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="right">
              <Button
                type="submit"
                // onClick={() => dispatch(selectItem(<ReportTable />))}
                onClick={View}
                variant="contained"
                color="primary"
                startIcon={<VisibilityIcon />}
                disabled={loading}
              >
                {loading && <CircularProgress size="24px" />} View
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* {.................................................Dialog.................................} */}
      <div className={classes.root}>
        <Dialog open={open} maxWidth="lg" fullWidth>
          {/* <DialogTitle style={{ fontSize: "0.875rem" }}>
            Supply Order Report
          </DialogTitle> */}
          <DialogContent>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">
                    <Typography>SO NO</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" className={classes.tableCell}>
                    <Typography className={classes.subHeading}></Typography>
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell} align="left">
                    <Typography className={classes.subHeading}>
                      Inspector
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" className={classes.tableCell}>
                    <Typography className={classes.subHeading}>
                      Consignee
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left" className={classes.tableCell}>
                    <Typography className={classes.subHeading}>
                      Indentor/OPA
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell className={classes.tableCell}>
                    1.
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell}>
                    PO No.
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell}>
                    PO No.
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell}>
                    PO No.
                  </StyledTableCell>
                  <StyledTableCell className={classes.tableCell}>
                    PO No.
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSubmit(handleSave)}
              type="submit"
              // onClick={handlePrint}
            >
              Pdf
            </Button>
            <Button
              variant="contained"
              color="primary"
              // onClick={handleSubmit(handleSave)}
              type="submit"
              // onClick={handlePrint}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => SetOpen(false)}
              type="submit"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
