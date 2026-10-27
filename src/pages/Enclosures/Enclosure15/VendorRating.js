/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
//material-ui

import { Dialog, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import TextField from "../../../components/TextField";
//hooks
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import { MaskedInput } from "components/controls/MaskedInput";
import moment from "moment";
import axiosInstanceTrans from "pages/Services/AxiosInstanceTransaction";
import { saveSupplierRatingUrl } from "pages/Services/URLs";
import { Controller, useForm } from "react-hook-form";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { restrict } from "restrict";
import { DialogActions, DialogContent, DialogTitle } from "Utils";
import { PaperComponent } from "Utils/D3Tree";
import * as yup from "yup";
import { WING_ID } from "../../../Globals";
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
  box: {
    border: "1px solid black",
  },
  paper: {
    width: "95%",
    padding: "12px 12px 12px 12px",
    [theme.breakpoints.down("lg")]: {
      width: "95%",
    },
    [theme.breakpoints.down("md")]: {
      width: "95%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "95%",
    },
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
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  value: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  textSize: {
    fontSize: "0.875rem",
  },
  root: {
    width: 100,
  },
  rootdate: {
    width: 110,
  },
  ml10: {
    marginLeft: 10,
  },
}));

const schema = yup.object().shape({
  kd: yup
    .number()
    .typeError("Kd is required")
    .required("Kd is required"),
  kr: yup
    .number()
    .typeError("Kr is required")
    .required("Kr is required"),
  na: yup
    .number()
    .typeError("Na is required")
    .required("Na is required"),
  ni: yup
    .number()
    .typeError("Ni is required")
    .required("Ni is required"),
  q1: yup
    .number()
    .typeError("Q1 is required")
    .required("Q1 is required"),
  drQ: yup
    .number()
    .typeError("Q is required")
    .required("Q is required"),
  t: yup
    .number()
    .typeError("T is required")
    .required("T is required"),
  t1: yup
    .number()
    .typeError("T1 is required")
    .required("T1 is required"),
  p: yup
    .number()
    .typeError("p is required")
    .required("p is required"),

  q: yup
    .number()
    .typeError("q is required")
    .required("q is required"),
  promptness: yup
    .number()
    .typeError("Promptness is required")
    .required("Promptness is required"),
  attitude: yup
    .number()
    .typeError("Attitude of Supplier is required")
    .required("Attitude of Supplier is required"),
  ceo: yup
    .number()
    .typeError("ceo is required")
    .required("ceo is required"),
  poDate: yup.string().required("PO date is required"),
  originalDp: yup
    .number()
    .typeError("original Dp is required")
    .required("original Dp is required"),
  actualDp: yup
    .number()
    .typeError("actualDp is required")
    .required("actualDp is required"),
});

const defaultValues = {
  qr: null,
  dr: null,
  er: null,
  sr: null,
  kd: null,
  kr: null,
  na: null,
  ni: null,
  q1: null,
  drQ: null,
  t: null,
  t1: null,
  p: null,
  q: null,
  promptness: null,
  attitude: null,
  ceo: null,
  poDate: "2022-02-02",
  originalDp: null,
  actualDp: null,
};

export default function VendorRating() {
  const {
    watch,
    handleSubmit,
    control,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const classes = useStyles();

  const loggedInUser = useSelector((store) => store.loggedInUser);
  const isArmy = loggedInUser?.wingId === WING_ID?.ARMY;

  const [printdialog, SetPrintDialog] = useState(false);
  const calculatedvalues = React.useRef({ qr: 0.0, dr: 0.0, er: 0.0, sr: 0.0 });

  const resetReference = () => {
    calculatedvalues.current.qr = 0.0;
    calculatedvalues.current.dr = 0.0;
    calculatedvalues.current.er = 0.0;
    calculatedvalues.current.sr = 0.0;
  };

  const executeSubmit = (e, data) => {
    e.preventDefault();
    const saveData = {
      ...data,
      qr: calculatedvalues.current.qr,
      dr: calculatedvalues.current.dr,
      er: calculatedvalues.current.er,
      sr: calculatedvalues.current.sr,
      vendorId: 2,
      preparedBy: 2,
      vettedBy: 3,
    };

    axiosInstanceTrans
      .post(saveSupplierRatingUrl, saveData)
      .then(() => {
        toast.success("Data Successfully Submitted");
        e.target.reset();
        resetReference();
        clearErrors();
      })
      .catch((error) => {
        toast.error("Failed to Save");
        console.log(error);
      });
  };

  function calQR() {
    const val = (
      parseFloat(watch("kd")) +
      parseFloat(watch("kr")) +
      parseFloat(watch("na")) +
      parseFloat(watch("ni"))
    ).toFixed(3);
    calculatedvalues.current.qr = isNaN(val) ? 0 : val;
    return calculatedvalues.current.qr;
  }

  function calDR() {
    const val = (
      (parseFloat(watch("q1")) / parseFloat(watch("drQ"))) *
      (parseFloat(watch("t")) /
        (parseFloat(watch("t")) * parseFloat(watch("p")) + 1.5 * parseFloat(watch("t1")) * parseFloat(watch("p"))))
    ).toFixed(3);
    calculatedvalues.current.dr = isNaN(val) ? 0 : val;
    return calculatedvalues.current.dr;
  }

  function calER() {
    const val = (parseFloat(watch("promptness")) + parseFloat(calculatedvalues.current.qr)).toFixed(3);
    calculatedvalues.current.er = isNaN(val) ? 0 : val;
    return calculatedvalues.current.er;
  }

  function calSR() {
    const val = (
      60 * parseFloat(calculatedvalues.current.qr) +
      30 * parseFloat(calculatedvalues.current.dr) +
      (10 * calculatedvalues.current.er) / 100
    ).toFixed(3);
    calculatedvalues.current.sr = isNaN(val) ? 0 : val;
    return calculatedvalues.current.sr;
  }

  useEffect(() => {
    calQR();
    calDR();
    calER();
    calSR();
  }, [getValues()]);

  const printref = useRef(null);
  return (
    <>
      {" "}
      <Dialog
        open={printdialog}
        maxWidth="lg"
        align="center"
        PaperComponent={(props) => <PaperComponent id="draggable-dialog-title5" {...props} />}
      >
        <DialogTitle
          style={{ fontSize: "0.875rem", cursor: "move" }}
          onClose={() => SetPrintDialog(false)}
          id="draggable-dialog-title5"
        >
          Print
        </DialogTitle>
        <DialogContent>
          <div ref={printref} className="printbox">
            <style>
              {`@media print {.printbox{font-size: 10px;} .printbox b{font-weight: 500;}  .printbox .printbtn{display:none}} .box-print{padding-left: 10px;padding-right: 10px;}`}
            </style>
            <Grid container spacing={2}>
              <Grid item xs={12} align="center">
                <Typography className={classes.heading}>VENDOR/SUPPLIER RATING-IS/FRM/010</Typography>
                <Typography className={classes.heading}>SUPPLIER RATING AS PER JSG 015:2021</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>PO NO:</b>
                </Typography>
              </Grid>
              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>20B95L001/G-650 dated 02 Feb22</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>Firm Name:</b>
                </Typography>
              </Grid>

              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>M/s Cathodic Control Ltd.</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>{isArmy ? "QACL" : "OL"} No & Date:</b>
                </Typography>
              </Grid>

              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>CCC/20B95L001/G-650/1/2022-23 dated 28 Jun</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>File No:</b>
                </Typography>
              </Grid>

              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>IG-3416-22</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>Item Description:</b>
                </Typography>
              </Grid>

              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>ICCP Anode P Type with Cable</Typography>
              </Grid>

              <Grid item xs={2} align="left">
                <Typography className={classes.subHeading}>
                  <b>Consignee:</b>
                </Typography>
              </Grid>

              <Grid item xs={4} align="left">
                <Typography className={classes.subHeading}>CPRO,Mumbai </Typography>
                <br /> <br />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5} align="left">
                <Typography className={classes.subHeading}>
                  1. <b> QR = Σ [Kd*Kr*Na]/Ni=(60%)</b>
                </Typography>
              </Grid>
              <Grid item xs={7} align="left">
                {calculatedvalues.current.qr}
              </Grid>
              <Grid item xs={5} align="left">
                <Typography className={classes.subHeading}>
                  2. <b> DR = (Q1/Q)*[T/(T*p+ 1.5T1*q)]=(30%)</b>
                </Typography>
              </Grid>
              <Grid item xs={7} align="left">
                {calculatedvalues.current.dr}
              </Grid>
              <Grid item xs={5} align="left">
                <Typography className={classes.subHeading}>
                  3. <b> ER = (10%) </b>
                </Typography>
              </Grid>
              <Grid item xs={7} align="left">
                {calculatedvalues.current.er}
              </Grid>
              <Grid item xs={5} align="left">
                <Typography className={classes.subHeading}>
                  4. <b> SR = 60(QR)+30(DR)+10(ER)/100 </b>
                </Typography>
              </Grid>
              <Grid item xs={7} align="left">
                {calculatedvalues.current.sr}
                <br />
              </Grid>
              <Grid item xs={12} align="left">
                <Typography className={classes.heading}>Enter value</Typography>
                <br />
              </Grid>
              <Grid className="box-print">
                <Grid container spacing={1} className={classes.box}>
                  {/* <Grid container spacing={2}> */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                    }}
                  >
                    <Grid item xs={2} align="left">
                      <Typography className={classes.value}>For QR</Typography>
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Kd=(0.5)</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().kd}
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Kr=(0.5)</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().kr}
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Na=</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().na}
                    </Grid>
                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Ni=</Typography>
                    </Grid>

                    <Grid item xs={1} align="left">
                      {getValues().ni}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Grid item xs={2} align="left">
                      <Typography className={classes.value}>For DR</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Q1=</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().q1}
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>Q=</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().q}
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>T (Days)=</Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().t}
                    </Grid>

                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>T1(Day)= </Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().t1}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      justifyItems: "center",
                    }}
                  >
                    <Grid item xs={3} align="left"></Grid>
                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>P=Q1/Q </Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().p}
                    </Grid>
                    <Grid item xs={1} align="left">
                      <Typography className={classes.value}>q=1-p= </Typography>
                    </Grid>
                    <Grid item xs={1} align="left">
                      {getValues().q}
                    </Grid>
                  </Grid>
                  {/* 4th row */}

                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      justifyItems: "center",
                    }}
                  >
                    <Grid item xs={2} align="left">
                      <Grid item xs={12} align="left">
                        <Typography className={classes.value}>For ER</Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={4} align="left">
                      <Grid container spacing={2}>
                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>promptness (4 marks)=</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().promptness}
                        </Grid>

                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>Attitude of supplier(3 Marks)=</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().attitude}
                        </Grid>

                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>CEO/CER (3 Marks) =</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().ceo}
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={4} align="left">
                      <Grid container spacing={2}>
                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>PO date</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().poDate}
                        </Grid>

                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>Original DP</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().originalDp}
                        </Grid>

                        <Grid item xs={6} align="left">
                          <Typography className={classes.value}>Actual DP (Wrt O)</Typography>
                        </Grid>
                        <Grid item xs={6} align="left">
                          {getValues().actualDp}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* //// */}
              <Grid item xs={12} align="left">
                <Typography className={classes.textSize}>
                  <b> Na = </b>Qty accepted in the i-Note.{" "}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Kd = </b>deviation;0.5 in case of deviation else 1.0.{" "}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Kr = </b>Rectification coefficient;0.5 for lots accepted after rectification else 1.0.{""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Ni = </b>Quantity offered for inspection.{""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Q = </b>Quantity promised to be supplied within stipulated delievery time.{""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Q1 = </b>Actual quantity suppplied within the stiplated delievery time.{""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> T = </b>Time promised delievery time for the full consignment.
                  {""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> T1 = </b>Actual delievery time for the full consignment(The delievery time should be taken from
                  the date of offering accceptable stores by the supplier.){""}
                </Typography>

                <Typography className={classes.textSize}>
                  <b> Σ </b>indicates summation of QRs computed where supplies are in various lots.
                  {""}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", display: "flex" }}>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary" className="printbtn">
                Print{" "}
              </Button>
            )}
            content={() => printref.current}
          />
        </DialogActions>
      </Dialog>
      <Paper className={classes.paper}>
        <form onSubmit={(e) => handleSubmit(async (data) => await executeSubmit(e, data))()}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
              <Typography className={classes.heading}>VENDOR/SUPPLIER RATING-IS/FRM/010</Typography>
              <Typography className={classes.heading}>SUPPLIER RATING AS PER JSG 015:2021</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>PO NO:</b>
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.subHeading}>20B95L001/G-650 dated 02 Feb22</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>Firm Name:</b>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.subHeading}>M/s Cathodic Control Ltd.</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>{isArmy ? "QACL" : "OL"} No & Date:</b>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.subHeading}>CCC/20B95L001/G-650/1/2022-23 dated 28 Jun</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>File No:</b>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.subHeading}>IG-3416-22</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>Item Description:</b>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography className={classes.subHeading}>ICCP Anode P Type with Cable</Typography>
            </Grid>

            <Grid item xs={2} sm={2} md={2} lg={2} xl={2} align="left">
              <Typography className={classes.subHeading}>
                <b>Consignee:</b>
              </Typography>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4} align="left">
              <Typography>CPRO,Mumbai </Typography>
              <br /> <br />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={10} md={6} lg={3} xl={3} align="left">
              <Typography className={classes.subHeading}>
                1. <b> QR = Σ [Kd*Kr*Na]/Ni=(60%)</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={6} lg={9} xl={9} align="left">
              <TextField
                inputProps={{ readOnly: true }}
                className={classes.root}
                variant="outlined"
                placeholder={"0.0"}
                required
                value={calculatedvalues.current.qr}
              />
            </Grid>
            <Grid item xs={12} sm={10} md={6} lg={3} xl={3} align="left">
              <Typography className={classes.subHeading}>
                2. <b> DR = (Q1/Q)*[T/(T*p+ 1.5T1*q)]=(30%)</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={6} lg={9} xl={9} align="left">
              <TextField
                inputProps={{ readOnly: true }}
                className={classes.root}
                variant="outlined"
                placeholder={"0.0"}
                required
                value={calculatedvalues.current.dr}
              />
            </Grid>
            <Grid item xs={12} sm={10} md={6} lg={3} xl={3} align="left">
              <Typography className={classes.subHeading}>
                3. <b> ER = (10%) </b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={6} lg={9} xl={9} align="left">
              <TextField
                inputProps={{ readOnly: true }}
                className={classes.root}
                variant="outlined"
                placeholder={"0"}
                required
                value={calculatedvalues.current.er}
              />
            </Grid>
            <Grid item xs={12} sm={10} md={6} lg={3} xl={3} align="left">
              <Typography className={classes.subHeading}>
                4. <b> SR = 60(QR)+30(DR)+10(ER)/100 </b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={6} lg={9} xl={9} align="left">
              <TextField
                inputProps={{ readOnly: true }}
                className={classes.root}
                variant="outlined"
                placeholder={"0"}
                required
                value={calculatedvalues.current.sr}
              />
              <br />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <Typography className={classes.heading}>Enter value</Typography>
              <br />
            </Grid>
            <Grid className={classes.paper}>
              <Grid container spacing={1} className={classes.box}>
                {/* <Grid container spacing={2}> */}
                <Grid container spacing={2} className={classes.paper}>
                  <Grid item xs={12} sm={12} md={12} lg={2} xl={2} align="left">
                    <Typography className={classes.value}>For QR</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Kd=(0.5)</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="kd"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            onInput={restrict.dose}
                            size="small"
                            inputProps={{ maxLength: 200 }}
                            mask={"0.0"}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.kd}
                            helperText={errors.kd?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Kr=(0.5)</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="kr"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.kr}
                            helperText={errors.kr?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Na=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="na"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.na}
                            helperText={errors.na?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Ni=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="ni"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.ni}
                            helperText={errors.ni?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>
                </Grid>
                {/* <br />		
							<br /> */}
                {/* 2nd row */}
                <Grid container spacing={2} className={classes.paper}>
                  {/* <Grid
									item
									xs={12}
									sm={12}
									md={2}
									lg={2}
									xl={2}
									align="left"
								> */}
                  <Grid item xs={12} sm={12} md={12} lg={2} xl={2} align="left">
                    <Typography className={classes.value}>For DR</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Q1=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="q1"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.q1}
                            helperText={errors.q1?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>Q=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="drQ"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.drQ}
                            helperText={errors.drQ?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>T (Days)=</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="t"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.t}
                            helperText={errors.t?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>T1(Day)= </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="t1"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            onInput={restrict.dose}
                            inputProps={{ maxLength: 200 }}
                            className={classes.root}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.t1}
                            helperText={errors.t1?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    {/* <b>Kd=(0.5) </b> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    {/* <MaskedInput
                    mask={"0.0"}
                    size="small"
                   onInput={restrict.dose}
										className={classes.root}
										variant="outlined"
									/> */}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={2} xl={2} align="left"></Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>P=Q1/Q </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="p"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            className={classes.root}
                            inputProps={{ maxLength: 200 }}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.p}
                            helperText={errors.p?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Typography className={classes.value}>q=1-p= </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} lg={1} xl={1} align="left">
                    <Controller
                      name="q"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <MaskedInput
                            mask={"0.0"}
                            size="small"
                            className={classes.root}
                            inputProps={{ maxLength: 200 }}
                            variant="outlined"
                            placeholder={"0.0"}
                            value={value}
                            onAccept={(v, mask) => onChange(v)}
                            error={!!errors.q}
                            helperText={errors.q?.message}
                          />
                        );
                      }}
                    ></Controller>
                  </Grid>
                </Grid>

                {/* 4th row */}

                <Grid container spacing={2} className={classes.paper}>
                  <Grid item xs={12} sm={12} md={12} lg={2} xl={2} align="left">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
                      <Typography className={classes.value}>For ER</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4} align="left">
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>promptness (4 marks)=</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Controller
                          name="promptness"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <MaskedInput
                                mask={"0.0"}
                                size="small"
                                className={classes.root}
                                inputProps={{ maxLength: 200 }}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.promptness}
                                helperText={errors.promptness?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>
                      {/* <Grid
											item
											xs={6}
											sm={6}
											md={3}
											lg={3}
											xl={3}
											align="left"
										>
											<b>PO date</b>
										</Grid>
										<Grid
											item
											xs={6}
											sm={6}
											md={3}
											lg={3}
											xl={3}
											align="left"
										>
											<TextField
												className={classes.root}
												variant="outlined"
											/>
										</Grid> */}

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>Attitude of supplier(3 Marks)=</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={3} lg={6} xl={6} align="left">
                        <Controller
                          name="attitude"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <MaskedInput
                                mask={"0.0"}
                                size="small"
                                className={classes.root}
                                inputProps={{ maxLength: 200 }}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.attitude}
                                helperText={errors.attitude?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>CEO/CER (3 Marks) =</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Controller
                          name="ceo"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <MaskedInput
                                mask={"0.0"}
                                size="small"
                                className={classes.root}
                                inputProps={{ maxLength: 200 }}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.ceo}
                                helperText={errors.ceo?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4} align="left">
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>PO date</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Controller
                          name="poDate"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <TextField
                                inputProps={{ readOnly: true }}
                                className={classes.rootdate}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value ? moment(value).format("DD-MM-yyyy") : null}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.poDate}
                                helperText={errors.poDate?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>Original DP</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Controller
                          name="originalDp"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <MaskedInput
                                mask={"0.0"}
                                size="small"
                                className={classes.root}
                                inputProps={{ maxLength: 200 }}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.originalDp}
                                helperText={errors.originalDp?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Typography className={classes.value}>Actual DP (Wrt O)</Typography>
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} align="left">
                        <Controller
                          name="actualDp"
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <MaskedInput
                                mask={"0.0"}
                                size="small"
                                className={classes.root}
                                inputProps={{ maxLength: 200 }}
                                variant="outlined"
                                placeholder={"0.0"}
                                value={value}
                                onAccept={(v, mask) => onChange(v)}
                                error={!!errors.actualDp}
                                helperText={errors.actualDp?.message}
                              />
                            );
                          }}
                        ></Controller>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* //// */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="left">
              <br />
              <Typography className={classes.textSize}>
                <b> Na = </b>Qty accepted in the i-Note.{" "}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Kd = </b>deviation;0.5 in case of deviation else 1.0.{" "}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Kr = </b>Rectification coefficient;0.5 for lots accepted after rectification else 1.0.{""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Ni = </b>Quantity offered for inspection.{""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Q = </b>Quantity promised to be supplied within stipulated delievery time.{""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Q1 = </b>Actual quantity suppplied within the stiplated delievery time.{""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> T = </b>Time promised delievery time for the full consignment.
                {""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> T1 = </b>Actual delievery time for the full consignment(The delievery time should be taken from the
                date of offering accceptable stores by the supplier.){""}
              </Typography>
              <br />
              <Typography className={classes.textSize}>
                <b> Σ </b>indicates summation of QRs computed where supplies are in various lots.
                {""}
              </Typography>
              <br />
              <Grid item xs={12} align="center" alignItems="center" spacing={2}>
                <Button
                  type="submit"
                  // onClick={executeSubmit(handleSubmit)}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  className={classes.ml10}
                  // onClick={executeSubmit(handleSubmit)}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    SetPrintDialog(true);
                  }}
                >
                  Preview
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}
