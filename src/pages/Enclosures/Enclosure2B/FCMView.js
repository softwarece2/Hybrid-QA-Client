/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {
  Checkbox,
  Dialog,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  RadioGroup,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { StyledTableCell } from "components/UseTable";
import moment from "moment";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { DialogContent, DialogTitle } from "Utils";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getSavedDetailsFCM } from "Redux/Actions/Enclosure/Enclosure2BAction";
//Component
import Button from "components/Button";
import HeaderPdf from "pages/Layout/HeaderPdf";
import { PaperComponent } from "Utils/D3Tree";
import { headerValue } from "Globals.js";
import HeaderFCM from "pages/Layout/HeaderFCM";

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

export default function FCMView({ open, setOpen, idVal }) {
  const classes = useStyles();
  const dispatch = useDispatch();



  const {
    control,


  } = useForm({
    mode: "onChange",
  });

  const [valueData, setValueData] = React.useState("");

  const savedFcm = useSelector((store) => store.enclosure2BReducer.savedFcm);


  React.useEffect(() => {
    dispatch(getSavedDetailsFCM(idVal?.id));
  }, []);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        maxWidth="lg"
        align="center"
        PaperComponent={(props) => (
          <PaperComponent id="draggable-dialog-title11" {...props} />
        )}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          id="draggable-dialog-title11"
        >
          FIRST CONTACT MEETING WITH FIRM ON RECEIPT OF PURCHASE ORDER
        </DialogTitle>
        <DialogContent>
          <div ref={componentRef}>
            <HeaderPdf headerValue={headerValue("fcm")} />
            <HeaderFCM />
            {/* <Paper> */}
            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}> */}

            <Grid container>
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
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell
                        align="left"
                        className={classes.tableCell}
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          Sl.No
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          DESCRIPTION
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        align="left"
                        colSpan={2}
                      >
                        <Typography className={classes.subHeading}>
                          {" "}
                          REMARKS
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
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {idVal?.orderNo}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        2.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PO Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {moment(savedFcm?.soDate).format("DD-MM-yyyy")}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        3.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Date of Receipt of PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.dateOfReceipt}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        4.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.itemDescription}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        5.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        No. of Line Items / Total Quantity
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.noOfItems}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        6.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Order Placing Authority
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.opa}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        7.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Delivery Date
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.deliveryDate}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        8.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        PSPP / No.of Lots
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.noOfLots}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        9.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={7}
                      >
                        {" "}
                        Inspection Instruction as per PO
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        Please mark the instructions as applicable-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Approved Drg and QAP{" "}
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedDrg"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.approvedDrg ? 1 : 0}
                                    color="primary"
                                    // onChange={(e) => onChange(e.target.checked)}
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Approved QAP
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="approvedQap"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.approvedQap ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) OEM Tech Specs
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="oemTechSpecs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.oemTechSpecs ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Import Documents
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="importDocs"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.importDocs ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) Special Instructions, If any
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="specInst"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.specInst ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Discrepancy in Inspection Instruction, if any, and
                        OPA clarification awaited
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        <FormControl component="fieldset">
                          <FormControlLabel
                            style={{ padding: "0px 0px 0px 25px" }}
                            control={
                              <Controller
                                name="inspDiscrepancy"
                                control={control}
                                render={({
                                  field: { onChange, value, ...props },
                                }) => (
                                  <Checkbox
                                    checked={savedFcm?.inspDiscrepancy ? 1 : 0}
                                    color="primary"
                                  />
                                )}
                              />
                            }
                          />
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        10.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Approved Drg and
                        QAP" or "Approved QAP", please furnish details-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={2}
                      >
                        Details of Drawing{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={12}>
                            (a) If first time induction, date of submission of
                            approved drawing to CQAE(WE),Bengaluru-{""}
                          </Grid>
                          {savedFcm?.newDrgDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={12}>
                            {" "}
                            (b) If existing approved drawing is to be used then
                            indicate concurrence details from OPA/ PD with date
                            of using the same -
                          </Grid>

                          {savedFcm?.existDrgDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      ></StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={3}
                      >
                        Details of QAP{" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={12}>
                            (a) If fresh QAP is to be made, date of submission
                            of draft QAP alongwith approved Drawings to
                            CQAE(WE), Bengaluru-
                          </Grid>
                          {savedFcm?.freshQapDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={12}>
                            (b) If existing QAP is to be used then indicate QAP
                            No with date. Concurrence to use the same will be
                            sought by CQAE(WE), Bengaluru from DQA(N), Delhi -
                          </Grid>

                          {savedFcm?.existQapDate}
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={6}>(c) QT/ Type test applicable - </Grid>
                          <Controller
                            name="qtTestApplicable"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                // value={
                                //   savedFcm?.qtTestApplicable
                                //     ? "true"
                                //     : "false"
                                // }
                                // onChange={onChange}
                                row
                              >
                                <FormControlLabel
                                  checked={savedFcm?.qtTestApplicable}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedFcm?.qtTestApplicable}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        11.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "OEM Tech Specs",
                        please furnish details-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Detailed Bill of Material available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={1}>
                            <Controller
                              name="detailBom"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <FormGroup
                                  aria-label="position"
                                  // row
                                  // checked={
                                  //   savedFcm?.detailBom ? "true" : "false"
                                  // }
                                  // column
                                >
                                  <FormControlLabel
                                    checked={savedFcm?.detailBom}
                                    control={
                                      <Checkbox
                                        color="primary"
                                        labelPlacement="start"
                                      />
                                    }
                                    label="Yes"
                                    labelPlacement="start"
                                  />
                                  <FormControlLabel
                                    checked={!savedFcm?.detailBom}
                                    control={<Checkbox color="primary" />}
                                    label="No"
                                    labelPlacement="start"
                                  />
                                </FormGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Approved PIL available
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid xs={1}>
                          <Controller
                            name="approvedPil"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <RadioGroup
                                // value={
                                //   savedFcm?.approvedPil ? "true" : "false"
                                // }
                                column
                              >
                                <FormControlLabel
                                  checked={savedFcm?.approvedPil}
                                  control={<Checkbox color="primary" />}
                                  label="Yes"
                                  labelPlacement="start"
                                />
                                <FormControlLabel
                                  checked={!savedFcm?.approvedPil}
                                  control={<Checkbox color="primary" />}
                                  label="No"
                                  labelPlacement="start"
                                />
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        12.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Bill of Lading/ Shipping Bill/ Air Way Bill (Any
                        one)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <FormControl component="fieldset">
                          <RadioGroup
                            size="small"
                            // value={
                            // savedFcm?.billEntryWarehouse? "true" : "false"
                            // }
                          >
                            <FormControlLabel
                              checked={savedFcm?.billEntryWarehouse}
                              // onChange={(e) => {
                              //   setValueData("yes");
                              // }}
                              control={<Checkbox color="primary" />}
                              label="Yes"
                              labelPlacement="start"
                            />
                            <FormControlLabel
                              checked={!savedFcm?.billEntryWarehouse}
                              onChange={(e) => {
                                setValueData("no");
                              }}
                              control={<Checkbox color="primary" />}
                              label="No"
                              labelPlacement="start"
                            />
                          </RadioGroup>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (b) Invoice by OEM or Country of Origin certificate of
                        equipment with Packing list
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={1}>
                            <Controller
                              name="invoiceOemOriginCert"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                // value={
                                //   savedFcm?.invoiceOemOriginCert
                                //     ? "true"
                                //     : "false"
                                // }
                                >
                                  <FormControlLabel
                                    checked={savedFcm?.invoiceOemOriginCert}
                                    control={<Checkbox color="primary" />}
                                    label="Yes"
                                    labelPlacement="start"
                                  />
                                  <FormControlLabel
                                    checked={!savedFcm?.invoiceOemOriginCert}
                                    control={<Checkbox color="primary" />}
                                    labelPlacement="start"
                                    label="No"
                                  />
                                </RadioGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Bill of Entry into Warehouse
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={1}>
                            <Controller
                              name="billEntryWarehouse"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                  // value={
                                  //   savedFcm?.billEntryWarehouse
                                  //     ? "true"
                                  //     : "false"
                                  // }
                                  column
                                >
                                  <FormControlLabel
                                    checked={savedFcm?.billEntryWarehouse}
                                    control={<Checkbox color="primary" />}
                                    label="Yes"
                                    labelPlacement="start"
                                  />
                                  <FormControlLabel
                                    checked={!savedFcm?.billEntryWarehouse}
                                    control={<Checkbox color="primary" />}
                                    label="No"
                                    labelPlacement="start"
                                  />
                                </RadioGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Certificate of Conformity indicating Governing
                        Specifications and values of which the item are tested
                        alongwith OEM Test cerrtificate/ Reports/ Date sheet/
                        Catalouge
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Grid container spacing={1}>
                          <Grid xs={1}>
                            <Controller
                              name="certOfConfirmity"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                // value={
                                //   savedFcm?.certOfConfirmity
                                //     ? "true"
                                //     : "false"
                                // }
                                >
                                  <FormControlLabel
                                    checked={savedFcm?.certOfConfirmity}
                                    control={<Checkbox color="primary" />}
                                    label="Yes"
                                    labelPlacement="start"
                                  />
                                  <FormControlLabel
                                    checked={!savedFcm?.certOfConfirmity}
                                    control={<Checkbox color="primary" />}
                                    label="No"
                                    labelPlacement="start"
                                  />
                                </RadioGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        {" "}
                        (e)Guarantee/ Warranty
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {" "}
                        <Grid container spacing={1}>
                          <Grid xs={1}>
                            <Controller
                              name="warranty"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                // value={savedFcm?.warranty ? "true" : "false"}
                                >
                                  <FormControlLabel
                                    checked={savedFcm?.warranty}
                                    control={<Checkbox color="primary" />}
                                    label="Yes"
                                    labelPlacement="start"
                                  />
                                  <FormControlLabel
                                    checked={!savedFcm?.warranty}
                                    control={<Checkbox color="primary" />}
                                    label="No"
                                    labelPlacement="start"
                                  />
                                </RadioGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={15}
                      >
                        13.
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        If Inspection Instruction is as per "Import Documents",
                        please furnish the availability of following documents-
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Raw Material Inspection
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (a) Melt/ Pouring
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.meltPouring}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        {" "}
                        (b) Sample testing (NABL){" "}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.sampleTestNabl}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        In Process Inspection (Component level/ Sub-assembly
                        stage/ Unit Level)
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (c) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ PCB level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.inproInspPcb}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (d) Physical Checks, Functional checks, ESS, Functional
                        checks post ESS @ Unit level
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.inproInspUnit}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (e) NDTs, Pressure Test, ECT
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.inproInspNpe}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={3}
                      >
                        Final Stage
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (f) Qualification Tests (ET, EMI/EMC)
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalQt}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (g) Pre-FATs, FATS, Endurance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalFats}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (h) Packing & Preservation, PDI and Stam in
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalPacking}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (i) Issuance of I-Note/ I and TC/ Dispatch Clearance
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalClearance}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (j) Issuance of Vendor Ratin
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalVendorRating}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        (k) Dispatch to Consignee
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.finalConsignee}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        className={classes.tableCell}
                        rowSpan={
                          savedFcm?.fcmVendor && savedFcm?.fcmVendor?.length > 0
                            ? savedFcm?.fcmVendor?.length + 2
                            : 3
                        }
                      >
                        14.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Order Details
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        <Typography>{savedFcm?.subOrderDet}</Typography>
                      </StyledTableCell>
                    </TableRow>{" "}
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        Sub-Vendor Name and Address
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Item Description
                      </StyledTableCell>{" "}
                      <StyledTableCell className={classes.tableCell}>
                        QA Jurisdiction/ Sub-Nominated Agency
                      </StyledTableCell>
                    </TableRow>
                    {savedFcm?.fcmVendor && savedFcm?.fcmVendor?.length > 0 ? (
                      savedFcm?.fcmVendor?.map((item) => (
                        <TableRow>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.vendor}
                          </StyledTableCell>
                          <StyledTableCell className={classes.tableCell}>
                            {item?.itemDesc}
                          </StyledTableCell>{" "}
                          <StyledTableCell className={classes.tableCell}>
                            {item?.agency}
                          </StyledTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell className={classes.tableCell}>
                          {/* <Typography></Typography> */}
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="center"
                        >
                          -
                        </StyledTableCell>
                        <StyledTableCell
                          className={classes.tableCell}
                          align="center"
                        >
                          -
                        </StyledTableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <StyledTableCell className={classes.tableCell}>
                        15.
                      </StyledTableCell>
                      <StyledTableCell className={classes.tableCell}>
                        Any other technical issues/ Clarifications pertaining to
                        PO, Drawings, QAP, Subnomination, Delivery Date, Offer
                        Letter etc. if any-
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        className={classes.tableCell}
                        colSpan={2}
                      >
                        {savedFcm?.others}
                      </StyledTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
            {/* </Grid> */}
            {/* </Paper>{" "} */}
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            // onClick={handleSubmit(handleSave)}
            type="submit"
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
            type="submit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
